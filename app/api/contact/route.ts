import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, category, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    // Save contact message directly into Supabase internal inbox
    const record = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        category: category || 'GENERAL',
        subject: subject.trim(),
        message: message.trim(),
        isRead: false,
        status: 'UNREAD',
      },
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Failed to submit message. Please try again.' }, { status: 500 });
  }
}
