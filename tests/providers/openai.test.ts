import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { countTokens } from "../../src/count-tokens.js";

describe("openai adapter", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ input_tokens: 42 }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls input_tokens endpoint in endpoint mode", async () => {
    const result = await countTokens({
      provider: "openai",
      model: "gpt-4o",
      text: "Hello",
      mode: "endpoint",
      apiKey: "test-key",
    });

    expect(result.tokens).toBe(42);
    expect(result.method).toBe("provider_endpoint");
    expect(result.estimated).toBe(false);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses/input_tokens",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      }),
    );
  });

  it("falls back to local in auto mode without api key", async () => {
    const result = await countTokens({
      provider: "openai",
      model: "gpt-4o",
      text: "Hello world",
      mode: "auto",
    });

    expect(result.tokens).toBeGreaterThan(0);
    expect(result.method).toBe("local_tiktoken");
    expect(result.estimated).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });
});
