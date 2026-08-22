import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EventsAdminClient } from './EventsAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const events = await db.event.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    include: {
      eventParticipants: { orderBy: { displayOrder: 'asc' } },
      eventMedia: { orderBy: { displayOrder: 'asc' } },
      registrations: true,
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Events & Entrepreneur Spotlight Management
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Manage event lifecycles, application opening & automatic closure, participant stories, winners, and post-event highlights.
        </p>
      </div>

      <EventsAdminClient initialEvents={events} />
    </div>
  );
}
