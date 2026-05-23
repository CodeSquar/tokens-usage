import { afterEach, describe, expect, it, vi } from "vitest";
import { googleAdapter } from "../../src/providers/google/adapter.js";
import { countTokens } from "../../src/count-tokens.js";

describe("google adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delegates local count to heuristic strategy", () => {
    const tokens = googleAdapter.countViaLocal({
      provider: "google",
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(tokens).toBeGreaterThan(0);
    expect(googleAdapter.getLocalMethod()).toBe("local_heuristic");
  });

  it("parses countTokens API response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ totalTokens: 10 }),
      }),
    );

    const result = await countTokens({
      provider: "google",
      model: "gemini-2.0-flash",
      text: "Hello",
      mode: "endpoint",
      apiKey: "gemini-key",
    });

    expect(result.tokens).toBe(10);
    expect(result.method).toBe("provider_endpoint");
  });

  it("hoists system messages to systemInstruction", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ totalTokens: 10 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await countTokens({
      provider: "google",
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: "Be helpful." },
        { role: "user", content: "Hello" },
      ],
      mode: "endpoint",
      apiKey: "gemini-key",
    });

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.systemInstruction).toEqual({
      parts: [{ text: "Be helpful." }],
    });
    expect(body.contents).toEqual([
      { role: "user", parts: [{ text: "Hello" }] },
    ]);
  });
});
