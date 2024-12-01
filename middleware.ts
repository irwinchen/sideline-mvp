import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/about(.*)",
  "/how-it-works(.*)",
  "/contact(.*)",
  "/providers(.*)",
  "/sign-in/(.*)",
  "/sign-up/(.*)",
  "/test(.*)",
  "/profile(.*)", // Allow all profile routes to be public
  "/(.*)", // Root catch-all route should be last
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
