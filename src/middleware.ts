import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection middleware for Resolve Home.
 * Ensures protected routes are only accessible with a valid session.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected and auth routes
  const isProtectedRoute = pathname.startsWith("/dashboard") || 
                          pathname.startsWith("/bookings") || 
                          pathname.startsWith("/wallet") ||
                          pathname.startsWith("/admin");
  
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Check for session cookie
  // Better Auth defaults to 'better-auth.session-token'
  // We also check for a generic 'auth_token' cookie as a fallback
  const sessionToken = request.cookies.get("better-auth.session-token")?.value || 
                       request.cookies.get("auth_token")?.value;

  // 1. Redirect to login if accessing protected route without session
  if (isProtectedRoute && !sessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/wallet/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
