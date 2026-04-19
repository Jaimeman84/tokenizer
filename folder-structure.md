# Project Folder Structure
## Educational AI Tokenizer App

**Version:** 1.0  
**Date:** 2026-04-18  
**Stack:** Next.js (TypeScript + Tailwind) + Python FastAPI

---

## Overview

This project is two separate services:

- `frontend/` — Next.js application (UI, API calls, visualization)
- `backend/` — Python FastAPI service (tokenization logic, tiktoken)

They communicate over HTTP. The frontend calls the backend API. The backend never calls the frontend. They are deployed independently.

---

## Full Project Root

```
tokenizer/
├── frontend/                  # Next.js app
├── backend/                   # Python FastAPI app
├── .gitignore
└── README.md
```

---

## Frontend Structure

```
frontend/
├── app/                        # Next.js App Router pages and layouts
│   ├── layout.tsx              # Root layout (fonts, metadata, global wrapper)
│   ├── page.tsx                # Home page — main tokenizer UI
│   ├── globals.css             # Global CSS (Tailwind base imports)
│   └── favicon.ico
│
├── components/                 # Reusable UI components
│   ├── tokenizer/              # Domain-specific tokenizer components
│   │   ├── PromptInput.tsx     # Textarea input for system or user prompt
│   │   ├── TokenDisplay.tsx    # Renders color-coded token badges for one section
│   │   ├── TokenBadge.tsx      # Single token badge (text + optional ID)
│   │   ├── TokenStats.tsx      # Shows count summary (tokens, chars) for a section
│   │   ├── TotalSummary.tsx    # Combined totals across all sections
│   │   ├── TokenIdToggle.tsx   # Toggle switch to show/hide token IDs
│   │   └── ExampleLoader.tsx   # Dropdown or cards for loading example prompts
│   │
│   ├── education/              # Educational content components
│   │   ├── InsightsPanel.tsx   # Sidebar or panel with educational notes
│   │   └── InsightCard.tsx     # Individual insight/tip card
│   │
│   └── ui/                     # Generic, reusable UI primitives
│       ├── Button.tsx          # Styled button component
│       ├── Badge.tsx           # Generic badge component
│       ├── Toggle.tsx          # Accessible toggle/switch
│       ├── Divider.tsx         # Horizontal rule with optional label
│       └── ErrorMessage.tsx    # Inline error display component
│
├── hooks/                      # Custom React hooks
│   ├── useTokenizer.ts         # Main hook — manages API call, state, debounce
│   ├── useDebounce.ts          # Generic debounce hook for input handling
│   └── useTokenIdToggle.ts     # State management for token ID visibility
│
├── lib/                        # Pure utility functions and constants
│   ├── constants.ts            # App-wide constants (API URL, debounce delay, etc.)
│   ├── tokenColors.ts          # Color palette logic for token highlighting
│   ├── formatters.ts           # Number formatting, display helpers
│   └── examples.ts             # Static example prompt data
│
├── services/                   # API layer — all calls to Python backend go here
│   └── tokenizerService.ts     # Functions: tokenizeText(), tokenizeSections()
│
├── types/                      # TypeScript type definitions
│   ├── tokenizer.ts            # TokenResult, TokenSection, TokenResponse types
│   └── examples.ts             # ExamplePrompt type
│
├── styles/                     # Additional styling (beyond globals.css)
│   └── tokens.css              # Token badge animation / highlight styles
│
├── public/                     # Static assets
│   └── og-image.png            # Open Graph image for social sharing
│
├── .env.local                  # Local environment variables (not committed)
├── .env.example                # Example env vars for documentation
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
└── README.md
```

### Frontend Folder Notes

**`app/`**  
Uses the Next.js App Router. The home page (`page.tsx`) renders the entire tokenizer UI. `layout.tsx` wraps the app with fonts, metadata, and the global Tailwind stylesheet. Additional pages (e.g., `/about`, `/examples`) can be added here without restructuring.

**`components/tokenizer/`**  
All components specific to the tokenizer feature. Each component has one job. `PromptInput` handles text input. `TokenDisplay` renders a row of `TokenBadge` elements. `TokenStats` shows count summaries. Keeping these in a `tokenizer/` subfolder makes it easy to lift out if the app grows.

**`components/education/`**  
Separate from tokenizer components because educational content is a distinct concern. `InsightsPanel` can show static tips or context-aware hints based on what the user is typing.

**`components/ui/`**  
Generic primitives with no domain logic. These are the building blocks (`Button`, `Toggle`, `Badge`) that domain components use. Keeping them separate avoids coupling UI conventions to feature logic.

**`hooks/`**  
`useTokenizer.ts` is the core hook. It owns the debounce, the API call via `tokenizerService`, and the resulting state (tokens, counts, loading, error). Components stay thin because the hook handles orchestration.

