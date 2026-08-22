import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const skills = await db.skill.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: { cohort: { select: { id: true, title: true, cohortNumber: true } } },
    });

    return NextResponse.json({ success: true, skills });
  } catch (err) {
    console.error('Fetch skills error:', err);
    return NextResponse.json({ error: 'Failed to fetch skills.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const {
      name,
      slug,
      shortDesc,
      fullDesc,
      iconName,
      coverImage,
      videoUrl,
      instructor,
      prizeAmount,
      toolsIncluded,
      outcomes,
      cohortId,
      published,
      displayOrder,
    } = body;

    if (!name || !shortDesc || !fullDesc || !coverImage) {
      return NextResponse.json(
        { error: 'Name, short description, full description, and cover image are required.' },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await db.skill.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A skill with slug "${generatedSlug}" already exists.` },
        { status: 400 }
      );
    }

    const newSkill = await db.skill.create({
      data: {
        name,
        slug: generatedSlug,
        shortDesc,
        fullDesc,
        iconName: iconName || 'Sparkles',
        coverImage,
        videoUrl: videoUrl || null,
        instructor: instructor || null,
        prizeAmount: Number(prizeAmount) || 100000,
        toolsIncluded: typeof toolsIncluded === 'string' ? toolsIncluded : JSON.stringify(toolsIncluded || []),
        outcomes: typeof outcomes === 'string' ? outcomes : JSON.stringify(outcomes || []),
        cohortId: cohortId || null,
        published: published !== undefined ? Boolean(published) : true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, skill: newSkill });
  } catch (err) {
    console.error('Create skill error:', err);
    return NextResponse.json({ error: 'Failed to create skill.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required.' }, { status: 400 });
    }

    if (data.prizeAmount !== undefined) data.prizeAmount = Number(data.prizeAmount);
    if (data.displayOrder !== undefined) data.displayOrder = Number(data.displayOrder);
    if (data.published !== undefined) data.published = Boolean(data.published);
    if (data.toolsIncluded && typeof data.toolsIncluded !== 'string') {
      data.toolsIncluded = JSON.stringify(data.toolsIncluded);
    }
    if (data.outcomes && typeof data.outcomes !== 'string') {
      data.outcomes = JSON.stringify(data.outcomes);
    }

    const updated = await db.skill.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, skill: updated });
  } catch (err) {
    console.error('Update skill error:', err);
    return NextResponse.json({ error: 'Failed to update skill.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required.' }, { status: 400 });
    }

    await db.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete skill error:', err);
    return NextResponse.json({ error: 'Failed to delete skill.' }, { status: 500 });
  }
}
