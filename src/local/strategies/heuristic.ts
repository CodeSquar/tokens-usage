import type { HeuristicInput } from "../../types/index.js";
import {
  flattenMessages,
  partitionSystemMessages,
  resolveMessages,
} from "../../utils/messages.js";

const CHARS_PER_TOKEN = 4;
const TOKENS_PER_MESSAGE = 3;

export function countHeuristic(input: HeuristicInput): number {
  const { system, messages } = partitionSystemMessages(
    resolveMessages(input.messages, input.text),
    input.system,
  );
  const text = flattenMessages(messages, system);
  const baseTokens = Math.ceil(text.length / CHARS_PER_TOKEN);
  const messageOverhead = messages.length * TOKENS_PER_MESSAGE;
  return baseTokens + messageOverhead;
}
