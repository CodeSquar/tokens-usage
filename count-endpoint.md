# Token Count Endpoints (MVP Providers)

Referencia mínima de endpoints oficiales para contabilizar tokens de input antes de inferencia.

| Provider | Endpoint dedicado | Pre-inferencia |
|---|---|---|
| OpenAI | Sí | Sí |
| Anthropic | Sí | Sí |
| Google Gemini | Sí | Sí |

---

## OpenAI

**Endpoint:** `POST https://api.openai.com/v1/responses/input_tokens`

**Auth:** `Authorization: Bearer $OPENAI_API_KEY`

**Body:** mismo formato que `POST /v1/responses` (`model`, `input`, `instructions`, `tools`, imágenes, archivos, etc.)

**Response:**

```json
{
  "object": "response.input_tokens",
  "input_tokens": 120
}
```

**Notas:**
- Alternativa local: `tiktoken` (limitada en multimodal/tools).

**Docs:** https://developers.openai.com/api/docs/guides/token-counting

---

## Anthropic

**Endpoint:** `POST https://api.anthropic.com/v1/messages/count_tokens`

**Auth:**
- `x-api-key: $ANTHROPIC_API_KEY`
- `anthropic-version: 2023-06-01`

**Body:** mismo shape que `POST /v1/messages` (`model`, `messages`, `system`, `tools`, imágenes, PDFs, etc.)

```json
{
  "model": "claude-sonnet-4-20250514",
  "system": "You are helpful.",
  "messages": [{ "role": "user", "content": "Hello" }]
}
```

**Response:**

```json
{
  "input_tokens": 14
}
```

**Notas:**
- No genera respuesta del modelo.

**Docs:** https://platform.claude.com/docs/en/build-with-claude/token-counting

---

## Google Gemini

### Google AI Studio (Gemini API)

**Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:countTokens`

Ejemplo: `.../v1beta/models/gemini-2.0-flash:countTokens?key=$GEMINI_API_KEY`

**Auth:** query param `key` o header según SDK.

**Body (opción simple):**

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "Hello" }]
    }
  ]
}
```

**Body (opción avanzada):** `generateContentRequest` (system instructions, tools, multimodal). Mutuamente excluyente con `contents`.

**Response:**

```json
{
  "totalTokens": 10,
  "promptTokensDetails": []
}
```

**Notas:**
- Cuenta input del prompt.
- Sin cargo; cuota ~3000 RPM.
- Alternativa Vertex AI: `POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/{model}:countTokens`

**Docs:** https://ai.google.dev/api/tokens

---

## Implicaciones para TokenKit

| Provider | `mode: "endpoint"` | `mode: "local"` fallback |
|---|---|---|
| OpenAI | `POST /v1/responses/input_tokens` | `tiktoken` |
| Anthropic | `POST /v1/messages/count_tokens` | tokenizer Claude |
| Google Gemini | `models/{model}:countTokens` | `LocalTokenizer` (SDK) |
