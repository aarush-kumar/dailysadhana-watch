import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';
import { createSessionCookie } from '../../../../lib/auth';

export async function POST(req) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const otpDoc = await db.collection('email_otps').doc(normalizedEmail).get();
        if (!otpDoc.exists) {
            return NextResponse.json({ error: 'OTP not found. Please request a new one.' }, { status: 400 });
        }

        const { otp: storedOtp, expiresAt } = otpDoc.data();

        if (new Date() > expiresAt.toDate()) {
            await db.collection('email_otps').doc(normalizedEmail).delete();
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        if (otp.trim() !== storedOtp) {
            return NextResponse.json({ error: 'Invalid OTP. Please check and try again.' }, { status: 400 });
        }

        await db.collection('email_otps').doc(normalizedEmail).delete();

        const orderDoc = await db.collection('verified_orders').doc(normalizedEmail).get();
        const isVerified = orderDoc.exists;
        console.log('Email login:', normalizedEmail, '| verified:', isVerified);

        const cookie = createSessionCookie({ email: normalizedEmail, verified: isVerified });

        return new NextResponse(JSON.stringify({ success: true, verified: isVerified }), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Verify email OTP error:', error);
        return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
    }
}
