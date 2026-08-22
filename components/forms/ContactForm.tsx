'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'GENERAL',
    subject: '',
    message: '',
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

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'GENERAL',
          subject: '',
          message: '',
        });
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 rounded-card-lg p-8 text-center space-y-4 shadow-soft">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="text-xl font-bold text-primary-navy font-display">Message Received!</h4>
        <p className="text-xs sm:text-sm text-neutral-muted max-w-sm mx-auto font-light leading-relaxed">
          Thank you for reaching out to Skill to Leadership. A team member will respond to your inquiry within 24–48 hours.
        </p>
        <Button onClick={() => setSuccess(false)} variant="primary" size="sm">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-card-lg p-6 sm:p-8 shadow-elevated space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
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
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+237 6xx xx xx xx"
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Inquiry Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
          >
            <option value="GENERAL">General Inquiry</option>
            <option value="PARTNERSHIP">Partnership / Collaboration</option>
            <option value="DONATION">Donation & Grant Support</option>
            <option value="VOLUNTEERING">Volunteering & Mentorship</option>
            <option value="MEDIA">Media & Press</option>
            <option value="PROGRAM">Program Information</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
          Subject *
        </label>
        <input
          type="text"
          required
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g. Partnership inquiry for Cohort 2"
          className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
          Message *
        </label>
        <textarea
          required
          rows={5}
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we assist you?"
          className="w-full px-4 py-2.5 rounded-xl bg-cream-surface focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold shadow-xs"
        />
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2 shadow-soft">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        leftIcon={<Send className="w-4 h-4 text-gold" />}
        className="w-full justify-center font-bold"
      >
        Send Message
      </Button>
    </form>
  );
}
