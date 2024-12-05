import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { events } from "lib/events-store";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventName, guestCount, creatorName } = await request.json();

    // Validate input
    if (!eventName || !guestCount || !creatorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (guestCount > 20) {
      return NextResponse.json(
        { error: "Guest count exceeds maximum limit of 20" },
        { status: 400 }
      );
    }

    // Generate a unique event ID
    const eventId = nanoid(10);

    // Create event object with expiration date (1 month from now)
    const event = {
      id: eventId,
      name: eventName,
      guestCount,
      userId,
      creatorName,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      guests: [],
    };

    // Store event
    events.set(eventId, event);

    return NextResponse.json({ eventId });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
