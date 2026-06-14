# CLEARPATH AI — API CONTRACT

**This document defines the classification API interface. The AI pipeline runs inside Next.js API routes via the HuggingFace Inference API (BART-large-MNLI), with dual fallback (raw fetch → HfInference SDK → keyword matching).**

---

## BASE URLS

| Service | URL | Environment |
|---|---|---|
| Web Backend + AI Pipeline | `http://localhost:3000/api` | Development |
| Web Backend + AI Pipeline | `https://clearpath-ai.vercel.app/api` | Production |

---

## ENDPOINT 1: CLASSIFY (with integrated crisis detection)

**Purpose:** Classify user input into resource categories with confidence scores. Crisis detection runs first (hardcoded regex), before any AI classification. This is a single unified endpoint that handles both crisis and non-crisis flows.

```
POST /api/classify
```

### Request

```json
{
    "text": "I can't pay my rent anymore",
    "lat": 29.76,
    "lng": -95.37
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| text | string | Yes | 1-2000 characters. The user's free-text description. |
| lat | number | No | User latitude for distance calculation. |
| lng | number | No | User longitude for distance calculation. |

### Response — Crisis Detected (HTTP 200)

```json
{
    "isCrisis": true,
    "crisisType": "self-harm",
    "crisisLines": [
        { "name": "988 Suicide & Crisis Lifeline", "action": "Free. Confidential. 24/7.", "call": "988" },
        { "name": "Crisis Text Line", "action": "Text HOME to 741741", "call": "Text" },
        { "name": "911", "action": "Immediate danger — call now", "call": "911" }
    ],
    "categories": [
        {
            "label": "Crisis Support",
            "confidence": 99,
            "resources": [...],
            "why": "You are not alone. Help is available right now.",
            "warning": "If you are in immediate physical danger, call 911."
        }
    ],
    "hasLocation": true,
    "outsideServiceArea": false,
    "serviceArea": "Houston, TX metro area"
}
```

Crisis types: `self-harm`, `violence-others`, `domestic`, `medical`, `general`.

### Response — High Confidence (HTTP 200)

```json
{
    "isCrisis": false,
    "categories": [
        {
            "label": "Housing Assistance",
            "confidence": 78,
            "resources": [
                {
                    "name": "Houston Housing Authority",
                    "detail": "Section 8 housing choice vouchers... Call 713-260-0600 Hours: Mon-Fri 8am-5pm",
                    "phone": "713-260-0600",
                    "address": "2640 Fountain View Dr, Houston, TX 77057",
                    "hours": "Mon-Fri 8am-5pm",
                    "eligibility": "Income at or below 50% AMI",
                    "verified": "May 2026",
                    "distance": "3.2 mi"
                }
            ],
            "why": "Matched by BART-large-MNLI semantic analysis of your description.",
            "also": "You may also benefit from Legal Aid and Food Assistance services.",
            "warning": null
        }
    ],
    "needsClarification": false,
    "clarificationMessage": null,
    "clarificationQuestions": null,
    "model": "BART-large-MNLI (live)",
    "classificationSource": "bart",
    "hasLocation": true,
    "outsideServiceArea": false,
    "serviceArea": "Houston, TX metro area",
    "debug": { ... }
}
```

### Response — Low Confidence, Clarification Needed (HTTP 200)

```json
{
    "isCrisis": false,
    "categories": [
        {
            "label": "Housing Assistance",
            "confidence": 52,
            "resources": [...],
            "why": "Matched by BART-large-MNLI semantic analysis of your description.",
            "warning": "52% confidence — consider providing more detail for a better match"
        }
    ],
    "needsClarification": true,
    "clarificationMessage": "Your top match scored below 70% confidence — help us help you by answering a quick question",
    "clarificationQuestions": [
        {
            "question": "Are you currently facing eviction, or at risk of losing housing?",
            "options": ["Facing eviction", "At risk", "Currently homeless", "Need affordable housing"],
            "id": "housing_urgency"
        }
    ],
    "model": "BART-large-MNLI (live)",
    "classificationSource": "bart",
    "hasLocation": false,
    "outsideServiceArea": false,
    "serviceArea": "Houston, TX metro area",
    "debug": { ... }
}
```

### Confidence Thresholds

| Threshold | Behavior |
|---|---|
| ≥ 70% | Show results with full confidence — no clarification needed |
| < 70% | Trigger clarification questions — "ask don't guess" |
| < 10% | Category not included in results |

### Classification Categories (9)

| Category | BART Label (descriptive) |
|---|---|
| Housing Assistance | rent help, emergency shelter, facing eviction, homeless... |
| Food Assistance | food pantry, free groceries, SNAP benefits, hunger... |
| Mental Health | feeling alone, lonely, isolated, depression, anxiety, PTSD... |
| Employment Services | job search, career training, unemployed, need work... |
| Legal Aid | legal aid, immigration help, court assistance, lawyer... |
| Healthcare | medical care, health clinic, doctor, prescription help... |
| Crisis Support | suicide, self-harm, want to die, crisis intervention... |
| Senior Services | senior services, elderly care, aging, meals for seniors... |
| Veteran Services | veteran services, VA benefits, military veteran, PTSD veteran... |

### Error Response (HTTP 400)

```json
{
    "error": "Text input is required"
}
```

### Performance Requirements

- **Crisis detection**: < 200ms (regex matching only, no network calls)
- **Full classification**: < 5 seconds (including HuggingFace API call)
- **Fallback**: Keyword matching when BART is unavailable (no API key, network error)

---

## ENDPOINT 2: COMMUNITY RESOURCES

**Purpose:** List resources from the database, filterable by category and search query.

```
GET /api/community-resources?category=Housing+Assistance&search=rent
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| category | string | No | Filter by category name |
| search | string | No | Search in name and description |

