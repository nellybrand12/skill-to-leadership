import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { eventId, mediaType, url, caption, displayOrder, published } = body;

    if (!eventId || !url) {
      return NextResponse.json(
        { error: 'Event ID and media URL are required.' },
        { status: 400 }
      );
    }

    const media = await db.eventMedia.create({
      data: {
        eventId,
        mediaType: mediaType || 'IMAGE',
        url,
        caption: caption || null,
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (err) {
    console.error('Create event media error:', err);
    return NextResponse.json({ error: 'Failed to add media to event.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required.' }, { status: 400 });
    }

    await db.eventMedia.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete event media error:', err);
    return NextResponse.json({ error: 'Failed to delete media.' }, { status: 500 });
  }
}
