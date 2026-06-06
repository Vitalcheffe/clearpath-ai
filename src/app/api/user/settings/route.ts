import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSameUser } from "@/lib/auth-helpers";

// GET /api/user/settings — Get user settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    const settings = await db.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get user settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/settings — Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...settingsFields } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    // Verify settings exist
    const existingSettings = await db.userSettings.findUnique({
      where: { userId },
    });

    if (!existingSettings) {
      // Create settings if they don't exist
      const newSettings = await db.userSettings.create({
        data: {
          userId,
          ...settingsFields,
        },
      });
      return NextResponse.json(newSettings);
    }

    // Filter out non-settings fields (only allow known UserSettings fields)
    const allowedFields = [
      "language", "theme", "zipCode", "confidenceThreshold", "defaultCategory",
      "autoClarification", "distanceUnit", "notificationSound", "dataRetention",
      "shareUsage", "sessionTimeout", "ipMasking", "doNotTrack",
      "blockThirdPartyCookies", "twoFactor", "emailNotifs", "resourceUpdates",
      "newFeatures", "weeklySummary", "largeText", "highContrast", "screenReader",
      "reducedMotion", "fontSize", "density", "sidebarPosition", "animationSpeed",
      "autoDelete", "downloadFormat", "developerMode", "debugLogging",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (settingsFields[field] !== undefined) {
        updateData[field] = settingsFields[field];
      }
    }

    const updatedSettings = await db.userSettings.update({
      where: { userId },
      data: updateData,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Update user settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
