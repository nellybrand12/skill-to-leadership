'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { cn } from '@/lib/utils';

interface AdminSessionUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AdminShellProps {
  session: AdminSessionUser | null;
  children: React.ReactNode;
}

export function AdminShell({ session, children }: AdminShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // 1. Close drawer automatically when route/page changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // 2. Breakpoint listener: automatically reset mobile drawer when resizing/rotating to desktop (>= 1024px)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsMobileOpen(false);
      }
    };

    // Run initial check
    handleBreakpointChange(mql);

    // Subscribe to media query changes
    mql.addEventListener('change', handleBreakpointChange);
    return () => mql.removeEventListener('change', handleBreakpointChange);
  }, []);

  // 3. Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // If there's no authenticated session (e.g. login page), render content directly
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-surface flex flex-col">
      {/* 
        Z-Index Scale:
        z-20: Sticky Admin Header
        z-30: Mobile Backdrop (lg:hidden)
        z-40: Mobile Drawer & Desktop Fixed Sidebar
        z-50: Standard Admin Modals & Dialogs (Events, Stories, Cohorts, etc.)
        z-[60]: Nested Modals (Fellow Edit Form)
      */}

      {/* Mobile Drawer Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Fixed Full-Height Sidebar (Desktop & Mobile Drawer) */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 lg:transition-none',
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        )}
      >
        <AdminSidebar
          onNavigate={() => setIsMobileOpen(false)}
          onClose={() => setIsMobileOpen(false)}
          className="h-full"
        />
      </div>

      {/* Main Content Wrapper (offset by sidebar width on desktop, 0 on mobile) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 min-h-screen">
        {/* Sticky Admin Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-neutral-border px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (visible strictly below lg) */}
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileOpen}
              className="lg:hidden p-2 rounded-lg text-primary-navy hover:bg-neutral-surface border border-neutral-border transition-colors flex items-center justify-center shrink-0"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider truncate">
              Skill to Leadership Management Portal
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gold-light text-primary-navy font-bold flex items-center justify-center text-xs shadow-soft">
              {session.firstName?.[0] || 'A'}
            </div>
            <div className="text-xs hidden sm:block">
              <span className="font-bold text-primary-navy block">
                {session.firstName} {session.lastName}
              </span>
              <span className="text-neutral-muted text-[11px] block">{session.email}</span>
            </div>
          </div>
        </header>

        {/* Independently Scrollable Main Viewport */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
