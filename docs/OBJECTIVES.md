# CLEARPATH AI — PROJECT OBJECTIVES

**We are not building a hackathon demo. We are building a product people would trust with their life.**

---

## 🔴 LEVEL 0 — NON-NEGOTIABLE BASELINE

If we don't hit these, we don't submit. Period.

- **The app loads in under 3 seconds** on a 3G connection. A person in crisis does not wait.
- **Crisis detection fires within 200ms** of input. If someone types "I want to hurt myself," they see the 988 hotline BEFORE any AI classification runs. No exceptions. No loading spinners. Instant.
- **Every single result shows a confidence score.** If we ever display a resource without telling the user how confident the AI is, that's a bug, not a feature gap.
- **The app works on a $50 Android phone.** Our users are not on iPhone 15 Pro. They are on cracked screens with slow data. If it doesn't work on their device, it doesn't work.
- **Zero data stored without explicit consent.** The user types their problem, we process it, we show results, we forget. No database of people's crises.
- **A real person can take over at any point.** The "Talk to a navigator" button is not a future feature. It's live on day one. It connects to 211.

---

## 🟡 LEVEL 1 — COMPETITIVE STANDARD

This is what a Top 3 project looks like. Anything below this is mid.

- **The user describes their situation in one sentence and gets three things:** (1) What the AI thinks they need, (2) How confident it is, (3) What else it considered. No clicking through menus. No dropdowns. One sentence in, full picture out.
- **When the AI is unsure, it doesn't guess — it asks.** "You mentioned rent problems. Have you received an eviction notice?" One question, typed naturally, and the confidence jumps from 52% to 94%. That moment IS the product.
- **The pitch video makes the judge feel something.** Not a screen recording with voiceover. A 2-minute story: a real scenario, a real wrong answer from a search engine, and then ClearPath doing it right. The judge should think "this team understands what's at stake."
- **The GitHub repo looks like a real startup.** Clean README with architecture diagram. CONTRIBUTING.md. RESPONSIBLE_AI.md. Not 47 files dumped in root. Not "will clean up later." Professional from commit one.
- **The deployed app is accessible by anyone with the URL.** No "it works on my machine." No localhost. The judge clicks the link and it works. Every time.
- **The confidence score isn't just a number — it's an experience.** A 94% match feels different from a 52% match. The UI makes that distinction visceral. Color, size, language — everything communicates certainty vs uncertainty.
- **Our Devpost page reads like a startup pitch, not a homework submission.** Problem statement that punches you in the gut. Architecture that makes sense. Limitations we're honest about. Impact that's measurable.

---

## 🟢 LEVEL 2 — JAW-DROPPER

This is what wins the whole thing. This is the level where a judge puts down their pen and says "this is the one."

- **The AI explains itself like a human would.** Not "Legal Aid — 78% confidence." But "I think you might need legal aid because you mentioned eviction. I'm fairly confident about this, but there's also a chance you need emergency financial assistance. Want to tell me more?" That explanation IS the transparency. It's not a separate section. It's woven into the answer.
- **A judge can break it and it still behaves responsibly.** They type nonsense. They type in another language. They type something triggering. In EVERY case: crisis keywords are caught, low confidence triggers clarification, and nothing harmful is presented as certain. The system is antifragile in its ethics.
- **The clarification questions feel like a conversation, not a form.** Not a dropdown of 5 options. A natural follow-up: "You said you can't pay rent — is this because of a job loss, or did you get a notice from your landlord?" Each question narrows the confidence gap.
- **The demo flow is rehearsed and airtight.** We have 3 demo scenarios: (1) A clear-cut case where the AI is confident, (2) A tricky case where it asks clarification, (3) A crisis case where it immediately shows hotline info. The judge sees all three in under 90 seconds.
- **Our RESPONSIBLE_AI.md is the best one in the entire hackathon.** Not 2 paragraphs of "we care about ethics." A real document: what could go wrong, what we did about it, what we couldn't fix, and where the human must stay in control. Judges will read this. Make it undeniable.
- **The pitch video ends with a line that sticks.** "When it matters most, honesty is the safest answer." The judge remembers that sentence a week later when they're scoring.

---

## ⚪ LEVEL 3 — LEGENDARY

This is beyond winning. This is the project that becomes the example they show next year.

- **Someone in the real world could actually use this.** Not a polished demo with fake data. A working tool with real 211.org integration, real resource data for at least one city, and a path to actual deployment.
- **The architecture is clean enough to scale.** We build for one city, but the code doesn't hardcode "Houston, TX." Adding a new city = adding a new data source. The API routes don't change. The frontend doesn't change. Plug and play.
- **Other hackathon teams reference our project as the standard for responsible AI.** They read our RESPONSIBLE_AI.md and use it as a template for their own projects. We don't just win Best Responsible AI — we define what it means.
- **USAII features ClearPath AI in their next boot camp** as an exemplar of the Community track. Our project becomes the case study.
- **The confidence calibration is mathematically sound, not vibes.** We don't just show a percentage — we can explain WHY it's 78% and not 82%. Temperature scaling, calibration curves, real methodology. A judge who knows AI looks at it and nods, not cringes.

---

## 🎯 DELIVERABLE QUALITY BARS

