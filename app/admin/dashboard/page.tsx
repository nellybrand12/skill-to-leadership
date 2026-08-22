import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { 
  FileText, 
  Inbox, 
  Layers, 
  Image as ImageIcon, 
  Calendar, 
  Mail, 
  Users, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Aggregate real system metrics
  const [
    skillsCount,
    cohortsCount,
    galleryCount,
    eventsCount,
    subscribersCount,
    unreadMessagesCount,
    recentMessages,
    recentApplications,
  ] = await Promise.all([
    db.skill.count({ where: { published: true } }),
    db.cohort.count(),
    db.galleryItem.count({ where: { published: true } }),
    db.event.count(),
    db.newsletterSubscriber.count(),
    db.contactMessage.count({ where: { isRead: false } }),
    db.contactMessage.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    db.application.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
            Management Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-muted">
            Welcome back, {session.firstName}. Real-time overview of website operations and publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="px-4 py-2 text-xs font-bold bg-white text-primary-navy border border-neutral-border rounded-button hover:bg-neutral-surface transition-all flex items-center gap-1.5 shadow-soft"
          >
            <Inbox className="w-3.5 h-3.5 text-gold-700" />
            <span>Messages Inbox</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-gold text-primary-navy text-[10px] font-black">
                {unreadMessagesCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/cohorts"
            className="px-4 py-2 text-xs font-bold bg-gold text-primary-navy rounded-button shadow-soft hover:bg-gold-600 transition-all"
          >
            Manage Cohorts & Skills
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 text-xs font-bold bg-white text-primary-navy border border-neutral-border rounded-button hover:bg-neutral-surface transition-all"
          >
            Site Settings
          </Link>
        </div>
      </div>

      {/* 4 Real System Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-neutral-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Unread Messages</span>
            <Inbox className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary-navy font-mono">
            {unreadMessagesCount}
          </div>
          <div className="text-[11px] text-neutral-muted">Pending visitor responses</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-neutral-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Live Skill Tracks</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary-navy font-mono">
            {skillsCount}
          </div>
          <div className="text-[11px] text-neutral-muted">Across {cohortsCount} cohorts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-neutral-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Published Photos</span>
            <ImageIcon className="w-4 h-4 text-gold-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary-navy font-mono">
            {galleryCount}
          </div>
          <div className="text-[11px] text-neutral-muted">Cohort 1 & 2 archive moments</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-neutral-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Mailing List</span>
            <Mail className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary-navy font-mono">
            {subscribersCount}
          </div>
          <div className="text-[11px] text-neutral-muted">Active newsletter subscribers</div>
        </div>
      </div>

      {/* Notice Banner: External Process Clarification */}
      <div className="p-4 bg-primary-navy/5 border border-primary-navy/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-primary-navy">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-gold-700 shrink-0" />
          <div>
            <span className="font-bold">External Workflows: </span>
            Donations are processed externally (MTN MoMo, Orange Money, GoFundMe) and Entrepreneur Spotlight applications are received via the official external form.
          </div>
        </div>
        <Link
          href="/donate"
          target="_blank"
          className="text-gold-700 font-bold hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>View Public Donation Guide</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Two-Column Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Contact Messages */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-border pb-3">
            <h2 className="text-base font-bold text-primary-navy">Recent Inquiries & Messages</h2>
            <Link href="/admin/messages" className="text-xs font-bold text-gold-700 hover:underline">
              Open Inbox
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-muted">
              No inquiries received yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-border text-xs">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />}
                      <span className="font-bold text-primary-navy truncate">{msg.name}</span>
                    </div>
                    <div className="text-[11px] text-neutral-muted truncate">{msg.subject}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-surface text-primary-navy border border-neutral-border">
                      {msg.category}
                    </span>
                    <div className="text-[10px] text-neutral-muted mt-0.5">{formatDate(msg.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-border pb-3">
            <h2 className="text-base font-bold text-primary-navy">Cohort Candidate Applications</h2>
            <Link href="/admin/applications" className="text-xs font-bold text-gold-700 hover:underline">
              View All
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-muted">
              No applications submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-border text-xs">
              {recentApplications.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-primary-navy">{app.fullName}</div>
                    <div className="text-[11px] text-neutral-muted">{app.skillPreference} · {app.location}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-surface text-primary-navy border border-neutral-border">
                      {app.status}
                    </span>
                    <div className="text-[10px] text-neutral-muted mt-0.5">{app.refCode}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
