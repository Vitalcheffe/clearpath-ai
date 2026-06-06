import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/saved-resources — Save a resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, category, categoryColor, confidence, verifiedDate, action, detail } = body;

    if (!userId || !title || !category) {
      return NextResponse.json(
        { error: "userId, title, and category are required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const resource = await db.savedResource.create({
      data: {
        userId,
        title,
        category,
        categoryColor: categoryColor || "#3b82f6",
        confidence: confidence ?? 0,
        verifiedDate: verifiedDate || null,
        action: action || null,
        detail: detail || null,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Save resource error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/saved-resources — Get saved resources for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([]);
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const resources = await db.savedResource.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Get saved resources error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
