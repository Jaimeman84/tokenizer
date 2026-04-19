# Workflow Document
## Educational AI Tokenizer App

**Version:** 1.0  
**Date:** 2026-04-18  
**Stack:** Next.js (TypeScript + Tailwind) + Python FastAPI

---

## 1. End-to-End User Flow

This is the full journey a user takes from opening the app to understanding tokenization.

```
User opens app
    │
    ▼
Sees two input areas: [System Prompt] and [User Prompt]
    │
    ▼
Reads placeholder text explaining what each field is for
    │
    ├── Option A: Types or pastes their own text
    │
    └── Option B: Clicks "Load Example" and selects an example prompt
            │
            ▼
        Both fields populate with example content
    │
    ▼
Text input triggers debounced API call to Python backend (300ms delay)
    │
    ▼
Loading indicator appears briefly
    │
    ▼
Token visualization renders:
    - System prompt section: colored token badges
    - User prompt section: colored token badges
    - Per-section token count and character count
    - Total token count across both sections
    │
    ▼
User reads the Educational Insights panel (sidebar or below)
    │
    ▼
User toggles "Show Token IDs"
    │
    ▼
Each token badge now shows its numeric ID below the text
    │
    ▼
User edits text → visualization updates in real time
    │
    ▼
User clicks "Clear" → all fields and visualizations reset
```

---

## 2. Frontend → Backend Request Flow

This is what happens technically when the user types or pastes text.

```
User types in PromptInput component
        │
        ▼
onChange event fires → stored in local state (React useState)
        │
        ▼
useDebounce hook waits 300ms for user to stop typing
        │
        ▼
useTokenizer hook triggers tokenizeText() from tokenizerService.ts
        │
        ▼
tokenizerService.ts sends HTTP POST to Python backend:

  POST http://localhost:8000/tokenize
  Content-Type: application/json

  {
    "sections": [
      { "label": "system", "text": "You are a helpful assistant." },
      { "label": "user",   "text": "What is tokenization?" }
    ],
    "encoding": "cl100k_base"
  }
        │
        ▼
Backend processes request (see Section 3)
        │
        ▼
Backend returns JSON response:

  {
    "sections": [
      {
        "label": "system",
        "tokens": [
          { "text": "You",   "id": 2675,  "index": 0 },
          { "text": " are",  "id": 527,   "index": 1 },
          { "text": " a",    "id": 264,   "index": 2 },
          ...
        ],
        "token_count": 6,
        "char_count": 29
      },
      {
        "label": "user",
        "tokens": [
          { "text": "What",         "id": 3923, "index": 0 },
          { "text": " is",          "id": 374,  "index": 1 },
          { "text": " token",       "id": 4037, "index": 2 },
          { "text": "ization",      "id": 2065, "index": 3 },
          { "text": "?",            "id": 30,   "index": 4 }
        ],
        "token_count": 5,
        "char_count": 21
      }
    ],
    "total_token_count": 11,
    "total_char_count": 50
  }
        │
        ▼
useTokenizer hook stores response in state
        │
        ▼
React re-renders:
  - TokenDisplay receives tokens array → renders TokenBadge per token
  - TokenStats receives counts → renders section summary
  - TotalSummary renders combined totals
```

---

## 3. Tokenization Processing Flow (Python Backend)

What happens inside FastAPI when a request arrives.

```
POST /tokenize received by FastAPI
        │
        ▼
Pydantic validates request body against TokenizeRequest schema
  - Checks required fields
  - Validates encoding string
  - If invalid → returns 422 Unprocessable Entity immediately
        │
        ▼
Route handler calls tokenizer_service.tokenize_sections(request)
        │
        ▼
tokenizer_service:
  1. Selects tokenizer engine based on request.encoding
     (MVP: always tiktoken with cl100k_base)
  2. Iterates over each section in request.sections
        │
        ▼
For each section:
  tiktoken_engine.tokenize(text):
    1. encoding = tiktoken.get_encoding("cl100k_base")
    2. token_ids = encoding.encode(text)
    3. tokens = [encoding.decode_single_token_bytes(id) for id in token_ids]
    4. Decodes bytes to UTF-8 string (handles multi-byte characters gracefully)
    5. Returns list of { text, id, index } dicts
        │
        ▼
tokenizer_service assembles section result:
  - label (from request)
  - tokens list
  - token_count = len(token_ids)
  - char_count = len(text)
        │
        ▼
tokenizer_service assembles final response:
  - sections list
  - total_token_count = sum of all section token_counts
  - total_char_count = sum of all section char_counts
        │
        ▼
Route handler serializes response via TokenizeResponse schema
        │
        ▼
FastAPI returns 200 JSON response
```

---

## 4. Response Handling in Frontend

What happens in React after the API response arrives.

```
tokenizerService.ts receives JSON response
        │
        ▼
Maps response to TypeScript types (TokenResponse)
        │
        ▼
useTokenizer hook updates state:
  - setTokenData(response)
  - setLoading(false)
  - setError(null)
        │
        ▼
If fetch fails (network error, 4xx, 5xx):
  - setError("Could not connect to tokenizer service.")
  - setLoading(false)
  - setTokenData(null)
        │
        ▼
Components re-render based on new state:
  - TokenDisplay maps tokens → renders TokenBadge per token
    - color assigned via tokenColors.ts (index % palette.length)
    - if showTokenIds === true → renders ID below text
  - TokenStats renders section counts
  - TotalSummary renders total counts
  - ErrorMessage renders if error is set
```

