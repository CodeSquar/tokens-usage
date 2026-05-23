import type { Provider } from "../types/index.js";
import { ProviderNotSupportedError } from "../errors/index.js";
import { anthropicAdapter } from "./anthropic/adapter.js";
import type { ProviderAdapter } from "./base.js";
import { googleAdapter } from "./google/adapter.js";
import { openaiAdapter } from "./openai/adapter.js";

const adapters: Record<Provider, ProviderAdapter> = {
  openai: openaiAdapter,
  anthropic: anthropicAdapter,
  google: googleAdapter,
};

export function getAdapter(provider: Provider): ProviderAdapter {
  const adapter = adapters[provider];
  if (!adapter) {
    throw new ProviderNotSupportedError(provider);
  }
  return adapter;
}
