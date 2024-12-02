import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Replace this with actual database check
    // For now, we'll simulate profile status:
    // - exists: true if user has started their profile
    // - completed: true if user has completed all onboarding steps
    return NextResponse.json({
      exists: false,
      completed: false,
    });
  } catch (error) {
    console.error("Profile check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Generate a unique public ID for the profile
    const publicId = crypto.randomUUID();

    // TODO: Save profile data to database
    // In production, you would:
    // 1. Save the private profile data with userId
    // 2. Create a public version with publicId
    // 3. Store the relationship between them

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      data: {
        ...data,
        userId,
        publicId,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
