import { countTokens } from "./count-tokens.js";
import type { CountTokensOptions, CountTokensResult } from "./types/index.js";

export async function estimateTokens(
  options: CountTokensOptions,
): Promise<CountTokensResult> {
  const mode = options.mode ?? "local";
  return countTokens({
    ...options,
    mode: mode === "endpoint" ? mode : "local",
  });
}
