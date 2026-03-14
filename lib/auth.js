import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const COOKIE_NAME = 'sadhana_session';

export function createSessionCookie(payload) {
    // Updated session to 90 days to match the journal duration
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '90d' });
    return serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
        maxAge: -1,
        path: '/',
    });
}
