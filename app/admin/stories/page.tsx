import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StoriesAdminClient } from './StoriesAdminClient';

export default async function AdminStoriesPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const stories = await db.story.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Stories & Blog Posts CMS
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Publish and manage articles, participant testimonials, and program reports.
        </p>
      </div>

      <StoriesAdminClient initialStories={stories} />
    </div>
  );
}
