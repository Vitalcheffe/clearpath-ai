import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { HOUSTON_RESOURCES, RESOURCES_BY_CATEGORY } from "@/data/resources";

// ─── Configuration ─────────────────────────────────────────
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// ─── Boot-time diagnostic (runs once when serverless function cold-starts) ───
console.log(`[classify:boot] HF_API_KEY present: ${!!HF_API_KEY}`);
console.log(`[classify:boot] HF_API_KEY length: ${HF_API_KEY?.length ?? 'N/A'}`);
console.log(`[classify:boot] HF_API_KEY prefix: ${HF_API_KEY ? HF_API_KEY.substring(0, 6) + '...' : 'NONE'}`);
console.log(`[classify:boot] HF_API_URL: ${HF_API_URL}`);

// ─── Crisis Detection (regex-based, deterministic, AI NEVER trusted for crisis) ───
const CRISIS_PATTERNS = [
  // ─── Suicidal ideation ───
  /suicid/i,
  /kill\s+myself/i,
  /end\s+it\s+all/i,
  /end\s+it\b/i,
  /end\s+my\s+life/i,
  /want\s+to\s+die/i,
  /take\s+my\s+life/i,
  /can'?t\s+take\s+(this|it)/i,
  /want\s+it\s+all\s+to\s+end/i,
  /ending\s+it/i,
  /harm\s+myself/i,
  /self[- ]?harm/i,
  /hurt\s+myself/i,
  /want\s+to\s+hurt\s+myself/i,
  /no\s+(reason|point)\s+to\s+live/i,
  /better\s+off\s+dead/i,
  /don'?t\s+want\s+to\s+live/i,
  /don'?t\s+want\s+to\s+be\s+here/i,
  /overdose/i,
  /take\s+pills/i,
  /jump\s+off/i,
  /hang\s+myself/i,
  /slit\s+my\s+wrists/i,
  /not\s+worth\s+living/i,
  /world\s+without\s+me/i,
  /give\s+up\s+on\s+life/i,
  /can'?t\s+go\s+on/i,
  /life\s+(means|has)\s+nothing/i,
  /nothing\s+(to\s+)?live\s+for/i,
  /don'?t\s+want\s+to\s+exist/i,
  /want\s+to\s+disappear/i,
  /want\s+to\s+fall\s+asleep\s+(and\s+)?never/i,
  /no\s+point\s+in\s+living/i,

  // ─── Medical emergency — "I'm dying" only standalone, NOT "I'm dying for a coffee" or "I'm dying laughing" ───
  /i'?m\s+dying\b(?!\s+(for|to|of|from|laughing|laugh))/i,
  /i\s+am\s+dying\b(?!\s+(for|to|of|from|laughing|laugh))/i,
  /i'?m\s+going\s+to\s+die\b(?!\s+(from|of|for))/i,
  /i\s+am\s+going\s+to\s+die\b(?!\s+(from|of|for))/i,
  /help\s+me\s+i'?m\s+dying/i,
  /i\s+can'?t\s+breathe/i,

  // ─── Domestic violence / abuse ───
  /domestic\s+violen/i,
  /domestic\s+abuse/i,
  /(husband|wife|partner|boyfriend|girlfriend|spouse)\s+(hits?|beats?|hurts?|chokes?|strangles?)/i,
  /being\s+beaten/i,
  /beaten\s+by/i,
  /physical\s+abuse/i,
  /emotional\s+abuse/i,
  /threaten(ing)?\s+me/i,
  /controlling\s+me/i,
  /won'?t\s+let\s+me\s+leave/i,
  /trapped\s+in\s+my\s+relationship/i,
  /afraid\s+of\s+my\s+partner/i,
  /being\s+abused/i,
  /abused\s+by\s+my\s+partner/i,
  /choking\s+me/i,
  /strangling\s+me/i,
  /stalking\s+me/i,
  /threatening\s+to\s+kill/i,

  // ─── Sexual assault / trafficking ───
  /sexual\s+assault/i,
  /\braped?\b/i,
  /human\s+trafficking/i,
  /forced\s+to\s+work/i,
  /held\s+against\s+my\s+will/i,

  // ─── Homicidal ideation / violence towards others ───
  /\b(kill|murder|hurt|harm|shoot|stab)\s+(someone|my|a|him|her|them|people|friend|family|partner|spouse|boss|child|kids?)\b/i,
  /i\s+(wanna|want\s+to|will|am\s+going\s+to)\s+(kill|murder|hurt|harm|shoot|stab)\b/i,
  /gonna\s+(kill|murder|hurt|harm|shoot|stab)\b/i,
];

