import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (category && category !== 'ALL') {
      whereClause.category = category;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const messages = await db.contactMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await db.contactMessage.count({
      where: { isRead: false },
    });

    return NextResponse.json({
      success: true,
      messages,
      unreadCount,
    });
  } catch (err) {
    console.error('Fetch messages error:', err);
    return NextResponse.json({ error: 'Failed to fetch contact messages.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { id, isRead, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isRead === 'boolean') updateData.isRead = isRead;
    if (status) updateData.status = status;

    const updated = await db.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (err) {
    console.error('Update message error:', err);
    return NextResponse.json({ error: 'Failed to update message status.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required.' }, { status: 400 });
    }

    await db.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete message error:', err);
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}
