import { createClerkClient } from "@clerk/backend";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the authenticated user ID from the request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing current or new password" },
        { status: 400 },
      );
    }

    // Initialize Clerk client with your secret key
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // 1. Verify the current password
    const verification = await clerkClient.users.verifyPassword({
      userId,
      password: currentPassword,
    });

    if (!verification.verified) {
      return NextResponse.json(
        {
          error: "Current password is incorrect",
          code: "form_password_incorrect",
        },
        { status: 400 },
      );
    }

    // 2. Update to the new password
    await clerkClient.users.updateUser(userId, {
      password: newPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Password update API error:", error);

    // Handle Clerk-specific errors
    const clerkError = error.errors?.[0];
    if (clerkError?.code === "form_password_incorrect") {
      return NextResponse.json(
        {
          error: "Current password is incorrect",
          code: "form_password_incorrect",
        },
        { status: 400 },
      );
    }
    if (clerkError?.code === "additional_verification_required") {
      return NextResponse.json(
        {
          error: "Additional verification required",
          code: "additional_verification_required",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { error: "Could not update password" },
      { status: 500 },
    );
  }
}
