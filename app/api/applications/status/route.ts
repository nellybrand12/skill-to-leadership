import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Please provide an application reference code or email address.' }, { status: 400 });
    }

    const application = await db.application.findFirst({
      where: {
        OR: [
          { refCode: { equals: query } },
          { email: { equals: query } },
        ],
      },
      select: {
        id: true,
        refCode: true,
        fullName: true,
        skillPreference: true,
        status: true,
        createdAt: true,
        reviewerNotes: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'No application found with the provided reference or email.' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (err) {
    console.error('Status lookup error:', err);
    return NextResponse.json({ error: 'Error querying application status.' }, { status: 500 });
  }
}
