import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendAdminReplyEmail } from '@/lib/email';

export async function POST(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse) return errorResponse;

  try {
    const { id, replyText, subject } = await req.json();

    if (!id || !replyText) {
      return NextResponse.json({ error: 'Message ID and reply content are required.' }, { status: 400 });
    }

    const message = await db.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    // Send email directly to the original sender's address
    const emailResult = await sendAdminReplyEmail({
      to: message.email,
      toName: message.name,
      subject: subject || message.subject,
      replyText: replyText.trim(),
      adminName: `${session?.firstName || 'Skill to Leadership'} ${session?.lastName || 'Management'}`,
      originalMessage: message.message,
    });

    // Update message status in Supabase
    const updated = await db.contactMessage.update({
      where: { id },
      data: {
        status: 'REPLIED',
        isRead: true,
        replyText: replyText.trim(),
        repliedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: updated,
      emailSent: emailResult.success,
    });
  } catch (err) {
    console.error('Reply message error:', err);
    return NextResponse.json({ error: 'Failed to send reply to sender.' }, { status: 500 });
  }
}
