import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminInactivityGuard } from '@/components/admin/AdminInactivityGuard';
import { getAdminSession } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getAdminSession();

  return (
    <div className="min-h-screen bg-neutral-surface flex">
      {session && <AdminInactivityGuard />}
      {session && <AdminSidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        {session && (
          <header className="bg-white border-b border-neutral-border px-6 py-4 flex items-center justify-between">
            <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider">
              Skill to Leadership Management Portal
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-light text-primary-navy font-bold flex items-center justify-center text-xs">
                {session.firstName?.[0] || 'A'}
              </div>
              <div className="text-xs">
                <span className="font-bold text-primary-navy block">{session.firstName} {session.lastName}</span>
                <span className="text-neutral-muted">{session.email}</span>
              </div>
            </div>
          </header>
        )}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
