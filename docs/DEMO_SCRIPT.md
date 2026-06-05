# DEMO_SCRIPT.md — ClearPath AI Demo Scenarios

> **Purpose**: Three fully scripted demo scenarios designed to maximize scoring across ALL INFORMS criteria. Each scenario demonstrates different layers of the 6-layer architecture and different scoring dimensions. Total demo time: ~3 minutes 30 seconds (within pitch video limits).

---

## Pre-Demo Setup

### Environment
- Browser: Chrome (latest), fullscreen
- URL: localhost:3000 (or deployed URL)
- Test data: Pre-seeded resource database with at least 20 verified entries
- Backup: Pre-recorded video of all three scenarios in case of live demo failure

### Screen Layout
- ClearPath AI homepage visible
- Browser zoom at 100%
- No unnecessary browser chrome (bookmarks bar hidden)
- Dark mode OFF (use light mode for visibility in recordings)

---

## Scenario 1: Multi-Need Classification with Calibrated Confidence

**Criteria targeted**: AI Reasoning (25%), Solution Coherence (20%), Problem Understanding (25%)
**Duration**: ~90 seconds
**Persona**: Maria, 34, single mother of two, recently laid off

### Script

**[0:00 — Show empty ClearPath homepage]**

Narrator: "Meet Maria. She just lost her job and doesn't know where to start. She types what's on her mind — not a category, not a keyword, just her situation."

**[0:08 — Type slowly into the search bar]**

> "I lost my job last week and I can't pay my rent. My kids need food and I don't know what to do."

**[0:18 — Press Enter. Show the processing animation — 6 layers visualized]**

Narrator: "ClearPath doesn't search for keywords. It classifies Maria's needs across multiple dimensions simultaneously. Layer 2 checks for crisis — no crisis keywords detected. Layer 3 runs zero-shot classification."

**[0:28 — Results appear. Show the multi-label classification result]**

Screen shows:
```
We found resources that match your situation:

┌─────────────────────────────────────────────────────┐
│ 🏠 HOUSING ASSISTANCE                    78% match │
│   Emergency Rental Assistance Program               │
│   Why this: You mentioned you can't pay rent        │
│   What else: Section 8 vouchers, Utility assistance │
│   Last verified: May 2026                           │
├─────────────────────────────────────────────────────┤
│ 🍎 FOOD ASSISTANCE                       85% match │
│   SNAP Benefits + Local Food Banks                  │
│   Why this: You mentioned your kids need food       │
│   What else: WIC (under 5), School meal programs    │
│   Last verified: May 2026                           │
├─────────────────────────────────────────────────────┤
│ 💼 EMPLOYMENT SERVICES                    71% match │
│   Job Corps + Career Center                         │
│   Why this: You mentioned losing your job           │
│   What else: Resume help, Training programs         │
│   Last verified: May 2026                           │
├─────────────────────────────────────────────────────┤
│ 👶 CHILDCARE ASSISTANCE                  62% match │
│   CCAP Subsidized Childcare                         │
│   Why this: Inferred from "kids" + job loss         │
│   ⚠️ Lower confidence — we're inferring this need   │
│   What else: After-school programs, Head Start      │
│   Last verified: April 2026                         │
└─────────────────────────────────────────────────────┘

[Can't find what you need? Talk to a navigator →]
```

**[0:45 — Highlight the Childcare result with 62% confidence]**

Narrator: "Notice the childcare result. ClearPath inferred that Maria might need childcare — she didn't ask for it. But because confidence is only 62%, below our 70% threshold, the system marks it as a lower-confidence inference and shows a warning. This is calibrated transparency in action. Maria sees not just WHAT we recommend, but HOW SURE we are and WHY."

**[1:00 — Click on SNAP Benefits to show detail view]**

Narrator: "When Maria clicks into SNAP, she sees the full picture: eligibility requirements, nearby offices, application link, and most importantly — our confidence level and what we DON'T know. We can't verify her income, so we flag that she should confirm eligibility before applying."

**[1:15 — Show detail view closing with "Talk to a navigator" option]**

Narrator: "And if she's unsure, one click connects her to a 211.org navigator who can verify her eligibility in real time. That's the difference between a resource finder and a trustworthy guide."

**[1:25 — End Scenario 1]**

---

## Scenario 2: Crisis Detection and Human Escalation

**Criteria targeted**: Human Oversight (10%), Responsible AI (15%), Problem Understanding (25%)
**Duration**: ~60 seconds
**Persona**: Anonymous user in acute distress

### Script

**[0:00 — Show empty ClearPath homepage again]**

Narrator: "Now, a very different scenario. Someone is in crisis."

**[0:05 — Type into search bar]**

> "I can't take this anymore I want to end it all"

**[0:10 — Press Enter. IMMEDIATELY show crisis response]**

Screen shows (red-bordered, prominent):

```
⚠️ WE HEAR YOU. YOU ARE NOT ALONE.

┌─────────────────────────────────────────────────────┐
│                                                      │
│   📞 988 Suicide & Crisis Lifeline                  │
│      Call or text 988 — Available 24/7               │
│                                                      │
│   📞 Crisis Text Line                               │
│      Text HOME to 741741                             │
│                                                      │
│   📞 211 Community Helpline                         │
│      Talk to a trained navigator now                 │
│      [Call 211]  [Chat with Navigator]               │
│                                                      │
│   📍 Your Local Crisis Center                       │
│      [Based on your location]                        │
│                                                      │
└─────────────────────────────────────────────────────┘

This response was triggered by a safety keyword in your message.
No AI was used to generate this response. You are being
connected to a trained human who can help.
```

