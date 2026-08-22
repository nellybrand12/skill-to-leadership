import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendNewsletterNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ success: true, message: 'You are already subscribed!' });
    }

    await db.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
      },
    });

    // Send notification email to NEXT_PUBLIC_CONTACT_EMAIL
    await sendNewsletterNotification(normalizedEmail);

    return NextResponse.json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
