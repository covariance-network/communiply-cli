import { Command } from "commander";
import { select, input, confirm } from "@inquirer/prompts";
import ora from "ora";
import chalk from "chalk";
import { requireApiKey, loadConfig } from "../lib/config.js";
import { api } from "../lib/api.js";
import * as out from "../lib/output.js";

const ACTION_COSTS: Record<string, { credits: number; count: string }> = {
  replies: { credits: 200, count: "10 AI-generated replies" },
  likes: { credits: 300, count: "30 likes" },
  reposts: { credits: 300, count: "10 reposts" },
};

export function boostCommand(): Command {
  const boost = new Command("boost")
    .description("Boost a tweet with replies, likes, or reposts")
    .argument("<tweet-url>", "URL of the tweet to boost")
    .option(
      "-a, --action <type>",
      "Action type: replies, likes, or reposts",
      "replies"
    )
    .option("-p, --product <id>", "Product ID (or use default from config)")
    .option("-g, --guidelines <text>", "Custom reply guidelines")
    .option("--json", "Output raw JSON")
    .action(async (tweetUrl: string, opts) => {
      const apiKey = requireApiKey();

      // Validate tweet URL
      if (
        !tweetUrl.match(
          /^https?:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+/
        )
      ) {
        out.error("Invalid tweet URL. Expected: https://x.com/user/status/123");
        process.exit(1);
      }

      // Resolve action type
      let actionType: string = opts.action;
      if (!["replies", "likes", "reposts"].includes(actionType)) {
        actionType = await select({
          message: "What type of boost?",
          choices: [
            {
              value: "replies",
              name: `Replies — ${ACTION_COSTS.replies.count} (${ACTION_COSTS.replies.credits} credits)`,
            },
            {
              value: "likes",
              name: `Likes — ${ACTION_COSTS.likes.count} (${ACTION_COSTS.likes.credits} credits)`,
            },
            {
              value: "reposts",
              name: `Reposts — ${ACTION_COSTS.reposts.count} (${ACTION_COSTS.reposts.credits} credits)`,
            },
          ],
        });
      }

      const cost = ACTION_COSTS[actionType];

      // Resolve product ID
      let productId = opts.product || loadConfig().default_product_id;
      if (!productId) {
        // Search for product
        const query = await input({
          message: "Search for your product on ProductClank:",
        });

        const searchRes = await api<{
          success: boolean;
          products: Array<{
            id: string;
            name: string;
            tagline: string;
            twitter: string;
          }>;
        }>("/products/search", {
          apiKey,
          params: { q: query, limit: 5 },
        });

        if (
          !searchRes.ok ||
          !(searchRes.data.products?.length)
        ) {
          out.error("No products found. Register your product at productclank.com first.");
          process.exit(1);
        }

        const products = searchRes.data.products;
        const chosen = await select({
          message: "Select your product:",
          choices: products.map((p) => ({
            value: p.id,
            name: `${p.name} — ${p.tagline || ""}`,
          })),
        });
        productId = chosen;
      }

      // Confirm
      out.heading("Boost Summary");
      out.label("Tweet", tweetUrl);
      out.label("Action", `${actionType} — ${cost.count}`);
      out.label("Cost", `${cost.credits} credits`);
      console.log();

      const proceed = await confirm({ message: "Proceed?", default: true });
      if (!proceed) {
        out.info("Cancelled.");
        return;
      }

      // Execute boost
      const spinner = ora("Boosting tweet...").start();

      const body: Record<string, unknown> = {
        tweet_url: tweetUrl,
        product_id: productId,
        action_type: actionType === "reposts" ? "repost" : actionType,
      };
      if (opts.guidelines) body.reply_guidelines = opts.guidelines;

      const res = await api<Record<string, unknown>>("/campaigns/boost", {
        method: "POST",
        apiKey,
        body,
      });

      spinner.stop();

      if (!res.ok) {
        out.handleApiError(res.data, res.status);
        process.exit(1);
      }

      if (opts.json) {
        out.json(res.data);
        return;
      }

      const data = res.data;
      const campaign = data.campaign as Record<string, unknown>;
      const credits = data.credits as Record<string, unknown>;

      out.success("Tweet boosted!");
      out.label("Campaign", campaign?.campaign_number as string);
      out.label("Items generated", data.items_generated as number);
      out.label("Credits used", credits?.credits_used as number);
      out.label("Credits remaining", credits?.credits_remaining as number);

      if (data.is_reboost) {
        out.info("Added to existing boost campaign for this product.");
      }

      console.log();
      out.info(`Dashboard: ${chalk.underline(campaign?.url as string)}`);
    });

  return boost;
}
