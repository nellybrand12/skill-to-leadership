import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const cohorts = await db.cohort.findMany({
      orderBy: { cohortNumber: 'asc' },
      include: {
        skills: { select: { id: true, name: true, slug: true } },
        galleryItems: { select: { id: true, title: true, imageUrl: true } },
      },
    });

    return NextResponse.json({ success: true, cohorts });
  } catch (err) {
    console.error('Fetch cohorts error:', err);
    return NextResponse.json({ error: 'Failed to fetch cohorts.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      cohortNumber,
      title,
      theme,
      description,
      startDate,
      endDate,
      applicationDeadline,
      status,
      maxParticipants,
      totalPrizeMoney,
    } = body;

    if (!cohortNumber || !title || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Cohort number, title, description, start date, and end date are required.' },
        { status: 400 }
      );
    }

    const existing = await db.cohort.findUnique({
      where: { cohortNumber: Number(cohortNumber) },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Cohort #${cohortNumber} already exists.` },
        { status: 400 }
      );
    }

    const newCohort = await db.cohort.create({
      data: {
        cohortNumber: Number(cohortNumber),
        title,
        theme: theme || null,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        status: status || 'UPCOMING',
        maxParticipants: Number(maxParticipants) || 30,
        totalPrizeMoney: Number(totalPrizeMoney) || 400000,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, cohort: newCohort });
  } catch (err) {
    console.error('Create cohort error:', err);
    return NextResponse.json({ error: 'Failed to create cohort.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Cohort ID is required.' }, { status: 400 });
    }

    if (data.cohortNumber !== undefined) data.cohortNumber = Number(data.cohortNumber);
    if (data.maxParticipants !== undefined) data.maxParticipants = Number(data.maxParticipants);
    if (data.totalPrizeMoney !== undefined) data.totalPrizeMoney = Number(data.totalPrizeMoney);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (data.applicationDeadline) data.applicationDeadline = new Date(data.applicationDeadline);

    const updated = await db.cohort.update({
      where: { id },
      data,
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, cohort: updated });
  } catch (err) {
    console.error('Update cohort error:', err);
    return NextResponse.json({ error: 'Failed to update cohort.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Cohort ID is required.' }, { status: 400 });
    }

    await db.cohort.delete({
      where: { id },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete cohort error:', err);
    return NextResponse.json({ error: 'Failed to delete cohort.' }, { status: 500 });
  }
}
