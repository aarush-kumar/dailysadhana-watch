import { NextResponse } from 'next/server';

function checkAdminAuth(req) {
    const secret = req.headers.get('x-admin-secret');
    return secret === process.env.ADMIN_SECRET;
}

// Split +919876543210 into { countryCode: '+91', phoneNumber: '9876543210' }
function splitPhone(phone) {
    if (!phone) return { countryCode: '+91', phoneNumber: '' };
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.startsWith('+91')) {
        return { countryCode: '+91', phoneNumber: cleaned.slice(3) };
    }
    if (cleaned.startsWith('91') && cleaned.length > 10) {
        return { countryCode: '+91', phoneNumber: cleaned.slice(2) };
    }
    return { countryCode: '+91', phoneNumber: cleaned };
}

export async function POST(req) {
    if (!checkAdminAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const INTERAKT_API_KEY = process.env.INTERAKT_API_KEY;
    if (!INTERAKT_API_KEY) {
        return NextResponse.json({ error: 'INTERAKT_API_KEY not configured' }, { status: 500 });
    }

    try {
        const { phones, templateName, bodyValues, languageCode } = await req.json();

        if (!phones?.length || !templateName) {
            return NextResponse.json({ error: 'phones and templateName are required' }, { status: 400 });
        }

        const results = await Promise.all(phones.map(async (phone) => {
            const { countryCode, phoneNumber } = splitPhone(phone);

            const payload = {
                countryCode,
                phoneNumber,
                callbackData: 'trial_followup',
                type: 'Template',
                template: {
                    name: templateName,
                    languageCode: languageCode || 'en',
                    ...(bodyValues?.length ? { bodyValues } : {}),
                },
            };

            try {
                const res = await fetch('https://api.interakt.ai/v1/public/message/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${INTERAKT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();
                return { phone, success: res.ok, response: data };
            } catch (err) {
                return { phone, success: false, error: err.message };
            }
        }));

        const successCount = results.filter(r => r.success).length;
        return NextResponse.json({ results, successCount, total: phones.length });
    } catch (error) {
        console.error('Error sending WhatsApp messages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
