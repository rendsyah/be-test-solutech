import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { APP } from './libs/constants';
import { getSession } from './libs/session';

const publicRoutes = ['/login'];

const DEFAULT_AUTH_REDIRECT = '/products';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await getSession();

  // Root route: redirect based on auth state in a single hop
  if (path === '/') {
    if (!session.token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  const isPublicRoute = publicRoutes.includes(path);

  // Redirect unauthenticated users away from protected routes
  if (!isPublicRoute && !session.token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from public routes
  if (isPublicRoute && session.token) {
    const isSessionExpired = request.nextUrl.searchParams.get('session_expired') === 'true';

    if (isSessionExpired) {
      const cleanUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.delete(APP.SESSION_NAME);
      return response;
    }

    const redirect = session.redirectTo || DEFAULT_AUTH_REDIRECT;
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|assets|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)',
  ],
};
