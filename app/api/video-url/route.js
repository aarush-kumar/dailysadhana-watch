import { NextResponse } from 'next/server';
import { generateSignedVideoUrl } from '../../../lib/cloudfront';
import { getSessionFromRequest } from '../../../lib/auth';

export async function POST(req) {
    const session = getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { day, language } = await req.json();

        // Purchase check
        const isVerified = session.verified === true;
        if (!isVerified && day > 2) {
            return NextResponse.json({ error: 'purchase_required' }, { status: 403 });
        }

        // Generate signed URL
        const videoFilename = `day-${day.toString().padStart(2, '0')}.mp4`;
        const videoPath = `${language}/${videoFilename}`;

        const signedUrl = generateSignedVideoUrl(videoPath);

        if (!signedUrl) {
            return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
        }

        return NextResponse.json({ url: signedUrl });

    } catch (error) {
        console.error('Error generating video URL:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
