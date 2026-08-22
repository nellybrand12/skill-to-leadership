import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { ApplicationsTableClient } from './ApplicationsTableClient';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const applications = await db.application.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Fellowship Program Applications
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Review, evaluate motivation, filter by track, and update candidate statuses for upcoming Skill to Leadership cohorts.
        </p>
      </div>

      <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-2.5 text-xs text-sky-950">
        <Sparkles className="w-4 h-4 text-sky-700 shrink-0" />
        <div>
          <strong>Note:</strong> These records represent candidate applications submitted directly for Skill to Leadership vocational cohorts. Entrepreneur Spotlight venture submissions are submitted and managed separately via the official external application form.
        </div>
      </div>

      <ApplicationsTableClient initialApplications={applications} />
    </div>
  );
}
