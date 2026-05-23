import { getMethodForStrategy, runLocal } from "../../local/run-local.js";
import type { Message, Method, NormalizedInput } from "../../types/index.js";
import { providerFetch } from "../../utils/fetch.js";
import type { ProviderAdapter } from "../base.js";

interface GeminiCountTokensResponse {
  totalTokens: number;
}

function toGeminiContents(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

export const googleAdapter: ProviderAdapter = {
  id: "google",
  localStrategy: "heuristic",

  supportsEndpoint() {
    return true;
  },

  getLocalMethod(): Method {
    return getMethodForStrategy(this.localStrategy);
  },

  async countViaEndpoint(input: NormalizedInput): Promise<number> {
    const model = encodeURIComponent(input.model);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:countTokens?key=${encodeURIComponent(input.apiKey!)}`;

    const contents = toGeminiContents(input.messages);
    const body: Record<string, unknown> = { contents };

    if (input.system) {
      body.systemInstruction = { parts: [{ text: input.system }] };
    }

    const response = await providerFetch<GeminiCountTokensResponse>({
      url,
      body,
      provider: "google",
    });

    return response.totalTokens;
  },

  countViaLocal(input: NormalizedInput): number {
    return runLocal(this.localStrategy, input);
  },
};
