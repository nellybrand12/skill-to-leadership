import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendApplicationNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      age,
      location,
      education,
      skillPreference,
      motivation,
      previousExperience,
      portfolioUrl,
      emergencyContact,
      consent,
    } = body;

    if (!fullName || !email || !phone || !age || !location || !motivation || !emergencyContact) {
      return NextResponse.json({ error: 'Missing required application fields.' }, { status: 400 });
    }

    // Generate unique reference code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refCode = `STL-2026-${randomHex}`;

    const application = await db.application.create({
      data: {
        refCode,
        fullName,
        email,
        phone,
        age: Number(age),
        location,
        education: education || 'High School',
        skillPreference: skillPreference || 'Braiding & Hairstyling',
        motivation,
        previousExperience: previousExperience || null,
        portfolioUrl: portfolioUrl || null,
        emergencyContact,
        consent: Boolean(consent),
        status: 'SUBMITTED',
      },
    });

    // Send notification email to NEXT_PUBLIC_CONTACT_EMAIL
    await sendApplicationNotification({
      refCode,
      fullName,
      email,
      phone,
      age: Number(age),
      location,
      education: education || 'High School',
      skillPreference: skillPreference || 'Braiding & Hairstyling',
      motivation,
      previousExperience,
      portfolioUrl,
      emergencyContact,
    });

    return NextResponse.json({
      success: true,
      refCode: application.refCode,
      id: application.id,
    });
  } catch (err) {
    console.error('Application creation error:', err);
    return NextResponse.json({ error: 'Internal server error processing application.' }, { status: 500 });
  }
}
