import React from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminInactivityGuard } from '@/components/admin/AdminInactivityGuard';
import { getAdminSession } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getAdminSession();

  return (
    <>
      {session && <AdminInactivityGuard />}
      <AdminShell session={session}>
        {children}
      </AdminShell>
    </>
  );
}

