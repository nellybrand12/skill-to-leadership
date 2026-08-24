'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { getEventLifecycleStatus, formatEventDateTime } from '@/lib/events';
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
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  Film, 
  ExternalLink,
  Sparkles,
  Award,
  Video
} from 'lucide-react';

export function EventsAdminClient({ initialEvents }: { initialEvents: any[] }) {
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    slug: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    date: '',
    time: '9:00 AM Sharp',
    location: 'Yaoundé, Cameroon',
    isVirtual: false,
    coverImage: '',
    organizer: 'Skill to Leadership',
    eventType: 'EVENT' as 'EVENT' | 'COMPETITION',
    capacity: 100,
    isSpotlight: false,
    applicationsEnabled: false,
    applicationUrl: '',
    status: 'ACTIVE',
    published: true,
  });

  // Selected Event for Sub-Managers
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<any | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [participantForm, setParticipantForm] = useState({
    name: '',
    businessName: '',
    category: 'ENTREPRENEUR',
    photoUrl: '',
    bio: '',
    story: '',
    quote: '',
    website: '',
    isWinner: false,
    published: true,
  });

  const [selectedEventForWinner, setSelectedEventForWinner] = useState<any | null>(null);
  const [winnerForm, setWinnerForm] = useState({
    winnerName: '',
    winnerBusiness: '',
    winnerPhoto: '',
    winnerStory: '',
    winnerQuote: '',
    winnerPrize: '100,000 FCFA',
    hasWinner: true,
  });

  const [selectedEventForMedia, setSelectedEventForMedia] = useState<any | null>(null);
  const [mediaForm, setMediaForm] = useState({
    mediaType: 'IMAGE',
    url: '',
    caption: '',
    published: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetCallback: (url: string) => void, folder = 'events') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        targetCallback(data.url);
        showNotification('success', 'File uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Upload failed.');
      }
    } catch {
      showNotification('error', 'Network error uploading file.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Event CRUD
  const openEventModal = (event?: any) => {
    if (event) {
      setEditingEvent(event);
      const isComp = event.eventType === 'COMPETITION' || Boolean(event.isSpotlight);
      setEventForm({
        title: event.title,
        slug: event.slug,
        description: event.description,
        startDateTime: event.startDateTime ? new Date(event.startDateTime).toISOString().slice(0, 16) : '',
        endDateTime: event.endDateTime ? new Date(event.endDateTime).toISOString().slice(0, 16) : '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: event.time || '9:00 AM Sharp',
        location: event.location || 'Yaoundé, Cameroon',
        isVirtual: Boolean(event.isVirtual),
        coverImage: event.coverImage,
        organizer: event.organizer || 'Skill to Leadership',
        eventType: isComp ? 'COMPETITION' : 'EVENT',
        capacity: event.capacity || 100,
        isSpotlight: isComp,
        applicationsEnabled: event.applicationsEnabled !== undefined ? Boolean(event.applicationsEnabled) : Boolean(event.applicationUrl || isComp),
        applicationUrl: event.applicationUrl || '',
        status: event.status || 'ACTIVE',
        published: event.published !== false,
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        slug: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        date: new Date().toISOString().split('T')[0],
        time: '9:00 AM Sharp',
        location: 'Yaoundé, Cameroon',
        isVirtual: false,
        coverImage: '',
        organizer: 'Skill to Leadership',
        eventType: 'EVENT',
        capacity: 100,
        isSpotlight: false,
        applicationsEnabled: false,
        applicationUrl: '',
        status: 'UPCOMING',
        published: true,
      });
    }
    setShowEventModal(true);
  };

  const handleToggleApplicationStatus = async (ev: any) => {
    const currentStatus = getEventLifecycleStatus(ev);
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    const applicationsEnabled = newStatus === 'ACTIVE';

    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ev.id,
          status: newStatus,
          applicationsEnabled,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => prev.map((e) => (e.id === ev.id ? data.event : e)));
        showNotification(
          'success',
          `Applications for "${ev.title}" marked ${newStatus === 'ACTIVE' ? 'OPEN' : 'CLOSED'}!`
        );
      } else {
        showNotification('error', data.error || 'Failed to update status.');
      }
    } catch {
      showNotification('error', 'Network error updating application status.');
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.coverImage) {
      showNotification('error', 'Please provide or upload a cover image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const applicationsEnabled = eventForm.status === 'ACTIVE';
      const payload = { ...eventForm, applicationsEnabled };
      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent ? { ...payload, id: editingEvent.id } : payload;

      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingEvent) {
          setEvents((prev) => prev.map((ev) => (ev.id === data.event.id ? data.event : ev)));
          showNotification('success', 'Event updated successfully!');
        } else {
          setEvents((prev) => [data.event, ...prev]);
          showNotification('success', 'Event created and live on public site!');
        }
        setShowEventModal(false);
      } else {
        showNotification('error', data.error || 'Failed to save event.');
      }
    } catch {
      showNotification('error', 'Network error saving event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        showNotification('success', 'Event deleted.');
      } else {
        showNotification('error', 'Failed to delete event.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  // Participant Management
  const handleSaveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForParticipants) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/events/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...participantForm,
          eventId: selectedEventForParticipants.id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setEvents((prev) =>
          prev.map((ev) => {
            if (ev.id === selectedEventForParticipants.id) {
              const updatedParticipants = [...(ev.eventParticipants || []), data.participant];
              return { ...ev, eventParticipants: updatedParticipants };
            }
            return ev;
          })
        );
        setSelectedEventForParticipants((prev: any) => ({
          ...prev,
          eventParticipants: [...(prev.eventParticipants || []), data.participant],
        }));
        setShowParticipantModal(false);
        setParticipantForm({
          name: '',
          businessName: '',
          category: 'ENTREPRENEUR',
          photoUrl: '',
          bio: '',
          story: '',
          quote: '',
          website: '',
          isWinner: false,
          published: true,
        });
        showNotification('success', 'Participant & story added successfully!');
      } else {
        showNotification('error', data.error || 'Failed to add participant.');
      }
    } catch {
      showNotification('error', 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    if (!confirm('Are you sure you want to remove this participant?')) return;
    try {
      const res = await fetch(`/api/admin/events/participants?id=${participantId}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((ev) => {
            if (ev.id === selectedEventForParticipants?.id) {
              return {
                ...ev,
                eventParticipants: ev.eventParticipants.filter((p: any) => p.id !== participantId),
              };
            }
            return ev;
          })
        );
        setSelectedEventForParticipants((prev: any) => ({
          ...prev,
          eventParticipants: prev.eventParticipants.filter((p: any) => p.id !== participantId),
        }));
        showNotification('success', 'Participant removed.');
      }
    } catch {
      showNotification('error', 'Network error.');
    }
  };

  // Winner Management
  const openWinnerModal = (event: any) => {
    setSelectedEventForWinner(event);
    setWinnerForm({
      winnerName: event.winnerName || '',
      winnerBusiness: event.winnerBusiness || '',
      winnerPhoto: event.winnerPhoto || '',
      winnerStory: event.winnerStory || '',
      winnerQuote: event.winnerQuote || '',
      winnerPrize: event.winnerPrize || '100,000 FCFA',
      hasWinner: event.hasWinner !== false,
    });
  };

  const handleSaveWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForWinner) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEventForWinner.id,
          ...winnerForm,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setEvents((prev) => prev.map((ev) => (ev.id === data.event.id ? data.event : ev)));
        setSelectedEventForWinner(null);
        showNotification('success', 'Final winner published to public event page!');
      } else {
        showNotification('error', data.error || 'Failed to save winner.');
      }
    } catch {
      showNotification('error', 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Media Management
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForMedia || !mediaForm.url) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/events/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mediaForm,
          eventId: selectedEventForMedia.id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setEvents((prev) =>
          prev.map((ev) => {
            if (ev.id === selectedEventForMedia.id) {
              return { ...ev, eventMedia: [...(ev.eventMedia || []), data.media] };
            }
            return ev;
          })
        );
        setSelectedEventForMedia((prev: any) => ({
          ...prev,
          eventMedia: [...(prev.eventMedia || []), data.media],
        }));
        setMediaForm({ mediaType: 'IMAGE', url: '', caption: '', published: true });
        showNotification('success', 'Media highlight added to event!');
      } else {
        showNotification('error', data.error || 'Failed to add media.');
      }
    } catch {
      showNotification('error', 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    try {
      const res = await fetch(`/api/admin/events/media?id=${mediaId}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((ev) => {
            if (ev.id === selectedEventForMedia?.id) {
              return {
                ...ev,
                eventMedia: ev.eventMedia.filter((m: any) => m.id !== mediaId),
              };
            }
            return ev;
          })
        );
        setSelectedEventForMedia((prev: any) => ({
          ...prev,
          eventMedia: prev.eventMedia.filter((m: any) => m.id !== mediaId),
        }));
        showNotification('success', 'Media deleted.');
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
          Active Events & Competitions ({events.length})
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => openEventModal()}
          leftIcon={<Plus className="w-4 h-4 text-primary-navy" />}
        >
          Create New Entry
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => {
          const isComp = ev.eventType === 'COMPETITION' || Boolean(ev.isSpotlight);
          const status = getEventLifecycleStatus(ev);

          return (
            <div
              key={ev.id}
              className={`bg-white rounded-3xl overflow-hidden border shadow-soft flex flex-col justify-between transition-all ${
                ev.published ? 'border-neutral-border' : 'border-dashed border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                <div className="relative h-44 w-full bg-primary-navy">
                  <Image src={ev.coverImage} alt={ev.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        isComp
                          ? 'bg-gold text-primary-navy shadow-soft'
                          : 'bg-primary-navy/80 text-white backdrop-blur-md'
                      }`}
                    >
                      {isComp ? 'Competition' : 'Event'}
                    </span>
                  </div>

                  {isComp && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          status === 'ACTIVE'
                            ? 'bg-emerald-500 text-white'
                            : status === 'CLOSED'
                            ? 'bg-rose-600 text-white'
                            : 'bg-sky-500 text-white'
                        }`}
                      >
                        {status === 'ACTIVE'
                          ? 'Applications Open'
                          : status === 'CLOSED'
                          ? 'Application Closed'
                          : 'Upcoming'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-primary-navy line-clamp-1">{ev.title}</h3>
                    <p className="text-xs text-neutral-muted mt-1 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-border space-y-1.5 text-[11px] text-neutral-muted">
                    {isComp && ev.startDateTime && ev.endDateTime ? (
                      <div>
                        <span className="font-bold text-primary-navy block text-[10px]">Timeline (Cameroon Time)</span>
                        <span>{formatEventDateTime(ev.startDateTime)} – {formatEventDateTime(ev.endDateTime)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-700" />
                        <span>{formatDate(ev.date)} · {ev.time}</span>
                      </div>
                    )}

                    {isComp && ev.applicationUrl && (
                      <div className="flex items-center gap-1 text-gold-700 font-bold">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[200px]">Form: {ev.applicationUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-Manager Action Toolbar */}
              <div className="p-4 border-t border-neutral-border bg-neutral-surface/30 space-y-2.5">
                {isComp ? (
                  <>
                    {/* 1-Click Application Status Toggle for Competitions */}
                    <button
                      onClick={() => handleToggleApplicationStatus(ev)}
                      className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={status === 'ACTIVE' ? 'Click to mark applications closed' : 'Click to mark applications open'}
                    >
                      {status === 'ACTIVE' ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Applications: OPEN (Click to Close)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Applications: CLOSED (Click to Open)</span>
                        </>
                      )}
                    </button>

                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      <button
                        onClick={() => setSelectedEventForParticipants(ev)}
                        className="p-1.5 rounded-lg bg-white border border-neutral-border font-bold text-primary-navy hover:bg-gold-light/40 flex items-center justify-center gap-1"
                        title="Manage Participants & Stories"
                      >
                        <Users className="w-3 h-3 text-gold-700" />
                        <span>Story ({ev.eventParticipants?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => openWinnerModal(ev)}
                        className={`p-1.5 rounded-lg border font-bold flex items-center justify-center gap-1 ${
                          ev.hasWinner && ev.winnerName
                            ? 'bg-gold text-primary-navy border-gold shadow-soft'
                            : 'bg-white border-neutral-border text-primary-navy hover:bg-neutral-surface'
                        }`}
                        title="Manage Final Winner"
                      >
                        <Trophy className="w-3 h-3" />
                        <span>Winner</span>
                      </button>

                      <button
                        onClick={() => setSelectedEventForMedia(ev)}
                        className="p-1.5 rounded-lg bg-white border border-neutral-border font-bold text-primary-navy hover:bg-neutral-surface flex items-center justify-center gap-1"
                        title="Manage Event Highlights Media"
                      >
                        <Film className="w-3 h-3 text-sky-700" />
                        <span>Media ({ev.eventMedia?.length || 0})</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] font-medium text-neutral-muted italic">
                    Normal event entry (no application required)
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-border/60">
                  <a
                    href={`/events/${ev.slug}`}
                    target="_blank"
                    className="text-[11px] font-bold text-neutral-muted hover:text-primary-navy inline-flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEventModal(ev)}
                      className="p-1.5 rounded-lg hover:bg-white text-primary-navy border border-neutral-border transition-colors"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Event Modal (Create / Edit) */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-lg font-bold text-primary-navy">
                {editingEvent ? `Edit: ${eventForm.title}` : 'Create New Entry'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Type Toggle: Event vs Competition */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1.5 uppercase tracking-wider">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-neutral-surface rounded-2xl border border-neutral-border">
                  <button
                    type="button"
                    onClick={() =>
                      setEventForm({
                        ...eventForm,
                        eventType: 'EVENT',
                        isSpotlight: false,
                        applicationsEnabled: false,
                      })
                    }
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      eventForm.eventType === 'EVENT'
                        ? 'bg-primary-navy text-white shadow-soft font-black'
                        : 'text-neutral-muted hover:text-primary-navy'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Event</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEventForm({
                        ...eventForm,
                        eventType: 'COMPETITION',
                        isSpotlight: true,
                        applicationsEnabled: true,
                      })
                    }
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      eventForm.eventType === 'COMPETITION'
                        ? 'bg-gold text-primary-navy shadow-soft font-black'
                        : 'text-neutral-muted hover:text-primary-navy'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Competition</span>
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setEventForm((prev) => ({
                      ...prev,
                      title,
                      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    }));
                  }}
                  placeholder={eventForm.eventType === 'COMPETITION' ? 'Entrepreneur Spotlight 2026' : 'Convergence Day 1'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={eventForm.slug}
                  onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Competition Specific Settings (Applications & States) */}
              {eventForm.eventType === 'COMPETITION' && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Applications</span>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-bold text-primary-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eventForm.applicationsEnabled}
                        onChange={(e) => setEventForm({ ...eventForm, applicationsEnabled: e.target.checked })}
                        className="rounded text-gold focus:ring-gold"
                      />
                      <span>Enable Applications</span>
                    </label>
                  </div>

                  {eventForm.applicationsEnabled && (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-bold text-primary-navy">
                        Application URL <span className="text-rose-600 font-bold">*</span>
                      </label>
                      <input
                        type="url"
                        required={eventForm.applicationsEnabled}
                        value={eventForm.applicationUrl}
                        onChange={(e) => setEventForm({ ...eventForm, applicationUrl: e.target.value })}
                        placeholder="https://forms.gle/F6oE11xL1bK5Xv7V9"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold font-mono"
                      />
                      <span className="text-[10px] text-neutral-muted block">
                        Applicants clicking &quot;Apply Now&quot; on the public site will open this link in a new tab.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-primary-navy mb-1">
                        Competition State
                      </label>
                      <select
                        value={eventForm.status || 'ACTIVE'}
                        onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-border bg-white"
                      >
                        <option value="ACTIVE">Applications Open (Active)</option>
                        <option value="CLOSED">Application Closed (Closed)</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary-navy mb-1">
                        Application Cutoff (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.endDateTime}
                        onChange={(e) => setEventForm({ ...eventForm, endDateTime: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Normal Event Lifecycle / Date */}
              {eventForm.eventType === 'EVENT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-primary-navy mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-navy mb-1">Time</label>
                    <input
                      type="text"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      placeholder="9:00 AM Sharp"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Cover Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={eventForm.coverImage}
                    onChange={(e) => setEventForm({ ...eventForm, coverImage: e.target.value })}
                    placeholder="/images/Spotlight.jpg"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                  <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-primary-navy" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setEventForm((prev) => ({ ...prev, coverImage: url })))}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Yaoundé, Cameroon"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Organizer</label>
                  <input
                    type="text"
                    value={eventForm.organizer}
                    onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                    placeholder="Skill to Leadership"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || uploadingFile}
                className="w-full justify-center font-bold mt-4"
              >
                {editingEvent ? 'Save Changes' : 'Publish Entry'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Manage Participants & Stories */}
      {selectedEventForParticipants && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-primary-navy">
                  Participant Stories: {selectedEventForParticipants.title}
                </h3>
                <p className="text-xs text-neutral-muted">Add selected candidate profiles, startup ventures, and founder stories.</p>
              </div>
              <button onClick={() => setSelectedEventForParticipants(null)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            {/* Existing Participants List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">
                  Published Participants ({selectedEventForParticipants.eventParticipants?.length || 0})
                </span>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setShowParticipantModal(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5 text-primary-navy" />}
                >
                  Add Participant
                </Button>
              </div>

              {selectedEventForParticipants.eventParticipants?.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-muted bg-neutral-surface/40 rounded-2xl border border-neutral-border/60">
                  No participants added yet. Add participants to display the "Meet the Entrepreneurs" section on the public event page.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEventForParticipants.eventParticipants?.map((p: any) => (
                    <div key={p.id} className="p-4 bg-neutral-surface/40 rounded-2xl border border-neutral-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {p.photoUrl && (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-primary-navy shrink-0">
                            <Image src={p.photoUrl} alt={p.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-primary-navy text-xs sm:text-sm">{p.name}</div>
                          <div className="text-[11px] text-gold-700 font-semibold">{p.businessName} · {p.category}</div>
                          <p className="text-[11px] text-neutral-muted line-clamp-1 mt-0.5">{p.story}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteParticipant(p.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 border border-neutral-border transition-colors shrink-0"
                        title="Delete Participant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Participant Subform */}
            {showParticipantModal && (
              <form onSubmit={handleSaveParticipant} className="p-5 bg-white rounded-2xl border-2 border-gold/40 shadow-soft space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-border pb-2">
                  <h4 className="text-xs font-bold text-primary-navy uppercase tracking-wider">New Participant Entry</h4>
                  <button onClick={() => setShowParticipantModal(false)} className="text-neutral-muted hover:text-primary-navy text-xs">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-navy mb-1">Founder / Participant Name</label>
                    <input
                      type="text"
                      required
                      value={participantForm.name}
                      onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                      placeholder="e.g. Alvine Kenfack"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-navy mb-1">Business / Venture Name</label>
                    <input
                      type="text"
                      required
                      value={participantForm.businessName}
                      onChange={(e) => setParticipantForm({ ...participantForm, businessName: e.target.value })}
                      placeholder="e.g. EcoClay Studios"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-navy mb-1">Photo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={participantForm.photoUrl}
                        onChange={(e) => setParticipantForm({ ...participantForm, photoUrl: e.target.value })}
                        placeholder="/images/participant.jpg"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                      />
                      <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5 text-primary-navy" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setParticipantForm((prev) => ({ ...prev, photoUrl: url })), 'participants')}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-navy mb-1">Category</label>
                    <input
                      type="text"
                      value={participantForm.category}
                      onChange={(e) => setParticipantForm({ ...participantForm, category: e.target.value })}
                      placeholder="e.g. Sustainable Crafts / Tech"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Founder Story / Venture Narrative</label>
                  <textarea
                    rows={3}
                    required
                    value={participantForm.story}
                    onChange={(e) => setParticipantForm({ ...participantForm, story: e.target.value })}
                    placeholder="How this entrepreneur started, their breakthrough craft, and community impact..."
                    className="w-full p-2.5 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Founder Quote (Optional)</label>
                  <input
                    type="text"
                    value={participantForm.quote}
                    onChange={(e) => setParticipantForm({ ...participantForm, quote: e.target.value })}
                    placeholder="Skill to Leadership gave me the confidence to hire 3 artisans in my community."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  isLoading={isSubmitting || uploadingFile}
                  className="w-full justify-center font-bold"
                >
                  Save Participant & Publish Story
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 3: Manage Winner */}
      {selectedEventForWinner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold text-primary-navy">Designate Final Winner</h3>
              </div>
              <button onClick={() => setSelectedEventForWinner(null)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveWinner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Winner Name</label>
                <input
                  type="text"
                  required
                  value={winnerForm.winnerName}
                  onChange={(e) => setWinnerForm({ ...winnerForm, winnerName: e.target.value })}
                  placeholder="Winner Full Name"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Winning Business</label>
                  <input
                    type="text"
                    required
                    value={winnerForm.winnerBusiness}
                    onChange={(e) => setWinnerForm({ ...winnerForm, winnerBusiness: e.target.value })}
                    placeholder="e.g. Divine Braids Atelier"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-navy mb-1">Prize / Grant</label>
                  <input
                    type="text"
                    value={winnerForm.winnerPrize}
                    onChange={(e) => setWinnerForm({ ...winnerForm, winnerPrize: e.target.value })}
                    placeholder="100,000 FCFA Prize"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Winner Photo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={winnerForm.winnerPhoto}
                    onChange={(e) => setWinnerForm({ ...winnerForm, winnerPhoto: e.target.value })}
                    placeholder="/images/winner.jpg"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                  <label className="p-2 rounded-lg bg-neutral-surface border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-primary-navy" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setWinnerForm((prev) => ({ ...prev, winnerPhoto: url })), 'winners')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Winner Achievement Story</label>
                <textarea
                  rows={3}
                  required
                  value={winnerForm.winnerStory}
                  onChange={(e) => setWinnerForm({ ...winnerForm, winnerStory: e.target.value })}
                  placeholder="Details about their performance, capstone presentation, and selection by the jury..."
                  className="w-full p-2.5 text-xs rounded-lg border border-neutral-border"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Winner Victory Quote</label>
                <input
                  type="text"
                  value={winnerForm.winnerQuote}
                  onChange={(e) => setWinnerForm({ ...winnerForm, winnerQuote: e.target.value })}
                  placeholder="This grant will allow me to purchase 2 new styling stations and train 4 young women."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                isLoading={isSubmitting || uploadingFile}
                className="w-full justify-center font-bold mt-2"
              >
                Publish Winner to Event Page
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Manage Event Media */}
      {selectedEventForMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-primary-navy">
                  Event Highlights Media: {selectedEventForMedia.title}
                </h3>
                <p className="text-xs text-neutral-muted">Add post-event photography and recap videos.</p>
              </div>
              <button onClick={() => setSelectedEventForMedia(null)} className="p-1 rounded-lg hover:bg-neutral-surface">
                <X className="w-5 h-5 text-neutral-muted" />
              </button>
            </div>

            {/* Media Upload Form */}
            <form onSubmit={handleSaveMedia} className="p-4 bg-neutral-surface/40 rounded-2xl border border-neutral-border space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-primary-navy mb-1">Media Type</label>
                  <select
                    value={mediaForm.mediaType}
                    onChange={(e) => setMediaForm({ ...mediaForm, mediaType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white"
                  >
                    <option value="IMAGE">Photo / Image</option>
                    <option value="VIDEO">Video (MP4 / Link)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-primary-navy mb-1">Caption (Optional)</label>
                  <input
                    type="text"
                    value={mediaForm.caption}
                    onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                    placeholder="e.g. Award Presentation"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-primary-navy mb-1">Media URL or Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={mediaForm.url}
                    onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                    placeholder="/images/Events/Highlight.jpg"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-border"
                  />
                  <label className="p-2 rounded-lg bg-white border border-neutral-border hover:bg-neutral-border cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-primary-navy" />
                    <input
                      type="file"
                      accept={mediaForm.mediaType === 'VIDEO' ? 'video/*' : 'image/*'}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setMediaForm((prev) => ({ ...prev, url })), 'highlights')}
                    />
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="sm"
                isLoading={isSubmitting || uploadingFile}
                className="w-full justify-center font-bold"
              >
                Add Media Highlight
              </Button>
            </form>

            {/* Existing Media Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">
                Event Media Highlights ({selectedEventForMedia.eventMedia?.length || 0})
              </span>

              {selectedEventForMedia.eventMedia?.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-muted">
                  No post-event highlights added yet. (Media is completely optional).
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedEventForMedia.eventMedia?.map((m: any) => (
                    <div key={m.id} className="relative rounded-xl overflow-hidden border border-neutral-border group bg-ink-900 h-28">
                      {m.mediaType === 'VIDEO' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gold">
                          <Video className="w-8 h-8" />
                          <span className="text-[10px] font-bold mt-1">Video</span>
                        </div>
                      ) : (
                        <Image src={m.url} alt={m.caption || 'Event media'} fill className="object-cover" />
                      )}
                      <button
                        onClick={() => handleDeleteMedia(m.id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white shadow-soft opacity-90 hover:opacity-100"
                        title="Delete Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
