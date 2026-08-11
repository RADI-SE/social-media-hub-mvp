import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
     const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

     let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
 
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    }); 
    let user;
    try {
      user = await clerk.users.getUser(userId);
    } catch {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
 
    if (!user.passwordEnabled) {
      return NextResponse.json(
        { 
          error: "This account does not have a password set. Use your social login provider to delete it." 
        },
        { status: 400 }
      );
    }
 
    try {
      const isValid = await clerk.users.verifyPassword({
        userId,
        password,
      });

      if (!isValid) {
        return NextResponse.json(
          { 
            code: "form_password_incorrect",
            error: "Current password is incorrect." 
          },
          { status: 400 }
        );
      }
    } catch (err: any) { 
      return NextResponse.json(
        { 
          code: "form_password_incorrect",
          error: "Current password is incorrect." 
        },
        { status: 400 }
      );
    }
 
    try {
      await clerk.users.deleteUser(userId);
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      return NextResponse.json(
        { error: "Failed to delete account. Please try again later." },
        { status: 500 }
      );
    }

 
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}