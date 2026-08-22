import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEventRegistrationNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, fullName, email, phone } = body;

    if (!eventId || !fullName || !email || !phone) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
      select: { title: true },
    });

    const registration = await db.eventRegistration.create({
      data: {
        eventId,
        fullName,
        email,
        phone,
      },
    });

    // Send notification email to NEXT_PUBLIC_CONTACT_EMAIL
    await sendEventRegistrationNotification({
      eventTitle: event?.title || 'Skill to Leadership Event',
      fullName,
      email,
      phone,
    });

    return NextResponse.json({ success: true, registrationId: registration.id });
  } catch (err) {
    console.error('Event registration error:', err);
    return NextResponse.json({ error: 'Failed to register for event.' }, { status: 500 });
  }
}
