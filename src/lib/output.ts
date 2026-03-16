import chalk from "chalk";

export function success(message: string): void {
  console.log(chalk.green("✓"), message);
}

export function error(message: string): void {
  console.error(chalk.red("✗"), message);
}

export function info(message: string): void {
  console.log(chalk.blue("ℹ"), message);
}

export function warn(message: string): void {
  console.log(chalk.yellow("⚠"), message);
}

export function label(key: string, value: string | number): void {
  console.log(`  ${chalk.dim(key + ":")} ${value}`);
}

export function heading(text: string): void {
  console.log();
  console.log(chalk.bold(text));
}

export function table(
  rows: Record<string, string | number | boolean | null | undefined>[]
): void {
  if (rows.length === 0) return;
  console.table(rows);
}

export function json(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

export function handleApiError(data: Record<string, unknown>, status: number): void {
  const msg = (data.message as string) || (data.error as string) || "Unknown error";

  if (status === 401) {
    error("Invalid API key. Run `communiply auth login` to set a valid key.");
  } else if (status === 402) {
    error(`Insufficient credits. ${msg}`);
    if (data.credits_required) {
      label("Required", data.credits_required as number);
      label("Available", data.credits_available as number);
    }
  } else if (status === 429) {
    error("Rate limit exceeded. Try again tomorrow.");
  } else {
    error(msg);
  }
}
