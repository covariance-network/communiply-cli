import { loadConfig } from "./config.js";

export interface ApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
}

export async function api<T = Record<string, unknown>>(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    apiKey: string;
    params?: Record<string, string | number | boolean>;
  }
): Promise<ApiResponse<T>> {
  const config = loadConfig();
  const url = new URL(`/api/v1/agents${path}`, config.api_url);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${options.apiKey}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = (await res.json()) as T;
  return { ok: res.ok, status: res.status, data };
}
