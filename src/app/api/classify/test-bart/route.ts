import { NextResponse } from "next/server";

// ─── DIRECT BART TEST ENDPOINT ────────────────────────────
// This makes a REAL call to HuggingFace and returns the raw result.
// No fallback. No keyword matching. Pure BART or error.
// Use this to verify BART is actually reaching HuggingFace.

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

export async function GET() {
  const testText = "I need help paying my rent this month";
  const testLabels = [
    "rent, mortgage, eviction, housing assistance",
    "needing food, food pantry, SNAP, hungry",
    "therapy, counseling, depression, anxiety, mental health",
  ];

  // ── Step 1: Check key ──
  const keyCheck = {
    keyPresent: !!HF_API_KEY,
    keyPrefix: HF_API_KEY ? HF_API_KEY.substring(0, 6) + '...' : 'NONE',
    keyLength: HF_API_KEY?.length ?? 0,
    keyNotPlaceholder: HF_API_KEY !== "hf_xxxxx",
  };

  if (!HF_API_KEY || HF_API_KEY === "hf_xxxxx") {
    return NextResponse.json({
      status: "FAIL",
      message: "HUGGINGFACE_API_KEY is not configured or is placeholder",
      keyCheck,
      testResult: null,
    }, { status: 200 });
  }

  // ── Step 2: Make the ACTUAL fetch call ──
  const requestBody = {
    inputs: testText,
    parameters: {
      candidate_labels: testLabels,
      multi_label: false,
    },
  };

  const startTime = Date.now();

  try {
    console.log(`[test-bart] Making REAL fetch to ${HF_API_URL}`);
    console.log(`[test-bart] Key prefix: ${HF_API_KEY.substring(0, 6)}...`);

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const elapsed = Date.now() - startTime;
    const responseText = await response.text();

    let parsedBody: unknown = null;
    try {
      parsedBody = JSON.parse(responseText);
    } catch {
      parsedBody = responseText;
    }

    return NextResponse.json({
      status: response.ok ? "SUCCESS" : "FAIL",
      message: response.ok
        ? "BART-large-MNLI is LIVE and responding!"
        : `HuggingFace returned HTTP ${response.status}`,
      keyCheck,
      request: {
        url: HF_API_URL,
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY.substring(0, 6)}...`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      },
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        elapsedMs: elapsed,
        body: parsedBody,
      },
    }, { status: 200 });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    return NextResponse.json({
      status: "FAIL",
      message: "Fetch to HuggingFace threw an error",
      keyCheck,
      request: {
        url: HF_API_URL,
        method: "POST",
      },
      error: {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        elapsedMs: elapsed,
      },
    }, { status: 200 });
  }
}
