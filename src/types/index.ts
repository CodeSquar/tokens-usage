export type Provider = "openai" | "anthropic" | "google";

export type CountMode = "auto" | "endpoint" | "local";

export type Method =
  | "provider_endpoint"
  | "local_tiktoken"
  | "local_anthropic"
  | "local_heuristic";

export type LocalStrategy =
  | "tiktoken"
  | "anthropic_tokenizer"
  | "heuristic";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
}

export interface CountTokensOptions {
  provider: Provider;
  model: string;
  messages?: Message[];
  text?: string;
  mode?: CountMode;
  apiKey?: string;
  system?: string;
}

export type EstimateTokensOptions = Omit<CountTokensOptions, "mode">;

export interface PriceEstimate {
  usd: number;
}

export interface CountTokensResult {
  provider: Provider;
  model: string;
  tokens: number;
  estimated: boolean;
  method: Method;
  price: PriceEstimate | null;
}

export interface NormalizedInput {
  provider: Provider;
  model: string;
  messages: Message[];
  system?: string;
  apiKey?: string;
}

export interface CalculatePriceOptions {
  provider: Provider;
  model: string;
  tokens: number;
}

export interface HeuristicInput {
  messages?: Message[];
  text?: string;
  system?: string;
}
