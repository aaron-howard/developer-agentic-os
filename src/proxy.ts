import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const fixtureMode = process.env.NODE_ENV !== "production" && process.env.HOSTED_AUTH_FIXTURE_MODE === "true";

export default fixtureMode ? () => NextResponse.next() : clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
