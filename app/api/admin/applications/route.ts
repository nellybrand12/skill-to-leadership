import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id, status, reviewerNotes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status.' }, { status: 400 });
    }

    const updated = await db.application.update({
      where: { id },
      data: {
        status,
        reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : undefined,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, application: updated });
  } catch (err) {
    console.error('Update application status error:', err);
    return NextResponse.json({ error: 'Failed to update application.' }, { status: 500 });
  }
}
