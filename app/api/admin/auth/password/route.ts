import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(req: Request) {
  const { session, errorResponse } = requireAdminSession();
  if (errorResponse || !session) return errorResponse;

  try {
    const body = await req.json();
    const { newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Both New Password and Confirm Password are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify and try again.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters in length.' },
        { status: 400 }
      );
    }

    // Hash the new password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in Supabase PostgreSQL
    await db.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin password successfully updated. Use your new password on your next sign in.',
    });
  } catch (err) {
    console.error('Password change error:', err);
    return NextResponse.json(
      { error: 'Failed to update password. Please try again.' },
      { status: 500 }
    );
  }
}
