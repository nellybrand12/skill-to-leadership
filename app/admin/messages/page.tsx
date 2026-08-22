import React from 'react';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MessagesClient } from './MessagesClient';

export default async function AdminMessagesPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  const initialMessages = await db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          Contact Messages Inbox
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Review, manage, and reply directly to incoming inquiries, partnerships, and visitor messages.
        </p>
      </div>

      <MessagesClient initialMessages={initialMessages} />
    </div>
  );
}
