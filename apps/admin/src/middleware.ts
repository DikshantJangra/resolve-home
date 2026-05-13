import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies
  let sessionToken = request.cookies.get('better-auth.session-token')?.value || 
                     request.cookies.get('auth_token')?.value

  // Sanitize token (ignore "undefined" or "null" strings)
  if (sessionToken === 'undefined' || sessionToken === 'null') {
    sessionToken = undefined
  }

  // 1. If trying to access dashboard without a token, redirect to login
  const isAuthPath = pathname.startsWith('/login') || 
                     pathname.startsWith('/forgot-password') || 
                     pathname.startsWith('/reset-password')

  if (!sessionToken && !isAuthPath) {
    const loginUrl = new URL('/login', request.url)
    // Add callbackUrl only if we're not on home or login
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // 2. If trying to access login WITH a token, ONLY redirect to dashboard if they are an admin
  // This prevents infinite loops for non-admin users (like workers) trying to access the admin portal
  const userRole = request.cookies.get('user_role')?.value
  
  if (sessionToken && pathname.startsWith('/login') && userRole === 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.svg, favicon.svg (specific assets)
     * - Common image extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|favicon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}
