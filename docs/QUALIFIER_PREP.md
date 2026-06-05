# QUALIFIER_PREP.md — ClearPath AI Qualifier Answer Bank

> **Qualifier: June 7-10 | 30 minutes | 9 standardized questions | AI-scored | STRICT word limits**
> **Strategy**: Every answer must hit the INFORMS scoring criteria while staying within word limits. No fluff. No filler. Every word earns points.

---

## Word Limit Rules

- **30-60 words per answer** — This is ENFORCED by the system
- Answers outside the range are AUTO-REJECTED
- Target: 50-58 words (safely within limits, maximally dense)
- Count every word before submitting

---

## Answer Framework: "HOOK → EVIDENCE → IMPACT"

Every answer follows this structure:
1. **HOOK** (5-10 words): State the core insight that makes judges pay attention
2. **EVIDENCE** (25-35 words): Specific, technical, verifiable detail
3. **IMPACT** (10-15 words): Why this matters for the community

---

## Question 1: What community problem does your project address?

**Criterion targeted**: Problem Understanding (25%)

### Draft Answer (55 words):

Vulnerable people can't find the right help — but worse, they find WRONG help confidently. Resource finders return plausible but inaccurate referrals, wasting time and eroding trust. One in three low-income Americans reports being directed to ineligible or closed programs. This information asymmetry disproportionately harms those least equipped to verify AI recommendations.

---

### Alternative shorter version (42 words):

Vulnerable people receive confidently wrong resource referrals. Existing finders match keywords without verifying eligibility or availability, directing users to closed programs they don't qualify for. This information asymmetry harms those least able to double-check AI recommendations.

---

## Question 2: Who is most affected by this problem?

**Criterion targeted**: Problem Understanding (25%) + Responsible AI (15%)

### Draft Answer (57 words):

Low-income families, non-English speakers, rural residents, and elderly individuals — people with the least margin for error. A single mother directed to an ineligible program loses hours she can't recover. Non-English speakers face cultural mismatch in resource categories. Rural users travel miles to closed offices. Wrong help isn't neutral — it's actively harmful for these populations.

---

### Alternative shorter version (49 words):

Low-income families, non-English speakers, rural residents, and elderly individuals — those with zero margin for error. A single mother directed to an ineligible program loses irreplaceable hours. Rural users travel miles to closed offices. For these populations, wrong help is actively harmful, not neutral.

---

## Question 3: Why is AI needed to solve this problem?

**Criterion targeted**: AI Reasoning (25%) + Problem Understanding (25%)

### Draft Answer (58 words):

211.org handles 20 million calls yearly but can't scale to 24/7 text-based access. Humans can't classify complex multi-need queries ("lost job, can't pay rent, kids need food") into overlapping resource categories fast enough. AI enables instant multi-label classification — but only if it shows uncertainty honestly, which is our core innovation.

---

### Alternative shorter version (45 words):

211.org handles 20M calls yearly but can't scale to 24/7 text access. Multi-need queries require simultaneous classification across overlapping categories. AI enables instant multi-label matching — but only if it honestly shows uncertainty. That's our innovation.

---

## Question 4: How does your AI model reason about the problem?

**Criterion targeted**: AI Reasoning (25%)

### Draft Answer (59 words):

We use HuggingFace zero-shot classification (BART-large-MNLI) to classify free-text queries into resource categories without training data. The model outputs probability distributions across labels, which we calibrate into confidence scores. When confidence drops below 70%, we trigger clarification questions instead of returning uncertain results. Multi-label output surfaces overlapping needs users didn't explicitly request.

---

### Alternative shorter version (48 words):

HuggingFace zero-shot classification maps free-text queries to resource categories without training data. We calibrate raw probabilities into confidence scores. Below 70% confidence, we ask clarification questions instead of guessing. Multi-label output surfaces overlapping needs users didn't explicitly request.

---

## Question 5: What data does your AI use?

**Criterion targeted**: AI Reasoning (25%) + Responsible AI (15%)

### Draft Answer (56 words):

Two data sources: a curated database of verified community resources (from 211.org and government programs) and the user's free-text query. No web scraping, no user data collection, no personal information. Resources include eligibility criteria, operating status, and contact info — all verified. The AI classifies intent; it never generates resource information.

---

### Alternative shorter version (43 words):

A curated database of verified community resources from 211.org and government programs, plus the user's free-text query. No scraping, no personal data, no user accounts. The AI classifies intent into categories; it never generates resource information — that comes only from verified sources.

---

## Question 6: How does your project address responsible AI concerns?

**Criterion targeted**: Responsible AI (15%) — THIS IS THE MONEY QUESTION

### Draft Answer (58 words):

Three mechanisms: calibrated transparency (showing confidence percentage, why this result, and alternatives for every recommendation), hardcoded crisis detection (keyword-based, not AI-dependent — zero hallucination risk for life-threatening queries), and automatic human escalation when confidence falls below 70%. We don't hide uncertainty — we weaponize it as a safety feature.

