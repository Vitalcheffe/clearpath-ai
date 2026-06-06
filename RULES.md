# CLEARPATH AI — RULES.md

**Self-imposed rules for the production build. Every rule exists because we learned the hard way.**

---

## R1 — GIT RULES (NON-NEGOTIABLE)

1. **ALWAYS commit under VitalCheffe (amineharchelkorane5@gmail.com).**
   ```bash
   git config user.name "VitalCheffe"
   git config user.email "amineharchelkorane5@gmail.com"
   ```

2. **ONLY push to `origin` (clearpath-ai-prod). NEVER push to `demo` remote.**
   - `origin` → `clearpath-ai-prod` (private, active workspace)
   - `demo` → `clearpath-ai` (public, FROZEN at commit 9cf03af)

3. **Conventional commits. Always.**
   - `feat: add real database connection`
   - `fix: replace mock data with API calls`
   - `refactor: clean up auth configuration`
   - `docs: update PROGRESS.MD`
   - Never: "update stuff", "fix things", "wip"

4. **Commit often. Push after every logical unit of work.** Small commits are better than big bang commits.

5. **NEVER commit secrets.** API keys go in `.env` only. `.env` is gitignored.

---

## R2 — ARCHITECTURE RULES

1. **Same UI, same pages, same design as the demo.** The production version looks IDENTICAL to the demo. The only difference is that it WORKS FOR REAL.

2. **No mock data. No hardcoded fake data. No "demo mode."** Every piece of data comes from either:
   - The real database (Prisma + SQLite)
   - A real API call (/api/classify, /api/conversations, etc.)
   - A real user session (NextAuth)

3. **Database: Prisma + SQLite.** The schema is already defined. Use it. Connect it. Seed it.

4. **Auth: NextAuth with real OAuth.** Google and GitHub providers with real Client IDs (configured via .env). Credentials provider for email/password login.

5. **6-Layer Architecture MUST work end-to-end:**
   - Layer 1: Free-text input → User types their situation
   - Layer 2: Crisis detection → Hardcoded keywords, ALWAYS runs first
   - Layer 3: AI classification → Real HuggingFace API call (with simulation fallback)
   - Layer 4: Clarification questions → When confidence < 70%
   - Layer 5: Transparent display → Why + What Else + How Confident
   - Layer 6: Human escalation → 211 navigator button, always visible

6. **API routes MUST use the real database.** No more returning hardcoded arrays.

---

## R3 — DESIGN RULES (FROM BRAND.md)

1. **Primary Blue:** #2563EB
2. **Confidence colors are semantic:** Green (>70%), Yellow (40-70%), Red (<40%)
3. **"Talk to a Navigator" button is ALWAYS visible.** Never hidden.
4. **Every result shows confidence.** No result without a confidence score.
5. **Crisis overlay takes over the ENTIRE screen.** No distractions.
6. **Voice:** Honest, calm, human. Never arrogant. Never robotic.
7. **ClearPath AI** — always three words, two capitals, one space before AI.

---

## R4 — RESPONSIBLE AI RULES (FROM CHARTER.md §4)

1. **Confidence scores are ALWAYS visible.** No result shown without its confidence percentage.
2. **Crisis detection is ALWAYS hardcoded.** AI can NEVER override or skip crisis keywords.
3. **Human escalation is ALWAYS offered when confidence < 70%.** System NEVER guesses harder.
4. **NEVER auto-contact services on behalf of the user.** AI suggests. Human decides.
5. **NEVER store PII without consent.** Free-text inputs processed in-memory, not persisted unless user opts in.
6. **Known limitations are ALWAYS documented.** In README, RESPONSIBLE_AI.md, and in the UI.
7. **NEVER claim the AI is 100% accurate.** Always state it's a decision-support tool.

---

## R5 — PRODUCTION-SPECIFIC RULES

1. **Login MUST work.** User can sign in with Google, GitHub, or email/password.
2. **Signup MUST work.** User can create an account and it gets saved to the database.
3. **Chat MUST call the real API.** No more pre-canned responses. Every user message goes to /api/classify.
4. **Dashboard MUST show real stats.** Conversations count, resources found, confidence average — all from the database.
5. **History MUST show real conversations.** From the database, grouped by date, filterable.
6. **Profile MUST show/edit real user data.** From the database, saved on submit.
7. **Settings MUST save to the database.** Every toggle, every dropdown, every input persists.
8. **Saved Resources MUST work.** User can save/unsave resources, stored in the database.

---

## R6 — FILE MANAGEMENT RULES

1. **RULES.md** — This file. Self-imposed rules. Read before every work session.
2. **PROGRESS.MD** — Detailed progress tracking. Update after every completed task.
3. **TASKS.md** — Ultra-granular task breakdown. Check off items as they're completed.
4. **worklog.md** — Agent work log. Every agent must append their work record.

---

## R7 — WHAT WE DON'T TOUCH

1. **The demo repo (clearpath-ai).** FROZEN. Never push to it.
2. **The visual design.** It's already premium. We don't redesign, we make it functional.
3. **RESPONSIBLE_AI.md, CHARTER.md, OBJECTIVES.md.** These are strategic documents. They're already excellent.
4. **The .env file.** Never commit it. Never share it.

---

*Last updated: June 2026 — Production build phase*
