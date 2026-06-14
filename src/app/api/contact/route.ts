import { NextRequest, NextResponse } from "next/server";

// ─── Simple in-memory rate limiter: max 5 messages per minute per IP ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > 5;
}

// ─── Email format validation ───
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Required field validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email format validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Max length validation
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be 5000 characters or less" },
        { status: 400 }
      );
    }

    // Log the message with full details
    console.log(`[contact] New message received:`, {
      name,
      email,
      subject: subject || "(no subject)",
      message: message.substring(0, 200) + (message.length > 200 ? "..." : ""),
      timestamp: new Date().toISOString(),
      ip,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. It has been logged and our team will review it.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process your message" },
      { status: 500 }
    );
  }
}
