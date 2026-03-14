import { NextResponse } from 'next/server';
import { auth, db } from '../../../../lib/firebaseAdmin';
import { createSessionCookie } from '../../../../lib/auth';

export async function POST(req) {
    try {
        const { idToken } = await req.json();

        // 1. Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid, phone_number: phone } = decodedToken;

        if (!phone) {
            return NextResponse.json({ error: 'Phone number not found in token' }, { status: 400 });
        }

        // 2. Look up phone in verified_orders
        // Normalize phone (ensure leading + and no spaces)
        const normalizedPhone = phone.replace(/\s+/g, '');
        const orderDoc = await db.collection('verified_orders').doc(normalizedPhone).get();
        const isVerified = orderDoc.exists;

        // 3. Update or create user profile
        await db.collection('users').doc(uid).set({
            phone: normalizedPhone,
            verified: isVerified,
            lastLoginAt: new Date(),
        }, { merge: true });

        // 4. Create session payload
        const sessionPayload = {
            uid,
            phone: normalizedPhone,
            verified: isVerified
        };

        // 5. Set session cookie
        const cookie = createSessionCookie(sessionPayload);

        return new NextResponse(JSON.stringify({ success: true, verified: isVerified }), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Session creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
