import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cleanupOrphanedMedia } from '@/lib/mediaStorage';

export async function GET(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const partners = await db.partner.findMany({
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, partners });
  } catch (err) {
    console.error('Fetch partners error:', err);
    return NextResponse.json({ error: 'Failed to fetch partners.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { name, logoUrl, website, description, category, orderIndex, isFeatured, published } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ error: 'Partner name and logo URL are required.' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newPartner = await db.partner.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        logoUrl,
        description: description || '',
        website: website || null,
        category: category || 'ACADEMIC',
        orderIndex: Number(orderIndex) || 0,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, partner: newPartner });
  } catch (err) {
    console.error('Create partner error:', err);
    return NextResponse.json({ error: 'Failed to create partner.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required.' }, { status: 400 });
    }

    if (data.orderIndex !== undefined) data.orderIndex = Number(data.orderIndex);
    if (data.isFeatured !== undefined) data.isFeatured = Boolean(data.isFeatured);
    if (data.published !== undefined) data.published = Boolean(data.published);

    const oldPartner = await db.partner.findUnique({ where: { id } });

    const updated = await db.partner.update({
      where: { id },
      data,
    });

    if (oldPartner && oldPartner.logoUrl !== updated.logoUrl) {
      await cleanupOrphanedMedia(oldPartner.logoUrl);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, partner: updated });
  } catch (err) {
    console.error('Update partner error:', err);
    return NextResponse.json({ error: 'Failed to update partner.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required.' }, { status: 400 });
    }

    const oldPartner = await db.partner.findUnique({ where: { id } });

    await db.partner.delete({
      where: { id },
    });

    if (oldPartner?.logoUrl) {
      await cleanupOrphanedMedia(oldPartner.logoUrl);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete partner error:', err);
    return NextResponse.json({ error: 'Failed to delete partner.' }, { status: 500 });
  }
}
