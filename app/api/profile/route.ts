import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
