# TokenKit

Unified token counting and prompt cost estimation for AI providers — **before** you send the request.

Count input tokens across OpenAI, Anthropic, and Google Gemini using official APIs or local fallbacks.

## Install

```bash
npm install tokenkit
```

## Quick start

```ts
import { countTokens, estimateTokens } from "tokenkit";

// Official endpoint (requires API key)
const result = await countTokens({
  provider: "anthropic",
  model: "claude-sonnet-4-20250514",
  messages: [{ role: "user", content: "Hello world" }],
  mode: "endpoint", // or "auto" (default)
  apiKey: process.env.ANTHROPIC_API_KEY,
});

console.log(result.tokens);   // 14
console.log(result.estimated); // false
console.log(result.price);    // { usd: 0.000042 } or null

// Local estimation only (no API call)
const estimate = await estimateTokens({
  provider: "google",
  model: "gemini-2.0-flash",
  text: "Hello world",
});
```

## Modes

| Mode | Behavior |
|------|----------|
| `auto` (default) | Uses official count endpoint when API key is available; falls back to local estimation on failure |
| `endpoint` | Forces provider count API; requires API key |
| `local` | Local estimation only (no network) |

## Environment variables

| Provider | Variables |
|----------|-----------|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` or `GOOGLE_API_KEY` |

## Response format

```ts
{
  provider: "anthropic",
  model: "claude-sonnet-4-20250514",
  tokens: 14,              // single pre-inference count
  estimated: false,
  method: "provider_endpoint",
  price: { usd: 0.000042 } // null if model not in pricing table
}
```

## Local strategies

| Provider | Local strategy |
|----------|----------------|
| OpenAI | `tiktoken` |
| Anthropic | `@anthropic-ai/tokenizer` (approximate for Claude 3+) |
| Google Gemini | Global `heuristic` (~chars/4) |

The heuristic counter is provider-agnostic and exported as `countHeuristic()` for reuse by future providers without a local tokenizer.

## API

- `countTokens(options)` — count prompt tokens + optional price
- `estimateTokens(options)` — same as `countTokens` with `mode: "local"`
- `calculatePrice({ provider, model, tokens })` — prompt cost only
- `countHeuristic({ messages?, text?, system? })` — standalone heuristic count

## Limitations (MVP)

- Input/prompt tokens only — no output token counting
- Text messages only (no multimodal)
- Gemini API (AI Studio), not Vertex AI
- Heuristic counts are approximate (~25% variance typical for prose)

See [count-endpoint.md](./count-endpoint.md) for official provider count endpoints.
