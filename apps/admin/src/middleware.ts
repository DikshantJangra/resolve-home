import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies (better-auth default cookie name is usually better-auth.session-token)
  // But our project might be using a custom name like auth_token or better-auth.session-token
  const sessionToken = request.cookies.get('better-auth.session-token') || 
                       request.cookies.get('auth_token')

  // 1. If trying to access dashboard without a token, redirect to login
  const isPublicPath = pathname.startsWith('/login') || 
                       pathname.startsWith('/forgot-password') || 
                       pathname.startsWith('/reset-password')

  if (!sessionToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
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
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
