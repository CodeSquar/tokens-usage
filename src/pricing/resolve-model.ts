import type { Provider } from "../types/index.js";
import models from "./models.json";

type PricingEntry = { inputPer1M: number };

const pricingTable = models as Record<string, PricingEntry>;

export function pricingKey(provider: Provider, model: string): string {
  return `${provider}:${model}`;
}

export function resolveModelPricing(
  provider: Provider,
  model: string,
): PricingEntry | null {
  const exact = pricingTable[pricingKey(provider, model)];
  if (exact) {
    return exact;
  }

  const prefix = `${provider}:`;
  const matches = Object.keys(pricingTable)
    .filter((key) => key.startsWith(prefix) && model.startsWith(key.slice(prefix.length)))
    .sort((a, b) => b.length - a.length);

  if (matches.length > 0) {
    return pricingTable[matches[0]!] ?? null;
  }

  return null;
}
