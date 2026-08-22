'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatFCFA, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Upload, 
  Eye, 
  EyeOff, 
  X, 
  Video,
  Trophy
} from 'lucide-react';

export function CohortsClient({
  initialCohorts,
  initialSkills,
}: {
  initialCohorts: any[];
  initialSkills: any[];
}) {
  const [cohorts, setCohorts] = useState(initialCohorts);
  const [skills, setSkills] = useState(initialSkills);
  const [activeTab, setActiveTab] = useState<'cohorts' | 'skills'>('cohorts');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [editingCohort, setEditingCohort] = useState<any | null>(null);
  const [cohortForm, setCohortForm] = useState({
    cohortNumber: 2,
    title: '',
    theme: '',
    description: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    status: 'COMING_SOON',
    maxParticipants: 30,
    totalPrizeMoney: 400000,
  });

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    iconName: 'Sparkles',
    coverImage: '',
    videoUrl: '',
    instructor: '',
    prizeAmount: 100000,
    toolsIncluded: '[]',
    outcomes: '[]',
    cohortId: '',
    published: true,
    displayOrder: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'coverImage' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', targetField === 'videoUrl' ? 'videos' : 'programs');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSkillForm((prev) => ({ ...prev, [targetField]: data.url }));
        showNotification('success', 'File uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Upload failed.');
      }
    } catch {
      showNotification('error', 'Network error during file upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Cohort CRUD
  const openCohortModal = (cohort?: any) => {
    if (cohort) {
      setEditingCohort(cohort);
      setCohortForm({
        cohortNumber: cohort.cohortNumber,
        title: cohort.title,
        theme: cohort.theme || '',
        description: cohort.description,
        startDate: cohort.startDate ? new Date(cohort.startDate).toISOString().split('T')[0] : '',
        endDate: cohort.endDate ? new Date(cohort.endDate).toISOString().split('T')[0] : '',
        applicationDeadline: cohort.applicationDeadline ? new Date(cohort.applicationDeadline).toISOString().split('T')[0] : '',
        status: cohort.status,
        maxParticipants: cohort.maxParticipants,
        totalPrizeMoney: cohort.totalPrizeMoney,
      });
    } else {
      setEditingCohort(null);
      setCohortForm({
        cohortNumber: cohorts.length + 1,
        title: `Cohort ${cohorts.length + 1}: The Next Generation`,
        theme: '',
        description: '',
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        status: 'COMING_SOON',
        maxParticipants: 30,
        totalPrizeMoney: 400000,
      });
    }
    setShowCohortModal(true);
  };

  const handleSaveCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingCohort ? 'PUT' : 'POST';
      const body = editingCohort ? { ...cohortForm, id: editingCohort.id } : cohortForm;

      const res = await fetch('/api/admin/cohorts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingCohort) {
          setCohorts((prev) => prev.map((c) => (c.id === data.cohort.id ? data.cohort : c)));
          showNotification('success', 'Cohort updated successfully!');
        } else {
          setCohorts((prev) => [...prev, data.cohort]);
          showNotification('success', 'New cohort created successfully!');
        }
        setShowCohortModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save cohort.');
      }
    } catch {
      showNotification('error', 'Network error saving cohort.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCohort = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return;
    try {
      const res = await fetch(`/api/admin/cohorts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCohorts((prev) => prev.filter((c) => c.id !== id));
        showNotification('success', 'Cohort deleted.');
      } else {
        showNotification('error', 'Failed to delete cohort.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  // Skill CRUD
  const openSkillModal = (skill?: any) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({
        name: skill.name,
        slug: skill.slug,
        shortDesc: skill.shortDesc,
        fullDesc: skill.fullDesc,
        iconName: skill.iconName || 'Sparkles',
        coverImage: skill.coverImage,
        videoUrl: skill.videoUrl || '',
        instructor: skill.instructor || '',
        prizeAmount: skill.prizeAmount,
        toolsIncluded: skill.toolsIncluded || '[]',
        outcomes: skill.outcomes || '[]',
        cohortId: skill.cohortId || '',
        published: skill.published !== false,
        displayOrder: skill.displayOrder || 0,
      });
    } else {
      setEditingSkill(null);
      setSkillForm({
        name: '',
        slug: '',
        shortDesc: '',
        fullDesc: '',
        iconName: 'Sparkles',
        coverImage: '',
        videoUrl: '',
        instructor: '',
        prizeAmount: 100000,
        toolsIncluded: JSON.stringify(['Professional Toolset', 'Hands-on Workshops', 'Masterclass Materials']),
        outcomes: JSON.stringify(['Portfolio of Work', 'Live Client Experience', 'Cash Prize Eligibility']),
        cohortId: cohorts[0]?.id || '',
        published: true,
        displayOrder: skills.length,
      });
    }
    setShowSkillModal(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingSkill ? 'PUT' : 'POST';
      const body = editingSkill ? { ...skillForm, id: editingSkill.id } : skillForm;

      const res = await fetch('/api/admin/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingSkill) {
          setSkills((prev) => prev.map((s) => (s.id === data.skill.id ? data.skill : s)));
          showNotification('success', 'Skill track updated!');
        } else {
          setSkills((prev) => [...prev, data.skill]);
          showNotification('success', 'New skill track created and live on public site!');
        }
        setShowSkillModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save skill track.');
      }
    } catch {
      showNotification('error', 'Network error saving skill track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublishSkill = async (skill: any) => {
    try {
      const updatedPublished = !skill.published;
      const res = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: skill.id, published: updatedPublished }),
      });
      if (res.ok) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, published: updatedPublished } : s))
        );
        showNotification('success', `Skill ${updatedPublished ? 'published' : 'unpublished'}.`);
      }
    } catch {
      showNotification('error', 'Failed to update publication status.');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this skill?')) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showNotification('success', 'Skill track removed.');
      } else {
        showNotification('error', 'Failed to delete skill.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-border pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cohorts')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'cohorts'
                ? 'bg-primary-navy text-white shadow-soft'
                : 'text-neutral-muted hover:text-primary-navy hover:bg-neutral-surface'
            }`}
          >
            Cohorts ({cohorts.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'skills'
                ? 'bg-primary-navy text-white shadow-soft'
                : 'text-neutral-muted hover:text-primary-navy hover:bg-neutral-surface'
            }`}
          >
            Vocational Skills & Programs ({skills.length})
          </button>
        </div>

        {activeTab === 'cohorts' ? (
          <Button
            variant="gold"
            size="sm"
            onClick={() => openCohortModal()}
            leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
          >
            Add New Cohort
          </Button>
        ) : (
          <Button
            variant="gold"
            size="sm"
            onClick={() => openSkillModal()}
            leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
          >
            Add New Skill Track
          </Button>
        )}
      </div>

      {/* Cohorts Tab View */}
      {activeTab === 'cohorts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cohorts.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gold-700 bg-gold-light px-3 py-1 rounded-full">
                    Cohort {c.cohortNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      c.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : c.status === 'COMING_SOON'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : c.status === 'COMPLETED'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-neutral-surface text-neutral-muted border-neutral-border'
                    }`}
                  >
                    {c.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-primary-navy">{c.title}</h3>
                {c.theme && <p className="text-xs font-semibold text-gold-700">{c.theme}</p>}
                <p className="text-xs text-neutral-muted leading-relaxed">{c.description}</p>

                <div className="pt-3 border-t border-neutral-border grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-muted block text-[10px]">Timeline</span>
                    <span className="font-bold text-primary-navy">
                      {formatDate(c.startDate)} – {formatDate(c.endDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-muted block text-[10px]">Prize Pool</span>
                    <span className="font-bold text-gold-700">{formatFCFA(c.totalPrizeMoney)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-border flex items-center justify-end gap-2">
                <button
                  onClick={() => openCohortModal(c)}
                  className="p-2 rounded-lg hover:bg-neutral-surface text-primary-navy transition-colors border border-neutral-border"
                  title="Edit Cohort"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCohort(c.id)}
                  className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors border border-neutral-border"
                  title="Delete Cohort"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Tab View */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-3xl overflow-hidden border shadow-soft flex flex-col justify-between transition-all ${
                s.published ? 'border-neutral-border' : 'border-dashed border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                <div className="relative h-44 w-full bg-primary-navy">
                  {s.coverImage && (
                    <Image src={s.coverImage} alt={s.name} fill className="object-cover" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.published
                          ? 'bg-emerald-500 text-white shadow-soft'
                          : 'bg-amber-400 text-primary-navy shadow-soft'
                      }`}
                    >
                      {s.published ? 'Published' : 'Draft / Hidden'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-700 font-mono">
                      {formatFCFA(s.prizeAmount)} Prize
                    </span>
                    <span className="text-[10px] text-neutral-muted font-mono">/{s.slug}</span>
                  </div>
                  <h4 className="text-base font-bold text-primary-navy">{s.name}</h4>
                  <p className="text-xs text-neutral-muted line-clamp-3 leading-relaxed">{s.shortDesc}</p>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-border bg-neutral-surface/30 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTogglePublishSkill(s)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors ${
                    s.published
                      ? 'bg-white text-neutral-muted hover:text-amber-600 border-neutral-border'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={s.published ? 'Unpublish from website' : 'Publish to website'}
                >
                  {s.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{s.published ? 'Unpublish' : 'Publish'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openSkillModal(s)}
                    className="p-1.5 rounded-lg hover:bg-white text-primary-navy border border-neutral-border transition-colors"
                    title="Edit Skill"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cohort Modal */}
      {showCohortModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingCohort ? `Edit Cohort #${cohortForm.cohortNumber}` : 'Create New Cohort'}
              </h3>
              <button onClick={() => setShowCohortModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveCohort} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Cohort #</label>
                  <input
                    type="number"
                    required
                    value={cohortForm.cohortNumber}
                    onChange={(e) => setCohortForm({ ...cohortForm, cohortNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Status</label>
                  <select
                    value={cohortForm.status}
                    onChange={(e) => setCohortForm({ ...cohortForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold bg-white"
                  >
                    <option value="COMING_SOON">Coming Soon</option>
                    <option value="ACTIVE">Active / Open</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Cohort Title</label>
                <input
                  type="text"
                  required
                  value={cohortForm.title}
                  onChange={(e) => setCohortForm({ ...cohortForm, title: e.target.value })}
                  placeholder="Cohort 2: The Next Generation"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Cohort Theme</label>
                <input
                  type="text"
                  value={cohortForm.theme}
                  onChange={(e) => setCohortForm({ ...cohortForm, theme: e.target.value })}
                  placeholder="Expansion, Advanced Enterprise & Creative Tech"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={cohortForm.description}
                  onChange={(e) => setCohortForm({ ...cohortForm, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={cohortForm.startDate}
                    onChange={(e) => setCohortForm({ ...cohortForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={cohortForm.endDate}
                    onChange={(e) => setCohortForm({ ...cohortForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Max Fellows</label>
                  <input
                    type="number"
                    value={cohortForm.maxParticipants}
                    onChange={(e) => setCohortForm({ ...cohortForm, maxParticipants: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Total Prize Pool (FCFA)</label>
                  <input
                    type="number"
                    value={cohortForm.totalPrizeMoney}
                    onChange={(e) => setCohortForm({ ...cohortForm, totalPrizeMoney: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center font-bold mt-4"
              >
                {editingCohort ? 'Save Changes' : 'Create Cohort'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingSkill ? `Edit Skill: ${skillForm.name}` : 'Create New Skill Track'}
              </h3>
              <button onClick={() => setShowSkillModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={skillForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSkillForm((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }));
                    }}
                    placeholder="Photography & Videography"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={skillForm.slug}
                    onChange={(e) => setSkillForm({ ...skillForm, slug: e.target.value })}
                    placeholder="photography"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Short Description (Cards)</label>
                <textarea
                  rows={2}
                  required
                  value={skillForm.shortDesc}
                  onChange={(e) => setSkillForm({ ...skillForm, shortDesc: e.target.value })}
                  placeholder="Master studio lighting, visual composition, and commercial photo production."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Full Curriculum Description</label>
                <textarea
                  rows={4}
                  required
                  value={skillForm.fullDesc}
                  onChange={(e) => setSkillForm({ ...skillForm, fullDesc: e.target.value })}
                  placeholder="In-depth overview of the syllabus, technical training, and capstone challenge..."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Cover Image</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={skillForm.coverImage}
                      onChange={(e) => setSkillForm({ ...skillForm, coverImage: e.target.value })}
                      placeholder="/images/photo.jpg"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                    />
                    <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                      <Upload className="w-4 h-4 text-primary-navy" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'coverImage')}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Track Video (Optional)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skillForm.videoUrl}
                      onChange={(e) => setSkillForm({ ...skillForm, videoUrl: e.target.value })}
                      placeholder="/videos/track.mp4"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                    />
                    <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                      <Video className="w-4 h-4 text-primary-navy" />
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'videoUrl')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Prize Amount (FCFA)</label>
                  <input
                    type="number"
                    value={skillForm.prizeAmount}
                    onChange={(e) => setSkillForm({ ...skillForm, prizeAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Instructor / Lead</label>
                  <input
                    type="text"
                    value={skillForm.instructor}
                    onChange={(e) => setSkillForm({ ...skillForm, instructor: e.target.value })}
                    placeholder="e.g. Master Artisan"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published_toggle"
                  checked={skillForm.published}
                  onChange={(e) => setSkillForm({ ...skillForm, published: e.target.checked })}
                  className="rounded text-gold focus:ring-gold"
                />
                <label htmlFor="published_toggle" className="text-xs font-bold text-primary-navy cursor-pointer">
                  Publish immediately (Visible on public /programs pages)
                </label>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || uploadingImage}
                className="w-full justify-center font-bold mt-4"
              >
                {editingSkill ? 'Save Changes' : 'Publish Skill Track'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
