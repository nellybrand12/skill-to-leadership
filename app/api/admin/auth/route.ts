import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signAdminToken } from '@/lib/auth';

const COOKIE_NAME = 'stl_admin_session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or credentials.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or credentials.' }, { status: 401 });
    }

    const token = signAdminToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal login error.' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
