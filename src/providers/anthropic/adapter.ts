import { getMethodForStrategy, runLocal } from "../../local/run-local.js";
import type { Message, Method, NormalizedInput } from "../../types/index.js";
import { providerFetch } from "../../utils/fetch.js";
import type { ProviderAdapter } from "../base.js";

interface AnthropicCountTokensResponse {
  input_tokens: number;
}

function toAnthropicMessages(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export const anthropicAdapter: ProviderAdapter = {
  id: "anthropic",
  localStrategy: "anthropic_tokenizer",

  supportsEndpoint() {
    return true;
  },

  getLocalMethod(): Method {
    return getMethodForStrategy(this.localStrategy);
  },

  async countViaEndpoint(input: NormalizedInput): Promise<number> {
    const body: Record<string, unknown> = {
      model: input.model,
      messages: toAnthropicMessages(input.messages),
    };

    if (input.system) {
      body.system = input.system;
    }

    const response = await providerFetch<AnthropicCountTokensResponse>({
      url: "https://api.anthropic.com/v1/messages/count_tokens",
      headers: {
        "x-api-key": input.apiKey!,
        "anthropic-version": "2023-06-01",
      },
      body,
      provider: "anthropic",
    });

    return response.input_tokens;
  },

  countViaLocal(input: NormalizedInput): number {
    return runLocal(this.localStrategy, input);
  },
};
