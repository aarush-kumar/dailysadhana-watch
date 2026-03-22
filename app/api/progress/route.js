import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebaseAdmin';
import { getSessionFromRequest } from '../../../lib/auth';

export async function GET(req) {
    const session = getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userDoc = await db.collection('users').doc(session.uid).get();
        const userData = userDoc.data();

        // Look up customer name from verified_orders using phone
        let customerName = null;
        if (session.phone) {
            try {
                const orderDoc = await db.collection('verified_orders').doc(session.phone).get();
                if (orderDoc.exists) {
                    customerName = orderDoc.data()?.name || null;
                }
            } catch (e) {
                // Silently fail — name is optional
            }
        }

        // progress is stored as subcollection or map
        const progressSnap = await db.collection('users').doc(session.uid).collection('progress').get();
        const completedDays = progressSnap.docs.map(doc => parseInt(doc.id.replace('day_', '')));

        // Simple streak calculation (placeholder logic)
        let totalMinutes = 0;
        progressSnap.docs.forEach(doc => {
            totalMinutes += (doc.data().duration || 0) / 60;
        });

        return NextResponse.json({
            completedDays,
            streak: completedDays.length > 0 ? 5 : 0, // Placeholder
            totalMinutes: Math.round(totalMinutes),
            customerName,
            phone: session.phone
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    const session = getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { day, watchDurationSeconds } = await req.json();

        await db.collection('users').doc(session.uid).collection('progress').doc(`day_${day}`).set({
            watched: true,
            watchedAt: new Date(),
            duration: watchDurationSeconds
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
