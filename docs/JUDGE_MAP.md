# JUDGE_MAP.md — ClearPath AI × INFORMS Scoring Alignment

> **Purpose**: Every single deliverable, feature, and presentation moment must map directly to the INFORMS scoring criteria. This document is our strategic blueprint — no effort is wasted on anything that doesn't score points.

---

## INFORMS Scoring Breakdown

| Criterion | Weight | Max Points | Our Strategic Priority |
|-----------|--------|------------|----------------------|
| Problem Understanding | 25% | 25 | 🔴 Critical — Must dominate |
| AI Reasoning | 25% | 25 | 🔴 Critical — Our differentiator |
| Solution Coherence | 20% | 20 | 🟠 High — Architecture tells the story |
| Responsible AI | 15% | 15 | 🔴 Critical — We WIN this category |
| Human Oversight | 10% | 10 | 🟠 High — Built into our DNA |
| Communication Clarity | 5% | 5 | 🟡 Medium — Polish, don't over-invest |

**Total**: 100 points. We need 85+ to win.

---

## Score Target Strategy

### Where We MAX OUT (90-100% of available points)

**Responsible AI (15 pts) → Target: 14-15 pts**
- We are the ONLY team with calibrated confidence as a core feature
- Crisis detection is hardcoded, not AI-dependent — zero hallucination risk
- Transparency layer (Why / What Else / How Confident) is unprecedented
- Human escalation to 211.org navigators when AI is uncertain
- This is our unfair advantage. No other team will match this.

**Human Oversight (10 pts) → Target: 9-10 pts**
- Layer 6 is literally "Human Escalation"
- 211.org integration connects to real human navigators
- Confidence threshold triggers human handoff automatically
- Hardcoded crisis keywords bypass AI entirely → guaranteed human response
- We don't just "allow" human oversight — we ARCHITECT it

**Problem Understanding (25 pts) → Target: 22-24 pts**
- We've identified the real problem: "A confident wrong answer is more dangerous than no answer at all"
- Most teams will say "people can't find resources" — we say "people find WRONG resources and don't know they're wrong"
- Our 6-layer architecture directly addresses every dimension of the problem
- We understand vulnerable populations don't have time for wrong answers

### Where We COMPETE STRONGLY (75-85% of available points)

**AI Reasoning (25 pts) → Target: 19-21 pts**
- Multi-label classification with HuggingFace zero-shot
- Calibrated confidence scoring (not just top-1 prediction)
- Active learning via clarification questions (confidence < 70%)
- Crisis detection as a separate, deterministic layer
- Risk: Judges may say "zero-shot isn't advanced enough" — counter: it's RESPONSIBLE to use simpler, verifiable AI than complex, opaque AI

**Solution Coherence (20 pts) → Target: 16-18 pts**
- 6-layer architecture is clean, logical, and each layer justifies the next
- Free input → crisis check → classify → clarify → display → escalate
- Every component serves a purpose; nothing is decorative
- Risk: If demo fails or bugs appear, coherence score drops — must have fallback demo

### Where We MAINTAIN (70-80% of available points)

**Communication Clarity (5 pts) → Target: 4 pts**
- Clear pitch script with problem → insight → solution structure
- Demo shows real scenario, not features
- Responsible AI doc is well-written and specific
- Risk: Only 5% — don't over-invest, but don't embarrass ourselves

---

## Deliverable-to-Criterion Mapping

### Qualifier Phase (June 7-10)

