import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('Fetch public settings error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}