**[0:18 — Highlight the crisis response]**

Narrator: "This happened instantly — before any AI classification. Our hardcoded crisis detection in Layer 2 intercepted the query the moment it contained crisis language. No AI model decided this was a crisis. No classification score was calculated. It's deterministic, keyword-based, and zero-risk for hallucination."

**[0:30 — Show what DIDN'T happen]**

Narrator: "Here's what most AI-powered systems would do: classify the query as 'mental health resources,' return a list of therapists, and move on. That's not just unhelpful — it's dangerous. ClearPath bypasses AI entirely for crisis situations and connects directly to trained humans."

**[0:42 — Point to 'Chat with Navigator' button]**

Narrator: "One click, and this person is talking to a real, trained crisis counselor through 211.org. This is human oversight not as an afterthought, but as the FIRST response when it matters most."

**[0:55 — End Scenario 2]**

---

## Scenario 3: Clarification Questions and Active Learning

**Criteria targeted**: AI Reasoning (25%), Responsible AI (15%), Solution Coherence (20%)
**Duration**: ~60 seconds
**Persona**: Jordan, 22, first-generation college student struggling with anxiety

### Script

**[0:00 — Show empty ClearPath homepage]**

Narrator: "Finally, let's see what happens when the AI isn't sure — because honest uncertainty is safer than confident guessing."

**[0:06 — Type into search bar]**

> "I've been feeling really stressed and I can't focus on anything"

**[0:12 — Press Enter. Show classification with low confidence]**

Screen shows:

```
We want to help, but we want to get it right.

Your query could relate to several types of support:

  Mental health counseling ──── 54%
  Academic support ───────────── 41%
  Financial stress assistance ── 33%

Before we recommend resources, help us understand better:
```

**[0:22 — Show clarification questions appearing]**

```
┌─────────────────────────────────────────────────────┐
│ Quick questions to find the right help:              │
│                                                      │
│ 1. Is the stress mainly about:                       │
│    ○ Your emotions and mental well-being             │
│    ○ School or work performance                      │
│    ○ Money and bills                                 │
│    ○ Relationships                                   │
│                                                      │
│ 2. How long have you been feeling this way?          │
│    ○ A few days                                      │
│    ○ A few weeks                                     │
│    ○ A few months or longer                          │
│                                                      │
│ [Skip and show all results anyway]                   │
│ [Talk to a navigator instead]                        │
└─────────────────────────────────────────────────────┘
```

**[0:30 — Select "Your emotions and mental well-being" + "A few months or longer"]**

Narrator: "Jordan selects that the stress is about emotional well-being and it's been going on for months. This changes the classification significantly."

**[0:38 — Updated results appear with higher confidence]**

```
Based on your answers, here are resources for you:

┌─────────────────────────────────────────────────────┐
│ 🧠 MENTAL HEALTH COUNSELING            82% match │
│   Free community counseling center                   │
│   Why this: Emotional stress lasting months          │
│   What else: Support groups, Crisis counseling       │
│   ⚠️ If you're in crisis, call 988 anytime          │
├─────────────────────────────────────────────────────┤
│ 🎓 ACADEMIC SUPPORT                    44% match │
│   Campus counseling + academic accommodations        │
│   Why this: Mentioned focus difficulties             │
│   ⚠️ We're less certain this is what you need        │
└─────────────────────────────────────────────────────┘

[Can't find what you need? Talk to a navigator →]
```

**[0:50 — Highlight the confidence change]**

Narrator: "Notice what happened. Before clarification, mental health was 54% — below our threshold, so we asked questions. After clarification, it jumped to 82%. Academic support dropped to 44% because Jordan clarified it's not primarily about school. The AI got more confident because it got more information — and if it hadn't, it would have escalated to a human. That's responsible AI in practice."

**[1:00 — End Scenario 3]**

---

## Demo Closing Statement

**[After all three scenarios]**

Narrator: "Three scenarios, three layers of responsibility. Multi-need classification with honest confidence scores. Crisis detection that bypasses AI entirely. And clarification questions that admit uncertainty instead of guessing. This is ClearPath AI — because wrong help is no help at all."

---

## Fallback Plan (If Live Demo Fails)

If the live demo encounters any technical issue:

1. **Switch to pre-recorded video** within 5 seconds
2. **Have screenshots ready** of each scenario's key screens
3. **Narrate from screenshots** — the story is more important than the live demo
4. **Never apologize for technical issues** — transition smoothly: "Let me show you how this works via our walkthrough"

### Pre-Recording Checklist
- [ ] Record all three scenarios with OBS/screen recorder
- [ ] Export as MP4, 1080p
- [ ] Upload to YouTube (unlisted) as backup
- [ ] Have file on local machine as double backup
- [ ] Test playback on presentation machine

---

## Demo Practice Schedule

| Day | Activity | Duration |
|------|----------|----------|
| June 14 | Script read-through + setup | 1 hour |
| June 15 | Run Scenario 1 until flawless | 1 hour |
| June 16 | Run Scenario 2 until flawless | 1 hour |
| June 17 | Run Scenario 3 until flawless | 1 hour |
| June 18 | Full demo run-through (all 3) | 30 min × 3 |
| June 19 | Full demo + pitch integration | 1 hour |
| June 20 | Record final demo video | 2 hours |
| June 21 | Backup recording + final checks | 1 hour |

---

*ClearPath AI Team — USAII Global AI Hackathon 2026*
