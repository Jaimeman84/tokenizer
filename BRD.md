# Business Requirements Document (BRD)
## Educational AI Tokenizer App

**Version:** 1.0  
**Date:** 2026-04-18  
**Status:** MVP Planning

---

## 1. Product Overview

An educational web app that visually demonstrates how AI tokenization works. Users paste or type text into a system prompt and user prompt area, and the app instantly shows how that text is broken into tokens — with color-coded highlights, token IDs, character counts, and per-section breakdowns.

The experience is inspired by the OpenAI tokenizer page but goes further: it explains *why* tokenization matters, provides example prompts, and surfaces educational insights alongside the visualization.

This is a standalone educational tool. It is not a context window simulator, cost calculator, or chat interface.

---

## 2. Problem Statement

Most people learning AI — students, prompt engineers, QA testers, developers — have no intuitive sense of how tokenization works. They know tokens exist, but they can't *see* them. This leads to:

- Poorly written prompts that waste tokens
- Confusion about why AI models behave differently with different inputs
- A gap between theoretical understanding and practical application
- No accessible, visual tool that teaches the concept interactively

Existing tools (like OpenAI's tokenizer) show tokens but don't teach. They're utilities, not learning experiences.

---

## 3. Goals and Objectives

**Primary Goals:**
- Give learners a visual, hands-on way to understand tokenization
- Show how system and user prompts differ in token cost
- Make token IDs tangible and understandable
- Deliver educational context alongside the visualization

**Measurable Objectives (3 months post-launch):**
- 500+ unique users per month
- Average session time > 3 minutes (indicates engagement)
- 60%+ of users interact with the token ID toggle or example loader
- Shared/embedded by at least 5 AI educators or newsletters

---

## 4. MVP Scope

The MVP is a single-page web app with:

- A system prompt input area
- A user prompt input area
- Real-time token visualization (color-coded per token)
- Token count per section (system / user)
- Total token count
- Character count
- Token ID toggle (show/hide numeric token IDs)
- Example prompt loader (preloaded educational examples)
- Clear/reset button
- Educational notes panel explaining what the user is seeing
- Responsive layout (desktop first, mobile friendly)

All tokenization runs through a Python FastAPI backend using `tiktoken` with the `cl100k_base` encoding (GPT-4 / GPT-3.5-turbo compatible).

---

## 5. Non-Goals / Out of Scope

The following are explicitly excluded from MVP:

| Item | Reason |
|------|--------|
| Context window simulator | Separate product, separate scope |
| Multi-user accounts | Not needed for MVP utility |
| Authentication | No user data to protect at MVP |
| Payment / monetization | Not the current focus |
| Saved projects or history | No persistence layer in MVP |
| Collaboration features | Out of scope |
| Multi-model comparison | Phase 2 feature |
| Anthropic / Claude tokenizer | Phase 2 — different encoding |
| Google / Gemini tokenizer | Phase 2 — different encoding |
| Full cost calculator | Different product focus |
| Chat history simulation | Different product |
| Assistant response input | Deferred to post-MVP |

---

## 6. Key Features

### F1 — Dual Prompt Input
- Two text areas: System Prompt and User Prompt
- Each is independently tokenized
- Labels explain what each field represents

### F2 — Token Visualization
- Each token rendered as a colored badge or highlighted span
- Alternating colors to clearly separate tokens
- System and user tokens use distinct color palettes

### F3 — Token Count Summary
- System prompt token count
- User prompt token count
- Total token count
- Character count (total and per section)

### F4 — Token ID View
- Toggle to show/hide numeric token IDs beneath each token
- Helps learners understand that tokens map to integers in the model vocabulary

### F5 — Example Loader
- Dropdown or card set of preloaded example prompts
- Examples cover: short text, long text, code, special characters, multilingual input
- Each example includes a brief educational note

### F6 — Educational Insights Panel
- Contextual notes that update based on what the user is entering
- Static tips explaining: what tokens are, why whitespace matters, how punctuation tokenizes, etc.

### F7 — Clear / Reset
- One-click clear of all inputs and visualization
- Optionally preserve last example for comparison

---

## 7. Functional Requirements

### FR-01: Tokenization
- System and user prompt text must be tokenized using `tiktoken` with `cl100k_base` encoding
- API must return: token strings, token IDs, token count, character count
- Results must update within 500ms of input change (debounced)

### FR-02: Visualization
- Each token must be rendered as a visually distinct element
- Token boundaries must be clearly visible
- System and user prompt visualizations must be displayed in separate sections

### FR-03: Token Counts
- Display token count for system prompt section
- Display token count for user prompt section
- Display combined total token count
- Display character count for each section and total

### FR-04: Token ID Toggle
- Default state: token IDs hidden
- On toggle: display integer token ID below or inside each token badge
- IDs must match the `cl100k_base` vocabulary

### FR-05: Example Loader
- At minimum 5 example prompts available at launch
- Each example pre-fills both system and user prompt fields
- Each example includes a short title and educational description

### FR-06: Educational Notes
- At minimum 6 static educational notes displayed in sidebar or panel
- Notes must be written in plain language suitable for beginners

### FR-07: Clear/Reset
- Clear button resets both input fields and visualization output
- Character and token counts reset to zero

### FR-08: Error States
- If backend is unreachable, display a clear user-facing error message
- If input is empty, display zero counts with a prompt to start typing

---

## 8. Non-Functional Requirements

### NFR-01: Performance
- Tokenization API response < 500ms for inputs up to 4,000 tokens
- Frontend renders token visualization without layout jank
- Debounce input events at 300ms to avoid excessive API calls

### NFR-02: Reliability
- Backend API uptime target: 99.5%
- Graceful degradation if backend is down (show error, don't crash)

### NFR-03: Responsiveness
- Fully usable on desktop (1280px+)
- Functional on tablet (768px+)
- Readable on mobile (375px+), though not the primary target

### NFR-04: Accessibility
- Color-coded tokens must not rely on color alone (use labels or patterns)
- All interactive elements must be keyboard navigable
- Minimum contrast ratio: WCAG AA

### NFR-05: Maintainability
- Frontend and backend are decoupled services
- Tokenizer logic is isolated in its own module in the backend
- New tokenizer support can be added without changing frontend code

### NFR-06: Developer Experience
- Local dev setup should take < 10 minutes with documented steps
- Environment variables used for all configuration
- No hardcoded URLs or secrets

---

## 9. Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Monthly unique users | 500+ | Month 3 |
| Average session duration | > 3 min | Month 2 |
| Token ID toggle interaction rate | > 60% | Month 2 |
| Example loader usage rate | > 40% | Month 2 |
| Bounce rate | < 50% | Month 3 |
| Social shares / mentions | 50+ | Month 3 |
| Educator referrals or mentions | 5+ | Month 3 |

---

## 10. Risks and Assumptions

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| tiktoken API breaks or changes | Low | High | Pin version, write tests |
| Backend cold starts (Railway/Fly.io) | Medium | Medium | Keep-alive pings or pre-warm |
| Low organic discovery | Medium | Medium | SEO optimization, social sharing |
| Mobile experience poor | Medium | Low | Test on real devices before launch |
| Tokenization results confuse beginners | Medium | High | Strong educational copy |

### Assumptions

- Users are comfortable using a web browser and typing text
- GPT-4 / `cl100k_base` is the relevant encoding for most learners at MVP
- No backend persistence is needed for MVP
- A single Python service is sufficient for MVP load
- The primary distribution channel is direct link / social sharing

---

## 11. Future Enhancements

These are post-MVP features, listed in rough priority order:

1. **Multi-model tokenizer support** — Add `o200k_base` (GPT-4o), add Claude tokenizer, add Gemini tokenizer
2. **Model selector** — Let users pick which model's tokenizer to use
3. **Assistant response input** — Add a third section for assistant response tokenization
4. **Token comparison mode** — Compare same text across two tokenizers side by side
5. **Share / export** — Generate shareable link or export token breakdown as image
6. **Cost estimate overlay** — Show approximate API cost based on token count (optional toggle)
7. **Saved examples** — User-created example library (requires auth)
8. **Embedded widget** — Embeddable tokenizer for course platforms
9. **Analytics dashboard** — For educators to see how students use the tool
10. **Dark mode** — Accessible color theme toggle

---

## 12. Recommended MVP Build Approach

**Phase 0 — Setup (Day 1–2)**
- Initialize Next.js + TypeScript + Tailwind frontend
- Initialize FastAPI + tiktoken backend
- Set up local dev with `.env` files
- Define API contract (request/response shapes)

**Phase 1 — Core Tokenization (Day 3–5)**
- Build `/tokenize` API endpoint in FastAPI
- Integrate tiktoken with `cl100k_base`
- Return tokens, token IDs, counts, character counts
- Test endpoint with Postman or HTTPie

**Phase 2 — Frontend Foundation (Day 6–9)**
- Build layout: dual prompt inputs + visualization area
- Connect to API, render token badges
- Show token counts and character counts

**Phase 3 — Features (Day 10–14)**
- Token ID toggle
- Example loader
- Clear/reset
- Educational notes panel

**Phase 4 — Polish + Launch (Day 15–18)**
- Responsive layout QA
- Error states
- Accessibility pass
- Deploy backend to Railway or Fly.io
- Deploy frontend to Vercel
- Write README

**Total estimated timeline: 18–21 working days for a solo developer**
