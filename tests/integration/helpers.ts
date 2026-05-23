/** Official model IDs (verified May 2026). */
export const INTEGRATION_MODELS = {
  openai: "gpt-5.5",
  anthropic: "claude-opus-4-7",
  google: "gemini-3-flash-preview",
} as const;

export const SAMPLE_PROMPT =
  "Tiktoken is a library for counting tokens.";

export function hasEnvKey(...names: string[]): boolean {
  return names.some((name) => Boolean(process.env[name]?.trim()));
}
