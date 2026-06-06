# CLEARPATH AI — API CONTRACT

**This document defines the exact interface between the AI Pipeline (Python) and the Web Backend (Node.js). Both services must adhere to this contract. Breaking changes require team approval.**

---

## BASE URLS

| Service | URL | Environment |
|---|---|---|
| AI Pipeline | `http://localhost:8000/api` | Development |
| Web Backend | `http://localhost:3000/api` | Development |
| AI Pipeline | `https://ai.clearpath.example.com/api` | Production (placeholder) |
| Web Backend | `https://api.clearpath.example.com/api` | Production (placeholder) |

---

## ENDPOINT 1: CRISIS DETECTION

**Purpose:** Check user input for crisis keywords. This is called BEFORE the classification endpoint.

```
POST /api/crisis-check
```

### Request

```json
{
    "user_input": "I can't take this anymore I want to hurt myself"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| user_input | string | Yes | 1-2000 characters. Trimmed. Non-empty after trim. |

### Response — Crisis Detected (HTTP 200)

```json
{
    "crisis_detected": true,
    "crisis_category": "suicide_self_harm",
    "crisis_resources": [
        {
            "name": "988 Suicide & Crisis Lifeline",
            "action": "Call or text 988",
            "available": "24/7",
            "note": null
        },
        {
            "name": "Crisis Text Line",
            "action": "Text HOME to 741741",
            "available": "24/7",
            "note": null
        },
        {
            "name": "Emergency Services",
            "action": "Call 911",
            "available": "24/7",
            "note": "If in immediate danger"
        }
    ],
    "category_note": null,
    "allow_continue": true
}
```

### Response — No Crisis (HTTP 200)

```json
{
    "crisis_detected": false,
    "crisis_category": null,
    "crisis_resources": [],
    "category_note": null,
    "allow_continue": true
}
```

### Error Response (HTTP 400)

```json
{
    "error": "user_input is required and must be 1-2000 characters"
}
```

### Performance Requirement

- **Must complete in < 200ms** (keyword matching only, no network calls)
- **Must work when AI server is down** (no dependency on classification model)

---

## ENDPOINT 2: CLASSIFY NEEDS

**Purpose:** Classify user input into resource categories with confidence scores. Called after crisis check returns no crisis.

```
POST /api/classify
```

### Request

```json
{
    "user_input": "I can't pay my rent anymore",
    "context": null
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| user_input | string | Yes | 1-2000 characters. The user's free-text description. |
| context | object \| null | No | Additional context from clarification answers. See Endpoint 3. |

### Context Object (when clarification has been answered)

```json
{
    "context": {
        "clarification_answers": [
            {
                "question_id": "eviction_notice",
                "question": "Have you received an eviction notice?",
                "answer": "Yes"
            }
        ]
    }
}
```

### Response — High Confidence (HTTP 200)

```json
{
    "status": "results",
    "categories": [
        {
            "name": "Legal Aid",
            "confidence": 0.78,
            "confidence_label": "high",
            "why": "You mentioned rent problems that could involve legal proceedings.",
            "resources": [
                {
                    "id": "legal_001",
                    "name": "Legal Aid Society of Austin",
                    "category": "Legal Aid",
                    "description": "Free legal representation for low-income residents facing eviction.",
                    "phone": "(512) 476-7777",
                    "address": "2201 E 6th St, Austin, TX 78702",
                    "hours": "Mon-Fri 9:00 AM - 5:00 PM",
                    "eligibility": "Income below 200% federal poverty level",
                    "last_verified": "2026-05-15",
                    "url": "https://example.com/legal-aid-austin"
                }
            ]
        },
        {
            "name": "Emergency Funds",
            "confidence": 0.52,
            "confidence_label": "moderate",
            "why": "You may need immediate financial assistance for rent.",
            "resources": [...]
        },
        {
            "name": "Housing Assistance",
            "confidence": 0.34,
            "confidence_label": "low",
            "why": "Longer-term housing support may be relevant.",
            "resources": [...]
        }
    ],
    "alternatives_summary": "Emergency Funds and Housing Assistance also partially match your situation.",
    "clarification_needed": false
}
```

### Response — Low Confidence, Clarification Needed (HTTP 200)

```json
{
    "status": "clarification_needed",
    "categories": [
        {
            "name": "Legal Aid",
            "confidence": 0.52,
            "confidence_label": "moderate",
            "why": null,
            "resources": []
        },
        {
            "name": "Emergency Funds",
            "confidence": 0.48,
            "confidence_label": "moderate",
            "why": null,
            "resources": []
        },
        {
            "name": "Housing Assistance",
            "confidence": 0.45,
            "confidence_label": "low",
            "why": null,
            "resources": []
        }
    ],
    "clarification": {
        "question_id": "eviction_notice",
        "question": "Have you received an eviction notice?",
        "options": ["Yes", "No", "I'm not sure"]
    },
    "clarification_needed": true
}
```

### Confidence Labels

| Label | Range | Color | UI Behavior |
|---|---|---|---|
| high | ≥ 0.70 | Green | Show results with full confidence bars |
| moderate | 0.40 - 0.69 | Yellow | Show results but trigger clarification first |
| low | < 0.40 | Red | Don't show results. Escalate to navigator. |

### Error Response (HTTP 500 — AI server error)

```json
{
    "status": "error",
    "error": "Classification service temporarily unavailable",
    "fallback": {
        "message": "Our AI system is temporarily unavailable. You can still search resources or talk to a navigator.",
        "show_manual_search": true,
        "show_navigator_button": true
    }
}
```

### Performance Requirement

- **Must complete in < 5 seconds** (including Hugging Face API call)
- **Must return graceful fallback** if Hugging Face is unavailable

---

## ENDPOINT 3: CLARIFY AND RE-CLASSIFY

**Purpose:** After the user answers a clarification question, re-classify with the additional context.

```
POST /api/classify
```

### Request (with clarification context)

```json
{
    "user_input": "I can't pay my rent anymore",
    "context": {
        "clarification_answers": [
            {
                "question_id": "eviction_notice",
                "question": "Have you received an eviction notice?",
                "answer": "Yes"
            }
        ]
    }
}
```

### Response (after clarification — confidence increased)

```json
{
    "status": "results",
    "categories": [
        {
            "name": "Legal Aid",
            "confidence": 0.94,
            "confidence_label": "high",
            "why": "You have an eviction notice, which means you need legal defense before anything else. A lawyer can delay or prevent the eviction.",
            "urgency": {
                "level": "time_sensitive",
                "message": "You may have as few as 5 days to respond legally."
            },
            "resources": [...]
        },
        {
            "name": "Emergency Funds",
            "confidence": 0.58,
            "confidence_label": "moderate",
            "why": "Emergency rent assistance may also be available.",
            "resources": [...]
        },
        {
            "name": "Housing Assistance",
            "confidence": 0.34,
            "confidence_label": "low",
            "why": "If the eviction proceeds, you may need emergency housing.",
            "resources": [...]
        }
    ],
    "alternatives_summary": "Emergency Funds and Housing Assistance are also relevant if legal defense is not successful.",
    "clarification_needed": false
}
```

Note: This uses the same endpoint as the initial classification. The `context` field differentiates first-pass from second-pass classification.

---

## ENDPOINT 4: GET RESOURCES BY CATEGORY

**Purpose:** Fetch resource listings for a specific category and location. Called by the frontend after classification returns categories.

```
GET /api/resources?category=Legal+Aid&zip=78701
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| category | string | Yes | Category name (must match classification output) |
| zip | string | No | ZIP code for location filtering. If omitted, returns national resources. |

### Response (HTTP 200)

```json
{
    "category": "Legal Aid",
    "zip": "78701",
    "resources": [
        {
            "id": "legal_001",
            "name": "Legal Aid Society of Austin",
            "description": "Free legal representation for low-income residents facing eviction, family law issues, and public benefits disputes.",
            "phone": "(512) 476-7777",
            "address": "2201 E 6th St, Austin, TX 78702",
            "hours": "Mon-Fri 9:00 AM - 5:00 PM",
            "eligibility": "Income below 200% federal poverty level",
            "services": ["Eviction defense", "Family law", "Public benefits"],
            "languages": ["English", "Spanish"],
            "last_verified": "2026-05-15",
            "url": "https://example.com/legal-aid-austin"
        }
    ],
    "total": 3,
    "note": "Please call to confirm availability and eligibility before visiting."
}
```

---

## ENDPOINT 5: HEALTH CHECK

**Purpose:** Verify the AI pipeline is running. Used by the web backend for fallback logic.

```
GET /api/health
```

### Response (HTTP 200)

```json
{
    "status": "healthy",
    "model_loaded": true,
    "crisis_module_active": true,
    "version": "1.0.0"
}
```

### Response (HTTP 503 — Unavailable)

```json
{
    "status": "unhealthy",
    "model_loaded": false,
    "crisis_module_active": true,
    "version": "1.0.0",
    "note": "Crisis detection is still active. Classification unavailable."
}
```

Note: Crisis detection MUST report as active even when the AI model is not loaded. It runs independently.

---

## DATA TYPES

### Resource Object

```typescript
interface Resource {
    id: string;              // Unique identifier (e.g., "legal_001")
    name: string;            // Organization name
    description: string;     // 1-3 sentence description
    phone: string | null;    // Contact phone (formatted)
    address: string | null;  // Physical address
    hours: string | null;    // Operating hours (human-readable)
    eligibility: string | null; // Eligibility requirements
    services: string[];      // List of services offered
    languages: string[];     // Languages available
    last_verified: string;   // ISO date (YYYY-MM-DD)
    url: string | null;      // Website URL
}
```

### Category Object

```typescript
interface Category {
    name: string;            // Category name (e.g., "Legal Aid")
    confidence: number;      // 0.0 to 1.0
    confidence_label: "high" | "moderate" | "low";
    why: string | null;      // Explanation of why this category matched
    urgency: {               // Optional urgency indicator
        level: "time_sensitive" | "important" | "standard";
        message: string;
    } | null;
    resources: Resource[];
}
```

---

## ERROR HANDLING RULES

1. **Crisis detection NEVER returns an error.** If the crisis module fails (which it shouldn't — it's just string matching), the system must log the error and proceed to classification. The user is never shown a crisis error.

2. **Classification errors are graceful.** If the AI server is down, the frontend shows: "Our AI system is temporarily unavailable. You can still search resources manually or talk to a navigator."

3. **No stack traces in production.** Error responses contain human-readable messages, not Python tracebacks.

4. **Rate limiting.** The AI pipeline should handle max 10 requests per minute per IP. If exceeded, return HTTP 429 with a message to try again in 60 seconds.

5. **Input validation.** Empty strings, strings over 2000 characters, and non-string inputs return HTTP 400 with a clear message.

---

*This contract is version-locked for the hackathon. Any changes must be communicated to both team members and documented in DECISIONS.md.*
