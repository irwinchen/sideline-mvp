import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // For now, we'll return different mock data based on the ID
    // to simulate different user profiles
    // In production, this would fetch from a real database
    const profile = {
      restrictions:
        params.id === "sample"
          ? [
              { item: "peanuts", type: "cannot" as const },
              { item: "shellfish", type: "cannot" as const },
              { item: "black pepper", type: "cannot" as const },
              { item: "peppers", type: "cannot" as const },
              { item: "dairy", type: "willnot" as const },
              { item: "red meat", type: "willnot" as const },
            ]
          : [
              { item: "gluten", type: "cannot" as const },
              { item: "soy", type: "willnot" as const },
            ],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
}
