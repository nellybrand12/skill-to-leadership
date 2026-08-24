import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cleanupOrphanedMedia } from '@/lib/mediaStorage';

export async function GET() {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const volunteers = await db.volunteer.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, volunteers });
  } catch (err) {
    console.error('Fetch volunteers error:', err);
    return NextResponse.json({ error: 'Failed to fetch volunteers.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      rolePreference,
      roleTitle,
      imageUrl,
      bio,
      linkedin,
      availability,
      status,
      isStaff,
      displayOrder,
      published,
    } = body;

    if (!fullName || !email || !rolePreference) {
      return NextResponse.json(
        { error: 'Full name, email, and role are required.' },
        { status: 400 }
      );
    }

    const created = await db.volunteer.create({
      data: {
        fullName,
        email,
        phone: phone || '',
        rolePreference: rolePreference || 'MENTOR',
        roleTitle: roleTitle || null,
        imageUrl: imageUrl || null,
        bio: bio || '',
        linkedin: linkedin || null,
        availability: availability || 'Flexible',
        status: status || 'APPROVED',
        isStaff: Boolean(isStaff),
        displayOrder: Number(displayOrder) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, volunteer: created });
  } catch (err) {
    console.error('Create volunteer error:', err);
    return NextResponse.json({ error: 'Failed to create volunteer.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required.' }, { status: 400 });
    }

    if (data.displayOrder !== undefined) data.displayOrder = Number(data.displayOrder);
    if (data.isStaff !== undefined) data.isStaff = Boolean(data.isStaff);
    if (data.published !== undefined) data.published = Boolean(data.published);

    const oldVolunteer = await db.volunteer.findUnique({ where: { id } });

    const updated = await db.volunteer.update({
      where: { id },
      data,
    });

    if (oldVolunteer && oldVolunteer.imageUrl !== updated.imageUrl) {
      await cleanupOrphanedMedia(oldVolunteer.imageUrl);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, volunteer: updated });
  } catch (err) {
    console.error('Update volunteer error:', err);
    return NextResponse.json({ error: 'Failed to update volunteer.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required.' }, { status: 400 });
    }

    const oldVolunteer = await db.volunteer.findUnique({ where: { id } });

    await db.volunteer.delete({
      where: { id },
    });

    if (oldVolunteer?.imageUrl) {
      await cleanupOrphanedMedia(oldVolunteer.imageUrl);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete volunteer error:', err);
    return NextResponse.json({ error: 'Failed to delete volunteer.' }, { status: 500 });
  }
}
