import { NextResponse } from 'next/server';
import { removeSessionCookie } from '../../../../lib/auth';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', removeSessionCookie());
    return response;
}

// Also support GET so we can redirect directly
export async function GET(req) {
    const url = new URL('/login', req.url);
    const response = NextResponse.redirect(url);
    response.headers.set('Set-Cookie', removeSessionCookie());
    return response;
}
