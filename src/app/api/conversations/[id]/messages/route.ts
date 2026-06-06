import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/conversations/[id]/messages — add a message to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, text, category, confidence, isCrisis, resources, why, also, warning, alternatives } = body;

    if (!role || !text) {
      return NextResponse.json(
        { error: "Role and text are required" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await db.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const message = await db.message.create({
      data: {
        conversationId: id,
        role,
        text,
        category: category || null,
        confidence: confidence || null,
        isCrisis: isCrisis || false,
        resources: resources ? JSON.stringify(resources) : null,
        alternatives: alternatives ? JSON.stringify(alternatives) : null,
        why: why || null,
        also: also || null,
        warning: warning || null,
      },
    });

    // Update conversation's updatedAt
    await db.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      id: message.id,
      role: message.role,
      text: message.text,
      category: message.category,
      confidence: message.confidence,
      isCrisis: message.isCrisis,
      createdAt: message.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
