import { NextRequest, NextResponse } from "next/server";
import { HOUSTON_RESOURCES, RESOURCES_BY_CATEGORY } from "@/data/resources";

// ─── Configuration ─────────────────────────────────────────
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

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

  // ─── Medical emergency — "I'm dying" only standalone, NOT "I'm dying for a coffee" ───
  /i'?m\s+dying\b(?!\s+(for|to|of|from))/i,
  /i\s+am\s+dying\b(?!\s+(for|to|of|from))/i,
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
];

// ─── Descriptive Labels for BART-large-MNLI ───
// Ultra-specific labels give BART maximum semantic signal for NLI matching.
const CANDIDATE_LABELS = [
  'paying rent, mortgage, eviction prevention, or emergency shelter and housing',
  'needing food, getting free food, food pantry, free groceries, meals, food stamps, SNAP, food bank, hungry, starving, no money for food, where to get food, feeding family, no food at home',
  'therapy, counseling, psychiatrist, depression, anxiety, or mental health treatment, feeling depressed, feeling anxious, emotional support',
  'job search, resume help, career training, unemployment benefits, or employment',
  'free lawyer, legal aid, immigration attorney, court representation, or legal help',
  'doctor, medical clinic, health insurance, prescription, or healthcare access',
  'suicidal thoughts, wanting to kill myself, self-harm, or immediate danger to life',
  'elderly care, senior meals, home delivery, transportation for older adults, aging parent, elderly mother, senior citizen services',
];

// Map descriptive labels back to short display names
const LABEL_TO_CATEGORY: Record<string, string> = {
  'paying rent, mortgage, eviction prevention, or emergency shelter and housing': 'Housing Assistance',
  'needing food, getting free food, food pantry, free groceries, meals, food stamps, SNAP, food bank, hungry, starving, no money for food, where to get food, feeding family, no food at home': 'Food Assistance',
  'therapy, counseling, psychiatrist, depression, anxiety, or mental health treatment, feeling depressed, feeling anxious, emotional support': 'Mental Health',
  'job search, resume help, career training, unemployment benefits, or employment': 'Employment Services',
  'free lawyer, legal aid, immigration attorney, court representation, or legal help': 'Legal Aid',
  'doctor, medical clinic, health insurance, prescription, or healthcare access': 'Healthcare',
  'suicidal thoughts, wanting to kill myself, self-harm, or immediate danger to life': 'Crisis Support',
  'elderly care, senior meals, home delivery, transportation for older adults, aging parent, elderly mother, senior citizen services': 'Senior Services',
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

// ─── Classification via HuggingFace ────────────────────────
async function classifyWithHF(text: string): Promise<Array<{ label: string; score: number }>> {
  if (!HF_API_KEY || HF_API_KEY === "hf_xxxxx") {
    return simulateClassification(text);
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: CANDIDATE_LABELS,
          multi_label: true,
        },
      }),
    });

    if (!response.ok) {
      console.error("HF API error:", response.status, await response.text());
      return simulateClassification(text);
    }

    const result = await response.json();

    // BART-large-MNLI zero-shot returns { labels: string[], scores: number[] }
    if (result.labels && result.scores) {
      return result.labels.map((label: string, i: number) => ({
        label: LABEL_TO_CATEGORY[label] || label,
        score: result.scores[i],
      }));
    }

    return simulateClassification(text);
  } catch (error) {
    console.error("Classification error:", error);
    return simulateClassification(text);
  }
}

