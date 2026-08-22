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
  Search,
  MessageSquareQuote,
  Image as ImageIcon,
  Sparkles,
  Quote,
  User,
  Briefcase
} from 'lucide-react';

export function GalleryClient({
  initialItems,
  cohorts,
  initialTestimonials = [],
}: {
  initialItems: any[];
  cohorts: any[];
  initialTestimonials?: any[];
}) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'photos' | 'testimonials'>('photos');

  // Photo Gallery State
  const [items, setItems] = useState<any[]>(initialItems);
  const [cohortFilter, setCohortFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Testimonials State
  const [testimonialsList, setTestimonialsList] = useState<any[]>(initialTestimonials);
  const [testimonialSearch, setTestimonialSearch] = useState('');

  // Notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Gallery Modal states
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'WORKSHOPS',
    cohortId: '',
    orderIndex: 0,
    published: true,
  });

  // Testimonial Modal states
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: 'Cohort 1 Participant',
    track: '',
    image: '',
    text: '',
    outcome: '',
    displayOrder: 0,
    published: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered Gallery Items
  const filteredGalleryItems = items.filter((item) => {
    const matchesCohort = cohortFilter === 'ALL' || item.cohortId === cohortFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesCohort && matchesCategory;
  });

  // Filtered Testimonials
  const filteredTestimonials = testimonialsList.filter((tm) => {
    const term = testimonialSearch.toLowerCase();
    return (
      tm.name.toLowerCase().includes(term) ||
      (tm.role && tm.role.toLowerCase().includes(term)) ||
      (tm.track && tm.track.toLowerCase().includes(term)) ||
      tm.text.toLowerCase().includes(term) ||
      (tm.outcome && tm.outcome.toLowerCase().includes(term))
    );
  });

  // Upload handler for Gallery Photos
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setGalleryForm((prev) => ({
          ...prev,
          imageUrl: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
        showNotification('success', 'Image uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Upload failed.');
      }
    } catch {
      showNotification('error', 'Network error during image upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload handler for Testimonial Headshot
  const handleTestimonialPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'testimonials');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonialForm((prev) => ({
          ...prev,
          image: data.url,
        }));
        showNotification('success', 'Profile photo uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Upload failed.');
      }
    } catch {
      showNotification('error', 'Network error during photo upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Gallery Modal
  const openGalleryModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setGalleryForm({
        title: item.title,
        description: item.description || '',
        imageUrl: item.imageUrl,
        category: item.category,
        cohortId: item.cohortId || '',
        orderIndex: item.orderIndex || 0,
        published: item.published !== false,
      });
    } else {
      setEditingItem(null);
      setGalleryForm({
        title: '',
        description: '',
        imageUrl: '',
        category: 'WORKSHOPS',
        cohortId: cohorts[0]?.id || '',
        orderIndex: items.length,
        published: true,
      });
    }
    setShowGalleryModal(true);
  };

  // Save Gallery Item
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) {
      showNotification('error', 'Please upload or provide an image URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...galleryForm, id: editingItem.id } : galleryForm;

      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingItem) {
          setItems((prev) => prev.map((item) => (item.id === data.item.id ? data.item : item)));
          showNotification('success', 'Gallery item updated!');
        } else {
          setItems((prev) => [data.item, ...prev]);
          showNotification('success', 'Photo added to gallery and live on public site!');
        }
        setShowGalleryModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save gallery item.');
      }
    } catch {
      showNotification('error', 'Network error saving gallery item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Gallery Item Publish
  const handleToggleGalleryPublish = async (item: any) => {
    const updatedPublished = !item.published;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, published: updatedPublished }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, published: updatedPublished } : i))
        );
        showNotification('success', `Photo ${updatedPublished ? 'published' : 'hidden'}.`);
      }
    } catch {
      showNotification('error', 'Failed to update visibility.');
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this photo?')) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showNotification('success', 'Photo deleted.');
      } else {
        showNotification('error', 'Failed to delete photo.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  // Open Testimonial Modal
  const openTestimonialModal = (testimonial?: any) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialForm({
        name: testimonial.name || '',
        role: testimonial.role || 'Cohort 1 Participant',
        track: testimonial.track || '',
        image: testimonial.image || '',
        text: testimonial.text || '',
        outcome: testimonial.outcome || '',
        displayOrder: testimonial.displayOrder || 0,
        published: testimonial.published !== false,
      });
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({
        name: '',
        role: 'Cohort 1 Participant',
        track: '',
        image: '/images/CH1-candidates/1.jpg',
        text: '',
        outcome: '',
        displayOrder: testimonialsList.length + 1,
        published: true,
      });
    }
    setShowTestimonialModal(true);
  };

  // Save Testimonial
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.text) {
      showNotification('error', 'Name and Testimonial Content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingTestimonial ? 'PUT' : 'POST';
      const body = editingTestimonial ? { ...testimonialForm, id: editingTestimonial.id } : testimonialForm;

      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingTestimonial) {
          setTestimonialsList((prev) =>
            prev.map((t) => (t.id === data.testimonial.id ? data.testimonial : t))
          );
          showNotification('success', 'Testimonial updated successfully!');
        } else {
          setTestimonialsList((prev) => [...prev, data.testimonial]);
          showNotification('success', 'New testimonial added to website!');
        }
        setShowTestimonialModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save testimonial.');
      }
    } catch {
      showNotification('error', 'Network error saving testimonial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Testimonial Publish
  const handleToggleTestimonialPublish = async (tm: any) => {
    const updatedPublished = !tm.published;
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tm.id, published: updatedPublished }),
      });
      if (res.ok) {
        setTestimonialsList((prev) =>
          prev.map((t) => (t.id === tm.id ? { ...t, published: updatedPublished } : t))
        );
        showNotification('success', `Testimonial ${updatedPublished ? 'published' : 'hidden'}.`);
      }
    } catch {
      showNotification('error', 'Failed to update testimonial visibility.');
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
        showNotification('success', 'Testimonial deleted.');
      } else {
        showNotification('error', 'Failed to delete testimonial.');
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

      {/* Main Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-surface rounded-2xl border border-neutral-border max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'photos'
              ? 'bg-primary-navy text-white shadow-soft font-black'
              : 'text-neutral-muted hover:text-primary-navy'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Visual Photos ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('testimonials')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'testimonials'
              ? 'bg-gold text-primary-navy shadow-soft font-black'
              : 'text-neutral-muted hover:text-primary-navy'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Testimonials ({testimonialsList.length})</span>
        </button>
      </div>

      {/* TAB 1: VISUAL MOMENTS & PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Action Bar & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-border shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={cohortFilter}
                onChange={(e) => setCohortFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy font-medium focus:ring-2 focus:ring-gold"
              >
                <option value="ALL">All Cohorts ({items.length})</option>
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>
                    Cohort {c.cohortNumber}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy font-medium focus:ring-2 focus:ring-gold"
              >
                <option value="ALL">All Categories</option>
                <option value="WORKSHOPS">Workshops</option>
                <option value="BRAIDING">Braiding</option>
                <option value="CERAMICS">Ceramics</option>
                <option value="CONTENT_CREATION">Content Creation</option>
                <option value="NAIL_ART">Nail Art</option>
                <option value="COMPETITION">Competition</option>
                <option value="AWARDS">Awards</option>
              </select>
            </div>

            <Button
              variant="gold"
              size="sm"
              onClick={() => openGalleryModal()}
              leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
            >
              Upload Photo
            </Button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGalleryItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl overflow-hidden border shadow-soft flex flex-col justify-between transition-all ${
                  item.published ? 'border-neutral-border' : 'border-dashed border-amber-300 bg-amber-50/20'
                }`}
              >
                <div>
                  <div className="relative h-48 w-full bg-primary-navy">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          item.published ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-primary-navy'
                        }`}
                      >
                        {item.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    {item.cohort && (
                      <div className="absolute bottom-2 left-3">
                        <span className="bg-primary-navy/80 backdrop-blur-md text-gold text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Cohort {item.cohort.cohortNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-primary-navy line-clamp-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-[11px] text-neutral-muted line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-3 border-t border-neutral-border bg-neutral-surface/30 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleGalleryPublish(item)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors ${
                      item.published
                        ? 'bg-white text-neutral-muted hover:text-amber-600 border-neutral-border'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={item.published ? 'Hide from public site' : 'Publish to public site'}
                  >
                    {item.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{item.published ? 'Hide' : 'Publish'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openGalleryModal(item)}
                      className="p-1.5 rounded-lg hover:bg-white text-primary-navy border border-neutral-border transition-colors"
                      title="Edit Photo"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PARTICIPANT TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          {/* Action Bar & Search */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-border shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search testimonials by name, position, quote..."
                value={testimonialSearch}
                onChange={(e) => setTestimonialSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
              />
              <Search className="w-4 h-4 text-neutral-muted absolute left-3 top-2.5" />
            </div>

            <Button
              variant="gold"
              size="sm"
              onClick={() => openTestimonialModal()}
              leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
              className="w-full sm:w-auto font-bold"
            >
              Add Testimonial
            </Button>
          </div>

          {/* Testimonials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((tm) => (
              <div
                key={tm.id}
                className={`bg-white rounded-3xl p-6 border shadow-soft flex flex-col justify-between transition-all space-y-4 ${
                  tm.published ? 'border-neutral-border' : 'border-dashed border-amber-300 bg-amber-50/20'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Photo + Name + Position */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-primary-navy shrink-0 border border-gold/40 shadow-soft">
                      <Image
                        src={tm.image || '/images/CH1-candidates/1.jpg'}
                        alt={tm.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-700 bg-gold-light/60 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                          {tm.role || 'Cohort 1 Participant'}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            tm.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {tm.published ? 'Published' : 'Hidden'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-primary-navy truncate">{tm.name}</h3>
                      {tm.track && (
                        <div className="text-[11px] font-semibold text-gold-700 truncate mt-0.5">
                          {tm.track}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="bg-neutral-surface/60 p-3.5 rounded-2xl border border-neutral-border/60 text-xs text-primary-navy leading-relaxed relative space-y-1">
                    <Quote className="w-4 h-4 text-gold-600/75 fill-gold-200" />
                    <p className="line-clamp-4 italic">&ldquo;{tm.text}&rdquo;</p>
                  </div>

                  {/* Outcome Highlight */}
                  {tm.outcome && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-muted pt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                      <span className="truncate">{tm.outcome}</span>
                    </div>
                  )}
                </div>

                {/* Footer Toolbar */}
                <div className="pt-3 border-t border-neutral-border flex items-center justify-between">
                  <button
                    onClick={() => handleToggleTestimonialPublish(tm)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-colors ${
                      tm.published
                        ? 'bg-white text-neutral-muted hover:text-amber-600 border-neutral-border'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {tm.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{tm.published ? 'Hide' : 'Publish'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openTestimonialModal(tm)}
                      className="p-1.5 rounded-lg hover:bg-neutral-surface text-primary-navy border border-neutral-border transition-colors"
                      title="Edit Testimonial"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(tm.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Upload / Edit Gallery Photo */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingItem ? 'Edit Photo Details' : 'Upload New Photo'}
              </h3>
              <button onClick={() => setShowGalleryModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1.5">Image Asset</label>
                <div className="border-2 border-dashed border-neutral-border rounded-2xl p-4 text-center hover:border-gold transition-colors bg-neutral-surface/30">
                  {galleryForm.imageUrl ? (
                    <div className="space-y-2">
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-primary-navy">
                        <Image src={galleryForm.imageUrl} alt="Preview" fill className="object-cover" />
                      </div>
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:underline cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleGalleryUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block py-4">
                      <ImageIcon className="w-8 h-8 text-neutral-muted mx-auto" />
                      <div className="text-xs font-bold text-primary-navy">
                        {uploadingImage ? 'Uploading...' : 'Click to select image file from computer'}
                      </div>
                      <div className="text-[11px] text-neutral-muted">PNG, JPG, WebP up to 10MB</div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  placeholder="/images/gallery-item.jpg"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Photo Title / Label</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="Hair Braiding Masterclass Day 3"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Caption / Description (Optional)</label>
                <textarea
                  rows={2}
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  placeholder="Fellows practicing precision parting and cornrow techniques."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Assign Cohort</label>
                  <select
                    value={galleryForm.cohortId}
                    onChange={(e) => setGalleryForm({ ...galleryForm, cohortId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white"
                  >
                    <option value="">General Archive</option>
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.id}>
                        Cohort {c.cohortNumber} ({c.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white"
                  >
                    <option value="WORKSHOPS">Workshops</option>
                    <option value="BRAIDING">Braiding</option>
                    <option value="CERAMICS">Ceramics</option>
                    <option value="CONTENT_CREATION">Content Creation</option>
                    <option value="NAIL_ART">Nail Art</option>
                    <option value="COMPETITION">Competition</option>
                    <option value="AWARDS">Awards</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="gallery_published"
                  checked={galleryForm.published}
                  onChange={(e) => setGalleryForm({ ...galleryForm, published: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                <label htmlFor="gallery_published" className="text-xs font-bold text-primary-navy cursor-pointer">
                  Publish to website immediately
                </label>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || uploadingImage}
                className="w-full justify-center font-bold mt-4"
              >
                {editingItem ? 'Save Changes' : 'Add to Gallery'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create / Edit Testimonial */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingTestimonial ? `Edit Testimonial: ${testimonialForm.name}` : 'Add New Testimonial'}
              </h3>
              <button onClick={() => setShowTestimonialModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              {/* Person Name */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Person&apos;s Name <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder="e.g. Brenda Mbuh"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Position / Title Text Field */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Position / Role (e.g. Cohort 1 Participant, Cohort 2 Fellow, Artisan Mentor) <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                  placeholder="e.g. Cohort 1 Participant"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold font-medium"
                />
                <span className="text-[10px] text-neutral-muted block mt-0.5">
                  Enter any custom title or cohort affiliation here.
                </span>
              </div>

              {/* Track / Discipline */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Vocational Track / Discipline
                </label>
                <input
                  type="text"
                  value={testimonialForm.track}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, track: e.target.value })}
                  placeholder="e.g. Braiding & Protective Hairstyling"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Profile Photo / Headshot */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Profile Photo URL (Upload or Paste URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testimonialForm.image}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                    placeholder="/images/CH1-candidates/1.jpg"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border font-mono"
                  />
                  <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-primary-navy" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleTestimonialPhotoUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                {uploadingImage && <span className="text-[10px] text-gold-700">Uploading photo...</span>}
              </div>

              {/* Testimonial Content / Quote */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Testimonial Content / Reflection <span className="text-rose-600 font-bold">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  placeholder="Enter the participant's authentic reflection, learning journey, and impact..."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold leading-relaxed"
                />
              </div>

              {/* Outcome Highlight */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">
                  Outcome Milestone / Achievement (Optional)
                </label>
                <input
                  type="text"
                  value={testimonialForm.outcome}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, outcome: e.target.value })}
                  placeholder="e.g. Mastered 8 intricate styles · Launched boutique booking service"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Display Order</label>
                  <input
                    type="number"
                    value={testimonialForm.displayOrder}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="tm_published"
                    checked={testimonialForm.published}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, published: e.target.checked })}
                    className="rounded text-gold focus:ring-gold"
                  />
                  <label htmlFor="tm_published" className="text-xs font-bold text-primary-navy cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || uploadingImage}
                className="w-full justify-center font-bold mt-4"
              >
                {editingTestimonial ? 'Save Testimonial Changes' : 'Add Testimonial'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
