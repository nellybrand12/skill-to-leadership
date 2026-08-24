import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

import { revalidatePath } from 'next/cache';
import { cleanupOrphanedMedia } from '@/lib/mediaStorage';

export async function POST(req: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { settings } = body; // Array of { key, value }

    if (Array.isArray(settings)) {
      for (const s of settings) {
        // If updating a media setting, fetch old setting first
        const existing = await db.siteSetting.findUnique({
          where: { key: s.key },
        });

        await db.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: {
            key: s.key,
            value: s.value,
            label: s.label || s.key,
            group: s.group || 'GENERAL',
          },
        });

        if (existing && existing.value !== s.value && existing.value?.startsWith('/uploads/')) {
          await cleanupOrphanedMedia(existing.value);
        }
      }
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
