'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

export function ApplicationsTableClient({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [filterSkill, setFilterSkill] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviewerNote, setReviewerNote] = useState('');

  const filtered = applications.filter((app) => {
    const matchesSkill = filterSkill === 'ALL' || app.skillPreference === filterSkill;
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, reviewerNotes: reviewerNote }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus, reviewerNotes: reviewerNote } : a))
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp((prev: any) => ({ ...prev, status: newStatus, reviewerNotes: reviewerNote }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-border shadow-soft flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, ref code..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Search className="w-3.5 h-3.5 text-neutral-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="ALL">All Disciplines</option>
            <option value="Braiding & Hairstyling">Braiding & Hairstyling</option>
            <option value="Ceramic Sculpting">Ceramic Sculpting</option>
            <option value="Content Creation & Digital Media">Content Creation</option>
            <option value="Nail Artistry & Beauty Tech">Nail Artistry</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-surface text-neutral-muted uppercase tracking-wider font-bold border-b border-neutral-border">
              <tr>
                <th className="px-4 py-3">Ref Code</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Age / Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-muted">
                    No applications matching the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-surface/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary-navy">
                      {app.refCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-primary-navy">{app.fullName}</div>
                      <div className="text-[11px] text-neutral-muted">{app.email} · {app.phone}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-dark">
                      {app.skillPreference}
                    </td>
                    <td className="px-4 py-3 text-neutral-muted">
                      {app.age} yrs · {app.location}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-surface text-primary-navy border border-neutral-border">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-muted">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewerNote(app.reviewerNotes || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary-navy/5 text-primary-navy hover:bg-primary-navy hover:text-white font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={`Reviewing: ${selectedApp.fullName}`}
          description={`Reference: ${selectedApp.refCode} · Track: ${selectedApp.skillPreference}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Candidate Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-surface p-3.5 rounded-xl">
              <div>
                <span className="text-neutral-muted block">Age / City</span>
                <strong className="text-primary-navy">{selectedApp.age} yrs · {selectedApp.location}</strong>
              </div>
              <div>
                <span className="text-neutral-muted block">Education</span>
                <strong className="text-primary-navy">{selectedApp.education}</strong>
              </div>
              <div>
                <span className="text-neutral-muted block">Phone</span>
                <strong className="text-primary-navy">{selectedApp.phone}</strong>
              </div>
              <div>
                <span className="text-neutral-muted block">Emergency Contact</span>
                <strong className="text-primary-navy">{selectedApp.emergencyContact}</strong>
              </div>
            </div>

            {/* Motivation Statement */}
            <div className="space-y-1.5">
              <strong className="text-primary-navy block uppercase tracking-wider text-[11px]">
                Candidate Motivation Statement
              </strong>
              <div className="p-4 bg-white rounded-xl border border-neutral-border leading-relaxed text-neutral-dark text-sm max-h-48 overflow-y-auto">
                {selectedApp.motivation}
              </div>
            </div>

            {/* Previous Experience & Portfolio */}
            {selectedApp.previousExperience && (
              <div className="space-y-1">
                <strong className="text-primary-navy block uppercase tracking-wider text-[11px]">
                  Prior Experience
                </strong>
                <p className="text-neutral-muted">{selectedApp.previousExperience}</p>
              </div>
            )}

            {selectedApp.portfolioUrl && (
              <div className="space-y-1">
                <strong className="text-primary-navy block uppercase tracking-wider text-[11px]">
                  Portfolio Link
                </strong>
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>{selectedApp.portfolioUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Reviewer Notes */}
            <div className="space-y-1.5">
              <label className="block text-primary-navy font-bold uppercase tracking-wider text-[11px]">
                Admissions Notes & Feedback
              </label>
              <textarea
                rows={3}
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Add private evaluation notes or instructions for the applicant..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            {/* Decision Status Actions */}
            <div className="pt-3 border-t border-neutral-border space-y-2">
              <div className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                Update Candidate Status
              </div>
              <div className="flex flex-wrap gap-2">
                {['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'WAITLISTED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(selectedApp.id, st)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      selectedApp.status === st
                        ? 'bg-primary-navy text-gold ring-2 ring-gold'
                        : 'bg-neutral-surface text-neutral-dark hover:bg-neutral-border'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
