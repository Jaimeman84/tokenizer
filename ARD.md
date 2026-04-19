# Architecture Requirements Document (ARD)
## Educational AI Tokenizer App

**Version:** 1.0  
**Date:** 2026-04-18  
**Stack:** Next.js (TypeScript + Tailwind) + Python FastAPI + tiktoken

---

## 1. Architecture Overview

The system is two independent services connected by a clean HTTP API boundary:

```
┌─────────────────────────────────────────────────────────┐
│                      User's Browser                     │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │              Next.js Frontend                    │  │
│   │                                                  │  │
│   │  PromptInput → useTokenizer → tokenizerService  │  │
│   │         ↓                                        │  │
│   │  TokenDisplay, TokenStats, TotalSummary          │  │
│   └──────────────────┬───────────────────────────────┘  │
└──────────────────────┼──────────────────────────────────┘
                       │ HTTP POST /tokenize
                       │ (JSON request/response)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Python FastAPI Backend                     │
│                                                         │
│   Route → TokenizerService → TiktokenEngine            │
│                    ↓                                    │
│               tiktoken library                          │
│           (cl100k_base encoding)                        │
└─────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- The frontend is a rendering and interaction layer only — it never tokenizes text
- The backend owns all tokenization logic — it is the single source of truth
- They communicate over a stable, typed JSON API contract
- Both services are independently deployable

---

## 2. Why Next.js + Python

### Why Next.js for the frontend:
- Industry standard for React apps with TypeScript
- App Router provides clean page/layout structure
- API routes available if needed (not required for MVP)
- Deploys to Vercel in minutes with zero config
- Strong ecosystem for the UI work needed

### Why Python for the backend:
- `tiktoken` is OpenAI's official tokenization library — Python is its native environment
- Running tiktoken in Python gives exact parity with how OpenAI counts tokens in production
- Python's ecosystem for future AI/ML tooling (model integrations, analytics) is unmatched
- FastAPI is fast, modern, and generates OpenAPI docs automatically
- The backend can evolve independently from the frontend

### Why not a pure Next.js (JavaScript-only) approach:
- JS ports of tiktoken (`js-tiktoken`) exist but are WebAssembly-based — heavier bundle, less control
- Running tokenization server-side in Python is cleaner, more maintainable, and easier to test
- The Python backend creates a clean extension point: adding Claude tokenizer, Gemini tokenizer, or ML analytics later is natural
- Avoids WASM complexity and potential browser compatibility issues
- Python backend is worth the setup cost for the long-term flexibility it provides

---

## 3. Frontend Architecture

### Framework: Next.js 14+ with App Router
### Language: TypeScript (strict mode)
### Styling: Tailwind CSS
### State: React hooks only (no Redux, no Zustand for MVP)

### Component hierarchy

```
app/page.tsx (Home)
├── ExampleLoader
├── [Section: System Prompt]
│   ├── PromptInput
│   ├── TokenDisplay
│   │   └── TokenBadge (×n)
│   └── TokenStats
├── [Section: User Prompt]
│   ├── PromptInput
│   ├── TokenDisplay
│   │   └── TokenBadge (×n)
│   └── TokenStats
├── TotalSummary
├── TokenIdToggle
├── InsightsPanel
│   └── InsightCard (×n)
└── Button (Clear)
```

### Data flow in the frontend

```
User input
  → React state (useState in page.tsx or lifted into useTokenizer)
  → useDebounce (300ms)
  → useTokenizer hook
  → tokenizerService.tokenizeText()
  → fetch() to Python backend
  → response stored in hook state
  → passed as props to display components
