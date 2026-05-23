import { countTokens as countAnthropicTokens } from "@anthropic-ai/tokenizer";
import type { NormalizedInput } from "../../types/index.js";
import { flattenMessages } from "../../utils/messages.js";

export function countAnthropicLocal(input: NormalizedInput): number {
  const text = flattenMessages(input.messages, input.system);
  return countAnthropicTokens(text);
}
