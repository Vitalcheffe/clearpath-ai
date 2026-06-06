import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/conversations/[id] — Get conversation with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);

    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // If conversation belongs to a user, verify the session user owns it
    if (conversation.userId && conversation.userId !== sessionUserId) {
      return NextResponse.json(
        { error: "You can only access your own conversations" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      preview: conversation.preview,
      category: conversation.category,
      categoryColor: conversation.categoryColor,
      confidence: conversation.confidence,
      isCrisis: conversation.isCrisis,
      isGuest: conversation.isGuest,
      userId: conversation.userId,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messages: conversation.messages.map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
        category: m.category,
        confidence: m.confidence,
        isCrisis: m.isCrisis,
        resources: m.resources ? (() => {
          try { return JSON.parse(m.resources); } catch { return m.resources; }
        })() : null,
        alternatives: m.alternatives ? (() => {
          try { return JSON.parse(m.alternatives); } catch { return m.alternatives; }
        })() : null,
        why: m.why,
        also: m.also,
        warning: m.warning,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] — Delete a conversation and its messages
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);

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

    // If conversation belongs to a user, verify the session user owns it
    if (conversation.userId && conversation.userId !== sessionUserId) {
      return NextResponse.json(
        { error: "You can only delete your own conversations" },
        { status: 403 }
      );
    }

    // Delete all messages first (cascade should handle this, but be explicit)
    await db.message.deleteMany({
      where: { conversationId: id },
    });

    // Delete the conversation
    await db.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