```

### State management approach

MVP state is simple enough for React's built-in hooks. No global state library needed.

State lives in three places:

1. **`page.tsx`** — `systemPrompt`, `userPrompt` strings (input text)
2. **`useTokenizer` hook** — `tokenData`, `loading`, `error` (async result state)
3. **`useTokenIdToggle` hook** — `showTokenIds` boolean (UI preference state)

If the app grows to multiple pages or requires cross-component sharing of tokenization state, consider Zustand — but do not add it until needed.

### Environment configuration

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

All API base URLs come from env vars. Never hardcode backend URLs in components.

---

## 4. Backend Architecture

### Framework: FastAPI
### Language: Python 3.11+
### Tokenizer: `tiktoken` (OpenAI)
### Validation: Pydantic v2
### Server: Uvicorn (ASGI)

### Request lifecycle

```
POST /tokenize
  → FastAPI receives request
  → Pydantic validates TokenizeRequest
  → Route calls tokenizer_service.tokenize_sections()
  → Service calls tiktoken_engine.tokenize() per section
  → tiktoken_engine uses tiktoken.get_encoding("cl100k_base")
  → Returns token text, token IDs, counts
  → Service assembles TokenizeResponse
  → FastAPI serializes and returns JSON
```

### Engine abstraction

The tokenizer engine is behind an abstract base class:

```python
# app/tokenizer/base.py
from abc import ABC, abstractmethod
from typing import List
from app.schemas.tokenizer import TokenData

class TokenizerEngine(ABC):
    @abstractmethod
    def tokenize(self, text: str) -> List[TokenData]:
        ...
    
    @abstractmethod
    def count(self, text: str) -> int:
        ...
```

`TiktokenEngine` implements this. When you add a second tokenizer, you write a second class implementing the same interface. The service selects which engine to use based on the request's `encoding` field.

### CORS configuration

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # from env var
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)
```

CORS is configured from environment variables. In development, `allowed_origins` includes `http://localhost:3000`. In production, it includes only the Vercel deployment URL.

---

## 5. API Design

### Base URL
- Local: `http://localhost:8000`
- Production: `https://api.yourdomain.com` (Railway or Fly.io)

### Endpoints

---

#### `GET /health`

Health check. Used by deployment platforms and monitoring.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

#### `POST /tokenize`

Tokenizes one or more text sections and returns full token data.

**Request body:**
```json
{
  "sections": [
    {
      "label": "system",
      "text": "You are a helpful assistant."
    },
    {
      "label": "user",
      "text": "What is tokenization?"
    }
  ],
  "encoding": "cl100k_base"
}
```

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `sections` | array | Yes | — | 1–3 sections supported |
| `sections[].label` | string | Yes | — | Display label for the section |
| `sections[].text` | string | Yes | — | Text to tokenize |
| `encoding` | string | No | `cl100k_base` | Tokenizer encoding to use |

**Response body:**
```json
{
  "sections": [
    {
      "label": "system",
      "tokens": [
        { "text": "You",    "id": 2675, "index": 0 },
        { "text": " are",   "id": 527,  "index": 1 },
        { "text": " a",     "id": 264,  "index": 2 },
        { "text": " helpful", "id": 11190, "index": 3 },
        { "text": " assistant", "id": 18328, "index": 4 },
        { "text": ".",      "id": 13,   "index": 5 }
      ],
      "token_count": 6,
      "char_count": 28
    },
    {
      "label": "user",
      "tokens": [
        { "text": "What",       "id": 3923, "index": 0 },
        { "text": " is",        "id": 374,  "index": 1 },
        { "text": " token",     "id": 4037, "index": 2 },
        { "text": "ization",    "id": 2065, "index": 3 },
        { "text": "?",          "id": 30,   "index": 4 }
      ],
      "token_count": 5,
      "char_count": 21
    }
  ],
  "total_token_count": 11,
  "total_char_count": 49,
  "encoding": "cl100k_base"
}
```

**Error responses:**

| Status | Scenario |
|--------|----------|
| 422 | Invalid request body (missing fields, wrong types) |
| 400 | Unknown encoding string |
| 500 | Internal tokenization error |

---

### Pydantic schemas

```python
# app/schemas/tokenizer.py

class TokenData(BaseModel):
    text: str
    id: int
    index: int

class TokenSectionRequest(BaseModel):
    label: str
    text: str

class TokenSectionResponse(BaseModel):
    label: str
    tokens: List[TokenData]
    token_count: int
    char_count: int

class TokenizeRequest(BaseModel):
    sections: List[TokenSectionRequest]
    encoding: str = "cl100k_base"

class TokenizeResponse(BaseModel):
    sections: List[TokenSectionResponse]
    total_token_count: int
    total_char_count: int
    encoding: str
```

---

## 6. Error Handling

### Backend

