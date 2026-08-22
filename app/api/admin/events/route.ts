import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const events = await db.event.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        eventParticipants: { orderBy: { displayOrder: 'asc' } },
        eventMedia: { orderBy: { displayOrder: 'asc' } },
        registrations: true,
      },
    });

    return NextResponse.json({ success: true, events });
  } catch (err) {
    console.error('Fetch events error:', err);
    return NextResponse.json({ error: 'Failed to fetch events.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      date,
      startDateTime,
      endDateTime,
      time,
      location,
      isVirtual,
      coverImage,
      organizer,
      eventType,
      status,
      capacity,
      isSpotlight,
      applicationsEnabled,
      applicationUrl,
      eligibilityInfo,
      statisticsInfo,
      winnerName,
      winnerBusiness,
      winnerPhoto,
      winnerStory,
      winnerQuote,
      winnerPrize,
      hasWinner,
      published,
    } = body;

    if (!title || !description || !coverImage) {
      return NextResponse.json(
        { error: 'Title, description, and cover image are required.' },
        { status: 400 }
      );
    }

    const type = eventType === 'COMPETITION' ? 'COMPETITION' : 'EVENT';
    const isAppEnabled = type === 'COMPETITION' ? Boolean(applicationsEnabled) : false;

    // Server-side validation for competitions with applications enabled
    if (type === 'COMPETITION' && isAppEnabled) {
      if (!applicationUrl || !applicationUrl.trim().startsWith('http')) {
        return NextResponse.json(
          { error: 'A valid external application URL (starting with http:// or https://) is required when applications are enabled for a competition.' },
          { status: 400 }
        );
      }
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await db.event.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `An event with slug "${generatedSlug}" already exists.` },
        { status: 400 }
      );
    }

    const newEvent = await db.event.create({
      data: {
        title,
        slug: generatedSlug,
        description,
        date: date ? new Date(date) : (startDateTime ? new Date(startDateTime) : new Date()),
        startDateTime: startDateTime ? new Date(startDateTime) : null,
        endDateTime: endDateTime ? new Date(endDateTime) : null,
        time: time || '9:00 AM Sharp',
        location: location || 'Yaoundé, Cameroon',
        isVirtual: Boolean(isVirtual),
        coverImage,
        organizer: organizer || 'Skill to Leadership',
        eventType: type,
        status: status || (type === 'COMPETITION' ? 'ACTIVE' : 'UPCOMING'),
        capacity: Number(capacity) || 100,
        isSpotlight: type === 'COMPETITION' ? true : Boolean(isSpotlight),
        applicationsEnabled: isAppEnabled,
        applicationUrl: type === 'COMPETITION' ? (applicationUrl || null) : null,
        eligibilityInfo: eligibilityInfo || null,
        statisticsInfo: statisticsInfo || null,
        winnerName: winnerName || null,
        winnerBusiness: winnerBusiness || null,
        winnerPhoto: winnerPhoto || null,
        winnerStory: winnerStory || null,
        winnerQuote: winnerQuote || null,
        winnerPrize: winnerPrize || null,
        hasWinner: Boolean(hasWinner),
        published: published !== undefined ? Boolean(published) : true,
      },
      include: {
        eventParticipants: true,
        eventMedia: true,
      },
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (err) {
    console.error('Create event error:', err);
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    // Validate type
    if (data.eventType !== undefined) {
      data.eventType = data.eventType === 'COMPETITION' ? 'COMPETITION' : 'EVENT';
    }

    // Server-side validation for competitions with applications enabled
    if (data.eventType === 'COMPETITION' || data.applicationsEnabled) {
      if (data.applicationsEnabled) {
        if (!data.applicationUrl || !data.applicationUrl.trim().startsWith('http')) {
          return NextResponse.json(
            { error: 'A valid external application URL (starting with http:// or https://) is required when applications are enabled for a competition.' },
            { status: 400 }
          );
        }
      }
    } else if (data.eventType === 'EVENT') {
      data.applicationsEnabled = false;
      data.applicationUrl = null;
    }

    if (data.capacity !== undefined) data.capacity = Number(data.capacity);
    if (data.date) data.date = new Date(data.date);
    if (data.startDateTime) data.startDateTime = new Date(data.startDateTime);
    if (data.endDateTime) data.endDateTime = new Date(data.endDateTime);
    if (data.published !== undefined) data.published = Boolean(data.published);
    if (data.isSpotlight !== undefined) data.isSpotlight = Boolean(data.isSpotlight);
    if (data.applicationsEnabled !== undefined) data.applicationsEnabled = Boolean(data.applicationsEnabled);
    if (data.hasWinner !== undefined) data.hasWinner = Boolean(data.hasWinner);
    if (data.isVirtual !== undefined) data.isVirtual = Boolean(data.isVirtual);

    const updated = await db.event.update({
      where: { id },
      data,
      include: {
        eventParticipants: { orderBy: { displayOrder: 'asc' } },
        eventMedia: { orderBy: { displayOrder: 'asc' } },
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (err) {
    console.error('Update event error:', err);
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete event error:', err);
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
