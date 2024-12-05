import { NextResponse } from "next/server";
import { events } from "lib/events-store";

export async function POST(
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

    const { name, restrictions } = await request.json();

    if (!name || !restrictions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add guest to event
    event.guests.push({
      name,
      restrictions,
      submittedAt: new Date(),
    });

    // Update event in map
    events.set(params.id, event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting guest restrictions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
