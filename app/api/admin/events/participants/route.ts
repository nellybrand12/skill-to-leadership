import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cleanupOrphanedMedia } from '@/lib/mediaStorage';

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      eventId,
      name,
      photoUrl,
      businessName,
      category,
      bio,
      story,
      quote,
      website,
      isWinner,
      displayOrder,
      published,
    } = body;

    if (!eventId || !name || !businessName || !story) {
      return NextResponse.json(
        { error: 'Event ID, participant name, business name, and story are required.' },
        { status: 400 }
      );
    }

    const participant = await db.eventParticipant.create({
      data: {
        eventId,
        name,
        photoUrl: photoUrl || null,
        businessName,
        category: category || 'ENTREPRENEUR',
        bio: bio || null,
        story,
        quote: quote || null,
        website: website || null,
        isWinner: Boolean(isWinner),
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, participant });
  } catch (err) {
    console.error('Create event participant error:', err);
    return NextResponse.json({ error: 'Failed to add participant to event.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Participant ID is required.' }, { status: 400 });
    }

    if (data.displayOrder !== undefined) data.displayOrder = Number(data.displayOrder);
    if (data.isWinner !== undefined) data.isWinner = Boolean(data.isWinner);
    if (data.published !== undefined) data.published = Boolean(data.published);

    const oldParticipant = await db.eventParticipant.findUnique({ where: { id } });

    const updated = await db.eventParticipant.update({
      where: { id },
      data,
    });

    if (oldParticipant && oldParticipant.photoUrl !== updated.photoUrl) {
      await cleanupOrphanedMedia(oldParticipant.photoUrl);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, participant: updated });
  } catch (err) {
    console.error('Update event participant error:', err);
    return NextResponse.json({ error: 'Failed to update participant.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Participant ID is required.' }, { status: 400 });
    }

    const oldParticipant = await db.eventParticipant.findUnique({ where: { id } });

    await db.eventParticipant.delete({
      where: { id },
    });

    if (oldParticipant?.photoUrl) {
      await cleanupOrphanedMedia(oldParticipant.photoUrl);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete event participant error:', err);
    return NextResponse.json({ error: 'Failed to delete participant.' }, { status: 500 });
  }
}
