/**
 * Next.js Proxy for Authentication
 *
 * Protects routes by checking for valid JWT token
 * Redirects unauthenticated users to signin page
 *
 * Protected routes:
 * - /dashboard/*
 * - /tasks/*
 * - /projects/*
 * - /calendar/*
 * - /settings/*
 *
 * Public routes:
 * - /signin
 * - /signup
 * - /
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/tasks',
  '/projects',
  '/calendar',
  '/settings',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/signin', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get('jwt_token')?.value ||
                request.cookies.get('auth_token')?.value;

  // Check if accessing protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  );

  // Check if accessing auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to signin if accessing protected route without token
  if (isProtectedRoute && !token) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect to dashboard if accessing auth route with token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Configure which routes the proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
