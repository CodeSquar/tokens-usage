export { countTokens } from "./count-tokens.js";
export { estimateTokens } from "./estimate-tokens.js";
export { calculatePrice, calculatePriceForProvider } from "./calculate-price.js";
export { countHeuristic } from "./local/strategies/heuristic.js";

export type {
  Provider,
  CountMode,
  Method,
  LocalStrategy,
  Message,
  MessageRole,
  CountTokensOptions,
  EstimateTokensOptions,
  CountTokensResult,
  PriceEstimate,
  CalculatePriceOptions,
  HeuristicInput,
  NormalizedInput,
} from "./types/index.js";

export {
  TokenKitError,
  ProviderNotSupportedError,
  ModelNotSupportedError,
  MissingApiKeyError,
  EndpointNotAvailableError,
  RateLimitError,
  ValidationError,
} from "./errors/index.js";
