import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const COOKIE_NAME = 'sadhana_session';

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // 1. Define protected & public paths
    const isProtectedRoute = pathname.startsWith('/day') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profile');

    const isAuthRoute = pathname.startsWith('/login');

    // 2. Get cookie using Next.js built-in cookies API (Edge-compatible)
    const token = req.cookies.get(COOKIE_NAME)?.value;

    // 3. Verify session using jose (Edge-compatible JWT library)
    let user = null;
    if (token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            user = payload;
        } catch (e) {
            // Token invalid or expired
        }
    }

    // 4. Redirect Logic

    // Case A: Accessing protected route without being logged in
    if (isProtectedRoute && !user) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Case B: Accessing /login while already logged in
    if (isAuthRoute && user) {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/day/:path*', '/dashboard/:path*', '/profile/:path*', '/login'],
};
