import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'stl_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login page and authentication API without session
  if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
    // If user is already authenticated and visits /admin/login, we can let them stay or redirect to dashboard
    return NextResponse.next();
  }

  // 2. Intercept protected Admin Web Pages (/admin/*)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }

    // Parse JWT expiration in edge-safe format (header.payload.signature)
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Malformed token');
      }
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Token expired
        const loginUrl = new URL('/admin/login?reason=inactive', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(COOKIE_NAME);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return response;
      }
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }

    // Valid session: proceed with anti-caching headers so browser back button does not serve stale authenticated pages after logout
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // 3. Intercept protected Admin API Routes (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin authentication session required.' },
        { status: 401 }
      );
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Malformed token');
      }
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        const response = NextResponse.json(
          { error: 'Session expired. Please log in again.' },
          { status: 401 }
        );
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
    } catch {
      const response = NextResponse.json(
        { error: 'Invalid authentication session.' },
        { status: 401 }
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
