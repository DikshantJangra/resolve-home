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

  // 2. If trying to access login WITH a token, redirect to dashboard
  if (sessionToken && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
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
