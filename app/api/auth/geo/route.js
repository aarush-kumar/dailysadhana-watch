import { NextResponse } from 'next/server';

export async function GET(req) {
    const country = req.headers.get('x-vercel-ip-country') || '';
    return NextResponse.json({ country });
}