Every deliverable has a standard. These are not aspirational. These are what "done" looks like.

### Qualifier Answers (June 7–10)
- Every answer names a **specific user**, not "people"
- Every risk is a **real scenario** that could happen with OUR system
- Every mitigation is a **design decision we actually implemented**, not a promise
- The pitch sentence makes a stranger say "I get it"

### Pitch Video
- Under 3 minutes. No exceptions.
- Opens with the problem — not our names, not the tech
- Shows the app working, not a PowerPoint
- Ends with one memorable line
- Audio is clean. No background noise. No "um"

### GitHub Repository
- README.md with: problem, architecture diagram, setup instructions, live demo link, team info
- RESPONSIBLE_AI.md with: risks, mitigations, known limitations, human oversight protocol
- Clean folder structure. No files in root except README, CHARTER, LICENSE
- Commit history shows consistent work across the week, not 47 commits on June 21
- Every PR has a description

### Deployed Application
- Accessible 24/7 at a public URL
- Works on mobile (Chrome Android, Safari iOS)
- Works on slow connections (test with Chrome DevTools throttling)
- No console errors in production
- Loading state for every async operation
- Error state for every failure case
- Crisis detection works even if the HuggingFace API is down

### Devpost Submission
- Thumbnail image that looks professional
- One-paragraph description that a non-technical person understands
- "What it does" section with the 6-layer architecture clearly explained
- "How we built it" section naming every tool and why we chose it
- "Challenges we ran into" section that shows we actually struggled and solved problems
- "What we learned" section that's honest, not "we learned teamwork"
- "What's next" section that shows a real vision, not "add more features"

---

## 📋 PRE-BUILD CHECKLIST

Before June 14, these must be ready:

- [ ] GitHub repo created with README, CHARTER.md, RESPONSIBLE_AI.md
- [ ] Branch protection rules on `main`
- [ ] Vercel account set up and linked
- [ ] Hugging Face API key obtained (free)
- [ ] 211.org API access confirmed (or fallback data sourced)
- [ ] SQLite database initialized with Prisma
- [ ] Figma/design system for the UI components
- [ ] 3 demo scenarios written and rehearsed
- [ ] Pitch video script drafted
- [ ] Both team members have committed to the CHARTER
- [ ] Daily standup schedule agreed (time that works for Morocco + India)
- [ ] Qualifier completed and passed (June 7–10)

---

## 📋 BUILD WEEK DAILY CHECKLIST

### Day 1 — June 14 (Architecture)
- [ ] Repo scaffolded: Next.js App Router with `src/app/`, `src/app/api/`, `src/data/`, `prisma/`, `docs/`
- [ ] API routes defined: `/api/classify`, `/api/community-resources`, `/api/contact`
- [ ] Prisma schema defined for SQLite (Resource, User, Conversation, Message)
- [ ] First deploy to Vercel (even if it's just a blank page)
- [ ] CI pipeline green

### Day 2 — June 15 (Safety First)
- [ ] Crisis detection regex implemented and tested with 20+ keywords
- [ ] Crisis detection has 100% test coverage
- [ ] Frontend skeleton: input page, results page, crisis overlay
- [ ] "Talk to a navigator" button live (links to 211)

### Day 3 — June 16 (Intelligence)
- [ ] HuggingFace Inference API integrated (BART-large-MNLI)
- [ ] Multi-label classification returns top categories with confidence scores across 9 categories
- [ ] Confidence calibration (temperature scaling) implemented
- [ ] API route `/api/classify` handles both crisis detection and classification

### Day 4 — June 17 (Conversation)
- [ ] Clarification logic: if confidence < 70%, generate follow-up question
- [ ] Second-pass classification with clarified input
- [ ] Frontend displays classification results with confidence bars
- [ ] Frontend displays clarification questions naturally

### Day 5 — June 18 (Transparency)
- [ ] Every result shows: WHY matched, WHAT ELSE considered, HOW CONFIDENT
- [ ] Human escalation flow: "I'm not confident enough — talk to a navigator"
- [ ] Full end-to-end flow working: input → crisis check → classify → clarify → display → escalate
- [ ] Mobile responsive on Android Chrome

### Day 6 — June 19 (Battle Testing)
- [ ] 3 demo scenarios working perfectly
- [ ] Edge case testing: empty input, gibberish, non-English, crisis keywords
- [ ] Performance: crisis detection < 200ms, full flow < 5 seconds
- [ ] Bug squash session — zero critical bugs remaining

### Day 7 — June 20 (Polish)
- [ ] README.md complete with architecture diagram
- [ ] RESPONSIBLE_AI.md complete and thorough
- [ ] Devpost submission filled out completely
- [ ] Pitch video recorded and edited
- [ ] Demo recording for Devpost

### Day 8 — June 21 (Submit)
- [ ] Final testing on a fresh device
- [ ] Submit on Devpost by 12:00 PM ET (noon — 12-hour safety margin)
- [ ] Confirm both team members are listed
- [ ] Post-submission: breathe

---

*This document is a living standard. If we're not meeting LEVEL 1 by June 19, we escalate. If we're hitting LEVEL 2 by June 20, we push for LEVEL 3.*
