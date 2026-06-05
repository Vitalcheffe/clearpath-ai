# CLEARPATH AI — USER SCENARIOS

**7 scenarios covering the full spectrum of use cases. Each scenario tests a different part of the system.**

---

## SCENARIO 1: THE EVICTION (Multi-need with legal urgency)

**Persona:** Maria, 34, single mother, works part-time as a cashier. Spanish-speaking but functional in English. Smartphone-only user.

**Input:** "I got a notice on my door saying I have to leave my apartment in 5 days. I don't have anywhere to go and I can't afford a lawyer."

**Expected system behavior:**

1. **Crisis check:** No crisis keywords detected. Proceed to classification.
2. **Classification:**
   - Legal Aid: 78%
   - Emergency Housing: 65%
   - Emergency Funds: 42%
3. **Confidence decision:** Legal Aid is above 70%, so results are shown. But Emergency Housing is also significant.
4. **Display:** Both Legal Aid and Emergency Housing shown prominently. Legal Aid has a time-sensitivity badge: "Eviction response deadlines are typically short. Contact a lawyer immediately."
5. **"Why" explanation:** "You mentioned an eviction notice and needing a lawyer. Legal defense can delay or prevent eviction."
6. **"What else" panel:** "Emergency housing is also relevant in case the eviction proceeds."

**What this tests:** Multi-label classification with overlapping needs. Time-sensitivity awareness. High-enough confidence to show results without clarification, but transparent about alternatives.

**Edge case variant:** What if Maria types in Spanish? → System attempts classification. If confidence is low (likely), clarification question in English + option to talk to navigator.

---

## SCENARIO 2: THE FOOD GAP (Clear-cut, high confidence)

**Persona:** James, 28, recently laid off from warehouse job. Two kids. Never used social services before. Doesn't know what's available.

**Input:** "I lost my job last week and I don't have enough food for my kids. Is there anywhere I can get help with groceries?"

**Expected system behavior:**

1. **Crisis check:** No crisis keywords detected.
2. **Classification:**
   - Food Assistance: 94%
   - Emergency Funds: 61%
   - Employment Services: 47%
3. **Display:** Food Assistance shown with high confidence. Two alternatives shown at lower confidence.
4. **"Why" explanation:** "You mentioned job loss and needing food for your children. Food banks and SNAP programs can help immediately."
5. **Resources shown:** Local food bank (with hours), SNAP application link, school meal program info.

**What this tests:** The "happy path" — everything works smoothly, high confidence, clear recommendation. This is the easiest demo scenario and should be flawless.

---

## SCENARIO 3: THE DOMESTIC VIOLENCE SITUATION (Crisis detection)

**Persona:** Aisha, 31, immigrant on spousal visa. Husband controls all finances. Afraid to call police because of immigration status.

**Input:** "My husband hits me and I can't leave because I don't have papers and he says he'll have me deported"

**Expected system behavior:**

1. **Crisis check:** "hits me" triggers domestic violence keyword detection.
2. **Crisis overlay appears IMMEDIATELY** — before any AI classification.
3. **Overlay shows:**
   - National Domestic Violence Hotline: 1-800-799-7233
   - Crisis Text Line: Text LOVEIS to 22522
   - Note: "Your immigration status does not prevent you from getting help. You have rights regardless of your status."
4. **After user acknowledges overlay:** AI classification runs.
5. **Classification:**
   - Legal Aid (immigration): 71%
   - Domestic Violence Services: 85%
   - Emergency Housing: 58%
6. **Display:** Domestic Violence Services shown first (highest confidence). Legal Aid for immigration shown as critical alternative.

**What this tests:** Crisis detection triggering correctly. The overlay MUST appear before AI classification. The immigration-specific note is NOT AI-generated — it's part of the crisis resource database for DV situations.

**Edge case variant:** What if someone types "my partner is controlling" instead of "hits me"? → This may NOT trigger crisis detection (no explicit violence keyword). The AI might classify it as lower urgency. This is a KNOWN LIMITATION documented in RESPONSIBLE_AI.md.

---

## SCENARIO 4: THE MEDICATION GAP (Clarification needed)

**Persona:** Robert, 62, retired truck driver on fixed income. Takes insulin for diabetes. Insurance changed and new plan doesn't cover his medication.

**Input:** "I can't afford my medicine anymore. My insurance changed and now my insulin costs $300 a month."

**Expected system behavior:**

