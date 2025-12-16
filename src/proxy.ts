import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Store routes that need Clerk authentication
const isProtectedStoreRoute = createRouteMatcher([
  "/account(.*)",
  "/orders(.*)",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle store routes with Clerk authentication
  if (isProtectedStoreRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};