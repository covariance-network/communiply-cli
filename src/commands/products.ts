import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { requireApiKey, loadConfig, saveConfig } from "../lib/config.js";
import { api } from "../lib/api.js";
import * as out from "../lib/output.js";

export function productsCommand(): Command {
  const products = new Command("products").description("Search products");

  products
    .command("search")
    .description("Search for a product on ProductClank")
    .argument("<query>", "Product name or keyword")
    .option("-l, --limit <n>", "Max results", "5")
    .option("--json", "Output raw JSON")
    .option("--set-default", "Set the first result as default product")
    .action(
      async (
        query: string,
        opts: { limit: string; json?: boolean; setDefault?: boolean }
      ) => {
        const apiKey = requireApiKey();

        const spinner = ora("Searching...").start();
        const res = await api<{
          success: boolean;
          products: Array<{
            id: string;
            name: string;
            tagline: string;
            twitter: string;
            category: string;
          }>;
        }>("/products/search", {
          apiKey,
          params: { q: query, limit: parseInt(opts.limit) },
        });
        spinner.stop();

        if (!res.ok) {
          out.handleApiError(
            res.data as unknown as Record<string, unknown>,
            res.status
          );
          process.exit(1);
        }

        if (opts.json) {
          out.json(res.data);
          return;
        }

        const products = res.data.products || [];
        if (products.length === 0) {
          out.info("No products found.");
          return;
        }

        out.heading(`Found ${products.length} product(s)`);
        for (const p of products) {
          console.log();
          console.log(`  ${chalk.bold(p.name)}`);
          if (p.tagline) console.log(`  ${chalk.dim(p.tagline)}`);
          out.label("  ID", p.id);
          if (p.twitter) out.label("  Twitter", p.twitter);
          if (p.category) out.label("  Category", p.category);
        }

        if (opts.setDefault && products.length > 0) {
          const config = loadConfig();
          config.default_product_id = products[0].id;
          saveConfig(config);
          console.log();
          out.success(`Default product set to ${products[0].name}`);
        }
      }
    );

  return products;
}
