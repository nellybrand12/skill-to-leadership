import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cleanupOrphanedMedia } from '@/lib/mediaStorage';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Reserved discriminator for batch-created fellows. Never accepted via the
 *  Story / single-participant flow; enforced server-side to keep the category
 *  column safe for querying fellows vs entrepreneurs. */
const FELLOW_CATEGORY = 'FELLOW' as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface FellowPayload {
  name: string;
  fellowRole: string;
  story: string;
  photoUrl: string;
}

interface FellowValidationError {
  index: number;
  field: string;
  message: string;
}

function validateFellowSlot(
  fellow: Partial<FellowPayload>,
  index: number
): FellowValidationError[] {
  const errors: FellowValidationError[] = [];
  if (!fellow.name?.trim()) errors.push({ index, field: 'name', message: 'Name is required.' });
  if (!fellow.fellowRole?.trim()) errors.push({ index, field: 'fellowRole', message: 'Role / focus area is required.' });
  if (!fellow.story?.trim()) errors.push({ index, field: 'story', message: 'Bio / short story is required.' });
  if (!fellow.photoUrl?.trim()) errors.push({ index, field: 'photoUrl', message: 'Photo is required.' });
  return errors;
}

// ---------------------------------------------------------------------------
// POST — single participant OR batch fellows
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    // -----------------------------------------------------------------------
    // Batch fellows path: { eventId, fellows: FellowPayload[] }
    // -----------------------------------------------------------------------
    if (Array.isArray(body.fellows)) {
      const { eventId, fellows } = body as { eventId: string; fellows: FellowPayload[] };

      if (!eventId) {
        return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });
      }
      if (fellows.length === 0) {
        return NextResponse.json({ error: 'fellows array must not be empty.' }, { status: 400 });
      }
      if (fellows.length > 20) {
        return NextResponse.json({ error: 'Maximum 20 fellows per batch.' }, { status: 400 });
      }

      // Per-slot validation before touching the DB
      const validationErrors: FellowValidationError[] = fellows.flatMap((f, i) =>
        validateFellowSlot(f, i)
      );
      if (validationErrors.length > 0) {
        return NextResponse.json(
          { error: 'Validation failed. See errors array.', errors: validationErrors },
          { status: 422 }
        );
      }

      // Interactive transaction: maxOrder read + all inserts execute atomically
      // inside a single serializable transaction, preventing two concurrent
      // batch requests on the same event from computing overlapping displayOrder
      // values. Prisma interactive transactions acquire row-level locks on the
      // aggregate read path (PostgreSQL SERIALIZABLE isolation on the tx).
      const createdFellows = await db.$transaction(async (tx) => {
        // Read the current max displayOrder for this event inside the tx
        const agg = await tx.eventParticipant.aggregate({
          where: { eventId },
          _max: { displayOrder: true },
        });
        const baseOrder = (agg._max.displayOrder ?? -1) + 1;

        // Create all fellows in slot order
        const creates = fellows.map((fellow, i) =>
          tx.eventParticipant.create({
            data: {
              eventId,
              name: fellow.name.trim(),
              fellowRole: fellow.fellowRole.trim(),
              story: fellow.story.trim(),
              photoUrl: fellow.photoUrl.trim(),
              // Discriminator — always FELLOW for this flow
              category: FELLOW_CATEGORY,
              // Default to empty string (schema default) — businessName unused for fellows
              businessName: '',
              // Fellows are published immediately on creation
              published: true,
              // Deterministic ordering: slot 0 → baseOrder, slot 1 → baseOrder+1 …
              displayOrder: baseOrder + i,
            },
          })
        );

        return Promise.all(creates);
      });

      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, fellows: createdFellows });
    }

    // -----------------------------------------------------------------------
    // Single participant path (Story flow)
    // -----------------------------------------------------------------------
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

    // Guard: prevent admins from accidentally (or intentionally) setting
    // category to 'FELLOW' through the Story flow, which would corrupt the
    // discriminator used to split fellows from entrepreneurs on the public page.
    if (category === FELLOW_CATEGORY) {
      return NextResponse.json(
        {
          error:
            '"FELLOW" is a reserved category value used by the Add Fellows flow. ' +
            'Use a different category label for Story/participant entries.',
        },
        { status: 400 }
      );
    }

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

// ---------------------------------------------------------------------------
// PUT — update a single participant or fellow
// ---------------------------------------------------------------------------

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Participant ID is required.' }, { status: 400 });
    }

    // Same guard on PUT: category must not be changed to 'FELLOW' via the
    // Story/edit flow. Fellow records already have category='FELLOW' and
    // their category must not be changed either (fellowRole is the editable field).
    if (data.category !== undefined && data.category === FELLOW_CATEGORY) {
      const existing = await db.eventParticipant.findUnique({ where: { id }, select: { category: true } });
      // Allow if the record is already a FELLOW (no category change, just other field edits)
      if (existing?.category !== FELLOW_CATEGORY) {
        return NextResponse.json(
          {
            error:
              '"FELLOW" is a reserved category value. Use the Fellows management flow to create fellow entries.',
          },
          { status: 400 }
        );
      }
    }

    if (data.displayOrder !== undefined) data.displayOrder = Number(data.displayOrder);
    if (data.isWinner !== undefined) data.isWinner = Boolean(data.isWinner);
    if (data.published !== undefined) data.published = Boolean(data.published);
    if (data.fellowRole !== undefined) data.fellowRole = data.fellowRole?.trim() || null;

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

// ---------------------------------------------------------------------------
// DELETE — remove a participant or fellow
// ---------------------------------------------------------------------------

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
