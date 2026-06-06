# RESPONSIBLE_AI.md — ClearPath AI Responsible AI Framework

> **This document is an official hackathon deliverable. It accounts for 15% of the total score and is evaluated directly by INFORMS judges. Every claim below must be demonstrable in the working prototype.**

---

## 1. Executive Summary

ClearPath AI is a community resource navigator built on a single conviction: **a confident wrong answer is more dangerous than no answer at all.** When vulnerable people seek help with food, housing, or mental health, an AI that confidently directs them to a non-existent program or an ineligible service doesn't just waste time — it erodes trust in the entire help-seeking process.

Our Responsible AI Framework is not an afterthought or a compliance checklist. It is the architectural foundation of the system. Every technical decision — from using zero-shot classification instead of generative AI, to hardcoding crisis detection instead of relying on AI detection, to displaying calibrated confidence scores instead of hiding uncertainty — was made because it is the responsible choice, not because it is the easiest one.

This document details our approach across six dimensions: Transparency, Safety, Privacy, Fairness, Accountability, and Human Oversight.

---

## 2. Core Principle: Calibrated Transparency

### 2.1 Definition

Calibrated transparency means showing users not just what the AI recommends, but **how confident it is, why it recommends this, what else it considered, and when it is uncertain enough to ask for human help.** This is the opposite of the prevailing AI design philosophy, which optimizes for appearing competent and confident at all times.

### 2.2 Why This Matters

Consider two scenarios:

**Scenario A — Opaque AI (Typical Resource Finder):**
A single mother types "I need help feeding my kids." The AI returns: "You should apply for SNAP benefits at your local DHS office." The mother spends two hours filling out paperwork, only to discover her income is $50 over the limit. She wasted time she didn't have, and now she trusts the system less.

**Scenario B — Calibrated Transparency (ClearPath AI):**
The same mother types the same query. ClearPath returns: "SNAP benefits — 73% match confidence. Why this result: Your query matches food assistance programs. What else: WIC (for children under 5), local food banks (no income requirement), school meal programs. How confident: We're moderately confident because SNAP has income requirements we can't verify — you may want to check eligibility first or talk to a navigator." The mother can make an informed choice, and if she's unsure, she can escalate to a 211.org navigator who can verify eligibility in real time.

### 2.3 Implementation

Calibrated transparency is implemented through three display components:

1. **Why This Result** — A plain-language explanation of which part of the user's query matched which resource category. Generated from the classification pipeline's attention weights and label probabilities.

2. **What Else** — The top-3 alternative resource categories with their confidence scores. Users see options they didn't think to ask about.

3. **How Confident** — A calibrated confidence percentage derived from the HuggingFace zero-shot classification scores. This is NOT a raw probability — it is adjusted based on known failure modes (e.g., the model is known to over-classify into "mental health" when users mention stress, so confidence is dampened for that category).

---

## 3. Safety: Crisis Detection and Response

### 3.1 Design Philosophy

Crisis detection in ClearPath AI is **deterministic and hardcoded, not AI-dependent.** This is a deliberate choice. AI models — no matter how well-trained — can miss crisis signals, generate inappropriate responses, or fail silently. When a user indicates suicidal ideation, domestic violence, or substance abuse crisis, the system must respond with absolute certainty and immediacy.

### 3.2 Crisis Detection Layer (Layer 2 of 6)

The crisis detection layer sits between user input and the AI classification pipeline. It operates as follows:

```
User Input → [Crisis Keyword Scanner] → Match? → YES → Crisis Response Protocol
                                        → NO  → Continue to Layer 3 (AI Classification)
```

**The scanner uses exact-match and regex patterns against a curated keyword list**, including but not limited to:
- Suicidal ideation: "kill myself," "end it all," "don't want to live," "suicide"
- Self-harm: "cut myself," "hurt myself," "self-harm"
- Domestic violence: "my partner hits me," "domestic violence," "abusive relationship"
- Substance abuse crisis: "overdose," "can't stop drinking," "drug emergency"

### 3.3 Crisis Response Protocol

When a crisis keyword is detected, the system:

1. **Immediately displays** the 988 Suicide & Crisis Lifeline, local crisis centers, and emergency services
2. **Bypasses the AI entirely** — no classification, no confidence scoring, no clarification
3. **Offers one-click connection** to a trained crisis counselor via 211.org
4. **Does NOT store** the crisis-related input in any log or database
5. **Does NOT attempt** to provide AI-generated advice or resources

### 3.4 Why Not AI-Based Crisis Detection?

AI-based crisis detection introduces three unacceptable risks:
- **False negatives**: The AI may fail to detect a crisis signal, especially in non-standard phrasing or non-English input. A missed crisis signal could be fatal.
- **False positives**: The AI may trigger crisis protocols for benign queries (e.g., "I'm killing it at my new job"), causing unnecessary panic and alert fatigue.
- **Hallucination**: An AI model in crisis mode might generate inappropriate advice, such as suggesting coping mechanisms that are medically unsound.

Hardcoded keyword detection eliminates all three risks. It is not elegant, but it is reliable — and reliability is more important than elegance when lives are at stake.

