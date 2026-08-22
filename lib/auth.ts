import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'skill_to_leadership_jwt_secret_key_2026';
export const COOKIE_NAME = 'stl_admin_session';

export interface AdminPayload {
  userId: string;
  email: string;
  role: string; // 'SUPER_ADMIN' | 'ADMIN' | 'REVIEWER'
  firstName: string;
  lastName: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '20m' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export function getAdminSession(): AdminPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

export function requireAdminSession(allowedRoles?: string[]): {
  session: AdminPayload | null;
  errorResponse?: NextResponse;
} {
  const session = getAdminSession();
  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 }),
    };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(session.role) && session.role !== 'SUPER_ADMIN') {
      return {
        session: null,
        errorResponse: NextResponse.json({ error: 'Forbidden. Higher role required.' }, { status: 403 }),
      };
    }
  }

  return { session };
}