// ─── Simulated Classification (fallback when HF API unavailable) ───
function simulateClassification(text: string): Array<{ label: string; score: number }> {
  const lower = text.toLowerCase();
  const results: Array<{ label: string; score: number }> = [];

  const labelKeywords: Record<string, string[]> = {
    "Housing Assistance": ["housing", "rent", "shelter", "homeless", "eviction", "apartment", "mortgage", "section 8"],
    "Food Assistance": ["food", "hungry", "groceries", "snap", "meals", "eat", "feeding", "food bank", "ebt", "starving"],
    "Mental Health": ["mental", "depression", "anxiety", "therapy", "counseling", "ptsd", "stress", "emotional", "depressed", "anxious", "feelings"],
    "Employment Services": ["job", "employment", "work", "unemployed", "training", "career", "fired", "laid off", "resume"],
    "Legal Aid": ["legal", "lawyer", "immigration", "court", "custody", "divorce", "deportation", "rights"],
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain", "medication", "insulin"],
    "Crisis Support": ["suicidal", "crisis", "self-harm", "kill myself", "emergency", "danger", "overdose", "distress"],
    "Senior Services": ["senior", "elderly", "aging", "medicare", "social security", "retirement", "old age", "grandparent", "elder"],
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
      score = 0.1 + Math.random() * 0.15;
    }

    results.push({ label, score: Math.round(score * 100) / 100 });
  }

  results.sort((a, b) => b.score - a.score);
  return results.filter((r) => r.score > 0.3);
}

// ─── Build resources for a category ───
function getResourcesForCategory(category: string, userLat?: number, userLng?: number) {
  const dbResources = RESOURCES_BY_CATEGORY[category] || [];
  return dbResources.map(r => {
    // Smart distance display
    let distance: string | null = null;
    if (userLat !== undefined && userLng !== undefined) {
      // User has geolocation — calculate distance from Houston center
      const miles = haversineMi(userLat, userLng, HOUSTON_LAT, HOUSTON_LNG);
      if (miles <= HOUSTON_METRO_RADIUS_MI) {
        // Local Houston — show address-based distance (approximate from center)
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

    // Validate optional geolocation
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

      // Also include Crisis Support resources
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

    // Layer 2: AI Classification
    const classifications = await classifyWithHF(text);

    // Layer 3: Confidence-gated response
    // Multi-need: show all categories ≥ 15%, max 5
    const MULTI_NEED_THRESHOLD = 0.15;
    const MAX_CATEGORIES = 5;
    let significantCategories = classifications
      .filter(c => c.score >= MULTI_NEED_THRESHOLD)
      .slice(0, MAX_CATEGORIES);

    // ── NEVER return empty categories ──
    // If BART returns 0 categories above threshold, broaden to top result
    // so the user always sees SOMETHING — even if confidence is low.
    if (significantCategories.length === 0 && classifications.length > 0) {
      // Take the top-scoring category regardless of threshold
      significantCategories = [classifications[0]];
    }

    const needsClarification = significantCategories.length > 0 && significantCategories[0].score < 0.5;

    // Build categories with resources attached
    const categoriesWithResources = significantCategories.map(c => ({
      label: c.label,
      confidence: Math.round(c.score * 100),
      resources: getResourcesForCategory(c.label, userLat, userLng),
      why: `Matched based on semantic analysis of your description.`,
      also: significantCategories.length > 1
        ? `You may also benefit from ${significantCategories.slice(1, 3).map(sc => sc.label).join(" and ")} services.`
        : undefined,
      warning: c.score < 0.70
        ? `${Math.round(c.score * 100)}% confidence — consider providing more detail for a better match`
        : undefined,
    }));

    // If even the broadened result is extremely low confidence, show clarification
    const noResults = categoriesWithResources.length === 0;

    return NextResponse.json({
      isCrisis: false,
      categories: categoriesWithResources,
      needsClarification: needsClarification || noResults,
      clarificationMessage: noResults
        ? "We couldn't match your description to a specific category. Could you tell us more about what you need help with?"
        : needsClarification
        ? "Your request scored below 50% — try providing more detail for better matches"
        : null,
      model: HF_API_KEY && HF_API_KEY !== "hf_xxxxx" ? "BART-large-MNLI (live)" : "BART-large-MNLI (simulated)",
      hasLocation: userLat !== undefined,
      outsideServiceArea: userLat !== undefined && isOutsideServiceArea(userLat, userLng!),
      serviceArea: 'Houston, TX metro area',
    });
  } catch (error) {
    console.error("Classification API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET Handler (health check) ────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ClearPath AI Classification API",
    version: "2.0.0",
    model: "facebook/bart-large-mnli",
    crisisDetection: "regex-based (deterministic)",
    labels: LABELS,
    resourceCount: HOUSTON_RESOURCES.length,
  });
}
