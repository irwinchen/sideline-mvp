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
  try {
    console.log("Middleware executing for path:", req.nextUrl.pathname);

    if (publicRoutes(req)) {
      console.log("Public route accessed:", req.nextUrl.pathname);
      return NextResponse.next();
    }

    const { userId } = await auth();
    console.log("Auth completed, userId:", userId ? "exists" : "null");

    if (!userId) {
      console.log("Redirecting to sign in");
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (err) {
    // Type guard for Error objects
    const error = err as Error;
    console.error("Middleware error:", {
      message: error?.message || "Unknown error",
      stack: error?.stack || "No stack trace",
      url: req.url,
    });
    // Still return next() to prevent complete site breakage
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
