import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/user/stats — Get user stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Return empty/guest stats
      return NextResponse.json({
        totalConversations: 0,
        totalResources: 0,
        avgConfidence: 0,
        crisisCount: 0,
        categoryBreakdown: [],
        weeklyActivity: [],
        monthlyTrend: [],
      });
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Total conversations
    const totalConversations = await db.conversation.count({
      where: { userId },
    });

    // Total saved resources
    const totalResources = await db.savedResource.count({
      where: { userId },
    });

    // Average confidence across conversations
    const conversations = await db.conversation.findMany({
      where: { userId },
      select: { confidence: true, category: true, isCrisis: true, createdAt: true },
    });

    const avgConfidence = conversations.length > 0
      ? Math.round(conversations.reduce((sum, c) => sum + c.confidence, 0) / conversations.length)
      : 0;

    // Crisis count
    const crisisCount = conversations.filter(c => c.isCrisis).length;

    // Category breakdown (top 5 with percentages)
    const categoryMap = new Map<string, number>();
    for (const conv of conversations) {
      if (conv.category) {
        categoryMap.set(conv.category, (categoryMap.get(conv.category) || 0) + 1);
      }
    }
    const sortedCategories = [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const categoryBreakdown = sortedCategories.map(([category, count]) => ({
      category,
      count,
      percentage: conversations.length > 0 ? Math.round((count / conversations.length) * 100) : 0,
    }));

    // Weekly activity (last 7 days)
    const now = new Date();
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

      const count = conversations.filter(c => {
        const created = new Date(c.createdAt);
        return created >= dayStart && created < dayEnd;
      }).length;

      weeklyActivity.push({
        date: dayStart.toISOString().split("T")[0],
        day: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        count,
      });
    }

    // Monthly trend (last 4 weeks)
    const monthlyTrend = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const count = conversations.filter(c => {
        const created = new Date(c.createdAt);
        return created >= weekStart && created < weekEnd;
      }).length;

      monthlyTrend.push({
        week: `Week ${4 - i}`,
        startDate: weekStart.toISOString().split("T")[0],
        count,
      });
    }

    return NextResponse.json({
      totalConversations,
      totalResources,
      avgConfidence,
      crisisCount,
      categoryBreakdown,
      weeklyActivity,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
