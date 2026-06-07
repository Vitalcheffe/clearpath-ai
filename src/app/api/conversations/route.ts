import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/conversations — list conversations, optionally filtered
// Query params: userId, search, category, skip, take
// Graceful auth: if authenticated, use session userId; if not, return empty (guest mode)
export async function GET(request: NextRequest) {
  try {
    const sessionUserId = await getAuthenticatedUserId(request);

    // If not authenticated, return empty list for guest mode
    if (!sessionUserId) {
      return NextResponse.json({
        conversations: [],
        total: 0,
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "0", 10);

    // Always use the authenticated session userId (ignore query param)
    const where: Record<string, unknown> = { userId: sessionUserId };
    if (category && category !== "all") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { preview: { contains: search } },
        { category: { contains: search } },
      ];
    }

    let conversations: Array<Record<string, unknown>> = [];
    let total = 0;

    try {
      conversations = await db.conversation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: skip > 0 ? skip : undefined,
        take: take > 0 ? take : undefined,
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
      });

      // Also get total count for pagination
      total = await db.conversation.count({ where });
    } catch (dbError) {
      console.error("DB query failed (conversations):", dbError);
      // Return empty — never crash the app for a DB issue
    }

    const mapped = conversations.map((c: Record<string, unknown>) => {
      let topResource: string | null = null;
      const messages = (c.messages as Array<Record<string, unknown>>) || [];
      for (const msg of messages) {
        if (msg.role === "ai" && msg.resources) {
          try {
            const resources = JSON.parse(msg.resources as string);
            if (Array.isArray(resources) && resources.length > 0) {
              topResource = typeof resources[0] === "string" ? resources[0] : resources[0]?.title || resources[0]?.name || null;
            }
          } catch {
            if ((msg.resources as string).trim()) {
              topResource = (msg.resources as string).split("\n")[0] || null;
            }
          }
          break;
        }
      }

      return {
        id: c.id,
        title: c.title,
        preview: c.preview,
        category: c.category,
        categoryColor: c.categoryColor,
        confidence: c.confidence,
        isCrisis: c.isCrisis,
        topResource,
        createdAt: (c.createdAt as Date).toISOString(),
        updatedAt: (c.updatedAt as Date).toISOString(),
      };
    });

    return NextResponse.json({
      conversations: mapped,
      total,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({
      conversations: [],
      total: 0,
    });
  }
}

// POST /api/conversations — create a new conversation
// Graceful auth: if authenticated, use session userId; if not, allow guest creation
export async function POST(request: NextRequest) {
  try {
    const sessionUserId = await getAuthenticatedUserId(request);
    const body = await request.json();
    const { title, preview, category, categoryColor, confidence, isCrisis, userId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // If authenticated, always use session userId (ignore the one from body)
    const effectiveUserId = sessionUserId || userId || null;

    let conversation: Record<string, unknown> | null = null;
    try {
      conversation = await db.conversation.create({
        data: {
          title,
          preview: preview || title,
          category: category || null,
          categoryColor: categoryColor || null,
          confidence: confidence || 0,
          isCrisis: isCrisis || false,
          isGuest: !effectiveUserId,
          userId: effectiveUserId,
        },
      });
    } catch (dbError) {
      console.error("DB create failed (conversations):", dbError);
      return NextResponse.json({
        id: null,
        title,
        preview: preview || title,
        category,
        categoryColor,
        confidence: confidence || 0,
        isCrisis: isCrisis || false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      id: (conversation as Record<string, unknown>).id,
      title: (conversation as Record<string, unknown>).title,
      preview: (conversation as Record<string, unknown>).preview,
      category: (conversation as Record<string, unknown>).category,
      categoryColor: (conversation as Record<string, unknown>).categoryColor,
      confidence: (conversation as Record<string, unknown>).confidence,
      isCrisis: (conversation as Record<string, unknown>).isCrisis,
      createdAt: ((conversation as Record<string, unknown>).createdAt as Date).toISOString(),
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
