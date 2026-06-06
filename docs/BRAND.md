# CLEARPATH AI — BRAND IDENTITY

---

## NAME

**ClearPath AI**

- Clear = transparency, clarity, honest
- Path = navigation, way forward, resource connection
- AI = the technology, but it's the LAST word, not the first. The person comes before the algorithm.

**Never:** ClearPath, ClearPathAI (one word), CP-AI, or any abbreviation. Always "ClearPath AI" — three words, two capitals, one space before AI.

---

## TAGLINE

**"When it matters most, honesty is the safest answer."**

This is our thesis in one sentence. It appears on the cover page, the last slide of the pitch, and the Devpost hero section. It is the ONE line a judge should remember a week later.

**Alternate taglines (for specific contexts):**

| Context | Tagline |
|---|---|
| App loading screen | "Finding help, honestly." |
| Crisis overlay | "You deserve support right now." |
| Devpost subtitle | "A community resource navigator that shows calibrated confidence instead of hiding uncertainty." |
| GitHub description | "AI-powered resource navigator with calibrated transparency — because a confident wrong answer is more dangerous than no answer at all." |

---

## VISUAL IDENTITY

### Colors

| Role | Hex | Usage | Rules |
|---|---|---|---|
| **Primary Blue** | #2563EB | Headers, primary buttons, confidence bars (high), links | Never use for body text. Never use as background for large areas. |
| **Light Blue** | #EFF6FF | Card backgrounds, hover states, subtle accents | Only for surfaces, never for text. |
| **Confidence Green** | #16A34A | Confidence bars >70% | Only for confidence indicators. Never for decorative elements. |
| **Confidence Yellow** | #CA8A04 | Confidence bars 40-70% | Same rule as green. |
| **Confidence Red** | #DC2626 | Confidence bars <40%, crisis indicators | Same rule as green/yellow. Also used for crisis overlay accent. |
| **Text Dark** | #1E293B | All body text, headings | Default text color. |
| **Text Muted** | #64748B | Secondary text, metadata, timestamps | Never for important information. |
| **Background** | #FFFFFF | Page backgrounds | Always white or near-white. Never dark. |
| **Surface** | #F8FAFC | Card backgrounds, alternating rows | Slight tint only. |

### Color Rules (Non-Negotiable)

1. **Confidence colors are semantic, not decorative.** Green = high confidence. Yellow = moderate. Red = low. These colors are ONLY used for confidence indicators. Never use green for a "success" button or red for a "delete" button — that creates confusion with the confidence system.

2. **No gradients.** No rainbow. No multi-color schemes. Our palette is blue + white + confidence colors. That's it.

3. **Dark mode is not a priority.** Our users are in crisis. White background = clean, calm, clinical. Dark mode can come later.

4. **The crisis overlay is always white with red accent.** It must feel like a hospital — clean, urgent, clear. Not dark and dramatic.

### Typography

| Element | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Hero headings | Inter | 800-900 | 48-64px | Tight letter-spacing (-0.02em) |
| Section headings | Inter | 700 | 24-32px | Normal spacing |
| Body text | Inter | 400 | 16px | Line-height: 1.6 |
| Confidence labels | Inter | 600 | 14px | Uppercase, letter-spacing: 0.05em |
| Metadata/timestamps | Inter | 400 | 12px | Muted color |
| Code/technical | JetBrains Mono | 400 | 14px | Only in technical documentation |

**Font loading:** Use Google Fonts CDN. Inter is free and designed for screens. JetBrains Mono for code.

### Spacing

- **Base unit: 8px.** All spacing is multiples of 8px.
- **Card padding: 24px** (3 × 8)
- **Section gap: 32px** (4 × 8)
- **Page margin: 16px mobile, 24px desktop**

### Border Radius

- **Buttons: 8px** — friendly but not bubbly
- **Cards: 12px** — softer, more inviting
- **Confidence bars: 4px** — precise, data-like
- **Crisis overlay: 0px** — sharp, urgent, no softness

### Icons

- Use **Lucide Icons** (open source, consistent stroke width)
- Stroke width: 1.5px
- Size: 20px inline, 24px standalone
- Never use emoji as icons. Never use custom-drawn icons.

---

## VOICE AND TONE

### How ClearPath AI Sounds

| Quality | We Are | We Are NOT |
|---|---|---|
| **Confidence** | Honest about what we know and don't know | Arrogant, overpromising, "we have all the answers" |
| **Clarity** | Simple language, short sentences, no jargon | Technical, academic, bureaucratic |
| **Calm** | Measured, steady, reassuring | Dramatic, emotional, fear-based |
| **Human** | "You," "we," conversational | "Users," "stakeholders," corporate |
| **Respectful** | We don't talk down to people in crisis | We don't pity them either. They need a tool, not a sermon. |

### Voice Examples

| Situation | ✅ We Say | ❌ We Don't Say |
|---|---|---|
| Low confidence | "I'm not confident enough to recommend resources yet. Can you tell me more?" | "Insufficient data. Please provide additional parameters." |
| Crisis detected | "You deserve support right now. Trained people are available 24/7." | "CRITICAL ALERT: Self-harm detected. Immediate intervention required." |
| High confidence | "I think legal aid is your best next step. Here's why." | "Based on our proprietary AI algorithm, we have determined with 94% accuracy that you require legal assistance." |
| Error state | "Something went wrong on our end. You can still search resources or talk to a navigator." | "Error 500: Internal server error. Please try again later." |
| Known limitation | "I can't verify if you're eligible for this resource. Please call them directly to confirm." | "Resource matched! Apply now!" |

### Words We Use vs. Words We Don't

| Use | Don't Use | Why |
|---|---|---|
| AI confidence | Accuracy, match score, reliability | Confidence ≠ accuracy. This distinction matters. |
| Navigator | Agent, bot, assistant | A navigator guides you. A bot talks at you. |
| Clarification | Disambiguation, parameter elicitation | Plain English. |
| Escalation | Handoff, transfer, routing | Escalation implies the situation is serious. |
| Crisis resources | Safety resources, help options | "Crisis" conveys urgency. "Safety" is vague. |
| Suggest | Recommend, advise | We suggest. We don't advise. We're not professionals. |
| Describe your situation | Enter your query, input your request | Human language. |

---

## UI PRINCIPLES

1. **One input, one sentence.** The user types ONE thing. No forms. No dropdowns. No multi-step wizards. One text box, one submit button.

2. **Confidence is the hero.** The confidence score is the first thing you see after results appear. It's the biggest visual element on the results page. It's not buried in a tooltip or a sidebar.

3. **The "Talk to a Navigator" button never disappears.** It's always visible. Always accessible. Always one click away from a human.

4. **White space is safety.** Cramped interfaces feel panicked. Generous white space feels calm. Our users are stressed. Our UI should not be.

5. **Every result answers three questions:** WHY was this matched? WHAT ELSE did you consider? HOW CONFIDENT are you? If a result doesn't answer all three, it's incomplete.

6. **The crisis overlay takes over the entire screen.** No distractions. No sidebar. No "while you're here, check out these resources." Just the hotline numbers and an acknowledgment button.

---

## LOGO SPECIFICATIONS

**Text-based logo:** "ClearPath AI" in Inter 900 weight, with "AI" in Primary Blue and "ClearPath" in Text Dark.

**No icon logo for the hackathon.** A text logo is faster to implement, scales perfectly, and looks professional. Icon design is a distraction we cannot afford during build week.

**If we have time post-submission:** A simple path/arrow icon in Primary Blue, suggesting "clear path forward." No compasses, no maps, no magnifying glasses. Too cliché.
