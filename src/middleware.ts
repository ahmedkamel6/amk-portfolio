import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/admin']
const publicPaths = ['/admin/login', '/admin/setup', '/admin/forgot-password', '/admin/reset-password']

// Middleware runs on Edge, so we can't easily query Prisma directly.
// We handle DB authentication inside the App Router layouts/route handlers.
// The middleware enforces CSRF and Security Headers.
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname

  const isApi = url.startsWith('/api/')
  const isAdmin = url.startsWith('/admin')

  // Security Headers for all paths
  const headers = new Headers(request.headers)
  const response = NextResponse.next({
    request: {
      headers: headers,
    },
  })

  // Set Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Basic CSP (can be tightened later)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://res.cloudinary.com https://lh3.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://www.youtube.com https://drive.google.com;
    connect-src 'self' https://vitals.vercel-insights.com;
    upgrade-insecure-requests;
  `
  // Replace newlines with space
  response.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim())

  // CSRF Protection for state-changing API endpoints
  if (isApi && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    const referer = request.headers.get('referer')

    let isValid = false
    
    // In local dev, origin might be http://localhost:3000, host localhost:3000
    // In production, origin might be https://domain.com, host domain.com
    if (origin) {
      try {
        const originUrl = new URL(origin)
        if (originUrl.host === host) {
          isValid = true
        }
      } catch (e) {}
    } else if (referer) {
      try {
        const refererUrl = new URL(referer)
        if (refererUrl.host === host) {
          isValid = true
        }
      } catch (e) {}
    } else {
      // If neither origin nor referer is present, block it.
      // Most modern browsers send at least one.
      isValid = false
    }

    if (!isValid && process.env.NODE_ENV === 'production') {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF validation failed. Invalid Origin or Referer.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
