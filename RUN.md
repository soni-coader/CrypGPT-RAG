# CrypGPT – How to run (Frontend only, no backend)

Chat uses **n8n RAG agent** (webhook). Token data uses **CoinMarketCap API** directly from the frontend.

## 1. Setup

```bash
npm install
cp .env.example .env
# Edit .env: set VITE_N8N_WEBHOOK_URL and VITE_CMC_API_KEY
```

## 2. Env variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_N8N_WEBHOOK_URL` | Yes (for chat) | n8n webhook URL for your RAG agent workflow |
| `VITE_CMC_API_KEY` | Yes (for token info) | CoinMarketCap API key (pro-api.coinmarketcap.com) |
| `VITE_CMC_SYMBOL` | No | Token symbol (default `BTC`). Use e.g. `CRYPGPT` for your token |
| `VITE_CHAT_TIMEOUT` | No | Chat request timeout in ms (default 90000) |

## 3. Run

```bash
npm run dev
```

- App runs at **http://localhost:5173**
- No backend or proxy. Chat → n8n webhook; token data → CMC API from the browser.

## 4. n8n webhook contract

Frontend sends **POST** with JSON:

```json
{
  "query": "user message",
  "maxTokens": 2000,
  "history": [{"role": "user"|"assistant", "content": "..."}]
}
```

Your n8n workflow should respond with JSON that includes at least one of:

- `response` or `output` or `text` – assistant reply (string)
- Optional: `intent`, `responseSource`, `realTimeData` (for per-message token data)

Example minimal response:

```json
{ "response": "Here is the answer from the RAG agent." }
```

## 5. CMC API

- Get an API key from [CoinMarketCap](https://coinmarketcap.com/api/).
- Key is used in the browser (via `VITE_CMC_API_KEY`). For production, consider a small server proxy if you need to hide the key.
