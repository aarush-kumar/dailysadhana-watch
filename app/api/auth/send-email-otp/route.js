import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';
import { sendOtpEmail } from '../../../../lib/zeptomail';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.collection('email_otps').doc(normalizedEmail).set({
            otp,
            expiresAt,
            createdAt: new Date(),
        });

        await sendOtpEmail(normalizedEmail, otp);
        console.log('Email OTP sent to:', normalizedEmail);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send email OTP error:', error);
        return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
    }
}
