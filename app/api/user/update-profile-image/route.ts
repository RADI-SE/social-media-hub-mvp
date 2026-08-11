import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Forward to Clerk's API
        const clerkFormData = new FormData();
        clerkFormData.append("file", file, file.name);

        const clerk = createClerkClient({
            secretKey: process.env.CLERK_SECRET_KEY!,
        });

        const response = await fetch(
            `https://api.clerk.com/v1/users/${userId}/profile_image`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                },
                body: clerkFormData,
            }
        );

        // Parse Clerk's response – it may be JSON or text
        let clerkData;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            clerkData = await response.json();
        } else {
            // Fallback: read as text
            const text = await response.text();
            clerkData = { error: text || "Unknown error" };
        }

        if (!response.ok) {
            const clerkError = clerkData.errors?.[0];
            let errorMessage = clerkError?.message || "Upload failed";

            if (clerkError?.code === "unsupported_image_type") {
                errorMessage = "Unsupported image type. Please upload a JPEG, PNG, GIF, or WebP.";
            } else if (clerkError?.code === "image_too_large") {
                errorMessage = "Image is too large. Maximum size is 10 MB.";
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Profile image upload error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `https://api.clerk.com/v1/users/${userId}/profile_image`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                },
            }
        );

        let clerkData;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            clerkData = await response.json();
        } else {
            const text = await response.text();
            clerkData = { error: text || "Unknown error" };
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: clerkData.error || "Remove failed" },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Profile image remove error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}