- Pydantic validation errors → FastAPI returns 422 automatically with field-level detail
- Unknown encoding string → Service raises `ValueError`, route returns 400 with message
- tiktoken internal error → Caught in engine, re-raised as 500 with generic message
- No raw Python exceptions should reach the HTTP response

```python
@router.post("/tokenize", response_model=TokenizeResponse)
async def tokenize(request: TokenizeRequest):
    try:
        return await tokenizer_service.tokenize_sections(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Tokenization failed. Try again.")
```

### Frontend

- Network error (fetch throws) → `useTokenizer` catches, sets `error` state
- 4xx/5xx response → Hook checks `response.ok`, sets `error` state with message
- Empty input → No API call made; show zero counts with "Start typing to see tokens"
- Loading state → Show spinner or skeleton in `TokenDisplay` area

The frontend never crashes from a backend failure. Error states are always handled gracefully.

---

## 7. Performance Considerations

### Backend
- `tiktoken` is fast — typical encode calls take < 10ms for short prompts
- For very long inputs (4,000+ tokens), response time stays well under 500ms
- FastAPI + Uvicorn handles concurrent requests via async I/O
- No database, no external calls — the bottleneck is pure CPU-bound tokenization
- If throughput becomes an issue: add Gunicorn workers or horizontal scaling

### Frontend
- Debounce input at 300ms to avoid API spam during fast typing
- Render token badges efficiently — avoid re-rendering the entire list on each keystroke
- Use `useMemo` in `TokenDisplay` if performance issues arise with large token lists
- Tailwind CSS is purged in production — no unused styles in the bundle

### Network
- JSON payloads are small — even a 500-token prompt results in < 50KB of JSON
- CORS preflight is handled by FastAPI middleware — no additional latency after first request
- Consider adding `Cache-Control: no-store` on the backend to prevent stale caching

---

## 8. Extensibility

### Adding a new tokenizer encoding
1. Create a new engine class implementing `TokenizerEngine`
2. Register it in a `ENGINES` dict keyed by encoding string
3. `TokenizeRequest` already accepts an `encoding` field — no schema change needed
4. Frontend adds an encoding selector dropdown — only UI change needed

### Adding model-level metadata
Add a `models` field to `TokenizeResponse` that returns a list of models known to use the encoding. Frontend can display this as context ("GPT-4, GPT-3.5-turbo use this encoding").

### Adding assistant response section
The API already supports arbitrary sections in the `sections` array. Just add a third section with `label: "assistant"`. The backend has no section limit. The frontend just needs a third input area.

### Adding comparison mode (two tokenizers side-by-side)
Send two requests with different `encoding` values, or extend the API to accept `encodings: []` and return results for each. Either way, the engine abstraction means no logic duplication.

---

## 9. Security Considerations

### Input validation
- Pydantic validates all incoming data — type mismatches and missing fields are rejected at the boundary
- Maximum input length should be enforced: add a `max_length` constraint on the `text` field in `TokenSectionRequest`
- Recommended limit: 10,000 characters per section, configurable via env var

```python
class TokenSectionRequest(BaseModel):
    label: str
    text: str = Field(max_length=10000)
```

### CORS
- `ALLOWED_ORIGINS` is set strictly to the production frontend URL in production
- In development, only `localhost:3000` is allowed
- Never use `allow_origins=["*"]` in production

### No data persistence
- The backend processes text and returns results — it stores nothing
- No user data is logged or retained
- This should be communicated clearly in the app's privacy notice

### Rate limiting (post-MVP)
- For MVP, rate limiting is not critical — the tool is educational and lightweight
- In Phase 2, add `slowapi` or a gateway-level rate limiter to protect the backend from abuse

### No authentication needed
- MVP is a public, anonymous tool
- If user accounts or saved state are added later, add JWT-based auth at that point

---

## 10. Testing Strategy

### Backend

| Test type | What to test | Tool |
|-----------|-------------|------|
| Unit — engine | Known inputs → known token output and IDs | `pytest` |
| Unit — service | Section assembly, total count aggregation | `pytest` with mock engine |
| Integration — routes | Full POST /tokenize with real tiktoken | `pytest` + `httpx.AsyncClient` |
| Edge cases | Empty string, special chars, emoji, CJK text | `pytest` parametrize |

