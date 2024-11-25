import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();

    // TODO: Save profile data to your database
    // This will depend on your database setup (e.g., Supabase, PostgreSQL)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
