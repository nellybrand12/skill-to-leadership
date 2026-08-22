'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Eye, 
  EyeOff, 
  X, 
  Building,
  ExternalLink 
} from 'lucide-react';

export function PartnersClient({ initialPartners }: { initialPartners: any[] }) {
  const [partners, setPartners] = useState(initialPartners);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
    website: '',
    description: '',
    category: 'ACADEMIC',
    orderIndex: 0,
    isFeatured: true,
    published: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'partners');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          logoUrl: data.url,
          name: prev.name || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        showNotification('success', 'Logo uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Logo upload failed.');
      }
    } catch {
      showNotification('error', 'Network error uploading logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const openModal = (partner?: any) => {
    if (partner) {
      setEditingPartner(partner);
      setForm({
        name: partner.name,
        logoUrl: partner.logoUrl,
        website: partner.website || '',
        description: partner.description || '',
        category: partner.category || 'ACADEMIC',
        orderIndex: partner.orderIndex || 0,
        isFeatured: partner.isFeatured !== false,
        published: partner.published !== false,
      });
    } else {
      setEditingPartner(null);
      setForm({
        name: '',
        logoUrl: '',
        website: '',
        description: '',
        category: 'ACADEMIC',
        orderIndex: partners.length,
        isFeatured: true,
        published: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.logoUrl) {
      showNotification('error', 'Please upload or provide a partner logo image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingPartner ? 'PUT' : 'POST';
      const body = editingPartner ? { ...form, id: editingPartner.id } : form;

      const res = await fetch('/api/admin/partners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingPartner) {
          setPartners((prev) => prev.map((p) => (p.id === data.partner.id ? data.partner : p)));
          showNotification('success', 'Partner updated successfully!');
        } else {
          setPartners((prev) => [data.partner, ...prev]);
          showNotification('success', 'New partner added and live in the footer!');
        }
        setShowModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save partner.');
      }
    } catch {
      showNotification('error', 'Network error saving partner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (partner: any) => {
    const updatedPublished = !partner.published;
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: partner.id, published: updatedPublished }),
      });
      if (res.ok) {
        setPartners((prev) =>
          prev.map((p) => (p.id === partner.id ? { ...p, published: updatedPublished } : p))
        );
        showNotification('success', `Partner ${updatedPublished ? 'published' : 'hidden'}.`);
      }
    } catch {
      showNotification('error', 'Failed to update partner visibility.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
        showNotification('success', 'Partner deleted.');
      } else {
        showNotification('error', 'Failed to delete partner.');
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

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-border shadow-soft flex items-center justify-between">
        <div className="text-xs font-bold text-primary-navy">
          Active Partners ({partners.length})
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => openModal()}
          leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
        >
          Add Partner
        </Button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-3xl p-6 border shadow-soft space-y-4 flex flex-col justify-between transition-all ${
              p.published ? 'border-neutral-border' : 'border-dashed border-amber-300 bg-amber-50/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-light/60 px-2.5 py-0.5 rounded-full">
                  {p.category}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    p.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {p.published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <div className="h-14 flex items-center justify-center p-2 bg-ink-900 rounded-xl">
                <Image
                  src={p.logoUrl}
                  alt={p.name}
                  width={140}
                  height={40}
                  className="max-h-10 w-auto object-contain mix-blend-screen"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-primary-navy">{p.name}</h3>
                {p.description && (
                  <p className="text-xs text-neutral-muted mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                )}
              </div>

              {p.website && (
                <div className="pt-2 border-t border-neutral-border">
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-gold-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span className="truncate max-w-[200px]">{p.website}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-border flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors ${
                  p.published
                    ? 'bg-white text-neutral-muted hover:text-amber-600 border-neutral-border'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
                title={p.published ? 'Hide from footer' : 'Publish to footer'}
              >
                {p.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{p.published ? 'Hide' : 'Publish'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openModal(p)}
                  className="p-1.5 rounded-lg hover:bg-neutral-surface text-primary-navy border border-neutral-border transition-colors"
                  title="Edit Partner"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors"
                  title="Delete Partner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingPartner ? 'Edit Partner Details' : 'Add New Partner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Logo Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1.5">Partner Logo</label>
                <div className="border-2 border-dashed border-neutral-border rounded-2xl p-4 text-center hover:border-gold transition-colors bg-neutral-surface/30">
                  {form.logoUrl ? (
                    <div className="space-y-2">
                      <div className="h-20 w-full rounded-xl flex items-center justify-center bg-ink-900 p-2">
                        <Image
                          src={form.logoUrl}
                          alt="Preview"
                          width={140}
                          height={40}
                          className="max-h-12 w-auto object-contain mix-blend-screen"
                        />
                      </div>
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:underline cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace Logo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block py-4">
                      <Building className="w-8 h-8 text-neutral-muted mx-auto" />
                      <div className="text-xs font-bold text-primary-navy">
                        {uploadingLogo ? 'Uploading logo...' : 'Click to select logo file (PNG, JPG, SVG)'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Logo URL (or Auto-Filled)</label>
                <input
                  type="text"
                  required
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="/partners/Bucknell.png"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Partner Organization Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Bucknell University"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://www.bucknell.edu"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Institutional grant and peace project supporter."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white"
                  >
                    <option value="ACADEMIC">Academic / University</option>
                    <option value="GLOBAL_FELLOWSHIP">Global Fellowship</option>
                    <option value="COMMUNITY">Community / NGO</option>
                    <option value="CORPORATE">Corporate Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.orderIndex}
                    onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="partner_published"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                <label htmlFor="partner_published" className="text-xs font-bold text-primary-navy cursor-pointer">
                  Publish to footer immediately
                </label>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || uploadingLogo}
                className="w-full justify-center font-bold mt-4"
              >
                {editingPartner ? 'Save Changes' : 'Add Partner'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