**`lib/`**  
Pure functions and constants. No React, no side effects. `tokenColors.ts` maps token index to a color from the palette. `examples.ts` exports the static list of example prompts. `constants.ts` stores `BACKEND_URL`, `DEBOUNCE_MS`, etc.

**`services/`**  
The only place that talks to the Python backend. If the API URL changes, the backend moves, or the request shape changes — this is the only file to update. Components and hooks never call `fetch` directly.

**`types/`**  
Shared TypeScript interfaces. `TokenResult` represents one token (text, id, index). `TokenSection` represents a full section result (tokens, count, char count). `TokenResponse` is the full API response shape.

---

## Backend Structure

```
backend/
├── app/                        # Main application package
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point, CORS config, router mounts
│   │
│   ├── routes/                 # HTTP route handlers (thin — delegate to services)
│   │   ├── __init__.py
│   │   └── tokenizer.py        # POST /tokenize, GET /health
│   │
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   └── tokenizer_service.py  # Calls tokenizer module, formats response
│   │
│   ├── tokenizer/              # Tokenizer engine (isolated, swappable)
│   │   ├── __init__.py
│   │   ├── tiktoken_engine.py  # tiktoken integration (cl100k_base encoding)
│   │   └── base.py             # Abstract base class for tokenizer engines
│   │
│   └── schemas/                # Pydantic request/response models
│       ├── __init__.py
│       └── tokenizer.py        # TokenizeRequest, TokenizeResponse, TokenData schemas
│
├── tests/                      # Backend tests
│   ├── __init__.py
│   ├── test_tokenizer_engine.py  # Unit tests for tiktoken_engine
│   ├── test_tokenizer_service.py # Unit tests for service layer
│   └── test_routes.py            # Integration tests for API endpoints
│
├── .env                        # Local environment variables (not committed)
├── .env.example                # Example env vars
├── requirements.txt            # Python dependencies
├── requirements-dev.txt        # Dev dependencies (pytest, httpx, etc.)
├── Dockerfile                  # Container definition for deployment
└── README.md
```

### Backend Folder Notes

**`app/main.py`**  
FastAPI app initialization. Configures CORS (to allow the Next.js frontend to call it), mounts all routers, and sets up startup/shutdown events if needed. Keep it thin — just wiring.

**`app/routes/tokenizer.py`**  
HTTP handlers only. A route function receives a request, calls a service function, and returns the response. No tokenization logic lives here. Thin routes make it easy to version the API (`/v1/tokenize`) or add middleware without touching logic.

**`app/services/tokenizer_service.py`**  
Orchestrates the tokenization flow. Receives validated input from the route, calls the tokenizer engine, formats the result into the response schema, and returns it. If you add caching or logging, it goes here.

**`app/tokenizer/`**  
The engine layer. `tiktoken_engine.py` wraps `tiktoken` and exposes a simple interface: give it text and encoding, get back tokens and IDs. `base.py` defines an abstract `TokenizerEngine` class with a `tokenize(text)` method. When you add a second tokenizer (e.g., for Claude), you create a new file here that implements the base class — nothing else changes.

**`app/schemas/tokenizer.py`**  
Pydantic models for request validation and response serialization. `TokenizeRequest` defines what the frontend sends. `TokenizeResponse` defines exactly what comes back. These schemas are the contract between frontend and backend.

**`tests/`**  
Separated by layer: unit tests for the engine, unit tests for the service, and integration tests for the routes. The integration tests use `httpx.AsyncClient` with FastAPI's `TestClient` to hit real endpoints.

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
ALLOWED_ORIGINS=http://localhost:3000
DEFAULT_ENCODING=cl100k_base
```

---

## Key Separation Principles

1. **Frontend never tokenizes** — all tokenization logic is in the Python backend
2. **Backend never knows about UI** — it returns structured data, nothing presentational
3. **`services/` on the frontend is the only API boundary** — nothing else calls the backend directly
4. **`tokenizer/` on the backend is the only place tiktoken is used** — the service layer doesn't import tiktoken
5. **Schemas define the contract** — both sides agree on shapes through the Pydantic models (backend) and TypeScript types (frontend)

---

## Adding a Second Tokenizer Later (Example)

When you're ready to support a second encoding or a different tokenizer:

1. Create `backend/app/tokenizer/new_engine.py` implementing `TokenizerEngine`
2. Update `TokenizeRequest` schema to accept an optional `encoding` field
3. Update `tokenizer_service.py` to select the engine based on the request
4. Update `frontend/types/tokenizer.ts` if the response shape changes
5. Add a model selector UI component in `frontend/components/tokenizer/`

Nothing else changes. The isolation is what makes this extension clean.
