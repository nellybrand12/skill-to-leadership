import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const cohortId = searchParams.get('cohortId');
    const category = searchParams.get('category');

    const whereClause: any = {};
    if (cohortId && cohortId !== 'ALL') whereClause.cohortId = cohortId;
    if (category && category !== 'ALL') whereClause.category = category;

    const items = await db.galleryItem.findMany({
      where: whereClause,
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
      include: {
        cohort: { select: { id: true, title: true, cohortNumber: true } },
      },
    });

    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error('Fetch gallery items error:', err);
    return NextResponse.json({ error: 'Failed to fetch gallery items.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { title, description, imageUrl, category, cohortId, orderIndex, published } = body;

    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { error: 'Title, image URL, and category are required.' },
        { status: 400 }
      );
    }

    const newItem = await db.galleryItem.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        category,
        cohortId: cohortId || null,
        orderIndex: Number(orderIndex) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
      include: {
        cohort: { select: { id: true, title: true, cohortNumber: true } },
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    console.error('Create gallery item error:', err);
    return NextResponse.json({ error: 'Failed to create gallery item.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required.' }, { status: 400 });
    }

    if (data.orderIndex !== undefined) data.orderIndex = Number(data.orderIndex);
    if (data.published !== undefined) data.published = Boolean(data.published);

    const updated = await db.galleryItem.update({
      where: { id },
      data,
      include: {
        cohort: { select: { id: true, title: true, cohortNumber: true } },
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error('Update gallery item error:', err);
    return NextResponse.json({ error: 'Failed to update gallery item.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required.' }, { status: 400 });
    }

    await db.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete gallery item error:', err);
    return NextResponse.json({ error: 'Failed to delete gallery item.' }, { status: 500 });
  }
}