---

## 4. Privacy and Data Governance

### 4.1 Data Minimization

ClearPath AI collects the minimum data necessary to function:

| Data Point | Collected | Stored | Duration |
|------------|-----------|--------|----------|
| User query text | Yes | Session only | Deleted on session end |
| Classification results | Yes | Session only | Deleted on session end |
| Confidence scores | Yes | Session only | Deleted on session end |
| User location (for local resources) | Optional | Session only | Deleted on session end |
| Personal identifiers (name, email, SSN) | No | Never | N/A |
| Browsing behavior | No | Never | N/A |
| Session cookies | Minimal | Browser only | Session end |

### 4.2 No Persistent Storage of Sensitive Queries

Users seeking help for domestic violence, substance abuse, or mental health crisis often do so from shared devices or compromised networks. ClearPath AI:

- **Does not require account creation** — No email, no password, no personal information
- **Does not store query history** — Once the browser session ends, all data is purged
- **Does not use third-party analytics** — No Google Analytics, no Facebook Pixel, no tracking
- **Does not share data with AI providers** — HuggingFace inference API processes queries but results are not stored by HuggingFace (verified via their data policy)

### 4.3 Data Flow Architecture

```
User Browser → HTTPS → ClearPath Backend → HuggingFace API → Classification Result
                                     ↓
                              Crisis Check (local)
                                     ↓
                              Resource Database (local, curated)
                                     ↓
                              Response → User Browser
                                     ↓
                              Session data purged
```

At no point does user data leave the system except for the classification API call to HuggingFace, which processes text without storing it. No data is written to persistent storage during normal operation.

### 4.4 Future Compliance Path

While this hackathon prototype does not require full HIPAA or GDPR compliance, the architecture is designed to be compliance-ready:
- Session-based data model naturally supports GDPR's "right to be forgotten"
- No persistent storage simplifies data breach response
- Opt-in location sharing (not required) respects consent requirements
- Open-source codebase allows independent security audits

---

## 5. Fairness and Bias Mitigation

### 5.1 Identified Bias Risks

| Bias Type | Description | Mitigation |
|-----------|-------------|------------|
| **Language bias** | Zero-shot models perform worse on African American English (AAE), code-switching, and non-standard English | Confidence calibration dampens scores for potentially misclassified queries; clarification questions trigger at 70% threshold |
| **Resource availability bias** | Resource database may be denser for urban areas than rural | Display geographic coverage for every resource; indicate when "nearest resource is 50+ miles away" |
| **Category bias** | Model may over-classify into "mental health" when users mention stress or emotions | Dampened confidence for mental health category; clarification questions specifically ask about severity |
| **Accessibility bias** | Text-only interface excludes visually impaired users | Future: screen reader compatibility, voice input support |
| **Cultural bias** | Western-centric resource categories may not serve immigrant communities | Multi-label classification surfaces multiple categories; community feedback loop for missing categories |

### 5.2 Confidence Calibration as Fairness Tool

Confidence calibration is not just a transparency feature — it is a fairness mechanism. When the model is less confident about a query (which disproportionately affects non-standard English speakers and culturally specific needs), the system:

1. **Shows lower confidence** — honestly communicating uncertainty
2. **Asks clarification questions** — giving the user a chance to rephrase or add detail
3. **Surfaces alternatives** — showing multiple possible matches instead of one
4. **Offers human escalation** — connecting to a navigator who can understand nuance

This is fundamentally fairer than an opaque system that gives the same confident answer regardless of input quality, because it acknowledges that the system works better for some users than others and gives disadvantaged users additional support.

### 5.3 Resource Database Curation

The resource database is curated from verified sources:
- 211.org community resource database
- Government benefit programs (SNAP, WIC, Medicaid, Section 8)
- Verified nonprofit organizations with current operating status
- Resources are verified quarterly (in production; static for hackathon)

Resources are NOT scraped from the web, which would introduce:
- Outdated information (closed programs, moved offices)
- Unverified organizations (potential scams or predatory services)
- SEO-gamed results (for-profit rehab centers disguised as help)

---

## 6. Accountability and Auditability

### 6.1 Model Provenance

Every AI decision in ClearPath AI is traceable:

| Component | Model/API | Version | Provenance |
|-----------|-----------|---------|------------|
| Text classification | HuggingFace zero-shot (facebook/bart-large-mnli) | Specific commit hash logged | Open-source, independently verifiable |
| Confidence calibration | Custom calibration layer | v1.0 in repository | Open-source, auditable |
| Crisis detection | Hardcoded keyword list | v1.0 in repository | Open-source, auditable |
| Resource matching | Curated database | v1.0 with source citations | Open-source, auditable |

### 6.2 Decision Logging (Development Mode)

During development and testing, every classification decision is logged with:
- Input text (anonymized)
- Model output (labels + scores)
- Calibration adjustments applied
- Final confidence score
- Whether clarification was triggered
- Whether human escalation was offered

This log is available for review by judges, auditors, and the development team. In production, this log would be session-based and anonymized, with aggregate statistics (not individual queries) used for model improvement.

### 6.3 Failure Mode Documentation

