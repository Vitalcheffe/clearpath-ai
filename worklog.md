---
Task ID: 1
Agent: Main
Task: Fix all P0-P4 issues in ClearPath AI

Work Log:
- P0: Added `/end\s+it\b/` crisis pattern to CRISIS_PATTERNS in classify/route.ts
- P1: Added fallback when BART returns 0 categories (never return empty), improved CANDIDATE_LABELS with more variations (evicted, cancer, dying of illness, etc.), lowered multi-need threshold from 15% to 10%
- P2: Replaced "Crisis keyword detected — AI classification bypassed" with "Help is available right now — you don't have to face this alone"
- P3: Completely rewrote /app page from 2410-line chatbot UI to 450-line clean classifier UI. Removed: sidebar, conversation tracking, profile icon, settings link, "Talk to a Navigator", "Ask a follow-up question", attach button, model selector dropdown, export menu, floating navigator button, AuthProvider from layout, useSession import. Added: clean single-page classifier with input + results + clarification.
- P4: Added filter for `verified !== 'N/A'` in resource display
- Removed AuthProvider from layout.tsx (no longer needed)
- Committed as 076693c, pushed to both origin and demo remotes

Stage Summary:
- All 5 priority fixes deployed and verified live
- Test results: Crisis detection ✅ (maybe I will end it, I want to kill myself), False positives ✅ (I'm dying for a coffee → clarification), Housing ✅ (eviction → 80%), Food ✅ (80%), Mental Health ✅ (56%), Senior ✅ (95%), Legal ✅ (95%), Employment ✅ (95%), Healthcare ✅ (dying of cancer → 95%)
- Frontend is clean classifier: "What do you need help with?" + suggestion cards + input bar + results
