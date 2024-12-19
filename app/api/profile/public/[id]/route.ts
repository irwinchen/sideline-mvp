import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { storageService } from "lib/storage-service";
import type { Restriction } from "lib/client/storage-service";

const DEMO_PROFILE_ID = "demo-user";

// Demo profile data
const demoProfile = {
  restrictions: [
    { item: "peanuts", type: "cannot" as const },
    { item: "shellfish", type: "cannot" as const },
    { item: "dairy", type: "willnot" as const },
  ],
  updatedAt: new Date().toISOString(),
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if this is a request for the demo profile
    if (params.id === DEMO_PROFILE_ID) {
      return NextResponse.json(demoProfile);
    }

    // For real profiles, attempt to fetch from storage service
    const profile = storageService.getProfile(params.id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get the language from the request URL search params
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("lang") || "en";

    // Get translated restrictions if language is specified
    const restrictions =
      language !== "en"
        ? storageService.getTranslatedRestrictions(params.id, language)
        : profile.restrictions;

    // Record the profile view with language
    storageService.recordProfileView(params.id, language);

    return NextResponse.json({
      restrictions: restrictions || [],
      updatedAt: profile.lastModified.toISOString(),
      language: language,
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    // Only return demo data if specifically requesting the demo profile
    if (params.id === DEMO_PROFILE_ID) {
      return NextResponse.json(demoProfile);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
