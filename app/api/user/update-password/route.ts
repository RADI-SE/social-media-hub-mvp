import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type PasswordRequest = {
  currentPassword?: unknown;
  newPassword?: unknown;
};

type ClerkErrorLike = {
  errors?: Array<{
    code?: string;
  }>;
};

function clerkErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  return (error as ClerkErrorLike).errors?.[0]?.code;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: PasswordRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = body;
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing current or new password" },
        { status: 400 },
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing current or new password" },
        { status: 400 },
      );
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        {
          error:
            "Your new password must be different from the current password",
        },
        { status: 400 },
      );
    }

    if (
      newPassword.length < 8 ||
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      return NextResponse.json(
        {
          error:
            "Use at least 8 characters with uppercase, lowercase, and a number",
        },
        { status: 400 },
      );
    }

    const client = await clerkClient();

    // Clerk throws `incorrect_password` when verification fails. The password
    // must not be updated until this call succeeds.
    await client.users.verifyPassword({
      userId,
      password: currentPassword,
    });

    await client.users.updateUser(userId, {
      password: newPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Password update API error:", error);
    const code = clerkErrorCode(error);

    if (code === "incorrect_password" || code === "form_password_incorrect") {
      return NextResponse.json(
        {
          error: "Current password is incorrect",
          code: "form_password_incorrect",
        },
        { status: 400 },
      );
    }

    if (code === "additional_verification_required") {
      return NextResponse.json(
        { error: "Additional verification required", code },
        { status: 403 },
      );
    }

    if (code?.includes("password")) {
      return NextResponse.json(
        {
          error: "The new password does not meet the security requirements",
          code,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: "Could not update password" },
      { status: 500 },
    );
  }
}
