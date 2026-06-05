# CLEARPATH AI — CRISIS KEYWORD DATABASE

**This module is the safety net. It MUST work every time. No exceptions. No AI override.**

---

## DESIGN PRINCIPLES

1. **Keyword matching is deterministic.** Same input, same output. No model inference, no probability, no ambiguity.
2. **The crisis module runs BEFORE the AI classification pipeline.** Always. No exceptions.
3. **The AI cannot override, skip, or bypass the crisis module.** These two systems are architecturally isolated.
4. **False positives are acceptable. False negatives are not.** It's better to show the crisis overlay to someone who doesn't need it than to miss someone who does.
5. **The crisis module works even if the AI server is down.** It runs independently.

---

## CATEGORY 1: SUICIDE & SELF-HARM

**Trigger:** Any match in this category shows the 988 Suicide & Crisis Lifeline and Crisis Text Line.

**Crisis resources displayed:**
- 988 Suicide & Crisis Lifeline: Call or text 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: Call 911

### Exact Keywords (case-insensitive)

| Keyword | Notes |
|---|---|
| kill myself | Direct expression |
| want to die | Direct expression |
| want to end it | Common euphemism |
| end my life | Direct expression |
| suicidal | Clinical term |
| suicide | Direct term |
| self-harm | Clinical term |
| self harm | Without hyphen variant |
| cutting myself | Specific method |
| hurt myself | Common expression |
| want to hurt myself | Common expression |
| don't want to live | Indirect expression |
| no reason to live | Indirect expression |
| better off dead | Common expression |
| can't go on | Indirect expression |
| give up on life | Indirect expression |
| overdose | Method mention |
| take pills | Method mention |
| jump off | Method mention |
| hang myself | Method mention |
| slit my wrists | Method mention |

### Phrase Patterns (substring match)

| Pattern | Matches | Does NOT Match |
|---|---|---|
| "end it all" | "I want to end it all" | "Let's end it on a good note" |
| "not worth living" | "Life's not worth living" | "This project is not worth the effort" |
| "no point in living" | "There's no point in living" | — |
| "world without me" | "They'd be better off in a world without me" | — |

---

## CATEGORY 2: DOMESTIC VIOLENCE

**Trigger:** Any match in this category shows the National Domestic Violence Hotline.

**Crisis resources displayed:**
- National Domestic Violence Hotline: 1-800-799-7233
- Crisis Text Line: Text LOVEIS to 22522
- Note: "Your immigration status does not prevent you from getting help. You have rights regardless of your status."

### Exact Keywords (case-insensitive)

| Keyword | Notes |
|---|---|
| domestic violence | Clinical term |
| domestic abuse | Clinical term |
| my husband hits me | Direct report |
| my wife hits me | Direct report (inclusive) |
| my partner hits me | Gender-neutral |
| my boyfriend hits me | Direct report |
| my girlfriend hits me | Direct report (inclusive) |
| beats me | Direct report |
| hitting me | Direct report |
| physical abuse | Clinical term |
| emotional abuse | Clinical term |
| threatening me | Intimidation |
| controlling me | Coercive control |
| won't let me leave | Restriction of movement |
| trapped in my relationship | Common expression |
| afraid of my partner | Fear-based |
| scared of my husband | Fear-based |
| scared of my wife | Fear-based |

### Phrase Patterns (substring match)

| Pattern | Matches | Does NOT Match |
|---|---|---|
| "hits me" | "My husband hits me" | "The news hits me hard" |
| "beats me" | "He beats me every night" | "It beats me how this works" |
| "won't let me" | "He won't let me leave the house" | "They won't let me park there" |

---

## CATEGORY 3: SUBSTANCE ABUSE / OVERDOSE

**Trigger:** Any match in this category shows SAMHSA National Helpline and Poison Control.

**Crisis resources displayed:**
- SAMHSA National Helpline: 1-800-662-4357
- Poison Control: 1-800-222-1222
- 988 Suicide & Crisis Lifeline (overlap with Category 1)
- Emergency Services: Call 911

### Exact Keywords (case-insensitive)

| Keyword | Notes |
|---|---|
| overdose | Direct term |
| overdosing | Active form |
| took too many pills | Common expression |
| alcohol poisoning | Medical term |
| drug overdose | Direct term |
| meth overdose | Specific substance |
| opioid overdose | Specific substance |
| fentanyl | High-risk substance |
| heroin | High-risk substance |
| cocaine overdose | Specific substance |
| need rehab | Help-seeking |
| can't stop drinking | Substance dependency |
| can't stop using | Substance dependency |
| withdrawal symptoms | Medical term |

---

## CATEGORY 4: CHILD ABUSE / ENDANGERMENT

**Trigger:** Any match in this category shows Childhelp National Child Abuse Hotline.

**Crisis resources displayed:**
- Childhelp National Child Abuse Hotline: 1-800-422-4453
- Emergency Services: Call 911
- Note: "If a child is in immediate danger, call 911."

### Exact Keywords (case-insensitive)

| Keyword | Notes |
|---|---|
| child abuse | Clinical term |
| abusing my child | Direct report |
| hurting my child | Direct report |
| neglecting my children | Direct report |
| afraid I'll hurt my child | Prevention-seeking |
| child protective services | Legal/system term |
| CPS | Abbreviation |
| foster care | System term |

---

## CATEGORY 5: SEXUAL ASSAULT