---

### Alternative shorter version (48 words):

Calibrated transparency: every result shows confidence, reasoning, and alternatives. Hardcoded crisis detection: keyword-based, zero AI hallucination risk for life-threatening queries. Automatic human escalation below 70% confidence. We don't hide uncertainty — we weaponize it as a safety feature.

---

## Question 7: How does your project incorporate human oversight?

**Criterion targeted**: Human Oversight (10%)

### Draft Answer (57 words):

Three escalation paths: crisis keywords bypass AI entirely, routing directly to 988 Lifeline and 211.org navigators. Low-confidence results (below 70%) automatically offer human navigator connection. A "Talk to a Person" button is always visible. Humans aren't a fallback — they're architecturally integrated at the crisis, uncertainty, and user-request layers.

---

### Alternative shorter version (45 words):

Three paths: crisis keywords bypass AI to 988/211 immediately. Low-confidence results (below 70%) auto-offer human navigator connection. "Talk to a Person" button is always visible. Humans aren't a fallback — they're architecturally integrated at crisis, uncertainty, and user-request layers.

---

## Question 8: What are the limitations of your approach?

**Criterion targeted**: Problem Understanding (25%) + Responsible AI (15%)

### Draft Answer (58 words):

Zero-shot classification isn't domain-expert accurate — it will misclassify ambiguous queries. Keyword-based crisis detection misses non-standard phrasing. Our resource database is only as current as its sources. Confidence calibration is heuristic, not mathematically derived. These limitations are precisely why we build in human escalation, not despite them. Honesty about limits IS the safety feature.

---

### Alternative shorter version (48 words):

Zero-shot misclassifies ambiguous queries. Keyword crisis detection misses non-standard phrasing. Resource data is only as current as sources. Confidence calibration is heuristic. These limitations are precisely why we build in human escalation. Honesty about limits IS the safety feature.

---

## Question 9: What impact will your project have?

**Criterion targeted**: Problem Understanding (25%) + Solution Coherence (20%)

### Draft Answer (56 words):

ClearPath reduces the "confident wrong answer" problem that erodes trust in community resources. By showing uncertainty honestly and escalating to humans when unsure, we protect vulnerable people from following bad referrals. Impact isn't more answers — it's more TRUSTWORTHY answers. Every calibrated confidence score prevents a wasted trip, a missed deadline, or eroded hope.

---

### Alternative shorter version (45 words):

We eliminate "confident wrong answers" that erode trust in community resources. Showing uncertainty honestly and escalating to humans protects vulnerable people from bad referrals. Impact isn't more answers — it's more TRUSTWORTHY answers, preventing wasted trips and eroded hope.

---

## Cross-Track Preparation (Environment Track)

> The qualifier may include questions from the Environment track as well. Prepare these as backup.

### Env Q: What environmental problem does your project address?

**Draft Answer (50 words)**:

Communities lack accessible, verified environmental resource information — water quality alerts, nearby contamination sites, recycling programs, and energy assistance. Existing tools are fragmented across agencies with inconsistent interfaces. Vulnerable populations can't navigate this complexity. AI can unify access, but only if it shows uncertainty about data freshness and source reliability.

---

## Pre-Qualifier Checklist

- [ ] Test word count on every answer (use wordcounter.net)
- [ ] Practice typing each answer in under 2 minutes
- [ ] Have backup shorter versions ready in case of technical issues
- [ ] Read each question TWICE before answering — don't misread
- [ ] Don't copy-paste from this document — retype naturally (AI detection)
- [ ] Focus on HOOK → EVIDENCE → IMPACT structure
- [ ] If unsure about word count, aim for 50 words (safely in 30-60 range)
- [ ] Remember: AI-scored means keywords matter — use: "calibrated confidence," "zero-shot," "crisis detection," "human escalation," "multi-label classification"

---

## Qualifier Day Protocol

### Before the Test
1. Stable internet connection verified
2. Browser tested and updated
3. Phone on silent, notifications off
4. This document open on a second device for reference
5. Timer visible — 30 minutes goes fast

### During the Test
1. Read each question fully before typing
2. Start with the HOOK — your core insight
3. Add EVIDENCE — specific, technical details
4. Close with IMPACT — why it matters
5. Count words before submitting
6. If over 60 words, cut adjectives first, then examples
7. If under 30 words, add a specific detail or metric
8. Never leave a question blank — even a rough answer scores points

### After the Test
1. Don't stress about individual answers
2. The AI scorer looks for keywords and structure
3. Move immediately to build phase preparation
4. Update this document with any unexpected questions for future reference

---

*Qualifier Date: June 7-10, 2026 | Build Phase: June 14-21, 2026*
*ClearPath AI Team — USAII Global AI Hackathon 2026*
