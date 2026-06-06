import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE /api/saved-resources/[id] — Delete a saved resource
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify resource exists
    const resource = await db.savedResource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Saved resource not found" },
        { status: 404 }
      );
    }

    await db.savedResource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Resource deleted" });
  } catch (error) {
    console.error("Delete saved resource error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
