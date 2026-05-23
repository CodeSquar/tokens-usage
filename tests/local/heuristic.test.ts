import { describe, expect, it } from "vitest";
import { countHeuristic } from "../../src/local/strategies/heuristic.js";

describe("countHeuristic", () => {
  it("throws for empty text", () => {
    expect(() => countHeuristic({ text: "" })).toThrow();
  });

  it("counts plain text", () => {
    const tokens = countHeuristic({ text: "Hello world" });
    expect(tokens).toBeGreaterThan(0);
  });

  it("counts messages with overhead", () => {
    const fromText = countHeuristic({ text: "Hello" });
    const fromMessages = countHeuristic({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(fromMessages).toBeGreaterThanOrEqual(fromText);
  });

  it("includes system in count", () => {
    const without = countHeuristic({
      messages: [{ role: "user", content: "Hi" }],
    });
    const withSystem = countHeuristic({
      messages: [{ role: "user", content: "Hi" }],
      system: "You are helpful.",
    });
    expect(withSystem).toBeGreaterThan(without);
  });

  it("scales with longer input", () => {
    const short = countHeuristic({ text: "a" });
    const long = countHeuristic({ text: "a".repeat(400) });
    expect(long).toBeGreaterThan(short);
  });
});
