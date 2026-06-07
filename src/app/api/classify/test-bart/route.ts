import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// ─── DIRECT BART TEST ENDPOINT ────────────────────────────
// Makes REAL calls to HuggingFace and returns raw diagnostics.
// Tests: (1) basic DNS/connectivity, (2) raw fetch, (3) SDK.
// No fallback. No keyword matching. Pure diagnostics.

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

function extractErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { message: String(error), name: "Unknown", cause: null, stack: null };
  }
  // Node.js TypeError: fetch failed wraps the real cause in error.cause
  const cause = (error as any)?.cause;
  return {
    message: error.message,
    name: error.name,
    cause: cause ? {
      message: cause.message || String(cause),
      code: cause.code || null,
      name: cause.name || null,
      syscall: cause.syscall || null,
      hostname: cause.hostname || null,
      address: cause.address || null,
      port: cause.port || null,
    } : null,
    stack: error.stack?.split('\n').slice(0, 5).join('\n') || null,
  };
}

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
      steps: null,
    }, { status: 200 });
  }

  const steps: Record<string, unknown> = {};

  // ── Step 2: DNS/connectivity test — simple GET to huggingface.co ──
  const dnsStart = Date.now();
  try {
    const dnsResp = await fetch("https://huggingface.co", {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
    });
    steps.dnsTest = {
      status: "ok",
      httpStatus: dnsResp.status,
      elapsedMs: Date.now() - dnsStart,
    };
  } catch (dnsErr) {
    steps.dnsTest = {
      status: "FAIL",
      error: extractErrorDetails(dnsErr),
      elapsedMs: Date.now() - dnsStart,
    };
  }

  // ── Step 3: Raw fetch to HF Inference API ──
  const requestBody = {
    inputs: testText,
    parameters: {
      candidate_labels: testLabels,
      multi_label: false,
    },
  };

  const fetchStart = Date.now();
  try {
    console.log(`[test-bart] Raw fetch to ${HF_API_URL}`);
    console.log(`[test-bart] Key prefix: ${HF_API_KEY.substring(0, 6)}...`);

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000),
    });

    const elapsed = Date.now() - fetchStart;
    const responseText = await response.text();

    let parsedBody: unknown = null;
    try {
      parsedBody = JSON.parse(responseText);
    } catch {
      parsedBody = responseText;
    }

    steps.rawFetch = {
      status: response.ok ? "SUCCESS" : "FAIL",
      httpStatus: response.status,
      httpStatusText: response.statusText,
      elapsedMs: elapsed,
      responseBody: parsedBody,
    };
  } catch (fetchErr) {
    steps.rawFetch = {
      status: "FAIL",
      elapsedMs: Date.now() - fetchStart,
      error: extractErrorDetails(fetchErr),
    };
  }

  // ── Step 4: Try HfInference SDK ──
  const sdkStart = Date.now();
  try {
    console.log(`[test-bart] Trying HfInference SDK`);
    const hf = new HfInference(HF_API_KEY);

    const result = await hf.zeroShotClassification({
      model: HF_MODEL,
      inputs: testText,
      parameters: {
        candidate_labels: testLabels,
        multi_label: false,
      },
    });

    steps.sdkTest = {
      status: "SUCCESS",
      elapsedMs: Date.now() - sdkStart,
      result: result,
    };
  } catch (sdkErr) {
    steps.sdkTest = {
      status: "FAIL",
      elapsedMs: Date.now() - sdkStart,
      error: extractErrorDetails(sdkErr),
    };
  }

  // ── Final verdict ──
  const rawFetchOk = (steps.rawFetch as any)?.status === "SUCCESS";
  const sdkOk = (steps.sdkTest as any)?.status === "SUCCESS";
  const dnsOk = (steps.dnsTest as any)?.status === "ok";

  const overallStatus = rawFetchOk || sdkOk ? "SUCCESS" : "FAIL";
  const overallMessage = rawFetchOk
    ? "BART-large-MNLI is LIVE via raw fetch!"
    : sdkOk
    ? "BART-large-MNLI is LIVE via SDK (raw fetch failed)!"
    : dnsOk
    ? "DNS works but HF Inference API is unreachable — Vercel outbound issue or HF rate limit"
    : "Cannot reach huggingface.co at all — Vercel DNS/network issue";

  return NextResponse.json({
    status: overallStatus,
    message: overallMessage,
    keyCheck,
    steps,
  }, { status: 200 });
}
