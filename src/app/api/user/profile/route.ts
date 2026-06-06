import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireSameUser, getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/user/profile — Get user profile with settings and stats
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

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        userSettings: true,
        _count: {
          select: {
            conversations: true,
            savedResources: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const conversations = await db.conversation.findMany({
      where: { userId },
      select: { confidence: true, isCrisis: true, category: true },
    });

    const avgConfidence = conversations.length > 0
      ? Math.round(conversations.reduce((sum, c) => sum + c.confidence, 0) / conversations.length)
      : 0;

    const crisisCount = conversations.filter(c => c.isCrisis).length;

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      phone: user.phone,
      location: user.location,
      language: user.language,
      plan: user.plan,
      hearAbout: user.hearAbout,
      interests: user.interests,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      settings: user.userSettings,
      stats: {
        totalConversations: user._count.conversations,
        totalResources: user._count.savedResources,
        avgConfidence,
        crisisCount,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile — Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, email, username, location, language, phone, image, plan, hearAbout, interests, currentPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    // Verify user exists
    const existingUser = await db.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If email is being changed, check uniqueness
    if (email && email !== existingUser.email) {
      const emailTaken = await db.user.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    // If username is being changed, check uniqueness
    if (username && username !== existingUser.username) {
      const usernameTaken = await db.user.findUnique({ where: { username } });
      if (usernameTaken) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }
    }

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (location !== undefined) updateData.location = location;
    if (language !== undefined) updateData.language = language;
    if (image !== undefined) updateData.image = image;
    if (plan !== undefined) updateData.plan = plan;
    if (hearAbout !== undefined) updateData.hearAbout = hearAbout;
    if (interests !== undefined) updateData.interests = interests;

    if (phone !== undefined) updateData.phone = phone;
    if (image !== undefined) updateData.image = image;

    // Handle password change
    if (currentPassword && newPassword) {
      const existingUserData = await db.user.findUnique({ where: { id: userId } });
      if (!existingUserData?.password) {
        return NextResponse.json(
          { error: "No password set for this account. Use OAuth instead." },
          { status: 400 }
        );
      }
      const passwordMatch = await bcrypt.compare(currentPassword, existingUserData.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      image: updatedUser.image,
      phone: updatedUser.phone,
      location: updatedUser.location,
      language: updatedUser.language,
      plan: updatedUser.plan,
      hearAbout: updatedUser.hearAbout,
      interests: updatedUser.interests,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
