import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth-helpers";

// DELETE /api/saved-resources/[id] — Delete a saved resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);

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

    // Verify the authenticated user owns this resource
    if (resource.userId && resource.userId !== sessionUserId) {
      return NextResponse.json(
        { error: "You can only delete your own saved resources" },
        { status: 403 }
      );
    }

    // Must be authenticated to delete
    if (!sessionUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
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
