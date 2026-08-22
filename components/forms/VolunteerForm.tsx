'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2, AlertCircle, HeartHandshake, Building2, UserCheck, Briefcase } from 'lucide-react';

export function VolunteerForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rolePreference: 'PARTNER',
    bio: '',
    linkedin: '',
    availability: 'Flexible / Project-based',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.bio) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 rounded-card-lg p-8 sm:p-10 text-center space-y-4 shadow-soft">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h4 className="text-2xl font-bold text-primary-navy font-display">Thank You for Connecting!</h4>
        <p className="text-sm text-neutral-muted max-w-md mx-auto font-light leading-relaxed">
          We have received your message regarding{' '}
          <strong>
            {formData.rolePreference === 'PARTNER'
              ? 'Partnership & Sponsorship'
              : formData.rolePreference === 'STAFF'
              ? 'Joining the Staff Team'
              : 'Mentorship & Volunteering'}
          </strong>
          . Our leadership team will review your inquiry and reach out to discuss next steps.
        </p>
        <Button onClick={() => setSuccess(false)} variant="primary" size="sm">
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  const isPartner = formData.rolePreference === 'PARTNER';
  const isStaff = formData.rolePreference === 'STAFF';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-card-lg p-6 sm:p-10 shadow-elevated space-y-6">
      
      {/* Category selector pill badges */}
      <div>
        <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-2">
          I am interested in *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rolePreference: 'PARTNER' }))}
            className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 shadow-xs ${
              formData.rolePreference === 'PARTNER'
                ? 'bg-gold-light/60 text-gold-900 ring-2 ring-gold font-bold'
                : 'bg-cream-surface text-ink-900 hover:bg-cream-surface/80'
            }`}
          >
            <Building2 className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Partner / Sponsor</div>
              <div className="text-[11px] text-neutral-muted font-normal">Fund toolkits, prizes & tracks</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rolePreference: 'MENTOR' }))}
            className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 shadow-xs ${
              formData.rolePreference === 'MENTOR'
                ? 'bg-gold-light/60 text-gold-900 ring-2 ring-gold font-bold'
                : 'bg-cream-surface text-ink-900 hover:bg-cream-surface/80'
            }`}
          >
            <HeartHandshake className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Mentor Fellows</div>
              <div className="text-[11px] text-neutral-muted font-normal">1-on-1 guidance & career advice</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rolePreference: 'STAFF' }))}
            className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 shadow-xs ${
              formData.rolePreference === 'STAFF'
                ? 'bg-gold-light/60 text-gold-900 ring-2 ring-gold font-bold'
                : 'bg-cream-surface text-ink-900 hover:bg-cream-surface/80'
            }`}
          >
            <Briefcase className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">Staff / Volunteer</div>
              <div className="text-[11px] text-neutral-muted font-normal">Workshops, media & operations</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            {isPartner ? 'Contact / Representative Name *' : 'Full Name *'}
          </label>
          <input
            type="text"
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={isPartner ? 'e.g. Dr. Danielle Fouda (Director)' : 'e.g. Danielle Fouda'}
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Phone / WhatsApp Number *
          </label>
          <input
            type="tel"
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+237 6xx xx xx xx"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Specific Role / Collaboration Type *
          </label>
          <select
            name="rolePreference"
            value={formData.rolePreference}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          >
            <option value="PARTNER">Institutional / Corporate Partner or Sponsor</option>
            <option value="MENTOR">Cohort Mentor (1-on-1 Fellow Guidance)</option>
            <option value="STAFF">Program Staff & Operations Team</option>
            <option value="INSTRUCTOR">Technical Workshop Instructor</option>
            <option value="EVENT_COORDINATOR">Event & Competition Coordinator</option>
            <option value="MEDIA">Media & Communications Volunteer</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
          {isPartner
            ? 'Organization Name & Partnership Proposal / Intent *'
            : isStaff
            ? 'Background, Skills & Area of Interest *'
            : 'Brief Bio & Experience / Areas of Mentorship *'}
        </label>
        <textarea
          required
          rows={4}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder={
            isPartner
              ? 'Tell us about your organization or foundation, and how you would like to collaborate or support upcoming cohorts...'
              : 'Share your background, industry experience, or areas where you would love to support our fellows and team...'
          }
          className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            {isPartner ? 'Organization Website / LinkedIn (Optional)' : 'LinkedIn / Professional Profile (Optional)'}
          </label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Availability / Time Commitment
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          >
            <option value="Flexible / Project-based">Flexible / Project-based (Partners & Sponsors)</option>
            <option value="1-2 hours / week">1–2 hours / week (Mentors)</option>
            <option value="2-4 hours / week">2–4 hours / week (Instructors & Staff)</option>
            <option value="5+ hours / week">5+ hours / week (Core Operations)</option>
            <option value="Event Days Only">Competition & Event Days Only</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2 shadow-soft">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isSubmitting}
        leftIcon={<HeartHandshake className="w-5 h-5 text-ink-900" />}
        className="w-full justify-center font-bold liquid-glass-button text-ink-900"
      >
        {isPartner ? 'Send Partnership Proposal' : 'Submit Application / Message'}
      </Button>
    </form>
  );
}
