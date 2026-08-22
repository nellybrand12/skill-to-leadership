'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Trash2, 
  Edit3,
  Plus,
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Mail, 
  Phone, 
  Linkedin,
  Clock,
  Briefcase,
  Upload,
  X,
  UserCheck,
  Sparkles
} from 'lucide-react';

export function VolunteersClient({ initialVolunteers }: { initialVolunteers: any[] }) {
  const [volunteers, setVolunteers] = useState<any[]>(initialVolunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    rolePreference: 'MENTOR',
    roleTitle: '',
    imageUrl: '',
    bio: '',
    linkedin: '',
    availability: 'Flexible',
    status: 'APPROVED',
  });

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredVolunteers = volunteers.filter((vol) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      vol.fullName.toLowerCase().includes(term) ||
      vol.email.toLowerCase().includes(term) ||
      vol.phone?.toLowerCase().includes(term) ||
      vol.rolePreference.toLowerCase().includes(term) ||
      (vol.roleTitle && vol.roleTitle.toLowerCase().includes(term)) ||
      vol.bio.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || vol.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (volunteer?: any) => {
    if (volunteer) {
      setEditingVolunteer(volunteer);
      setForm({
        fullName: volunteer.fullName || '',
        email: volunteer.email || '',
        phone: volunteer.phone || '',
        rolePreference: volunteer.rolePreference || 'MENTOR',
        roleTitle: volunteer.roleTitle || '',
        imageUrl: volunteer.imageUrl || '',
        bio: volunteer.bio || '',
        linkedin: volunteer.linkedin || '',
        availability: volunteer.availability || 'Flexible',
        status: volunteer.status || 'APPROVED',
      });
    } else {
      setEditingVolunteer(null);
      setForm({
        fullName: '',
        email: '',
        phone: '',
        rolePreference: 'MENTOR',
        roleTitle: '',
        imageUrl: '',
        bio: '',
        linkedin: '',
        availability: 'Flexible',
        status: 'APPROVED',
      });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'team');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        showNotification('success', 'Profile photo uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Upload failed.');
      }
    } catch {
      showNotification('error', 'Network error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      showNotification('error', 'Full Name and Email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingVolunteer ? 'PUT' : 'POST';
      const body = editingVolunteer ? { ...form, id: editingVolunteer.id } : form;

      const res = await fetch('/api/admin/volunteers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingVolunteer) {
          setVolunteers((prev) => prev.map((v) => (v.id === data.volunteer.id ? data.volunteer : v)));
          showNotification('success', 'Volunteer / Staff member updated successfully!');
        } else {
          setVolunteers((prev) => [data.volunteer, ...prev]);
          showNotification('success', 'New volunteer / staff member created!');
        }
        setShowModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save.');
      }
    } catch {
      showNotification('error', 'Network error saving information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setVolunteers((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
        );
        showNotification('success', `Status updated to ${newStatus}.`);
      } else {
        showNotification('error', 'Failed to update status.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this person from the registry?')) return;
    try {
      const res = await fetch(`/api/admin/volunteers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
        showNotification('success', 'Record deleted successfully.');
      } else {
        showNotification('error', 'Failed to delete record.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Action & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-border shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, role, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
            />
            <Search className="w-4 h-4 text-neutral-muted absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy font-medium focus:ring-2 focus:ring-gold"
          >
            <option value="ALL">All Statuses ({volunteers.length})</option>
            <option value="APPROVED">Approved</option>
            <option value="CONTACTED">Contacted</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => openModal()}
          leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
          className="w-full sm:w-auto font-bold"
        >
          Add Volunteer / Staff
        </Button>
      </div>

      {/* Volunteers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolunteers.map((vol) => (
          <div
            key={vol.id}
            className="bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header: Photo + Info */}
              <div className="flex items-start gap-3.5">
                {vol.imageUrl ? (
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-primary-navy shrink-0 border border-gold/40 shadow-soft">
                    <Image src={vol.imageUrl} alt={vol.fullName} fill className="object-cover object-top" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gold-light/60 text-primary-navy font-black flex items-center justify-center text-lg shrink-0 border border-gold/30">
                    {vol.fullName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gold-700 bg-gold-light/60 px-2 py-0.5 rounded-full">
                      {vol.rolePreference}
                    </span>
                    <select
                      value={vol.status}
                      onChange={(e) => handleUpdateStatus(vol.id, e.target.value)}
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border bg-white focus:outline-none ${
                        vol.status === 'APPROVED'
                          ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50'
                          : vol.status === 'CONTACTED'
                          ? 'text-blue-700 border-blue-200 bg-blue-50/50'
                          : 'text-amber-700 border-amber-200 bg-amber-50/50'
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="APPROVED">Approved</option>
                    </select>
                  </div>

                  <h3 className="text-base font-bold text-primary-navy truncate">{vol.fullName}</h3>
                  {vol.roleTitle && (
                    <div className="text-[11px] font-semibold text-gold-700 truncate mt-0.5">
                      {vol.roleTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Contacts */}
              <div className="flex flex-col gap-1.5 text-xs text-neutral-muted pt-1 border-t border-neutral-border/60">
                <a href={`mailto:${vol.email}`} className="hover:text-gold-700 flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                  <span className="truncate">{vol.email}</span>
                </a>
                {vol.phone && (
                  <a href={`tel:${vol.phone}`} className="hover:text-gold-700 flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                    <span>{vol.phone}</span>
                  </a>
                )}
                {vol.linkedin && (
                  <a
                    href={vol.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-700 flex items-center gap-2 text-sky-700 font-medium truncate"
                  >
                    <Linkedin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{vol.linkedin}</span>
                  </a>
                )}
              </div>

              {/* Bio / Motivation */}
              {vol.bio && (
                <div className="bg-neutral-surface/60 p-3.5 rounded-2xl border border-neutral-border/60 text-xs text-primary-navy leading-relaxed">
                  <div className="font-bold text-[10px] text-neutral-muted uppercase tracking-wider mb-1">
                    Bio & Motivation
                  </div>
                  <p className="line-clamp-3">{vol.bio}</p>
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-muted pt-0.5">
                <Clock className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                <span>Availability: {vol.availability || 'Flexible'}</span>
              </div>
            </div>

            {/* Footer Toolbar */}
            <div className="pt-3 border-t border-neutral-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-muted">
                {formatDate(vol.createdAt)}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openModal(vol)}
                  className="p-1.5 rounded-lg hover:bg-neutral-surface text-primary-navy border border-neutral-border transition-colors"
                  title="Edit volunteer details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(vol.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create / Edit Volunteer */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingVolunteer ? `Edit Details: ${form.fullName}` : 'Add Volunteer or Staff Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Choh Laura Kendzu'u"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Contact Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+237 670 00 00 00"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Role Domain</label>
                  <select
                    value={form.rolePreference}
                    onChange={(e) => setForm({ ...form, rolePreference: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy focus:ring-2 focus:ring-gold"
                  >
                    <option value="INSTRUCTOR">Instructor / Faculty</option>
                    <option value="MENTOR">Mentor / Advisor</option>
                    <option value="STAFF">Staff / Operations</option>
                    <option value="MEDIA">Media & Storytelling</option>
                    <option value="EVENT_COORDINATOR">Event Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy focus:ring-2 focus:ring-gold"
                  >
                    <option value="APPROVED">Approved</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Custom Role Title (Optional)
                </label>
                <input
                  type="text"
                  value={form.roleTitle}
                  onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                  placeholder="e.g. Head of Hair Artistry & Protective Styling"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Profile Image & Upload */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Profile Photo URL (Upload or Paste URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/images/staff/Braiding-staff.jpg"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold font-mono"
                  />
                  <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-primary-navy" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {isUploading && <span className="text-[10px] text-gold-700">Uploading photo...</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Availability</label>
                  <input
                    type="text"
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    placeholder="e.g. Weekdays & Studio Sessions"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Bio / Background & Experience</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Summary of experience, domain mentorship, and background..."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
                  {editingVolunteer ? 'Save Changes' : 'Create Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
