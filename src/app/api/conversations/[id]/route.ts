import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/conversations/[id] — Delete a conversation and its messages
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
