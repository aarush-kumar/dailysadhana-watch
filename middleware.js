import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const COOKIE_NAME = 'sadhana_session';

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // 1. Define protected & public paths
    const isProtectedRoute = pathname.startsWith('/day') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profile');

    const isAuthRoute = pathname.startsWith('/login');

    // 2. Get cookie
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies[COOKIE_NAME];

    // 3. Verify session
    let user = null;
    if (token) {
        try {
            user = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            // Token invalid
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
