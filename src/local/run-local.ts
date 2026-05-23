import type { LocalStrategy, Method, NormalizedInput } from "../types/index.js";
import { countAnthropicLocal } from "./strategies/anthropic.js";
import { countHeuristic } from "./strategies/heuristic.js";
import { countTiktoken } from "./strategies/tiktoken.js";

export function getMethodForStrategy(strategy: LocalStrategy): Method {
  switch (strategy) {
    case "tiktoken":
      return "local_tiktoken";
    case "anthropic_tokenizer":
      return "local_anthropic";
    case "heuristic":
      return "local_heuristic";
  }
}

export function runLocal(
  strategy: LocalStrategy,
  input: NormalizedInput,
): number {
  switch (strategy) {
    case "tiktoken":
      return countTiktoken(input);
    case "anthropic_tokenizer":
      return countAnthropicLocal(input);
    case "heuristic":
      return countHeuristic({
        messages: input.messages,
        system: input.system,
      });
  }
}