1. **Crisis check:** No crisis keywords detected. (Note: "can't afford medicine" is urgent but not a crisis keyword in our current list. This is a known gap.)
2. **Classification:**
   - Prescription Assistance: 68%
   - Health Insurance Help: 55%
   - Financial Assistance: 42%
3. **Confidence decision:** No category exceeds 70%. Clarification questions triggered.
4. **Clarification question:** "Are you currently out of medication, or do you have some left but will run out soon?"
5. **If "I'm out now":** Confidence for Prescription Assistance jumps to 89%. Results shown with urgency badge.
6. **If "I have a few weeks":** Confidence for Health Insurance Help rises to 72%. Results shown with note about enrollment periods.

**What this tests:** The clarification mechanism working correctly. One question changes the classification significantly. The user sees the system "thinking" and adjusting.

---

## SCENARIO 5: THE VETERAN (Navigating multiple systems)

**Persona:** Mike, 45, Iraq veteran with PTSD. Recently homeless. Eligible for VA benefits but doesn't know how to access them.

**Input:** "I'm a veteran and I'm homeless. I heard the VA can help but I don't know how to sign up."

**Expected system behavior:**

1. **Crisis check:** "homeless" and "veteran" do not trigger crisis keywords. PTSD is not mentioned in the input.
2. **Classification:**
   - Veteran Services: 88%
   - Emergency Housing: 71%
   - Mental Health Services: 34%
3. **Display:** Veteran Services shown with high confidence. Emergency Housing also shown.
4. **"Why" explanation:** "You identified as a veteran experiencing homelessness. VA programs provide housing assistance specifically for veterans."
5. **"What else" panel:** "Mental health support is also available through the VA, including PTSD treatment."

**What this tests:** Domain-specific classification (veteran services). The system should recognize that "veteran" unlocks an entire category of resources (VA benefits) that non-veterans cannot access.

---

## SCENARIO 6: THE OVERWHELMED PARENT (Vague emotional input)

**Persona:** Lisa, 29, mother of three. Partner just left. Behind on bills. Kids need school supplies. Overwhelmed and doesn't know where to start.

**Input:** "Everything is falling apart. I don't know what to do first."

**Expected system behavior:**

1. **Crisis check:** No explicit crisis keywords, but the system flags the emotional distress.
2. **Classification:** Low confidence across all categories (no specific need mentioned).
3. **Clarification question:** "I hear you. Let's start with what's most urgent. Are you facing any of these right now? [Risk of losing housing / Not enough food / Legal trouble / Health emergency / Something else]"
4. **User selects:** "Risk of losing housing"
5. **Follow-up:** "Are you behind on rent, or is your living situation unstable for another reason?"
6. **Classification sharpens** with each answer. Confidence climbs from <30% to >70%.

**What this tests:** Handling vague, emotional input gracefully. The system doesn't pretend to understand — it asks. The tone is empathetic but not pitying.

---

## SCENARIO 7: THE NON-ENGLISH SPEAKER (Language barrier)

**Persona:** Chen, 52, recent immigrant from China. Speaks Mandarin, minimal English. Needs healthcare for chronic condition.

**Input:** "我需要看医生但我没有保险" (I need to see a doctor but I don't have insurance)

**Expected system behavior:**

1. **Crisis check:** System does not recognize Mandarin crisis keywords (known limitation).
2. **Classification:** Hugging Face model may attempt classification on non-English input. Confidence will likely be very low.
3. **System response:** "I had difficulty understanding your request. Could you describe your situation in English? If you'd prefer, you can talk to a navigator who may be able to help in your language."
4. **"Talk to Navigator" button is prominent.** This is the correct fallback for language barriers.

**What this tests:** Graceful degradation when the system can't handle non-English input. The system doesn't pretend to understand, doesn't give wrong results, and offers the human alternative immediately.

---

## SCENARIO PRIORITY FOR DEMOS

| Priority | Scenario | What It Shows | When to Use |
|---|---|---|---|
| 1 | Eviction | Multi-need + clarification | Main demo — shows the product's core value |
| 2 | Crisis (DV) | Safety net | Most important for Responsible AI award |
| 3 | Food Gap | Happy path | Quick demo when time is short |
| 4 | Medication | Clarification mechanism | Deep dive into the "ask don't guess" feature |
| 5 | Vague Input | Graceful handling of ambiguity | Shows system doesn't break under uncertainty |
| 6 | Veteran | Domain-specific classification | Shows breadth of resource coverage |
| 7 | Non-English | Known limitation handling | Shows honesty about what we can't do |
