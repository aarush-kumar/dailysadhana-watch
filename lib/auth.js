import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const COOKIE_NAME = 'sadhana_session';

export function createSessionCookie(payload) {
    // Updated session to 90 days to match the journal duration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '90d' });
    
    // Using more permissive cookie settings for custom domains on Vercel
    return serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true, // Vercel always uses HTTPS
        sameSite: 'lax', // Lax is more reliable for redirects across subdomains
        maxAge: 90 * 24 * 60 * 60, // 90 days
        path: '/',
    });
}

export function verifySession(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function getSessionFromRequest(req) {
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    return verifySession(token);
}

export function removeSessionCookie() {
    return serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 0,
        expires: new Date(0),
        path: '/',
    });
}