### Frontend

| Test type | What to test | Tool |
|-----------|-------------|------|
| Unit | `tokenColors.ts`, `formatters.ts`, `useDebounce` | Vitest |
| Component | `TokenBadge` renders, `TokenStats` displays counts | Vitest + Testing Library |
| Integration | `tokenizerService` with mocked fetch | Vitest |
| E2E | Full user flow: type → see tokens | Playwright |

### CI (GitHub Actions)
```yaml
# On pull request to main:
- Run Python backend tests (pytest)
- Run frontend type check (tsc --noEmit)
- Run frontend unit tests (vitest)
- Lint frontend (eslint)
```

---

## 11. Deployment Strategy

### Frontend — Vercel

- Connect GitHub repo, set root to `frontend/`
- Set `NEXT_PUBLIC_API_URL` environment variable in Vercel dashboard
- Auto-deploys on push to `main`
- Preview deployments on pull requests
- Zero config — Vercel handles Next.js builds natively

### Backend — Railway (recommended) or Fly.io

**Railway:**
- Connect GitHub repo, set root to `backend/`
- Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set env vars: `ALLOWED_ORIGINS`, `DEFAULT_ENCODING`
- Auto-deploys on push to `main`
- Sleeps after inactivity on free tier — consider a keep-alive ping or paid tier for production

**Fly.io (alternative):**
- More control over container and region
- Better suited if you need the backend to stay warm without upgrading a tier
- Slightly more setup (Dockerfile required — included in backend folder)

**Dockerfile for backend:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 12. Architecture Tradeoffs

### Option A: Next.js Only (JS tokenizer via js-tiktoken)

**Pros:**
- Single service to deploy
- No backend cold starts
- Simpler local development

**Cons:**
- `js-tiktoken` uses WebAssembly — heavier bundle, less control
- Tokenization results may diverge slightly from Python tiktoken in edge cases
- Harder to add Claude/Gemini tokenizers later (different libraries, different ecosystems)
- No clean server-side layer for future analytics, logging, or caching

**Verdict:** Viable for a prototype or demo, but creates technical debt for a production educational tool.

---

### Option B: Next.js + Python FastAPI Backend (this architecture)

**Pros:**
- tiktoken in Python = exact parity with OpenAI's production tokenization
- Clean API boundary makes extending tokenizer support straightforward
- Backend can evolve independently (add endpoints, encodings, caching)
- Natural home for future ML/AI tooling (analytics, model integrations)
- FastAPI generates OpenAPI docs automatically — useful for developer documentation

**Cons:**
- Two services to run locally and deploy
- Backend cold starts on free tiers (Railway free tier sleeps after inactivity)
- Slightly more initial setup than a single Next.js app

**Verdict:** The right choice for a product that will grow. The initial overhead is small. The long-term benefits are significant.

---

## 13. Final Recommendation

**Use Next.js + Python FastAPI.**

The setup cost is one afternoon. The payoff is:
- Exact tokenization accuracy (same library OpenAI uses)
- A clean, stable API contract between frontend and backend
- A backend that is ready for the next phase without refactoring
- A tokenizer engine abstraction that makes adding Claude, Gemini, or custom encoders a matter of adding one file

The frontend stays clean and fast because it does only what it should: render UI and call an API. The backend stays focused because it does only what it should: tokenize text and return structured data.

When you're ready to add multi-model support, comparison mode, or educational analytics — the architecture already has a home for all of it.

---

## 14. Future Scaling Approach

| Growth stage | What to add |
|-------------|------------|
| Phase 2 | Additional tokenizer engines (Claude, Gemini) behind the same API |
| Phase 2 | Model selector UI in frontend |
| Phase 2 | Assistant response section |
| Phase 3 | Redis caching for repeated tokenization requests |
| Phase 3 | Rate limiting with `slowapi` or API gateway |
| Phase 3 | Usage analytics (track popular examples, session counts) |
| Phase 4 | User accounts, saved prompts, project history |
| Phase 4 | Embeddable widget for course platforms |
| Phase 5 | Comparison mode (two tokenizers side-by-side) |
| Phase 5 | Cost estimation overlay based on token count |
