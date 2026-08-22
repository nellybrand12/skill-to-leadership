import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { VolunteersClient } from './VolunteersClient';

export default async function AdminVolunteersPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const volunteers = await db.volunteer.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Volunteers & Mentors Network
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Review expressions of interest from industry mentors, workshop instructors, and event coordinators.
        </p>
      </div>

      <VolunteersClient initialVolunteers={volunteers} />
    </div>
  );
}
