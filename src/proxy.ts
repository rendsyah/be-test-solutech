import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { APP } from './libs/constants';
import { getSession } from './libs/session';

// 1. Specify public routes
const publicRoutes = ['/login', '/forgot-password', '/verify-otp', '/new-password'];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the session from the cookie
  const session = await getSession();

  // 4. Redirect to /login if the user is not authenticated
  if (!isPublicRoute && !session.token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session.token) {
    // Check if the session is expired
    const isSessionExpired = request.nextUrl.searchParams.get('session_expired') === 'true';

    // Redirect to /login with session expired flag if the session is expired
    if (isSessionExpired) {
      const cleanUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.delete(APP.SESSION_NAME);

      return response;
    }

    const redirect = session.redirectTo || '/dashboard';
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    '/((?!api|assets|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)',
  ],
};
