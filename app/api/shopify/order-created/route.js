import { NextResponse } from 'next/server';
import { admin, db } from '../../../../lib/firebaseAdmin';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

export async function POST(req) {
    try {
        const body = await req.text();
        const hmacHeader = req.headers.get('x-shopify-hmac-sha256');

        // 1. Verify Webhook (optional but recommended)
        if (SHOPIFY_WEBHOOK_SECRET && hmacHeader) {
            const hash = crypto
                .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
                .update(body)
                .digest('base64');

            if (hash !== hmacHeader) {
                return new Response('Invalid HMAC', { status: 401 });
            }
        }

        const payload = JSON.parse(body);

        // 2. Extract Phone Number
        // Shopify phone numbers can be in customer or billing_address
        const phone = payload.customer?.phone || payload.billing_address?.phone;

        if (!phone) {
            console.log('No phone number found in order:', payload.id);
            return NextResponse.json({ success: true, message: 'No phone found' });
        }

        // 3. Normalize Phone (E.164)
        const normalizedPhone = phone.replace(/\s+/g, '');

        // 4. Store in verified_orders
        await db.collection('verified_orders').doc(normalizedPhone).set({
            orderId: payload.id,
            email: payload.customer?.email,
            name: [payload.customer?.first_name, payload.customer?.last_name].filter(Boolean).join(' ') || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Verified order added for phone:', normalizedPhone);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Shopify webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
