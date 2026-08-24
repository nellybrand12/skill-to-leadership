import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SettingsClient } from './SettingsClient';

export default async function AdminSettingsPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const settings = await db.siteSetting.findMany({
    orderBy: { key: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Website Settings & CMS
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Manage dynamic countdown timers, hero messaging, founder media, feature cards, and contact information without editing code.
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
