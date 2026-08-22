'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

export function ApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    education: 'High School (A-Level / Baccalauréat)',
    skillPreference: 'Braiding & Hairstyling',
    motivation: '',
    previousExperience: '',
    portfolioUrl: '',
    emergencyContact: '',
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.age || !formData.location || !formData.motivation || !formData.emergencyContact) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.consent) {
      setError('Please agree to the fellowship commitment guidelines.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age, 10),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedRef(data.application.referenceCode);
      } else {
        setError(data.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (submittedRef) {
    return (
      <div className="bg-white rounded-card-lg p-8 sm:p-10 shadow-elevated text-center space-y-6 animate-fade-up">
        <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto text-primary-navy shadow-soft">
          <Sparkles className="w-8 h-8 text-gold-700" />
        </div>

        <div className="space-y-2">
          <Badge variant="green">Application Successfully Submitted</Badge>
          <h3 className="text-2xl sm:text-3xl font-black text-primary-navy font-display">
            Welcome to the Selection Process!
          </h3>
          <p className="text-sm text-neutral-muted max-w-md mx-auto font-light leading-relaxed">
            Your application for <strong>{formData.skillPreference}</strong> has been received by the Skill to Leadership admissions committee.
          </p>
        </div>

        {/* Reference Code Box */}
        <div className="bg-neutral-surface rounded-2xl p-5 max-w-md mx-auto space-y-2 shadow-soft">
          <div className="text-xs uppercase tracking-widest text-neutral-muted font-bold">
            Your Official Application Reference Code
          </div>
          <div className="text-2xl font-mono font-black text-primary-navy tracking-wider">
            {submittedRef}
          </div>
          <button
            type="button"
            onClick={copyRef}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-gold-800 transition-colors pt-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to clipboard!' : 'Copy reference code'}</span>
          </button>
        </div>

        <div className="text-xs text-neutral-muted max-w-md mx-auto font-light leading-relaxed">
          We will review your submission and notify you at <strong>{formData.email}</strong>. You can also check your real-time review status at any time.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button href={`/apply/status?ref=${submittedRef}`} variant="primary" size="md">
            Check Application Status
          </Button>
          <Button href="/" variant="outline" size="md">
            Back to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-card-lg p-6 sm:p-10 shadow-elevated space-y-8">
      
      {/* Step 1: Personal Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-primary-navy uppercase tracking-wider pb-2">
          <span className="w-6 h-6 rounded-full bg-gold text-primary-navy flex items-center justify-center text-xs font-black">1</span>
          <span>Personal Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Danielle Fouda"
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
              placeholder="danielle@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
              Phone (WhatsApp preferred) *
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
              Age *
            </label>
            <input
              type="number"
              min="15"
              max="35"
              required
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 21"
              className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
              City / Location *
            </label>
            <input
              type="text"
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Yaoundé, Centre"
              className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Highest Level of Education Completed
          </label>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          >
            <option value="Secondary School (O-Level / BEPC)">Secondary School (O-Level / BEPC)</option>
            <option value="High School (A-Level / Baccalauréat)">High School (A-Level / Baccalauréat)</option>
            <option value="Vocational Certificate / Diploma">Vocational Certificate / Diploma</option>
            <option value="Undergraduate Student / Degree">Undergraduate Student / Degree</option>
            <option value="Other">Other / Self-Taught</option>
          </select>
        </div>
      </div>

      {/* Step 2: Skill Track & Motivation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-primary-navy uppercase tracking-wider pb-2">
          <span className="w-6 h-6 rounded-full bg-gold text-primary-navy flex items-center justify-center text-xs font-black">2</span>
          <span>Skill Selection & Motivation</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Preferred Practical Discipline *
          </label>
          <select
            name="skillPreference"
            value={formData.skillPreference}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          >
            <option value="Braiding & Hairstyling">Braiding & Professional Hairstyling</option>
            <option value="Ceramic Sculpting">Ceramic Sculpting & Pottery Craft</option>
            <option value="Content Creation & Digital Media">Content Creation & Digital Storytelling</option>
            <option value="Nail Artistry & Beauty Tech">Nail Artistry & Beauty Care</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Why do you want to join Skill to Leadership? (Motivation) *
          </label>
          <textarea
            required
            rows={4}
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Tell us what excites you about this skill track and how you plan to use this knowledge to start an enterprise or lead in your community..."
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Any Previous Experience in this field? (Optional)
          </label>
          <input
            type="text"
            name="previousExperience"
            value={formData.previousExperience}
            onChange={handleChange}
            placeholder="e.g. Self-taught hair braiding for 1 year, or beginner with no prior experience"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Portfolio / Social Media Link (Instagram, TikTok, Behance, YouTube, etc. - Optional)
          </label>
          <input
            type="url"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/yourhandle"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>
      </div>

      {/* Step 3: Emergency Contact & Consent */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-primary-navy uppercase tracking-wider pb-2">
          <span className="w-6 h-6 rounded-full bg-gold text-primary-navy flex items-center justify-center text-xs font-black">3</span>
          <span>Emergency Contact & Commitment</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Emergency Contact Name & Phone *
          </label>
          <input
            type="text"
            required
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="e.g. Papa Fouda - +237 6xx xx xx xx (Father)"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded text-primary-navy focus:ring-gold"
            />
            <span className="text-xs text-neutral-muted leading-relaxed font-light">
              I certify that all information provided is true. I commit to attending all mandatory workshop sessions, respecting mentors and peers, and actively competing with integrity.
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2 shadow-soft">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isSubmitting}
        leftIcon={<Sparkles className="w-5 h-5 text-primary-navy" />}
        className="w-full justify-center text-base font-bold liquid-glass-button text-ink-900"
      >
        Submit Fellowship Application
      </Button>

    </form>
  );
}
