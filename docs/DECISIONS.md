# CLEARPATH AI — ARCHITECTURE DECISION RECORDS

**Every major technical choice documented with context, alternatives, and rationale.**

---

## ADR-001: Zero-Shot Classification Instead of Fine-Tuned Model

**Date:** June 2026  
**Status:** Decided  
**Context:** We need to classify user-described situations into resource categories. We have two options: (A) Fine-tune a classification model on labeled resource data, or (B) Use a zero-shot classification model that works without labeled training data.

**Decision:** We chose zero-shot classification (Hugging Face Transformers, specifically `facebook/bart-large-mnli` or similar).

**Rationale:**
- We have NO labeled training data. Collecting and labeling a dataset of real crisis situations would take weeks and raises serious privacy concerns.
- Zero-shot classification works out of the box with custom category labels. We can define our categories ("Legal Aid", "Food Assistance", "Emergency Housing", etc.) and the model classifies against them immediately.
- The hackathon build period is 7 days. Fine-tuning is not feasible in that timeline.
- Zero-shot confidence scores are naturally calibrated (they represent how well the premise matches the hypothesis), which aligns with our transparency requirement.
- If we need better accuracy post-hackathon, we can fine-tune on collected data later. Zero-shot is our MVP foundation.

**Consequences:**
- Zero-shot accuracy will be lower than a fine-tuned model, especially for domain-specific language. We accept this and mitigate with the clarification mechanism.
- Confidence scores may be systematically over- or under-confident. We apply temperature scaling for calibration.
- We are dependent on Hugging Face's model quality. If the base model has biases, our classifications will reflect them.

**Alternatives Considered:**
- OpenAI GPT-4 API: Better accuracy, but paid, and violates our "free tools only" philosophy. Also a black box — we can't inspect or calibrate confidence scores.
- Fine-tuned BERT: Better accuracy, but requires labeled data we don't have and time we don't have.
- Rule-based classification (keyword matching): No AI reasoning, which would hurt our AI Reasoning score (25% of total). Also can't handle paraphrases or indirect descriptions.

---

## ADR-002: Python for AI Pipeline, Node.js for Backend

**Date:** June 2026  
**Status:** Decided  
**Context:** The AI pipeline needs Python (Hugging Face Transformers, scientific computing). The web application needs a fast, well-supported backend framework. We could use Python for everything (Flask/FastAPI) or split the stack.

**Decision:** Python for AI pipeline (Flask or FastAPI), Node.js + Express for web backend. Separate services communicating via REST API.

**Rationale:**
- Python is the only serious choice for NLP/AI work. Hugging Face Transformers, temperature scaling, and scientific libraries are Python-native.
- Harshit is strongest in Node.js/Express. The web backend (serving the frontend, handling sessions, routing to AI pipeline) benefits from his expertise.
- Separation of concerns: The AI pipeline can be deployed independently (on a GPU-enabled server if needed) while the web backend runs on Vercel.
- The REST API contract between the two services is clean and testable. Each service can be developed and deployed independently.

**Consequences:**
- Two codebases to maintain instead of one.
- Two deployment targets instead of one.
- Latency from the HTTP call between backend and AI pipeline (typically 50-200ms added).
- More complex local development setup (need to run both services).

**Alternatives Considered:**
- All Python (FastAPI for everything): Simpler stack, but Harshit is less productive in Python. The frontend would need a separate server anyway (Next.js/Vercel).
- All Node.js (TensorFlow.js for AI): Possible but TF.js has fewer pre-trained models and zero-shot classification options than Hugging Face's Python ecosystem. Would limit our AI capability.

---

## ADR-003: Temperature Scaling for Confidence Calibration

**Date:** June 2026  
**Status:** Decided  
**Context:** Zero-shot classification models return raw scores that may not be well-calibrated. A score of 0.78 does not necessarily mean there's a 78% chance the classification is correct. We need calibrated confidence scores for our transparency requirement.

**Decision:** Apply temperature scaling (Platt scaling) to the model's output scores before displaying them to the user.

**Rationale:**
- Temperature scaling is the simplest calibration method: divide logits by a learned temperature parameter T before applying softmax. It preserves the ranking of predictions while improving calibration.
- It requires minimal computational overhead (single scalar parameter).
- It's well-studied and effective (Guo et al., "On Calibration of Modern Neural Networks," ICML 2017).
- For the hackathon, we can start with T=1.0 (no calibration) and tune it during testing if time permits. Even uncalibrated scores are better than no confidence display.

**Consequences:**
- Without a validation dataset, we cannot properly learn the temperature parameter T. We may use a default or heuristic value.
- The calibration may not be perfect. We mitigate this by labeling scores as "AI Confidence" (not "Accuracy") and documenting this limitation.

**Alternatives Considered:**
- Isotonic regression: More flexible calibration but requires more data and complexity. Not justified for our scale.
- No calibration (raw scores): Simpler but potentially misleading. A score of 0.95 might correspond to 70% actual accuracy, creating false confidence.
- Discrete confidence levels (High/Medium/Low): Simpler for users but loses granularity. We can add this as a visual layer on top of numerical scores.

---

## ADR-004: MongoDB for Resource Data

**Date:** June 2026  
**Status:** Decided  
**Context:** We need to store resource listings (name, category, phone, address, eligibility, hours). The data is semi-structured — some resources have many fields, others have few.

**Decision:** MongoDB (Atlas free tier) for resource data storage.

