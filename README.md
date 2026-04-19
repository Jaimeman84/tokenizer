# AI Tokenizer

Educational web app that shows how AI models break text into tokens. Visual, interactive, and built for learners.

**Stack:** Next.js 16 (TypeScript + Tailwind v4) · Python FastAPI · tiktoken

---

## Features

- **Dual prompt inputs** — separate System Prompt and User Prompt fields
- **Real-time token visualization** — color-coded token badges update as you type
- **Per-section counts** — token and character count for each section
- **Total summary** — combined token and character count across all sections
- **Token ID toggle** — reveal the integer ID behind each token
- **Model selector** — switch between three tokenizer encodings (see below)
- **Example loader** — 6 preloaded prompts with educational descriptions
- **Insights panel** — plain-language explanations of how tokenization works

### Supported Encodings

| Encoding | Models | Vocabulary |
|----------|--------|------------|
| `cl100k_base` | GPT-4, GPT-3.5-turbo, text-embedding-ada-002 | ~100,000 tokens |
| `o200k_base` | GPT-4o, GPT-4o-mini, o1, o3 | ~200,000 tokens |
| `p50k_base` | text-davinci-003, code-davinci-002 (legacy) | ~50,000 tokens |

---

## Local Development

### 1. Backend (Python FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/health` → `{"status":"ok"}`  
Visit `http://localhost:8000/docs` for interactive API docs.

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`

---

## Environment Variables

### `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `backend/.env`
```
ALLOWED_ORIGINS=http://localhost:3000
DEFAULT_ENCODING=cl100k_base
MAX_CHARS_PER_SECTION=10000
```

---

## Running Tests

```bash
# Backend — 12 tests (unit + integration)
cd backend
source venv/bin/activate        # Windows: venv\Scripts\activate
pytest tests/ -v

# Frontend — TypeScript type check
cd frontend
npx tsc --noEmit
```

---

## API

The backend exposes two endpoints:

### `GET /health`
Returns `{"status": "ok", "version": "1.0.0"}`

### `POST /tokenize`

**Request:**
```json
{
  "sections": [
    { "label": "system", "text": "You are a helpful assistant." },
    { "label": "user",   "text": "What is tokenization?" }
  ],
  "encoding": "cl100k_base"
}
```

**Response:**
```json
{
  "sections": [
    {
      "label": "system",
      "tokens": [{ "text": "You", "id": 2675, "index": 0 }, "..."],
      "token_count": 6,
      "char_count": 28
    }
  ],
  "total_token_count": 11,
  "total_char_count": 49,
  "encoding": "cl100k_base"
}
```

---

## Project Structure

```
tokenizer/
├── backend/                    # Python FastAPI + tiktoken
│   ├── app/
│   │   ├── main.py             # App entry point, CORS config
│   │   ├── routes/             # HTTP route handlers
│   │   ├── services/           # Business logic
│   │   ├── tokenizer/          # Tokenizer engine (swappable per encoding)
│   │   └── schemas/            # Pydantic request/response models
│   ├── tests/                  # 12 unit + integration tests
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/                   # Next.js 16 + Tailwind v4
    ├── app/                    # Pages and root layout
    ├── components/
    │   ├── tokenizer/          # TokenBadge, TokenDisplay, TokenStats,
    │   │                       # TotalSummary, PromptInput, ExampleLoader,
    │   │                       # ModelSelector
    │   ├── education/          # InsightsPanel, InsightCard
    │   └── ui/                 # Button, Toggle, ErrorMessage
    ├── hooks/                  # useTokenizer, useDebounce
    ├── lib/                    # constants (MODEL_OPTIONS), tokenColors,
    │                           # formatters, examples
    ├── services/               # tokenizerService (API calls)
    └── types/                  # TypeScript interfaces
```

---

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | [Vercel](https://vercel.com) | Connect `frontend/` folder, zero config |
| Backend | [Railway](https://railway.app) or [Fly.io](https://fly.io) | Connect `backend/` folder |

**Vercel** — add environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**Railway / Fly.io** — add environment variables:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app
DEFAULT_ENCODING=cl100k_base
```

Start command for Railway/Fly.io:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Adding a New Tokenizer (Future)

1. Create `backend/app/tokenizer/your_engine.py` implementing `TokenizerEngine`
2. Register it in `tokenizer_service.py`
3. Add the encoding string to `SUPPORTED_ENCODINGS` in `tiktoken_engine.py`
4. Add the model definition to `MODEL_OPTIONS` in `frontend/lib/constants.ts`
5. The selector UI picks it up automatically — no other changes needed
