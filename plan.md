# LLM Token Meter

Unified token counting and cost estimation across AI providers.

---

# Goal

Provide a single API to:

* Count tokens
* Estimate costs
* Normalize provider differences
* Support official endpoints + local estimation

Across multiple LLM providers.

---

# MVP Scope

## Supported Providers

```txt
OpenAI
Anthropic
Google Gemini
```

---

# Core API

## Count Tokens

```ts
countTokens(options)
```

Example:

```ts
const result = await countTokens({
  provider: "anthropic",
  model: "claude-sonnet-4",
  messages: [
    {
      role: "user",
      content: "Hello world"
    }
  ]
})
```

---

# Modes

## `auto`

Uses official endpoint if available.

Falls back to local estimation.

```ts
mode: "auto"
```

---

## `endpoint`

Force provider endpoint.

```ts
mode: "endpoint"
```

---

## `local`

Force local estimation.

```ts
mode: "local"
```

---

# Supported Inputs

## Messages

```ts
messages: Message[]
```

---

## Plain Text

```ts
text: string
```

---

# Response Format

```ts
{
  provider: "anthropic",
  model: "claude-sonnet-4",

  tokens: 120,

  estimated: false,

  method: "provider_endpoint",

  price: {
    usd: 0.00012
  }
}
```

---

# Core Features

```txt
Unified API
Provider normalization
Cost estimation
Official endpoint support
Local estimation fallback
TypeScript types
Minimal setup
Consistent response format
```

---

# Provider Architecture

## Adapter Pattern

```txt
providers/
  openai/
  anthropic/
  google/
```

Each provider implements:

```ts
count()
estimate()
calculatePrice()
supportsEndpoint()
```

---

# Public API

```ts
countTokens()
estimateTokens()
calculatePrice()
```

---

# Errors

Standardized errors:

```ts
ProviderNotSupportedError
ModelNotSupportedError
MissingApiKeyError
EndpointNotAvailableError
RateLimitError
```

---

# Package Goals

```txt
Simple DX
Fast integration
Reliable estimations
Minimal dependencies
Provider-agnostic
```

---

# Non Goals (MVP)

```txt
Streaming analytics
Realtime usage tracking
Audio/image tokenization
SDK wrappers
Caching layer
CLI
```

---

# Tech Stack

```txt
TypeScript
ESM first
Node.js
Fetch API
```

---

# Package Structure

```txt
src/
  providers/
  utils/
  pricing/
  types/
  index.ts
```

---

# Positioning

```txt
Unified token counting and cost estimation for AI providers.
```

---