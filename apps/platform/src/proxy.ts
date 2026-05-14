import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection proxy for ResolvHome.
 * Ensures protected routes are only accessible with a valid session.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected and auth routes
  const isProtectedRoute = pathname.startsWith("/dashboard") ||
                          pathname.startsWith("/bookings") ||
                          pathname.startsWith("/wallet") ||
                          pathname.startsWith("/profile") ||
                          pathname.startsWith("/settings") ||
                          pathname.startsWith("/messages") ||
                          pathname.startsWith("/book-service") ||
                          pathname.startsWith("/engineer") ||
                          pathname.startsWith("/admin") ||
                          pathname.startsWith("/subscriptions") ||
                          pathname.startsWith("/complaints");
  
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Check for session and role cookies
  const sessionToken = request.cookies.get("better-auth.session-token")?.value || 
                       request.cookies.get("better-auth.session_token")?.value || 
                       request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. Redirect to login if accessing protected route without session
  if (isProtectedRoute && !sessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Role-based barriers
  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Country Detection (Preset for Nigeria)
  const response = NextResponse.next();
  
  // Detect country from various possible headers or geo object
  const geoCountry = (request as any).geo?.country;
  const headerCountry = request.headers.get("x-vercel-ip-country") || 
                        request.headers.get("cf-ipcountry") || 
                        "NG"; // Default to Nigeria
  
  const country = geoCountry || headerCountry;

  // Set country cookie if not present
  if (!request.cookies.has("user_country")) {
    response.cookies.set("user_country", country, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/profile",
    "/settings/:path*",
    "/messages/:path*",
    "/book-service/:path*",
    "/engineer/:path*",
    "/admin/:path*",
    "/subscriptions/:path*",
    "/subscriptions",
    "/complaints/:path*",
    "/complaints",
    "/login",
    "/register",
  ],
};
