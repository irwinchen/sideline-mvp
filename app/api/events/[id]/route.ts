import { NextResponse } from "next/server";
import { events } from "lib/events-store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = events.get(params.id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if event has expired
    if (new Date() > new Date(event.expiresAt)) {
      return NextResponse.json(
        { error: "This event link has expired" },
        { status: 410 }
      );
    }

    // Return event details without sensitive information
    return NextResponse.json({
      name: event.name,
      id: event.id,
      creatorName: event.creatorName,
      expiresAt: event.expiresAt,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
