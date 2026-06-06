import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/community-resources — List community resources, optionally filtered by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { services: { contains: search } },
      ];
    }

    const resources = await db.resource.findMany({
      where,
      orderBy: { name: "asc" },
    });

    // Get unique categories for filtering
    const categories = await db.resource.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return NextResponse.json({
      resources,
      categories: categories.map((c) => c.category),
    });
  } catch (error) {
    console.error("Error fetching community resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
