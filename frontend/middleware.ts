/**
 * Next.js 16 Middleware for Authentication
 *
 * Protects routes by checking for valid JWT token in cookies
 * 
 * Protected routes: /dashboard, /tasks, /projects, /calendar, /settings
 * Auth routes: /signin, /signup (redirect to dashboard if already logged in)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/tasks', '/projects', '/calendar', '/settings'];
const authRoutes = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('jwt_token')?.value;

  // Check if trying to access protected route without token
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Check if trying to access auth route with token (redirect to dashboard)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