---

## 5. Local Development Workflow

### Prerequisites
- Node.js 20+
- Python 3.11+
- `pnpm` or `npm`
- `pip` or `uv`

### Step 1 — Clone and set up the project

```bash
git clone <your-repo>
cd tokenizer
```

### Step 2 — Set up the Python backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:
```
ALLOWED_ORIGINS=http://localhost:3000
DEFAULT_ENCODING=cl100k_base
```

Start the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

Verify: open `http://localhost:8000/health` — should return `{"status": "ok"}`.

### Step 3 — Set up the Next.js frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

App is live at `http://localhost:3000`.

### Running Both at Once (optional)

Install `concurrently` in the root, or use a simple shell script:

```bash
# run-dev.sh (project root)
cd backend && uvicorn app.main:app --reload --port 8000 &
cd frontend && npm run dev
```

Or use a root-level `package.json` with `concurrently`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && uvicorn app.main:app --reload\" \"cd frontend && npm run dev\""
  }
}
```

---

## 6. Developer Workflow

### Adding a new feature (example: adding character-level stats)

1. **Define the schema change** — Update `backend/app/schemas/tokenizer.py` to add new fields
2. **Update the engine/service** — Add the logic in `tokenizer_service.py`
3. **Write backend tests** — Add a test case in `tests/test_tokenizer_service.py`
4. **Update TypeScript types** — Reflect the new response shape in `frontend/types/tokenizer.ts`
5. **Update the service layer** — If the API call changes, update `frontend/services/tokenizerService.ts`
6. **Update the hook** — Update `useTokenizer.ts` if state shape changes
7. **Build the UI component** — Add or update components in `components/tokenizer/`
8. **Test in browser** — Run both services, verify end-to-end behavior

### Making a change only to the UI (example: new color palette)

Only touch the frontend. The backend doesn't need to know. Update `frontend/lib/tokenColors.ts` and verify visually.

### Making a change only to tokenization logic (example: add new encoding)

Only touch the backend. Add a new engine in `backend/app/tokenizer/`. Update the service to select it. The frontend just passes the encoding string — no frontend changes needed unless you add a UI selector.

---

## 7. Testing Workflow

### Backend Tests

```bash
cd backend
source venv/bin/activate
pip install -r requirements-dev.txt
pytest tests/ -v
```

Test coverage targets:
- `test_tokenizer_engine.py` — Unit tests for tiktoken_engine (known inputs, known outputs)
- `test_tokenizer_service.py` — Unit tests for service layer (mocked engine, section assembly)
- `test_routes.py` — Integration tests using FastAPI TestClient (full request/response cycle)

Example test cases to write:
- Empty string input → returns empty token list, zero counts
- Single word → correct token count and ID
- Text with special characters → correct encoding
- Multi-section request → correct per-section and total counts
- Invalid encoding string → returns 422
- Very long input (4000+ tokens) → returns result within timeout

### Frontend Tests

```bash
cd frontend
npm run test        # runs Jest / Vitest
npm run test:e2e    # runs Playwright (if configured)
```

Unit test targets:
- `tokenColors.ts` — Color assignment logic
- `formatters.ts` — Number formatting helpers
- `useDebounce.ts` — Debounce timing behavior
- `tokenizerService.ts` — API call with mocked fetch

Component test targets (with Testing Library):
- `TokenBadge` — Renders text, renders ID when toggle is on
- `TokenStats` — Displays correct count values
- `ErrorMessage` — Renders error string correctly

---

## 8. Deployment Workflow

### Backend — Deploy to Railway (or Fly.io)

**Railway:**

1. Push backend code to GitHub
2. Create a new Railway project, connect repo
3. Set root directory to `backend/`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Railway dashboard:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   DEFAULT_ENCODING=cl100k_base
   ```
6. Railway auto-deploys on push to `main`

**Fly.io (alternative):**

```bash
cd backend
fly launch         # follow prompts
fly secrets set ALLOWED_ORIGINS=https://your-frontend.vercel.app
fly deploy
```

### Frontend — Deploy to Vercel

1. Push frontend code to GitHub
2. Import project in Vercel dashboard
3. Set root directory to `frontend/`
4. Add environment variable in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
5. Vercel auto-deploys on push to `main`

### Deployment Checklist

- [ ] Backend deployed and `/health` returns 200
- [ ] CORS configured with production frontend URL
- [ ] `NEXT_PUBLIC_API_URL` set to production backend URL in Vercel
- [ ] Both services tested end-to-end in production
- [ ] Error states tested (disconnect backend, verify frontend shows error message)

---

## 9. Future Scalability Workflow

When the app grows, the workflow scales without restructuring:

**Adding a new tokenizer (e.g., Claude):**
1. Add `anthropic_engine.py` in `backend/app/tokenizer/`
2. Update service to accept `encoding` param routing
3. Update `TokenizeRequest` schema to accept encoding choice
4. Add a model/encoding selector to the frontend UI
5. No other changes needed

**Adding caching (to reduce tiktoken overhead on repeated inputs):**
1. Add Redis or in-memory cache in `tokenizer_service.py`
2. Hash the request body as a cache key
3. Return cached result if available
4. Frontend has no awareness of this optimization

**Adding a second API version:**
1. Create `backend/app/routes/v2/tokenizer.py`
2. Mount at `/v2/tokenize` in `main.py`
3. Frontend `services/tokenizerService.ts` targets the versioned URL
4. Old `/v1/` endpoint stays alive during migration
