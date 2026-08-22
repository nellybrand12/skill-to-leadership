'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { 
  LayoutDashboard, 
  Inbox,
  FileText, 
  Layers, 
  Calendar, 
  BookOpen, 
  HeartHandshake, 
  Building, 
  Image as ImageIcon, 
  Users,
  Settings, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Messages Inbox', href: '/admin/messages', icon: Inbox },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Cohorts & Skills', href: '/admin/cohorts', icon: Layers },
  { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Partners', href: '/admin/partners', icon: Building },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Stories & News', href: '/admin/stories', icon: BookOpen },
  { name: 'Volunteers', href: '/admin/volunteers', icon: Users },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-primary-navy text-white flex flex-col shrink-0 min-h-screen border-r border-primary-navy-light">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10">
        <Logo variant="light" size="sm" />
        <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-gold">
          Administration Console
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gold text-primary-navy shadow-gold font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Links & Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
