import { getMethodForStrategy, runLocal } from "../../local/run-local.js";
import type { Method, NormalizedInput } from "../../types/index.js";
import { providerFetch } from "../../utils/fetch.js";
import type { ProviderAdapter } from "../base.js";

interface OpenAIInputTokensResponse {
  input_tokens: number;
}

function buildInput(input: NormalizedInput): string | Array<{ role: string; content: string }> {
  if (input.messages.length === 1 && input.messages[0]!.role === "user" && !input.system) {
    return input.messages[0]!.content;
  }

  const items: Array<{ role: string; content: string }> = [];
  if (input.system) {
    items.push({ role: "system", content: input.system });
  }
  for (const message of input.messages) {
    items.push({ role: message.role, content: message.content });
  }
  return items;
}

export const openaiAdapter: ProviderAdapter = {
  id: "openai",
  localStrategy: "tiktoken",

  supportsEndpoint() {
    return true;
  },

  getLocalMethod(): Method {
    return getMethodForStrategy(this.localStrategy);
  },

  async countViaEndpoint(input: NormalizedInput): Promise<number> {
    const body: Record<string, unknown> = {
      model: input.model,
      input: buildInput(input),
    };

    const response = await providerFetch<OpenAIInputTokensResponse>({
      url: "https://api.openai.com/v1/responses/input_tokens",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
      },
      body,
      provider: "openai",
    });

    return response.input_tokens;
  },

  countViaLocal(input: NormalizedInput): number {
    return runLocal(this.localStrategy, input);
  },
};
