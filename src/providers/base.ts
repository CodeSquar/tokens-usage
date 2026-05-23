import type {
  LocalStrategy,
  Method,
  NormalizedInput,
  Provider,
} from "../types/index.js";

export interface ProviderAdapter {
  readonly id: Provider;
  readonly localStrategy: LocalStrategy;
  supportsEndpoint(): boolean;
  countViaEndpoint(input: NormalizedInput): Promise<number>;
  countViaLocal(input: NormalizedInput): number;
  getLocalMethod(): Method;
}
