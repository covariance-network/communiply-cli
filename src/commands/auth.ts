import { Command } from "commander";
import { input } from "@inquirer/prompts";
import ora from "ora";
import { loadConfig, saveConfig, getApiKey, getConfigPath } from "../lib/config.js";
import { api } from "../lib/api.js";
import * as out from "../lib/output.js";

export function authCommand(): Command {
  const auth = new Command("auth").description("Manage authentication");

  auth
    .command("login")
    .description("Save your ProductClank API key")
    .argument("[key]", "API key (pck_live_...)")
    .action(async (key?: string) => {
      const apiKey =
        key ||
        (await input({
          message: "Enter your API key (pck_live_...):",
          validate: (v: string) =>
            v.startsWith("pck_live_") || "Key must start with pck_live_",
        }));

      // Verify the key works
      const spinner = ora("Verifying API key...").start();
      const res = await api("/me", { apiKey });

      if (!res.ok) {
        spinner.fail("Invalid API key");
        process.exit(1);
      }

      const config = loadConfig();
      config.api_key = apiKey;
      saveConfig(config);
      spinner.stop();

      const data = res.data as Record<string, unknown>;
      out.success("Authenticated successfully");
      out.label("Agent", (data.agent as Record<string, unknown>)?.name as string || "unknown");
      out.label("Config saved to", getConfigPath());
    });

  auth
    .command("status")
    .description("Check authentication status")
    .action(async () => {
      const apiKey = getApiKey();
      if (!apiKey) {
        out.error("Not authenticated. Run `communiply auth login`.");
        process.exit(1);
      }

      const spinner = ora("Checking status...").start();
      const res = await api("/me", { apiKey });
      spinner.stop();

      if (!res.ok) {
        out.error("API key is invalid or expired. Run `communiply auth login`.");
        process.exit(1);
      }

      const data = res.data as Record<string, unknown>;
      const agent = data.agent as Record<string, unknown>;
      const credits = data.credits as Record<string, unknown>;

      out.success("Authenticated");
      out.label("Agent", agent?.name as string);
      out.label("Status", agent?.status as string);
      out.label("Credits", credits?.balance as number);
      out.label("Key", apiKey.slice(0, 12) + "..." + apiKey.slice(-4));
    });

  auth
    .command("link")
    .description("Link this agent to your ProductClank account")
    .action(async () => {
      const apiKey = getApiKey();
      if (!apiKey) {
        out.error("Not authenticated. Run `communiply auth login` first.");
        process.exit(1);
      }

      const spinner = ora("Generating link...").start();
      const res = await api("/create-link", { method: "POST", apiKey });
      spinner.stop();

      const data = res.data as Record<string, unknown>;

      if (!res.ok) {
        out.handleApiError(data, res.status);
        process.exit(1);
      }

      if (data.already_linked) {
        out.success(`Already linked to ${data.user_name}`);
        return;
      }

      out.success("Link generated! Open this URL to connect your account:");
      console.log();
      console.log(`  ${data.link_url}`);
      console.log();
      out.info("The link expires in 15 minutes.");
    });

  auth
    .command("register")
    .description("Register a new agent and get an API key")
    .argument("<name>", "Agent name")
    .option("-d, --description <desc>", "Agent description")
    .action(async (name: string, opts: { description?: string }) => {
      const spinner = ora("Registering agent...").start();

      const body: Record<string, unknown> = { name };
      if (opts.description) body.description = opts.description;

      const res = await fetch(
        `${loadConfig().api_url}/api/v1/agents/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = (await res.json()) as Record<string, unknown>;
      spinner.stop();

      if (!res.ok) {
        out.error((data.message as string) || "Registration failed");
        process.exit(1);
      }

      const apiKey = data.api_key as string;
      const config = loadConfig();
      config.api_key = apiKey;
      saveConfig(config);

      const credits = data.credits as Record<string, unknown>;

      out.success("Agent registered!");
      out.label("API Key", apiKey);
      out.label("Credits", credits?.balance as number);
      out.label("Config saved to", getConfigPath());
      console.log();
      out.warn("Store your API key securely — it won't be shown again.");
      out.info("Run `communiply auth link` to connect your ProductClank account.");
    });

  return auth;
}
