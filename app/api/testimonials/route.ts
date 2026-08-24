import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials as fallbackTestimonials } from '@/data/testimonials';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const list = await db.testimonial.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(
      { success: true, testimonials: list.length > 0 ? list : fallbackTestimonials },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error('Fetch public testimonials error:', err);
    return NextResponse.json(
      { success: true, testimonials: fallbackTestimonials },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  }
}
