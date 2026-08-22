import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendVolunteerNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, rolePreference, bio, linkedin, availability } = body;

    if (!fullName || !email || !phone || !bio) {
      return NextResponse.json({ error: 'Missing required volunteer fields.' }, { status: 400 });
    }

    const record = await db.volunteer.create({
      data: {
        fullName,
        email,
        phone,
        rolePreference: rolePreference || 'MENTOR',
        bio,
        linkedin: linkedin || null,
        availability: availability || '2-4 hours / week',
      },
    });

    // Send notification email to NEXT_PUBLIC_CONTACT_EMAIL
    await sendVolunteerNotification({
      fullName,
      email,
      phone,
      rolePreference: rolePreference || 'MENTOR',
      bio,
      linkedin,
      availability: availability || '2-4 hours / week',
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error('Volunteer error:', err);
    return NextResponse.json({ error: 'Failed to submit volunteer application.' }, { status: 500 });
  }
}
