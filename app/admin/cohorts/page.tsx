import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CohortsClient } from './CohortsClient';

export default async function AdminCohortsPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const [cohorts, skills] = await Promise.all([
    db.cohort.findMany({
      orderBy: { cohortNumber: 'asc' },
      include: {
        skills: { select: { id: true, name: true, slug: true } },
      },
    }),
    db.skill.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        cohort: { select: { id: true, title: true, cohortNumber: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Cohorts & Skills Management
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Create, edit, and publish vocational tracks, cohort cycles, timeline parameters, and prize pools.
        </p>
      </div>

      <CohortsClient initialCohorts={cohorts} initialSkills={skills} />
    </div>
  );
}
