import { encoding_for_model } from "tiktoken";
import { describe, expect, it } from "vitest";
import { countTiktoken } from "../../src/local/strategies/tiktoken.js";

describe("countTiktoken", () => {
  it("adds encoded name tokens plus framing overhead", () => {
    const content = "Hello";
    const name = "example_user";

    const withoutName = countTiktoken({
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "user", content }],
    });

    const withName = countTiktoken({
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "user", content, name }],
    });

    const enc = encoding_for_model("gpt-4o");
    try {
      const expectedDelta = enc.encode(name).length + 1;
      expect(withName - withoutName).toBe(expectedDelta);
    } finally {
      enc.free();
    }
  });
});