| Qualifier Question | Primary Criterion | Secondary Criterion | Key Talking Points |
|--------------------|-------------------|---------------------|-------------------|
| Q1: What community problem? | Problem Understanding | Communication Clarity | Information asymmetry; wrong help > no help |
| Q2: Who is affected? | Problem Understanding | Responsible AI | Vulnerable populations; digital divide |
| Q3: Why AI needed? | AI Reasoning | Problem Understanding | Scale of need exceeds human capacity; 24/7 availability |
| Q4: How does AI reason? | AI Reasoning | Solution Coherence | Zero-shot classification + confidence calibration |
| Q5: What data? | AI Reasoning | Responsible AI | Curated verified database; no scraping; no PII |
| Q6: Responsible AI? | Responsible AI | Human Oversight | Transparency, crisis detection, human escalation |
| Q7: Human oversight? | Human Oversight | Responsible AI | 211.org integration; confidence thresholds; crisis bypass |
| Q8: Limitations? | Problem Understanding | Responsible AI | Zero-shot isn't perfect → that's WHY we calibrate confidence |
| Q9: Impact? | Problem Understanding | Solution Coherence | Measured by accuracy of resource matching + user trust |

### Build Phase Deliverables

| Deliverable | Primary Criterion | Secondary Criterion | How It Scores |
|-------------|-------------------|---------------------|---------------|
| **Working Demo** | Solution Coherence | AI Reasoning | Shows all 6 layers working end-to-end |
| **Responsible AI Document** | Responsible AI | Human Oversight | Required deliverable; must be thorough |
| **Pitch Video (3 min)** | Communication Clarity | Problem Understanding | Problem → Insight → Solution → Demo → Impact |
| **GitHub Repository** | Solution Coherence | AI Reasoning | Clean code, documented, reproducible |
| **Crisis Detection Module** | Human Oversight | Responsible AI | Hardcoded, deterministic, zero hallucination |
| **Confidence Display UI** | Responsible AI | AI Reasoning | Visual "glass box" showing AI reasoning |
| **211.org Integration** | Human Oversight | Solution Coherence | Real external API, not simulated |

---

## Presentation Strategy: Second-by-Second Score Maximization

### Pitch Video (3 minutes = 180 seconds)

| Time | Content | Criterion Targeted | Why It Scores |
|------|---------|-------------------|---------------|
| 0-15s | "A confident wrong answer is more dangerous than no answer at all" | Problem Understanding | Hooks with insight, not just problem statement |
| 15-30s | Scene: single mother types "I need help with food" → gets wrong resource | Problem Understanding | Emotional, specific, real |
| 30-60s | ClearPath AI: 6-layer architecture explained visually | Solution Coherence | Clean architecture = coherence points |
| 60-90s | LIVE DEMO: crisis detection + confidence display + human escalation | AI Reasoning + Responsible AI + Human Oversight | Triple-score moment |
| 90-120s | Responsible AI deep dive: transparency, crisis, calibration | Responsible AI | We OWN this category |
| 120-150s | Impact metrics + future vision | Problem Understanding + Solution Coherence | Scale + sustainability |
| 150-180s | "ClearPath AI — because wrong help is no help at all" | Communication Clarity | Memorable closing |

### Demo Script Score Maximization

| Demo Scenario | Criteria Covered | Duration |
|---------------|-----------------|----------|
| **Scenario 1**: "I lost my job and can't pay rent" → multi-label + confidence | AI Reasoning, Solution Coherence | 90 seconds |
| **Scenario 2**: "I want to end it all" → crisis detection + human escalation | Human Oversight, Responsible AI | 60 seconds |
| **Scenario 3**: "I need help with childcare" → low confidence → clarification | AI Reasoning, Responsible AI | 60 seconds |

---

## Judge Persona Analysis

### What Judges Want to See

**INFORMS judges are Operations Research professionals. They value:**
1. **Quantifiable reasoning** — Not "we use AI" but "we classify with 73% calibrated confidence and escalate when below 70%"
2. **Systematic methodology** — Our 6-layer architecture IS methodology
3. **Honest limitations** — Admitting zero-shot isn't perfect + explaining WHY that's why we calibrate = brilliance
4. **Real-world feasibility** — 211.org integration, real resource database, not hypothetical
5. **Responsible deployment** — This is INFORMS. They CARE about ethics more than most hackathon judges

### What Judges DON'T Want to See

