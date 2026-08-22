import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, testimonials });
  } catch (err) {
    console.error('Fetch testimonials error:', err);
    return NextResponse.json({ error: 'Failed to fetch testimonials.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name, role, track, image, text, outcome, displayOrder, published } = body;

    if (!name || !text) {
      return NextResponse.json(
        { error: 'Name and testimonial content are required.' },
        { status: 400 }
      );
    }

    const created = await db.testimonial.create({
      data: {
        name,
        role: role || 'Cohort 1 Participant',
        track: track || null,
        image: image || '/images/CH1-candidates/1.jpg',
        text,
        outcome: outcome || null,
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, testimonial: created });
  } catch (err) {
    console.error('Create testimonial error:', err);
    return NextResponse.json({ error: 'Failed to create testimonial.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required.' }, { status: 400 });
    }

    if (data.displayOrder !== undefined) data.displayOrder = Number(data.displayOrder);
    if (data.published !== undefined) data.published = Boolean(data.published);

    const updated = await db.testimonial.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err) {
    console.error('Update testimonial error:', err);
    return NextResponse.json({ error: 'Failed to update testimonial.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required.' }, { status: 400 });
    }

    await db.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete testimonial error:', err);
    return NextResponse.json({ error: 'Failed to delete testimonial.' }, { status: 500 });
  }
}
