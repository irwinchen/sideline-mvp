import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)", // Allow webhook endpoints
  "/_next(.*)", // Allow Next.js internal routes
  "/favicon.ico",
  "/sitemap.xml",
]);

export default clerkMiddleware(async (auth, req) => {
  // Early return for public routes
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Redirect to sign in if no user
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
