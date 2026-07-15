import { NextResponse } from 'next/server';
import { admin, db } from '../../../../lib/firebaseAdmin';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const SHOPIFY_WEBHOOK_SECRET_US = process.env.SHOPIFY_WEBHOOK_SECRET_US;

function verifyHmac(body, hmacHeader, secret) {
    const hash = crypto.createHmac('sha256', secret).update(body).digest('base64');
    return hash === hmacHeader;
}

export async function POST(req) {
    try {
        const body = await req.text();
        const hmacHeader = req.headers.get('x-shopify-hmac-sha256');

        // 1. Verify Webhook — accept if either store's secret matches
        if (hmacHeader) {
            const validIndia = SHOPIFY_WEBHOOK_SECRET && verifyHmac(body, hmacHeader, SHOPIFY_WEBHOOK_SECRET);
            const validUS = SHOPIFY_WEBHOOK_SECRET_US && verifyHmac(body, hmacHeader, SHOPIFY_WEBHOOK_SECRET_US);

            if (!validIndia && !validUS) {
                console.log('HMAC verification failed for both secrets');
                return new Response('Invalid HMAC', { status: 401 });
            }

            console.log('Webhook verified from store:', validUS ? 'US' : 'India');
        }

        const payload = JSON.parse(body);

        // 2. Extract phone and email independently
        const phone = payload.customer?.phone || payload.billing_address?.phone;
        const email = payload.customer?.email || payload.email || payload.billing_address?.email;

        if (!phone && !email) {
            console.log('No phone or email found in order:', payload.id);
            return NextResponse.json({ success: true, message: 'No phone or email found' });
        }

        const name = [payload.customer?.first_name, payload.customer?.last_name].filter(Boolean).join(' ') || null;
        const writes = [];

        // 3a. Phone-based record (India store / phone login)
        if (phone) {
            const normalizedPhone = phone.replace(/\s+/g, '');
            writes.push(
                db.collection('verified_orders').doc(normalizedPhone).set({
                    orderId: payload.id,
                    email: email || null,
                    name,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                }).then(() => console.log('Verified order added for phone:', normalizedPhone))
            );
        }

        // 3b. Email-based record (US store / email login)
        if (email) {
            const normalizedEmail = email.trim().toLowerCase();
            writes.push(
                db.collection('verified_orders').doc(normalizedEmail).set({
                    orderId: payload.id,
                    phone: phone ? phone.replace(/\s+/g, '') : null,
                    name,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                }).then(() => console.log('Verified order added for email:', normalizedEmail))
            );
        }

        await Promise.all(writes);

        console.log(`Order ${payload.id}: created ${writes.length} verified_order record(s) (phone=${!!phone}, email=${!!email})`);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Shopify webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
