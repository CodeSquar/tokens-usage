import { calculatePrice } from "./calculate-price.js";
import { getAdapter } from "./providers/registry.js";
import { executeCount } from "./providers/mode-resolver.js";
import type {
  CountTokensOptions,
  CountTokensResult,
  NormalizedInput,
} from "./types/index.js";
import { resolveApiKey } from "./utils/env.js";
import { resolveMessages } from "./utils/messages.js";

function normalizeInput(options: CountTokensOptions): NormalizedInput {
  return {
    provider: options.provider,
    model: options.model,
    messages: resolveMessages(options.messages, options.text),
    system: options.system,
    apiKey: resolveApiKey(options.provider, options.apiKey),
  };
}

export async function countTokens(
  options: CountTokensOptions,
): Promise<CountTokensResult> {
  const input = normalizeInput(options);
  const mode = options.mode ?? "auto";
  const adapter = getAdapter(options.provider);
  const execution = await executeCount(adapter, input, mode);

  return {
    provider: options.provider,
    model: options.model,
    tokens: execution.tokens,
    estimated: execution.estimated,
    method: execution.method,
    price: calculatePrice({
      provider: options.provider,
      model: options.model,
      tokens: execution.tokens,
    }),
  };
}
