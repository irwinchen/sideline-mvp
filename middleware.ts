import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/(.*)", // Root catch-all route
  "/about(.*)",
  "/how-it-works(.*)",
  "/contact(.*)",
  "/providers(.*)",
  "/sign-in/(.*)",
  "/sign-up/(.*)",
  "/test(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
