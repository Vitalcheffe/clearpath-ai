import { NextRequest, NextResponse } from "next/server";

// ─── Configuration ─────────────────────────────────────────
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

// ─── Crisis Keywords (hardcoded, deterministic) ────────────
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", "can't take this anymore",
  "want it all to end", "no reason to live", "better off dead", "hurt myself",
  "self-harm", "overdose", "jump off", "slit my", "hang myself",
  "end it all", "give up on life", "not worth living", "suicidal",
  "thinking about death", "don't want to be alive", "take my own life",
  "domestic violence", "being abused", "raped", "sexual assault",
  "child abuse", "human trafficking", "help me escape",
];

// ─── Classification Labels ─────────────────────────────────
const LABELS = [
  "Housing Assistance",
  "Food Assistance",
  "Mental Health",
  "Employment Services",
  "Legal Aid",
  "Healthcare",
  "Substance Abuse",
  "Senior Services",
];

// ─── Crisis Detection ──────────────────────────────────────
function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
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
          candidate_labels: LABELS,
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
        label,
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
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain"],
    "Substance Abuse": ["addiction", "drugs", "alcohol", "rehab", "detox", "sober", "overdose", "substance"],
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

// ─── POST Handler ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    // Layer 1: Crisis Detection (hardcoded, deterministic)
    if (detectCrisis(text)) {
      return NextResponse.json({
        isCrisis: true,
        crisisLines: [
          { name: "988 Suicide & Crisis Lifeline", action: "Free. Confidential. 24/7.", call: "988" },
          { name: "Crisis Text Line", action: "Text HOME to 741741", call: "Text" },
          { name: "Local Crisis Center", action: "Talk to a real person now", call: "211" },
        ],
        categories: [],
        note: "Crisis keyword detected — AI classification bypassed entirely",
      });
    }

    // Layer 2: AI Classification
    const classifications = await classifyWithHF(text);

    // Layer 3: Confidence-gated response
    const topResult = classifications[0];
    const needsClarification = topResult && topResult.score < 0.5;

    return NextResponse.json({
      isCrisis: false,
      categories: classifications.map((c) => ({
        label: c.label,
        confidence: Math.round(c.score * 100),
      })),
      needsClarification,
      clarificationMessage: needsClarification
        ? "Your request scored below 50% across all categories — too ambiguous for reliable matching"
        : null,
      model: HF_API_KEY && HF_API_KEY !== "hf_xxxxx" ? "BART-large-MNLI (live)" : "BART-large-MNLI (simulated)",
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
    crisisDetection: "hardcoded (deterministic)",
    labels: LABELS,
  });
}
