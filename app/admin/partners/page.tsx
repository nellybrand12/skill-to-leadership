import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PartnersClient } from './PartnersClient';

export default async function AdminPartnersPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const partners = await db.partner.findMany({
    orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Institutional Partners & Supporters
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Manage sponsoring universities, fellowship foundations, and institutional partner logos displayed in the footer.
        </p>
      </div>

      <PartnersClient initialPartners={partners} />
    </div>
  );
}
