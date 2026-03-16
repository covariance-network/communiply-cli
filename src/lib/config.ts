import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export interface CommuniplyConfig {
  api_key?: string;
  api_url: string;
  default_product_id?: string;
}

const CONFIG_DIR = join(homedir(), ".communiply");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_CONFIG: CommuniplyConfig = {
  api_url: "https://app.productclank.com",
};

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function loadConfig(): CommuniplyConfig {
  if (!existsSync(CONFIG_FILE)) {
    return { ...DEFAULT_CONFIG };
  }
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: CommuniplyConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}

export function getApiKey(): string | undefined {
  return process.env.COMMUNIPLY_API_KEY || loadConfig().api_key;
}

export function requireApiKey(): string {
  const key = getApiKey();
  if (!key) {
    console.error(
      "No API key found. Run `communiply auth login` or set COMMUNIPLY_API_KEY."
    );
    process.exit(1);
  }
  return key;
}
