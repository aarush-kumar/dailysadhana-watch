import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';

function checkAdminAuth(req) {
    const secret = req.headers.get('x-admin-secret');
    return secret === process.env.ADMIN_SECRET;
}

export async function GET(req) {
    if (!checkAdminAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get all unverified users (haven't purchased)
        const usersSnap = await db.collection('users').where('verified', '==', false).get();

        const results = [];

        await Promise.all(usersSnap.docs.map(async (userDoc) => {
            const userData = userDoc.data();

            // Check if they watched any videos
            const progressSnap = await db
                .collection('users')
                .doc(userDoc.id)
                .collection('progress')
                .orderBy('watchedAt', 'desc')
                .get();

            if (progressSnap.empty) return;

            const daysWatched = progressSnap.docs.map(d => parseInt(d.id.replace('day_', '')));
            const lastWatchedAt = progressSnap.docs[0].data().watchedAt?.toDate?.() || null;
            // First watched = last doc since ordered desc
            const firstWatchedAt = progressSnap.docs[progressSnap.docs.length - 1].data().watchedAt?.toDate?.() || null;

            results.push({
                uid: userDoc.id,
                phone: userData.phone,
                daysWatched,
                lastWatchedAt: lastWatchedAt ? lastWatchedAt.toISOString() : null,
                firstWatchedAt: firstWatchedAt ? firstWatchedAt.toISOString() : null,
                lastLoginAt: userData.lastLoginAt?.toDate?.()?.toISOString() || null,
            });
        }));

        // Check which phones have a matching verified_order (purchased) and when
        const phones = results.map(r => r.phone).filter(Boolean);
        const ordersByPhone = {};
        // Firestore 'in' queries support max 30 items per batch
        for (let i = 0; i < phones.length; i += 30) {
            const batch = phones.slice(i, i + 30);
            const ordersSnap = await db.collection('verified_orders')
                .where('__name__', 'in', batch)
                .get();
            ordersSnap.docs.forEach(doc => {
                const data = doc.data();
                ordersByPhone[doc.id] = data.createdAt?.toDate?.() || null;
            });
        }

        for (const user of results) {
            const orderDate = ordersByPhone[user.phone];
            user.purchased = !!orderDate;
            if (orderDate) {
                user.purchasedAt = orderDate.toISOString();
                // Get earliest watch time to compare
                const firstWatchedAt = user.firstWatchedAt ? new Date(user.firstWatchedAt) : null;
                if (firstWatchedAt && orderDate < firstWatchedAt) {
                    user.source = 'journal_first'; // Bought journal, then scanned QR
                } else {
                    user.source = 'trial_first'; // Watched free videos, then purchased
                }
            } else {
                user.source = null;
            }
        }

        // Sort by most recently active first
        results.sort((a, b) => {
            if (!a.lastWatchedAt) return 1;
            if (!b.lastWatchedAt) return -1;
            return new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt);
        });

        return NextResponse.json({ users: results, total: results.length });
    } catch (error) {
        console.error('Error fetching trial watchers:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
