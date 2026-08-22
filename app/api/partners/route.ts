import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { partnersData } from '@/data/partners';

export async function GET() {
  try {
    const dbPartners = await db.partner.findMany({
      where: { published: true },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    });

    if (dbPartners.length > 0) {
      return NextResponse.json({
        success: true,
        partners: dbPartners.map((p) => ({
          id: p.id,
          name: p.name,
          logo: p.logoUrl,
          website: p.website,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      partners: partnersData,
    });
  } catch (err) {
    console.error('Fetch public partners error:', err);
    return NextResponse.json({ success: true, partners: partnersData });
  }
}
