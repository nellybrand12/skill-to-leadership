import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { donorName, donorEmail, donorPhone, amount, frequency, paymentMethod, purpose } = body;

    if (!donorName || !donorEmail || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid donation details.' }, { status: 400 });
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const receiptNumber = `STL-DON-${randomNum}`;

    const donation = await db.donation.create({
      data: {
        receiptNumber,
        donorName,
        donorEmail,
        donorPhone: donorPhone || null,
        amount: Number(amount),
        frequency: frequency || 'ONE_TIME',
        paymentMethod: paymentMethod || 'MTN_MOMO',
        purpose: purpose || 'GENERAL',
        status: 'SUCCESSFUL',
        txReference: `TX-${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      receiptNumber: donation.receiptNumber,
      id: donation.id,
      amount: donation.amount,
    });
  } catch (err) {
    console.error('Donation error:', err);
    return NextResponse.json({ error: 'Failed to record donation.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Missing receipt reference.' }, { status: 400 });
    }

    const donation = await db.donation.findUnique({
      where: { receiptNumber: ref },
    });

    if (!donation) {
      return NextResponse.json({ error: 'Donation receipt not found.' }, { status: 404 });
    }

    return NextResponse.json({ donation });
  } catch (err) {
    console.error('Fetch donation error:', err);
    return NextResponse.json({ error: 'Error fetching donation.' }, { status: 500 });
  }
}
