import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

// ─── Configuration ─────────────────────────────────────────
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// ─── Crisis Detection (regex-based, deterministic, AI NEVER trusted for crisis) ───
// Uses regex patterns for robust matching — handles case, spacing, punctuation.
// Crisis check runs BEFORE any HuggingFace API call.
const CRISIS_PATTERNS = [
  // ─── Suicidal ideation ───
  /suicid/i,
  /kill\s+myself/i,
  /end\s+it\s+all/i,
  /end\s+my\s+life/i,
  /end\s+it\b/i,
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

  // ─── Medical emergency — "I'm dying" only when standalone, NOT "I'm dying for a coffee" ───
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
// Each label includes the most common user-facing terms so the model can
// directly match "hungry" → "food bank", "lawyer" → "legal aid", etc.
const CANDIDATE_LABELS = [
  'paying rent, mortgage, eviction prevention, or emergency shelter and housing',
  'needing food, getting free food, food pantry, free groceries, meals, food stamps, SNAP, food bank, hungry, starving, no money for food, where to get food, feeding family, no food at home',
  'therapy, counseling, psychiatrist, depression, anxiety, or mental health treatment',
  'job search, resume help, career training, unemployment benefits, or employment',
  'free lawyer, legal aid, immigration attorney, court representation, or legal help',
  'doctor, medical clinic, health insurance, prescription, or healthcare access',
  'suicidal thoughts, wanting to kill myself, self-harm, or immediate danger to life',
  'elderly care, senior meals, home delivery, transportation for older adults',
];

// Map descriptive labels back to short display names for the UI
const LABEL_TO_CATEGORY: Record<string, string> = {
  'paying rent, mortgage, eviction prevention, or emergency shelter and housing': 'Housing Assistance',
  'needing food, getting free food, food pantry, free groceries, meals, food stamps, SNAP, food bank, hungry, starving, no money for food, where to get food, feeding family, no food at home': 'Food Assistance',
  'therapy, counseling, psychiatrist, depression, anxiety, or mental health treatment': 'Mental Health',
  'job search, resume help, career training, unemployment benefits, or employment': 'Employment Services',
  'free lawyer, legal aid, immigration attorney, court representation, or legal help': 'Legal Aid',
  'doctor, medical clinic, health insurance, prescription, or healthcare access': 'Healthcare',
  'suicidal thoughts, wanting to kill myself, self-harm, or immediate danger to life': 'Crisis Support',
  'elderly care, senior meals, home delivery, transportation for older adults': 'Senior Services',
};

// Short labels for display/color mapping
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

// ─── Crisis Detection ──────────────────────────────────────
function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some(pattern => pattern.test(text));
}

// ─── Classification via HuggingFace ────────────────────────
async function classifyWithHF(text: string): Promise<Array<{ label: string; score: number }>> {
  if (!HF_API_KEY || HF_API_KEY === "hf_xxxxx") {
    // Fallback: return simulated classification for demo
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
        label: LABEL_TO_CATEGORY[label] || label,  // Map back to short name
        score: result.scores[i],
      }));
    }

    return simulateClassification(text);
  } catch (error) {
    console.error("Classification error:", error);
    return simulateClassification(text);
  }
}

