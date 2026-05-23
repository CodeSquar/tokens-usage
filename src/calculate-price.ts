import { resolveModelPricing } from "./pricing/resolve-model.js";
import type {
  CalculatePriceOptions,
  PriceEstimate,
  Provider,
} from "./types/index.js";

export function calculatePrice(
  options: CalculatePriceOptions,
): PriceEstimate | null {
  const entry = resolveModelPricing(options.provider, options.model);
  if (!entry) {
    return null;
  }

  const usd = (options.tokens / 1_000_000) * entry.inputPer1M;
  return { usd };
}

export function calculatePriceForProvider(
  provider: Provider,
  model: string,
  tokens: number,
): PriceEstimate | null {
  return calculatePrice({ provider, model, tokens });
}
