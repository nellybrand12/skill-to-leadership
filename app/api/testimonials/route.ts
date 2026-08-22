import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials as fallbackTestimonials } from '@/data/testimonials';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await db.testimonial.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (list.length > 0) {
      return NextResponse.json({ success: true, testimonials: list });
    }

    return NextResponse.json({ success: true, testimonials: fallbackTestimonials });
  } catch (err) {
    console.error('Fetch public testimonials error:', err);
    return NextResponse.json({ success: true, testimonials: fallbackTestimonials });
  }
}
