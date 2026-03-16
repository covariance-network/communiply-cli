import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { requireApiKey } from "../lib/config.js";
import { api } from "../lib/api.js";
import * as out from "../lib/output.js";

export function creditsCommand(): Command {
  const credits = new Command("credits").description("Manage credits");

  credits
    .command("balance")
    .description("Check your credit balance")
    .option("--json", "Output raw JSON")
    .action(async (opts: { json?: boolean }) => {
      const apiKey = requireApiKey();

      const spinner = ora("Fetching balance...").start();
      const res = await api<Record<string, unknown>>("/credits/balance", { apiKey });
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
      out.heading("Credit Balance");
      out.label("Balance", `${data.balance} credits`);
      out.label("Plan", data.plan as string);
      if (data.lifetime_used) {
        out.label("Lifetime used", data.lifetime_used as number);
      }
    });

  credits
    .command("history")
    .description("View credit transaction history")
    .option("-l, --limit <n>", "Number of transactions", "10")
    .option("--json", "Output raw JSON")
    .action(async (opts: { limit: string; json?: boolean }) => {
      const apiKey = requireApiKey();

      const spinner = ora("Fetching history...").start();
      const res = await api<Record<string, unknown>>("/credits/history", {
        apiKey,
        params: { limit: parseInt(opts.limit) },
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

      const transactions = (res.data.transactions || res.data.history || []) as Array<
        Record<string, unknown>
      >;

      if (transactions.length === 0) {
        out.info("No transactions yet.");
        return;
      }

      out.heading("Credit History");
      for (const tx of transactions) {
        const amount = tx.amount as number;
        const sign = amount > 0 ? chalk.green(`+${amount}`) : chalk.red(`${amount}`);
        const desc = tx.description || tx.type || "transaction";
        const date = tx.created_at
          ? new Date(tx.created_at as string).toLocaleDateString()
          : "";
        console.log(`  ${sign} ${chalk.dim("—")} ${desc} ${chalk.dim(date)}`);
      }
    });

  return credits;
}