// ─── Simulated Classification (fallback for demo) ──────────
function simulateClassification(text: string): Array<{ label: string; score: number }> {
  const lower = text.toLowerCase();
  const results: Array<{ label: string; score: number }> = [];

  const labelKeywords: Record<string, string[]> = {
    "Housing Assistance": ["housing", "rent", "shelter", "homeless", "eviction", "apartment", "mortgage", "section 8", "home"],
    "Food Assistance": ["food", "hungry", "groceries", "snap", "meals", "eat", "feeding", "food bank", "ebt"],
    "Mental Health": ["mental", "depression", "anxiety", "therapy", "counseling", "ptsd", "stress", "emotional", "feelings", "emotions", "mood"],
    "Employment Services": ["job", "employment", "work", "unemployed", "training", "career", "fired", "laid off", "resume", "workforce"],
    "Legal Aid": ["legal", "lawyer", "immigration", "court", "custody", "divorce", "deportation", "rights"],
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain", "medication", "insulin"],
    "Crisis Support": ["suicidal", "crisis", "self-harm", "kill myself", "emergency", "danger", "overdose", "distress"],
    "Senior Services": ["senior", "elderly", "aging", "medicare", "social security", "retirement", "old age", "grandparent"],
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

// ─── HAVERSINE DISTANCE + SMART DISPLAY ───
// Houston, TX city center coordinates (service area reference point)
const HOUSTON_LAT = 29.7604;
const HOUSTON_LNG = -95.3698;
const HOUSTON_METRO_RADIUS_MI = 25;  // Approximate Houston metro radius

const EARTH_RADIUS_MI = 3958.8;

function haversineMi(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MI * c;
}

/**
 * Returns a smart distance display string.
 * - < 25 mi: "X.X mi" (local Houston)
 * - 25-100 mi: "X mi (outside Houston metro)" (regional)
 * - > 100 mi: "📍 Houston, TX" (far away, show city only)
 * - No location: null (don't show distance at all)
 */
function formatSmartDistance(userLat: number, userLng: number, resourceLat: number | null, resourceLng: number | null): string | null {
  if (resourceLat === null || resourceLng === null) return null;  // Phone/text-only service

  const miles = haversineMi(userLat, userLng, resourceLat, resourceLng);

  if (miles <= HOUSTON_METRO_RADIUS_MI) {
    return `${miles.toFixed(1)} mi`;
  } else if (miles <= 100) {
    return `${Math.round(miles)} mi (outside Houston metro)`;
  } else {
    return '📍 Houston, TX';
  }
}

/**
 * Check if user is outside the Houston service area (> 100 mi from city center)
 */
function isOutsideServiceArea(userLat: number, userLng: number): boolean {
  return haversineMi(userLat, userLng, HOUSTON_LAT, HOUSTON_LNG) > 100;
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

    // Get authenticated user (if any)
    let userId: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch {
      // No session — guest user
    }

    // Layer 1: Crisis Detection (hardcoded, deterministic)
    const isCrisis = detectCrisis(text);

    if (isCrisis) {
      const crisisLines = [
        { name: "988 Suicide & Crisis Lifeline", action: "Free. Confidential. 24/7.", call: "988" },
        { name: "Crisis Text Line", action: "Text HOME to 741741", call: "Text" },
        { name: "National Domestic Violence Hotline", action: "1-800-799-7233", call: "1-800-799-7233" },
        { name: "Local Crisis Center", action: "Talk to a real person now", call: "211" },
      ];

      // Save conversation to database
      const conversation = await db.conversation.create({
        data: {
          userId: userId || null,
          title: "Crisis: Immediate Support Needed",
          preview: text.substring(0, 100),
          category: "Crisis",
          categoryColor: CATEGORY_COLORS["Crisis"],
          confidence: 99,
          isCrisis: true,
          isGuest: !userId,
        },
      });

      // Save user message
      await db.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          text,
          isCrisis: true,
        },
      });

      // Save AI response
      const aiResponseText = "🚨 **Your safety is the top priority right now.**\n\nIf you are in immediate danger, please call **911**.\n\nHere are crisis resources available 24/7:\n\n📞 **988 Suicide & Crisis Lifeline** — Call or text 988\n📞 **Crisis Text Line** — Text HOME to 741741\n📞 **National Domestic Violence Hotline** — 1-800-799-7233\n📞 **211** — Local crisis center connections";
      await db.message.create({
        data: {
          conversationId: conversation.id,
          role: "ai",
          text: aiResponseText,
          category: "Crisis",
          confidence: 99,
          isCrisis: true,
          resources: JSON.stringify(crisisLines.map(l => ({ title: l.name, action: l.action, call: l.call }))),
          why: "Crisis keyword detected — immediate safety resources provided.",
          warning: "If you are in immediate physical danger, call 911.",
        },
      });

      return NextResponse.json({
        isCrisis: true,
        conversationId: conversation.id,
        crisisLines,
        categories: [],
        note: "Crisis keyword detected — AI classification bypassed entirely",
      });
    }

    // Layer 2: AI Classification
    const classifications = await classifyWithHF(text);

    // Layer 3: Confidence-gated response
    const topResult = classifications[0];
    const needsClarification = topResult && topResult.score < 0.5;

    // Determine top category for conversation
    const topCategory = topResult?.label || "General";
    const topConfidence = topResult ? Math.round(topResult.score * 100) : 0;

    // Build AI response text
    let aiText = "";
    const resources: Array<{ title: string; action: string; call?: string }> = [];
    let whyText = "";
    let alsoText = "";
    let warningText: string | null = null;

    if (needsClarification) {
      aiText = `Your request scored below 50% across all categories — it may be too ambiguous for reliable matching. Here are the closest matches:\n\n`;
    } else {
      aiText = `Based on what you've shared, here's what I found:\n\n`;
    }

    for (let i = 0; i < Math.min(classifications.length, 3); i++) {
      const c = classifications[i];
      const emoji = ["🏠", "🍎", "🧠", "💼", "⚖️", "🏥", "🚨", "👴"][LABELS.indexOf(c.label)] || "📋";
      const confPct = Math.round(c.score * 100);
      aiText += `${emoji} **${c.label}** (${confPct}% confidence)\n`;
    }

    // Build why/also/warning
    whyText = `Your description was classified as ${topCategory} based on keyword analysis and semantic matching.`;
    if (classifications.length > 1) {
      alsoText = `You may also benefit from ${classifications.slice(1, 3).map(c => c.label).join(" and ")} services.`;
    }
    if (topConfidence < 70) {
      warningText = "The confidence score is below 70% — consider providing more details for a better match.";
    }

    // Save conversation to database
    const conversation = await db.conversation.create({
      data: {
        userId: userId || null,
        title: text.substring(0, 60) + (text.length > 60 ? "..." : ""),
        preview: text.substring(0, 100),
        category: topCategory,
        categoryColor: CATEGORY_COLORS[topCategory] || "#6b7280",
        confidence: topConfidence,
        isCrisis: false,
        isGuest: !userId,
      },
    });

    // Save user message
    await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        text,
      },
    });

    // Save AI response
    await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "ai",
        text: aiText,
        category: topCategory,
        confidence: topConfidence,
        isCrisis: false,
        resources: resources.length > 0 ? JSON.stringify(resources) : null,
        alternatives: classifications.length > 1
          ? JSON.stringify(classifications.slice(1).map(c => ({ label: c.label, confidence: Math.round(c.score * 100) })))
          : null,
        why: whyText,
        also: alsoText || null,
        warning: warningText,
      },
    });

    return NextResponse.json({
      isCrisis: false,
      conversationId: conversation.id,
      categories: classifications.map((c) => ({
        label: c.label,
        confidence: Math.round(c.score * 100),
      })),
      needsClarification,
      clarificationMessage: needsClarification
        ? "Your request scored below 50% across all categories — too ambiguous for reliable matching"
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
    version: "1.0.0",
    model: "facebook/bart-large-mnli",
    crisisDetection: "regex-based (deterministic)",
    labels: LABELS,
  });
}
