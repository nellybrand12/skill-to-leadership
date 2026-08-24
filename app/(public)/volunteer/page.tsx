import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { HeartHandshake, Sparkles, Building2, Users, Briefcase } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Partner, Mentor & Join Us | Skill to Leadership',
  description: 'Join Skill to Leadership as an institutional partner, fellowship mentor, technical workshop instructor, or operational staff member.',
};

export default function VolunteerPage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-12 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-cream-canvas">
      
      {/* Header */}
      <ScrollReveal>
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display uppercase">
            Partner, Mentor & Join Our Team
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-muted max-w-2xl mx-auto font-light leading-relaxed">
            Whether you are an organization seeking to sponsor upcoming cohorts, a professional ready to mentor young fellows, or an individual wanting to join our staff — send us a message below.
          </p>
        </div>
      </ScrollReveal>

      {/* 3 Pathway Cards */}
      <ScrollReveal delay={50}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white shadow-soft space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-900 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-gold-700" />
            </div>
            <h3 className="text-base font-bold text-ink-900 font-display">Partners & Sponsors</h3>
            <p className="text-xs text-neutral-muted font-light leading-relaxed">
              Support Cohort 2 by sponsoring craft disciplines, professional toolkits, or prize seed capital.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-soft space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-900 flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-gold-700" />
            </div>
            <h3 className="text-base font-bold text-ink-900 font-display">Fellow Mentors</h3>
            <p className="text-xs text-neutral-muted font-light leading-relaxed">
              Provide 1-on-1 moral mentorship, industry advice, and craftsmanship guidance to ambitious youth.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-soft space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-900 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5 text-gold-700" />
            </div>
            <h3 className="text-base font-bold text-ink-900 font-display">Staff & Volunteers</h3>
            <p className="text-xs text-neutral-muted font-light leading-relaxed">
              Help coordinate practical studio workshops, photography, media storytelling, and event logistics.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Unified Form */}
      <ScrollReveal delay={100}>
        <VolunteerForm />
      </ScrollReveal>

    </div>
  );
}
