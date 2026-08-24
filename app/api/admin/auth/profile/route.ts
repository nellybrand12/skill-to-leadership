import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse || !session) return errorResponse;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('Fetch profile error:', err);
    return NextResponse.json({ error: 'Failed to fetch profile.' }, { status: 500 });
  }
}
