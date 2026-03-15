import { NextResponse } from 'next/server';
import { auth, db } from '../../../../lib/firebaseAdmin';
import { createSessionCookie } from '../../../../lib/auth';

export async function POST(req) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
        }

        // 1. Verify Firebase ID token
        if (!auth) {
            console.error('Firebase Admin Auth not initialized. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY env vars.');
            return NextResponse.json({ error: 'Auth service unavailable. Check server configuration.' }, { status: 500 });
        }

        let decodedToken;
        try {
            decodedToken = await auth.verifyIdToken(idToken);
        } catch (verifyError) {
            console.error('Token verification failed:', verifyError.code, verifyError.message);
            return NextResponse.json({
                error: 'Token verification failed',
                detail: verifyError.code || verifyError.message
            }, { status: 401 });
        }

        const { uid, phone_number: phone } = decodedToken;

        if (!phone) {
            console.error('Phone number not found in token for UID:', uid);
            return NextResponse.json({ error: 'Phone number not found in token' }, { status: 400 });
        }

        // 2. Look up phone in verified_orders
        const normalizedPhone = phone.replace(/\s+/g, '');
        let isVerified = false;

        try {
            if (db) {
                const orderDoc = await db.collection('verified_orders').doc(normalizedPhone).get();
                isVerified = orderDoc.exists;

                // 3. Update or create user profile
                await db.collection('users').doc(uid).set({
                    phone: normalizedPhone,
                    verified: isVerified,
                    lastLoginAt: new Date(),
                }, { merge: true });
            } else {
                console.error('Firebase Firestore not initialized');
            }
        } catch (dbError) {
            console.error('Database error during login:', dbError);
            // We continue even if DB fails, as long as auth is successful
        }

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
        console.error('Session creation error:', error.message, error.stack);
        return NextResponse.json({
            error: 'Session creation failed',
            detail: error.message
        }, { status: 500 });
    }
}
