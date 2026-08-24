import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { partnersData } from '@/data/partners';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const dbPartners = await db.partner.findMany({
      where: { published: true },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    });

    const list = dbPartners.length > 0
      ? dbPartners.map((p) => ({
          id: p.id,
          name: p.name,
          logo: p.logoUrl,
          website: p.website,
        }))
      : partnersData;

    return NextResponse.json(
      { success: true, partners: list },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error('Fetch public partners error:', err);
    return NextResponse.json(
      { success: true, partners: partnersData },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  }
}