// ─── Descriptive Labels for BART-large-MNLI ───
// Ultra-specific labels give BART maximum semantic signal for NLI matching.
const CANDIDATE_LABELS = [
  'rent, mortgage, eviction, being evicted, losing my home, homelessness, shelter, emergency housing, section 8, housing assistance, no money for rent, need financial help, utility assistance, about to lose my apartment',
  'needing food, getting free food, food pantry, free groceries, meals, food stamps, SNAP, food bank, hungry, starving, no money for food, where to get food, feeding family, no food at home',
  'therapy, counseling, psychiatrist, depression, feeling depressed, anxiety, feeling anxious, mental health treatment, emotional support, PTSD, stressed, overwhelmed, feeling alone, lonely, isolated, no one to talk to, alone, loneliness',
  'job search, resume help, career training, unemployment benefits, employment, looking for work, fired, laid off, need money, no money, unemployed, need income, financial stability, workforce development',
  'free lawyer, legal aid, immigration attorney, court representation, legal help, deportation, custody, divorce',
  'doctor, medical clinic, health insurance, prescription, healthcare, medical care, sick, cancer treatment, dying of illness, hospital, clinic, health center',
  'suicidal thoughts, wanting to kill myself, self-harm, or immediate danger to life',
  'elderly care, senior meals, home delivery, transportation for older adults, aging parent, elderly mother, senior citizen services, senior, older adult, Medicare',
];

// Map descriptive labels back to short display names
const LABEL_TO_CATEGORY: Record<string, string> = {
  'rent, mortgage, eviction, being evicted, losing my home, homelessness, shelter, emergency housing, section 8, housing assistance, no money for rent, need financial help, utility assistance, about to lose my apartment': 'Housing Assistance',
  'needing food, getting free food, food pantry, free groceries, meals, food stamps, SNAP, food bank, hungry, starving, no money for food, where to get food, feeding family, no food at home': 'Food Assistance',
  'therapy, counseling, psychiatrist, depression, feeling depressed, anxiety, feeling anxious, mental health treatment, emotional support, PTSD, stressed, overwhelmed, feeling alone, lonely, isolated, no one to talk to, alone, loneliness': 'Mental Health',
  'job search, resume help, career training, unemployment benefits, employment, looking for work, fired, laid off, need money, no money, unemployed, need income, financial stability, workforce development': 'Employment Services',
  'free lawyer, legal aid, immigration attorney, court representation, legal help, deportation, custody, divorce': 'Legal Aid',
  'doctor, medical clinic, health insurance, prescription, healthcare, medical care, sick, cancer treatment, dying of illness, hospital, clinic, health center': 'Healthcare',
  'suicidal thoughts, wanting to kill myself, self-harm, or immediate danger to life': 'Crisis Support',
  'elderly care, senior meals, home delivery, transportation for older adults, aging parent, elderly mother, senior citizen services, senior, older adult, Medicare': 'Senior Services',
};

const LABELS = [
  'Housing Assistance',
  'Food Assistance',
  'Mental Health',
  'Employment Services',
  'Legal Aid',
  'Healthcare',
  'Crisis Support',
  'Senior Services',
];

// ─── Category Colors ───────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Housing Assistance": "#f59e0b",
  "Food Assistance": "#22c55e",
  "Mental Health": "#8b5cf6",
  "Employment Services": "#3b82f6",
  "Legal Aid": "#06b6d4",
  "Healthcare": "#ef4444",
  "Senior Services": "#6366f1",
  "Crisis": "#dc2626",
  "Crisis Support": "#dc2626",
};

