import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { countTokens } from "../../src/count-tokens.js";
import { MissingApiKeyError, RateLimitError } from "../../src/errors/index.js";

describe("anthropic adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses count_tokens response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ input_tokens: 14 }),
      }),
    );

    const result = await countTokens({
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      text: "Hello",
      mode: "endpoint",
      apiKey: "test-key",
    });

    expect(result.tokens).toBe(14);
    expect(result.estimated).toBe(false);
  });

  it("maps 401 to MissingApiKeyError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        text: async () => "",
      }),
    );

    await expect(
      countTokens({
        provider: "anthropic",
        model: "claude-sonnet-4",
        text: "Hi",
        mode: "endpoint",
        apiKey: "bad",
      }),
    ).rejects.toThrow(MissingApiKeyError);
  });

  it("maps 429 to RateLimitError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: async () => "",
      }),
    );

    await expect(
      countTokens({
        provider: "anthropic",
        model: "claude-sonnet-4",
        text: "Hi",
        mode: "endpoint",
        apiKey: "key",
      }),
    ).rejects.toThrow(RateLimitError);
  });
});
