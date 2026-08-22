import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { GalleryClient } from './GalleryClient';

export default async function AdminGalleryPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const [items, cohorts, testimonials] = await Promise.all([
    db.galleryItem.findMany({
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
      include: {
        cohort: { select: { id: true, title: true, cohortNumber: true } },
      },
    }),
    db.cohort.findMany({
      orderBy: { cohortNumber: 'asc' },
      select: { id: true, title: true, cohortNumber: true },
    }),
    db.testimonial.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    }),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Photo Gallery & Participant Testimonials
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Manage visual moments, photos, and participant reflection testimonials displayed across the public website.
        </p>
      </div>

      <GalleryClient
        initialItems={items}
        cohorts={cohorts}
        initialTestimonials={testimonials}
      />
    </div>
  );
}
