import dotenv from "dotenv";
import {
  calculatePrice,
  countHeuristic,
  countTokens,
  estimateTokens,
  type Message,
} from "../src/index.js";

dotenv.config();

const MODEL = "gpt-5.5";
const PROMPT = "Tiktoken is a library for counting tokens.";
const messages: Message[] = [
  { role: "assistant", content: "How can i help you today?" },
  { role: "user", content: PROMPT },
];

function log(label: string, data: unknown) {
  console.log(`\n--- ${label} ---`);
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.warn("OPENAI_API_KEY missing: endpoint/auto will fall back to local");
  }

  log(
    "countTokens (endpoint)",
    await countTokens({
      provider: "openai",
      model: MODEL,
      messages,
      mode: "endpoint",
    }),
  );

  log(
    "countTokens (auto)",
    await countTokens({
      provider: "openai",
      model: MODEL,
      messages,
      mode: "auto",
    }),
  );

  log(
    "countTokens (local / tiktoken)",
    await countTokens({
      provider: "openai",
      model: MODEL,
      messages,
      mode: "local",
    }),
  );

  log(
    "estimateTokens",
    await estimateTokens({
      provider: "openai",
      model: MODEL,
      messages,
    }),
  );

  const endpointTokens = (
    await countTokens({
      provider: "openai",
      model: MODEL,
      messages,
      mode: "endpoint",
    })
  ).tokens;

  log(
    "calculatePrice",
    calculatePrice({
      provider: "openai",
      model: MODEL,
      tokens: endpointTokens,
    }),
  );

  log("countHeuristic", { tokens: countHeuristic({ messages }) });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