// ─── HAVERSINE DISTANCE + SMART DISPLAY ───
const HOUSTON_LAT = 29.7604;
const HOUSTON_LNG = -95.3698;
const HOUSTON_METRO_RADIUS_MI = 25;
const EARTH_RADIUS_MI = 3958.8;

function haversineMi(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MI * c;
}

function isOutsideServiceArea(userLat: number, userLng: number): boolean {
  return haversineMi(userLat, userLng, HOUSTON_LAT, HOUSTON_LNG) > 100;
}

// ─── Crisis Detection ──────────────────────────────────────
function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some(pattern => pattern.test(text));
}

// ─── Classification result with source tracking ────────────
interface ClassificationResult {
  label: string;
  score: number;
  source: 'bart' | 'keyword';
}

// ─── Debug info for transparency ────────────────────────────
interface DebugInfo {
  keyPresent: boolean;
  keyPrefix: string;
  keyLength: number;
  fetchAttempted: boolean;
  fetchUrl: string;
  fetchStatus: number | null;
  fetchElapsedMs: number | null;
  fetchError: string | null;
  hfResponseBody: string | null;
  fallbackUsed: boolean;
  fallbackReason: string | null;
}

// ─── Classification via HuggingFace BART-large-MNLI ────────
async function classifyWithBART(text: string): Promise<{ results: ClassificationResult[]; debug: DebugInfo }> {
  // ── Build debug info as we go ──
  const debug: DebugInfo = {
    keyPresent: !!(HF_API_KEY && HF_API_KEY !== "hf_xxxxx"),
    keyPrefix: HF_API_KEY ? HF_API_KEY.substring(0, 6) + '...' : 'NONE',
    keyLength: HF_API_KEY?.length ?? 0,
    fetchAttempted: false,
    fetchUrl: HF_API_URL,
    fetchStatus: null,
    fetchElapsedMs: null,
    fetchError: null,
    hfResponseBody: null,
    fallbackUsed: false,
    fallbackReason: null,
  };

  // ── HONEST GATE: No API key = no BART. Never fake it. ──
  if (!HF_API_KEY || HF_API_KEY === "hf_xxxxx") {
    console.warn("[classify] No HUGGINGFACE_API_KEY configured — using keyword matching");
    debug.fallbackUsed = true;
    debug.fallbackReason = 'No HUGGINGFACE_API_KEY configured';
    return { results: keywordClassify(text), debug };
  }

  // ── CALLING HF API — with full diagnostic logging ──
  debug.fetchAttempted = true;
  console.log(`[classify] Calling HF API at ${HF_API_URL}`);
  console.log(`[classify] Key prefix: ${HF_API_KEY.substring(0, 6)}...`);
  console.log(`[classify] Input text: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`);
  console.log(`[classify] Candidate labels count: ${CANDIDATE_LABELS.length}`);

  const requestBody = {
    inputs: text,
    parameters: {
      candidate_labels: CANDIDATE_LABELS,
      multi_label: true,
    },
  };

  // ── ATTEMPT 1: Raw fetch ──
  const fetchStart = Date.now();
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const elapsed = Date.now() - fetchStart;
    debug.fetchStatus = response.status;
    debug.fetchElapsedMs = elapsed;
    console.log(`[classify] HF raw fetch responded in ${elapsed}ms with status ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      debug.hfResponseBody = JSON.stringify(result).substring(0, 500);

      // BART-large-MNLI zero-shot returns { labels: string[], scores: number[] }
      if (result.labels && result.scores) {
        const top3 = result.labels.slice(0, 3).map((l: string, i: number) =>
          `${LABEL_TO_CATEGORY[l] || l}: ${(result.scores[i] * 100).toFixed(1)}%`
        );
        console.log(`[classify] Top 3: ${top3.join(' | ')}`);

        return {
          results: result.labels.map((label: string, i: number) => ({
            label: LABEL_TO_CATEGORY[label] || label,
            score: result.scores[i],
            source: 'bart' as const,
          })),
          debug,
        };
      }

      // Unexpected format
      debug.fallbackUsed = true;
      debug.fallbackReason = `Unexpected HF response format: keys=${Object.keys(result).join(',')}`;
      console.warn("[classify] Unexpected HF response format:", debug.fallbackReason);
    } else {
      const errBody = await response.text();
      debug.hfResponseBody = errBody.substring(0, 500);
      debug.fallbackUsed = true;
      debug.fallbackReason = `HF API returned ${response.status}: ${errBody.substring(0, 100)}`;
      console.error(`[classify] HF API error ${response.status}: ${errBody}`);
    }
  } catch (fetchErr) {
    const elapsed = Date.now() - fetchStart;
    debug.fetchElapsedMs = elapsed;
    const cause = (fetchErr as any)?.cause;
    debug.fetchError = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    const causeInfo = cause ? ` (cause: ${cause.code || cause.message || cause.name || 'unknown'}${cause.hostname ? ` hostname=${cause.hostname}` : ''}${cause.address ? ` address=${cause.address}` : ''})` : '';
    console.error(`[classify] HF raw fetch FAILED after ${elapsed}ms: ${debug.fetchError}${causeInfo}`);
  }

  // ── ATTEMPT 2: HfInference SDK (different HTTP stack) ──
  console.log("[classify] Raw fetch failed or returned bad format — trying HfInference SDK");
  const sdkStart = Date.now();
  try {
    const hf = new HfInference(HF_API_KEY);
    const result = await hf.zeroShotClassification({
      model: HF_MODEL,
      inputs: text,
      parameters: {
        candidate_labels: CANDIDATE_LABELS,
        multi_label: true,
      },
    });

    const elapsed = Date.now() - sdkStart;
    console.log(`[classify] HfInference SDK succeeded in ${elapsed}ms`);

    // SDK returns ZeroShotClassificationOutput — array of { label, score }
    if (result && Array.isArray(result)) {
      const top3 = result.slice(0, 3).map((r: any) =>
        `${LABEL_TO_CATEGORY[r.label] || r.label}: ${(r.score * 100).toFixed(1)}%`
      );
      console.log(`[classify] SDK Top 3: ${top3.join(' | ')}`);

      // Update debug to show SDK was used
      if (!debug.fetchStatus) {
        debug.fetchStatus = 200; // SDK succeeded
      }
      debug.fetchElapsedMs = elapsed;
      debug.fallbackUsed = false;
      debug.fallbackReason = null;

      return {
        results: result.map((r: any) => ({
          label: LABEL_TO_CATEGORY[r.label] || r.label,
          score: r.score,
          source: 'bart' as const,
        })),
        debug,
      };
    }

    debug.fallbackUsed = true;
    debug.fallbackReason = `SDK returned unexpected format: ${typeof result}`;
    console.warn("[classify] SDK returned unexpected format:", typeof result);
  } catch (sdkErr) {
    const elapsed = Date.now() - sdkStart;
    const cause = (sdkErr as any)?.cause;
    const sdkMsg = sdkErr instanceof Error ? sdkErr.message : String(sdkErr);
    const causeInfo = cause ? ` (cause: ${cause.code || cause.message || 'unknown'})` : '';
    console.error(`[classify] HfInference SDK also FAILED after ${elapsed}ms: ${sdkMsg}${causeInfo}`);

    debug.fallbackUsed = true;
    if (!debug.fallbackReason) {
      debug.fallbackReason = `Both raw fetch and SDK failed. Raw: ${debug.fetchError || 'N/A'}. SDK: ${sdkMsg}${causeInfo}`;
    } else {
      debug.fallbackReason += ` | SDK also failed: ${sdkMsg}${causeInfo}`;
    }
  }

  // ── FINAL FALLBACK: Keyword matching (honest) ──
  return { results: keywordClassify(text), debug };
}

// ─── Keyword Classification (HONEST fallback — never pretends to be BART) ───
function keywordClassify(text: string): ClassificationResult[] {
  console.log("[classify] Using KEYWORD matching (BART unavailable or failed)");
  const lower = text.toLowerCase();
  const results: ClassificationResult[] = [];

  const labelKeywords: Record<string, string[]> = {
    "Housing Assistance": ["housing", "rent", "shelter", "homeless", "eviction", "evicted", "apartment", "mortgage", "section 8", "losing my home", "no money for rent", "financial help", "utility"],
    "Food Assistance": ["food", "hungry", "groceries", "snap", "meals", "eat", "feeding", "food bank", "ebt", "starving"],
    "Mental Health": ["mental", "depression", "depressed", "anxiety", "anxious", "therapy", "counseling", "ptsd", "stress", "stressed", "emotional", "overwhelmed", "feelings", "alone", "lonely", "isolated", "no one to talk to", "loneliness"],
    "Employment Services": ["job", "employment", "work", "unemployed", "training", "career", "fired", "laid off", "resume", "need money", "no money", "income"],
    "Legal Aid": ["legal", "lawyer", "immigration", "court", "custody", "divorce", "deportation", "rights"],
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain", "medication", "insulin", "cancer", "dying of", "illness"],
    "Crisis Support": ["suicidal", "crisis", "self-harm", "kill myself", "emergency", "danger", "overdose", "distress"],
    "Senior Services": ["senior", "elderly", "aging", "medicare", "social security", "retirement", "old age", "grandparent", "elder", "older adult"],
  };

  for (const [label, keywords] of Object.entries(labelKeywords)) {
    let score = 0;
    let matchCount = 0;

    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matchCount++;
        score += 0.3;
      }
    }

    if (matchCount > 0) {
      score = Math.min(0.95, 0.5 + score);
      if (label === "Mental Health" && matchCount <= 1) {
        score *= 0.7;
      }
    } else {
      score = 0.05 + Math.random() * 0.1;
    }

    results.push({ label, score: Math.round(score * 100) / 100, source: 'keyword' });
  }

  results.sort((a, b) => b.score - a.score);
  return results.filter((r) => r.score > 0.3);
}

// ─── Build resources for a category ───
function getResourcesForCategory(category: string, userLat?: number, userLng?: number) {
  const dbResources = RESOURCES_BY_CATEGORY[category] || [];
  return dbResources.map(r => {
    let distance: string | null = null;
    if (userLat !== undefined && userLng !== undefined) {
      const miles = haversineMi(userLat, userLng, HOUSTON_LAT, HOUSTON_LNG);
      if (miles <= HOUSTON_METRO_RADIUS_MI) {
        distance = `${miles.toFixed(1)} mi`;
      } else if (miles <= 100) {
        distance = `${Math.round(miles)} mi (outside Houston metro)`;
      } else {
        distance = '📍 Houston, TX';
      }
    } else {
      distance = '📍 Houston, TX';
    }

    return {
      name: r.name,
      detail: r.description + (r.phone ? ` Call ${r.phone}` : '') + (r.hours ? ` Hours: ${r.hours}` : ''),
      phone: r.phone || undefined,
      address: r.address || undefined,
      hours: r.hours || undefined,
      eligibility: r.eligibility || undefined,
      verified: r.verified,
      distance,
    };
  });
}

// ─── POST Handler ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, lat, lng } = body;

    const userLat = typeof lat === 'number' && lat >= -90 && lat <= 90 ? lat : undefined;
    const userLng = typeof lng === 'number' && lng >= -180 && lng <= 180 ? lng : undefined;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    // Layer 1: Crisis Detection (hardcoded, deterministic)
    const isCrisis = detectCrisis(text);

    if (isCrisis) {
      const crisisLines = [
        { name: "988 Suicide & Crisis Lifeline", action: "Free. Confidential. 24/7.", call: "988" },
        { name: "Crisis Text Line", action: "Text HOME to 741741", call: "Text" },
        { name: "National Domestic Violence Hotline", action: "1-800-799-7233", call: "1-800-799-7233" },
        { name: "911", action: "Immediate danger — call now", call: "911" },
      ];

      const crisisResources = getResourcesForCategory("Crisis Support", userLat, userLng);

      return NextResponse.json({
        isCrisis: true,
        crisisLines,
        categories: [{
          label: "Crisis Support",
          confidence: 99,
          resources: crisisResources,
          why: "Your safety is the top priority right now.",
          warning: "If you are in immediate physical danger, call 911.",
        }],
        hasLocation: userLat !== undefined,
        outsideServiceArea: userLat !== undefined && isOutsideServiceArea(userLat, userLng!),
        serviceArea: 'Houston, TX metro area',
      });
    }

    // Layer 2: AI Classification (BART if available, keyword if not — ALWAYS HONEST)
    const { results: classifications, debug: classificationDebug } = await classifyWithBART(text);

    const classificationSource = classifications.length > 0 ? classifications[0].source : 'keyword';

    // Layer 3: Confidence-gated response
    const MULTI_NEED_THRESHOLD = 0.10;
    const MAX_CATEGORIES = 5;
    let significantCategories = classifications
      .filter(c => c.score >= MULTI_NEED_THRESHOLD)
      .slice(0, MAX_CATEGORIES);

    if (significantCategories.length === 0 && classifications.length > 0) {
      significantCategories = [classifications[0]];
    }

    const needsClarification = significantCategories.length > 0 && significantCategories[0].score < 0.5;

    const categoriesWithResources = significantCategories.map(c => ({
      label: c.label,
      confidence: Math.round(c.score * 100),
      resources: getResourcesForCategory(c.label, userLat, userLng),
      why: classificationSource === 'bart'
        ? 'Matched by BART-large-MNLI semantic analysis of your description.'
        : 'Matched by keyword analysis. For more accurate results, BART AI classification requires an API key.',
      also: significantCategories.length > 1
        ? `You may also benefit from ${significantCategories.slice(1, 3).map(sc => sc.label).join(" and ")} services.`
        : undefined,
      warning: c.score < 0.70
        ? `${Math.round(c.score * 100)}% confidence — consider providing more detail for a better match`
        : undefined,
    }));

    const noResults = categoriesWithResources.length === 0;

    const modelLabel = classificationSource === 'bart'
      ? "BART-large-MNLI (live)"
      : classificationDebug.fallbackUsed && classificationDebug.fetchAttempted
      ? `Keyword matching (BART call failed: ${classificationDebug.fetchStatus ?? classificationDebug.fetchError ?? 'unknown'})`
      : "Keyword matching (BART API key not configured)";

    return NextResponse.json({
      isCrisis: false,
      categories: categoriesWithResources,
      needsClarification: needsClarification || noResults,
      clarificationMessage: noResults
        ? "We couldn't match your description to a specific category. Could you tell us more about what you need help with?"
        : needsClarification
        ? "Your request scored below 50% — try providing more detail for better matches"
        : null,
      model: modelLabel,
      classificationSource,
      hasLocation: userLat !== undefined,
      outsideServiceArea: userLat !== undefined && isOutsideServiceArea(userLat, userLng!),
      serviceArea: 'Houston, TX metro area',
      // ── DEBUG: Full transparency into classification pipeline ──
      debug: classificationDebug,
    });
  } catch (error) {
    console.error("Classification API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET Handler (health check with HONEST diagnostics) ────
export async function GET() {
  const hasApiKey = !!(HF_API_KEY && HF_API_KEY !== "hf_xxxxx");
  return NextResponse.json({
    status: "ok",
    service: "ClearPath AI Classification API",
    version: "3.1.0",
    model: "facebook/bart-large-mnli",
    bartAvailable: hasApiKey,
    apiKeyPrefix: HF_API_KEY ? HF_API_KEY.substring(0, 6) + '...' : 'NONE',
    apiKeyLength: HF_API_KEY?.length ?? 0,
    classificationMode: hasApiKey ? "BART-large-MNLI (live)" : "Keyword matching (fallback — set HUGGINGFACE_API_KEY)",
    crisisDetection: "regex-based (deterministic)",
    labels: LABELS,
    resourceCount: HOUSTON_RESOURCES.length,
  });
}
