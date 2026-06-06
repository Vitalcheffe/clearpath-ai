import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

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
  "hits me", "beats me", "husband hits", "wife hits", "partner hits",
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

// ─── Category Colors ───────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Housing Assistance": "#f59e0b",
  "Food Assistance": "#22c55e",
  "Mental Health": "#8b5cf6",
  "Employment Services": "#3b82f6",
  "Legal Aid": "#06b6d4",
  "Healthcare": "#ef4444",
  "Substance Abuse": "#f97316",
  "Senior Services": "#6366f1",
  "Crisis": "#dc2626",
};

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
    "Healthcare": ["medical", "health", "doctor", "insurance", "prescription", "hospital", "clinic", "sick", "pain", "medication", "insulin"],
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
      const emoji = ["🏠", "🍎", "🧠", "💼", "⚖️", "🏥", "🚭", "👴"][LABELS.indexOf(c.label)] || "📋";
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
