import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Get the authenticated user ID from the session, or null if not authenticated
export async function getAuthenticatedUserId(request?: NextRequest): Promise<string | null> {
  try {
    const session = await getServerSession();
    return (session as any)?.user?.id || null;
  } catch {
    return null;
  }
}

// Verify that the user is authenticated
// Returns an error response if not authenticated, or null if auth passes
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const sessionUserId = await getAuthenticatedUserId(request);
  if (!sessionUserId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  return null; // Auth passed
}

// Verify that the userId parameter matches the authenticated session
export async function requireSameUser(request: NextRequest, userId: string): Promise<NextResponse | null> {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const sessionUserId = await getAuthenticatedUserId(request);
  if (sessionUserId !== userId) {
    return NextResponse.json(
      { error: "You can only access your own data" },
      { status: 403 }
    );
  }
  return null; // Auth passed
}