**Trigger:** Any match in this category shows RAINN National Sexual Assault Hotline.

**Crisis resources displayed:**
- RAINN National Sexual Assault Hotline: 1-800-656-4673
- Emergency Services: Call 911
- Note: "You are not alone. What happened is not your fault."

### Exact Keywords (case-insensitive)

| Keyword | Notes |
|---|---|
| sexual assault | Clinical term |
| raped | Direct term |
| rape | Direct term |
| sexual abuse | Clinical term |
| assaulted me | Direct report |
| touched me without consent | Direct report |
| nonconsensual | Clinical term |

---

## CATEGORY 6: HUMAN TRAFFICKING

**Trigger:** Any match in this category shows the National Human Trafficking Hotline.

**Crisis resources displayed:**
- National Human Trafficking Hotline: 1-888-373-7888
- Text: 233733
- Emergency Services: Call 911

### Exact Keywords (case-insensitive)

| Keyword | Notes |
|---|---|
| human trafficking | Direct term |
| forced to work | Coercion |
| forced into sex work | Coercion |
| being trafficked | Direct report |
| trafficking | Direct term |
| held against my will | Restriction |
| passport taken | Common trafficking indicator |
| can't leave my employer | Labor trafficking indicator |

---

## IMPLEMENTATION SPECIFICATION

### Python Module Structure

```python
# crisis_detection.py

CRISIS_CATEGORIES = {
    "suicide_self_harm": {
        "resources": [...],
        "keywords": [...],
        "phrases": [...]
    },
    "domestic_violence": {
        "resources": [...],
        "keywords": [...],
        "phrases": [...]
    },
    # ... etc
}

def detect_crisis(user_input: str) -> dict | None:
    """
    Check user input against crisis keywords.
    Returns crisis category + resources if detected, None otherwise.
    
    This function:
    - Converts input to lowercase
    - Checks exact keyword matches first
    - Then checks substring phrase patterns
    - Returns FIRST match found (priority order: suicide > DV > substance > child > assault > trafficking)
    - Is completely independent of the AI classification pipeline
    - Runs synchronously (no async, no network calls)
    - Completes in < 200ms
    """
```

### API Response Format

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

### Frontend Behavior

When `crisis_detected === true`:

1. **Full-screen overlay appears** over the app. No way to interact with the app until the overlay is acknowledged.
2. **Overlay shows:** Crisis category resources prominently. Large text. High contrast. No distractions.
3. **Acknowledge button:** "I've reached out for help" + "Continue to resource search" (secondary).
4. **After acknowledgment:** The AI classification results are shown BELOW the crisis resources. Crisis resources remain visible at the top.
5. **"Talk to a Navigator" button is always visible** on the crisis overlay.

---

## TESTING PROTOCOL

Every keyword and phrase must be tested before deployment. No exceptions.

| Test | Input | Expected Category | Pass/Fail |
|---|---|---|---|
| Direct suicide | "I want to kill myself" | suicide_self_harm | [ ] |
| Indirect suicide | "I don't want to be here anymore" | suicide_self_harm | [ ] |
| Domestic violence | "My husband hits me" | domestic_violence | [ ] |
| Substance overdose | "I took too many pills" | substance_abuse | [ ] |
| Child abuse | "I'm afraid I'll hurt my child" | child_abuse | [ ] |
| Sexual assault | "I was raped" | sexual_assault | [ ] |
| Human trafficking | "I'm being trafficked" | human_trafficking | [ ] |
| False positive check | "My husband hits the gym a lot" | None (no crisis) | [ ] |
| False positive check | "This headache is killing me" | None (no crisis) | [ ] |
| Combined crisis | "I want to kill myself and my husband hits me" | suicide_self_harm (first priority) | [ ] |
| Non-English | "Je veux mourir" | None (known limitation) | [ ] |
| AI server down | Any crisis keyword | Crisis detected (independent of AI) | [ ] |

---

## KNOWN GAPS

These are expressions we know we might miss. They are documented in RESPONSIBLE_AI.md.

1. **Indirect expressions of suicide:** "I don't want to wake up tomorrow," "I'm a burden to everyone," "Nobody would miss me." These are common but extremely hard to catch with keyword matching without massive false positives.

2. **Non-English crisis expressions:** Our keyword list is English-only. A person typing "je veux mourir" (I want to die in French) or "quiero morir" (Spanish) will NOT trigger crisis detection.

3. **Slang and code-switching:** Crisis expressions vary by age, culture, and community. "I'm done," "I can't take this," "I'm over it" could be crisis-related or could be venting about a bad day.

4. **Typographical errors:** "I want to kil myself" (misspelled "kill") may not match our exact keyword. We should consider fuzzy matching for high-risk keywords.

**Mitigation for all gaps:** The "Talk to a Navigator" button is always available. Even if our crisis detection misses something, the user can always reach a human. We also recommend that anyone in distress call 911 or 988 directly, regardless of whether our system flags them.

---

## MAINTENANCE NOTES

- This keyword list should be reviewed by a mental health professional before production deployment.
- New keywords should be added based on real-world testing and feedback from crisis counselors.
- The priority order (suicide > DV > substance > child > assault > trafficking) should be reviewed regularly.
- False positive rates should be monitored and keywords adjusted accordingly.
- This is a LIVING DOCUMENT. Update it as we learn.