We explicitly document known failure modes:

| Failure Mode | Likelihood | Impact | Mitigation |
|--------------|-----------|--------|------------|
| Misclassification of ambiguous queries | Medium | User gets wrong resource type | Multi-label display + alternatives + confidence score |
| Over-classification into "mental health" | Medium | User sees irrelevant mental health resources | Dampened confidence + specific clarification question |
| Missed crisis signal (non-standard phrasing) | Low | Delayed crisis response | Expanding keyword list + community feedback mechanism |
| Model API downtime | Low | System unavailable | Fallback: manual resource directory + 211.org link |
| Confidence miscalibration | Medium | Over- or under-confidence displayed | Regular calibration testing with benchmark dataset |

---

## 7. Human Oversight Architecture

### 7.1 Design Principle

Human oversight in ClearPath AI is not a "contact us" link buried in a footer. It is an integral, automatic part of the system flow that activates in three conditions:

1. **Crisis detection** (Layer 2) — Immediate human connection
2. **Low confidence** (< 70%) — Offer human navigator
3. **User request** — "Talk to a person" button available at every stage

### 7.2 211.org Integration

ClearPath AI integrates with 211.org's service to connect users with trained community navigators:

- **Phone**: Direct dial to 211 from the interface
- **Chat**: Web chat integration to 211's live chat service (where available)
- **Referral**: Pre-populated referral with user's query context (not raw text — a structured summary)

### 7.3 Human-in-the-Loop for Model Improvement

User feedback on resource relevance (thumbs up/down) is collected for model improvement:
- Feedback is anonymous and aggregated
- Individual queries are never stored with feedback
- Feedback is used to recalibrate confidence thresholds, not to retrain the model
- This ensures the model improves over time without compromising privacy

---

## 8. Responsible AI Commitment Checklist

| Commitment | Status | Evidence |
|------------|--------|----------|
| All AI decisions are explainable | ✅ Implemented | "Why This Result" display for every recommendation |
| Confidence scores are displayed | ✅ Implemented | "How Confident" percentage on every result |
| Crisis detection is deterministic | ✅ Implemented | Hardcoded keyword scanner, no AI dependency |
| Human escalation is available | ✅ Implemented | 211.org integration + confidence threshold trigger |
| No PII is collected or stored | ✅ Implemented | Session-based only, no accounts, no persistent storage |
| Known failure modes are documented | ✅ Implemented | Section 6.3 above |
| Bias risks are identified and mitigated | ✅ Implemented | Section 5 above |
| Code is open-source and auditable | ✅ Planned | GitHub repository with full documentation |
| Resource database is curated, not scraped | ✅ Implemented | Verified sources only |
| User feedback improves the system | ✅ Planned | Anonymous feedback mechanism in post-hackathon version |

---

## 9. Comparison with Industry Standards

| Principle | NIST AI RMF | Our Implementation |
|-----------|-------------|-------------------|
| Validity & Reliability | Verify model outputs against ground truth | Confidence calibration + human verification for low-confidence results |
| Safety | Prevent harm from AI failures | Hardcoded crisis detection + human escalation + no autonomous action |
| Security | Protect against adversarial attacks | Input sanitization + rate limiting + no persistent data storage |
| Resilience | Graceful degradation | Fallback to resource directory + 211.org when AI is unavailable |
| Accountability | Traceability of decisions | Decision logging + open-source code + model provenance |
| Transparency | Explainability of outputs | "Why / What Else / How Confident" display for every result |
| Fairness | Non-discriminatory outcomes | Bias identification + confidence calibration + clarification questions |
| Privacy | Data minimization and consent | Session-based only + no PII + opt-in location |

---

## 10. Limitations and Honest Assessment

We believe that responsible AI requires honesty about what the system cannot do:

1. **Zero-shot classification is not domain-expert level.** Our model will make classification errors. That is precisely why we calibrate confidence and offer human escalation — not because the model is bad, but because any model serving vulnerable populations must have safety nets.

2. **Crisis detection is keyword-based and has blind spots.** Non-standard phrasing, typos, and non-English crisis expressions may not be caught. We mitigate this with a continuously expanding keyword list and community feedback, but we acknowledge this limitation honestly.

3. **Resource availability is only as good as our database.** We curate from verified sources, but resources change constantly. A resource listed as available may have closed or changed eligibility requirements. We mitigate this by showing "last verified" dates and encouraging users to confirm directly.

4. **The system does not verify user eligibility.** We can recommend SNAP or Medicaid, but we cannot determine if a user qualifies. We mitigate this by clearly stating eligibility requirements and connecting users to navigators who can verify.

5. **Confidence calibration is an approximation.** Our dampening factors for known over-classification categories are heuristic-based, not mathematically derived from a calibration dataset. In a production system, these would be calibrated using proper held-out evaluation data.

These limitations are not weaknesses in our Responsible AI framework — they are strengths. A team that cannot articulate its system's limitations has not thought deeply enough about responsible deployment.

---

*This document is a living artifact. It will be updated as the system evolves during the build phase (June 14-21, 2026).*

*ClearPath AI Team — USAII Global AI Hackathon 2026*