### Response (HTTP 200)

```json
{
    "resources": [
        {
            "id": 1,
            "name": "Houston Housing Authority",
            "category": "Housing Assistance",
            "description": "Section 8 housing choice vouchers...",
            "phone": "713-260-0600",
            "address": "2640 Fountain View Dr, Houston, TX 77057",
            "hours": "Mon-Fri 8am-5pm",
            "eligibility": "Income at or below 50% AMI",
            "lastVerified": "2026-05-15"
        }
    ],
    "total": 3
}
```

---

## ENDPOINT 3: CLASSIFY HEALTH CHECK

**Purpose:** Verify the classification API is running and check BART availability.

```
GET /api/classify
```

### Response (HTTP 200)

```json
{
    "status": "ok",
    "service": "ClearPath AI Classification API",
    "version": "3.2.0",
    "model": "facebook/bart-large-mnli",
    "bartAvailable": true,
    "apiKeyPrefix": "hf_xxx...",
    "apiKeyLength": 36,
    "classificationMode": "BART-large-MNLI (live)",
    "crisisDetection": "regex-based (deterministic)",
    "labels": ["Housing Assistance", "Food Assistance", "Mental Health", "Employment Services", "Legal Aid", "Healthcare", "Crisis Support", "Senior Services", "Veteran Services"],
    "resourceCount": 23
}
```

---

## ENDPOINT 4: API HEALTH CHECK

**Purpose:** Basic health check for the API.

```
GET /api
```

### Response (HTTP 200)

```json
{
    "status": "ok"
}
```

---

## ERROR HANDLING RULES

1. **Crisis detection NEVER returns an error.** It is regex-based and deterministic. If it fails, the system logs the error and proceeds to classification.

2. **Classification errors are graceful.** If BART is unavailable, the system falls back to keyword matching. The user is always shown which method was used (transparent about source).

3. **No stack traces in production.** Error responses contain human-readable messages.

4. **Input validation.** Empty strings, strings over 2000 characters, and non-string inputs return HTTP 400 with a clear message.

---

*This contract reflects the actual implementation. The AI pipeline runs within Next.js API routes using the HuggingFace Inference API, not as a separate Python service.*