**Rationale:**
- Resource data is document-like: each resource has varying fields. MongoDB's flexible schema accommodates this naturally.
- Atlas free tier (512MB) is sufficient for a hackathon MVP with resources for one or two cities.
- Harshit has MongoDB experience. Faster development.
- JSON-native storage matches our API contract (resources returned as JSON objects).

**Consequences:**
- MongoDB is not ideal for complex queries or relationships between resources. If we need to implement resource recommendations based on user history, a relational database would be better. But we're not doing user history (privacy-first, no stored data).
- Atlas free tier has limitations (no advanced security features, shared cluster). Not production-grade for a real deployment.

**Alternatives Considered:**
- PostgreSQL: More structured, better for relational data. But resource data is not heavily relational, and the flexible schema of MongoDB is a better fit for varying resource attributes.
- Supabase: PostgreSQL-based with built-in API. Good option but adds another dependency and learning curve.
- Static JSON files: Simplest possible approach. No database needed. But makes updates harder and doesn't scale beyond a demo.

---

## ADR-005: React + TypeScript for Frontend

**Date:** June 2026  
**Status:** Decided  
**Context:** We need a fast, modern frontend that works well on mobile devices and can display dynamic confidence indicators, clarification questions, and crisis overlays.

**Decision:** React + TypeScript, deployed on Vercel.

**Rationale:**
- Harshit's strongest frontend framework. Maximum development velocity.
- TypeScript catches bugs at compile time, which is critical for a 7-day build sprint where we can't afford runtime errors.
- Vercel deployment is trivial for React apps. Zero-config CI/CD.
- Component-based architecture maps well to our UI: ConfidenceBar, ClarificationQuestion, CrisisOverlay, ResourceCard are all independent components.

**Consequences:**
- React bundle size can be large. We need to be mindful of performance on slow connections. Code splitting and lazy loading are required.
- Vercel's free tier has bandwidth limits. Fine for a hackathon demo but not for real traffic.

**Alternatives Considered:**
- Next.js: Server-side rendering would help with initial load time and SEO. But adds complexity we may not need for a single-page app. Can add later if needed.
- Vue.js: Lighter bundle size, but Harshit has less experience. Not worth the learning curve for a 7-day sprint.
- Plain HTML/JS: Smallest possible bundle, but harder to manage complex state (classification results, clarification flow, crisis overlay). Not practical.

---

## ADR-006: Hardcoded Crisis Detection (Not AI-Powered)

**Date:** June 2026  
**Status:** Decided  
**Context:** We need to detect when a user is in active crisis (suicidal ideation, domestic violence, substance overdose) and show crisis resources immediately.

**Decision:** Crisis detection is implemented as a hardcoded keyword-matching module in Python, completely separate from the AI classification pipeline. The AI layer CANNOT override or bypass it.

**Rationale:**
- AI-powered crisis detection can fail silently. A language model might not flag an indirect expression of crisis, or worse, classify it as something else entirely.
- Hardcoded keyword matching is deterministic: same input always produces the same output. No model updates, no version changes, no unpredictable behavior.
- The crisis module runs FIRST, before the AI pipeline. Even if the AI server is down, crisis detection still works.
- This is our strongest argument for the Best Responsible AI award: crisis detection is architecturally separated from AI, making it impossible for the AI to interfere with safety-critical functionality.

**Consequences:**
- Keyword matching has limited recall. Indirect expressions ("I don't want to be here anymore") may not trigger detection. We document this as a known limitation.
- The keyword list requires ongoing maintenance. New crisis language patterns emerge over time.
- False positives are possible (e.g., someone discussing a TV show about suicide in an academic context). We mitigate by showing the overlay non-intrusively (it doesn't lock the app — the user can dismiss it).

**Alternatives Considered:**
- AI-based crisis detection: More nuanced understanding but less reliable. Can fail unpredictably. Violates our principle of keeping safety-critical functions deterministic.
- Hybrid (keyword + AI): Could improve recall but adds complexity and potential for AI override. Too risky for a safety-critical feature.
- No crisis detection: Would eliminate the safety net entirely. Not acceptable for a product dealing with vulnerable populations.

---

## ADR-007: No User Accounts or Data Persistence

**Date:** June 2026  
**Status:** Decided  
**Context:** Users describe personal, often sensitive situations. Storing this data creates privacy risks, legal obligations, and security requirements.

**Decision:** No user accounts. No data persistence. All user input is processed in-memory and discarded after the session ends.

**Rationale:**
- Privacy by design: we can't leak data we don't store.
- Simpler architecture: no authentication, no database of user inputs, no GDPR compliance complexity.
- Aligns with our brand: "We forget what you tell us. That's a feature, not a bug."
- Reduces attack surface: no user database to breach.

**Consequences:**
- No session continuity: if the user refreshes the page, their classification results are lost.
- No personalization: the system can't learn from past interactions or improve over time based on user feedback.
- No analytics: we can't measure how many people we helped or which resources were most useful.

**Alternatives Considered:**
- Optional accounts with consent: More features (save resources, revisit past results) but adds significant complexity (auth, consent management, data retention policies).
- Anonymous sessions with expiry: Session data stored temporarily (24h expiry). Adds some continuity without permanent storage. Could implement post-hackathon.

---

*As new decisions are made during the build week, they should be documented here using the same format. Every decision must include: context, decision, rationale, consequences, and alternatives considered.*