1. **"We use GPT-4"** with no explanation of how or why → lazy, scores low on AI Reasoning
2. **Overpromising** — "Our AI is 99% accurate" → they'll see through it
3. **No failure modes** — If you can't articulate how it fails, you don't understand it
4. **Decorative AI** — AI for AI's sake with no clear reasoning chain
5. **Ignoring human oversight** — This is 10% of the score; many teams will forget it

---

## Competitive Positioning Matrix

| Our Feature | Maps To | Most Teams Will | We Will |
|-------------|---------|-----------------|---------|
| Calibrated confidence | AI Reasoning + Responsible AI | Show top-1 result confidently | Show confidence % + alternatives |
| Crisis detection | Human Oversight + Responsible AI | Skip it or use AI for it | Hardcode it, deterministic |
| Clarification questions | AI Reasoning | Return results immediately | Ask before recommending when uncertain |
| Transparency display | Responsible AI | Black box results | "Why this? What else? How confident?" |
| Human escalation | Human Oversight | "Contact us" form | Auto-escalate to 211.org navigator |
| Verified database | Problem Understanding + AI Reasoning | Scrape web resources | Curated, verified entries only |

---

## Score Projection

| Criterion | Weight | Conservative | Expected | Optimistic |
|-----------|--------|-------------|----------|------------|
| Problem Understanding | 25% | 20 | 23 | 25 |
| AI Reasoning | 25% | 17 | 20 | 23 |
| Solution Coherence | 20% | 14 | 17 | 19 |
| Responsible AI | 15% | 13 | 14 | 15 |
| Human Oversight | 10% | 8 | 9 | 10 |
| Communication Clarity | 5% | 3 | 4 | 5 |
| **Total** | **100%** | **75** | **87** | **97** |

**To win Grand Prize**: Need 85+ → Expected case gets us there.
**To win Best Responsible AI**: Need to max out Responsible AI + Human Oversight = 23-25/25 → Very achievable.
**To win Best Social Impact**: Need to dominate Problem Understanding = 23-25/25 → Very achievable.

---

## Action Items Per Criterion

### Problem Understanding (25%) — OWN THIS
- [ ] Write 3 specific user personas with real demographic data
- [ ] Document the "confident wrong answer" problem with real examples
- [ ] Show the gap: 211.org handles 20M+ calls/year → AI can handle more, but only if accurate
- [ ] Cite statistics on resource mismatch (people directed to wrong services)

### AI Reasoning (25%) — DIFFERENTIATE HERE
- [ ] Document HuggingFace zero-shot classification pipeline step-by-step
- [ ] Show confidence calibration methodology (not just raw scores)
- [ ] Demonstrate active learning: clarification questions when confidence < 70%
- [ ] Explain WHY zero-shot (responsible choice: simpler = more auditable)

### Solution Coherence (20%) — ARCHITECTURE TELLS THE STORY
- [ ] 6-layer architecture diagram (must be in pitch + demo)
- [ ] Each layer must have clear input → processing → output
- [ ] Demo must show all 6 layers in sequence, no gaps
- [ ] No orphan features — everything connects to the next layer

### Responsible AI (15%) — WE WIN THIS
- [ ] Responsible AI document (required deliverable) — must be thorough
- [ ] Document transparency methodology (Why / What Else / How Confident)
- [ ] Show crisis detection is deterministic, not probabilistic
- [ ] Privacy: no PII stored, no data sold, session-based only

### Human Oversight (10%) — BUILT INTO DNA
- [ ] 211.org integration working in demo
- [ ] Confidence threshold → automatic human escalation
- [ ] Crisis keywords → bypass AI entirely → immediate human support
- [ ] User can request human at any point in the flow

### Communication Clarity (5%) — POLISH, DON'T OVER-INVEST
- [ ] Pitch video rehearsed, timed, under 3 minutes
- [ ] Demo rehearsed with fallback if live demo fails
- [ ] README.md is clean and professional
- [ ] No jargon without explanation

---

*Last updated: June 6, 2026 — Qualifier in 1 day*
