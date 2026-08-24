import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CohortTwoBanner } from '@/components/sections/CohortTwoBanner';
import { CohortGallerySection } from '@/components/sections/CohortGallerySection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Trophy, CheckCircle2, Users, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Cohorts | Skill to Leadership',
  description: 'Explore Skill to Leadership cohort milestones, Cohort 1 achievements, and the upcoming Cohort 2 expansion.',
};

export default function CohortsPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-12 lg:py-20 bg-cream-canvas">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display uppercase">
              Our Fellowship Cohorts
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-muted leading-relaxed font-light">
              From the historic achievements of Cohort 1 to the upcoming expansion of Cohort 2, discover how practical mastery transforms youth potential.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Cohort 1 Detailed Spotlight (No Hard Borders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-white rounded-card-lg shadow-elevated overflow-hidden">
            
            <div className="bg-gradient-to-r from-ink-950 via-ink-900 to-ink-800 text-white p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-soft">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cohort 1 Successfully Completed</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
                  Cohort 1: The Inaugural Fellows
                </h2>
                <p className="text-sm text-gray-300 max-w-xl font-light">
                  Practical Mastery & Entrepreneurial Launchpad in Yaoundé, Cameroon
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs">
                <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-soft">
                  <div className="text-gray-400 font-medium">Tracks Taught</div>
                  <div className="font-bold text-white text-sm">4 Core Disciplines</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-soft">
                  <div className="text-gray-400 font-medium">Total Prizes</div>
                  <div className="font-bold text-gold text-sm">400,000 FCFA</div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-ink-900 font-display">
                    Inaugural Achievements & Outcomes
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-light">
                    Cohort 1 brought together talented Cameroonian youths across <strong>Braiding & Hairstyling</strong>, <strong>Nail Arts</strong>, <strong>Clay & Ceramic Arts</strong>, and <strong>Content Creation</strong>. Fellows were equipped with complete starter toolkits and concluded with an exhilarating Grand Finale competition.
                  </p>
                </div>
                
                <ul className="space-y-3 text-sm text-ink-900 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-light text-gold-900 flex items-center justify-center shrink-0">
                      <Trophy className="w-3.5 h-3.5 text-gold-700" />
                    </div>
                    <span>4 Category Winners awarded 100,000 FCFA each</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                    <span>100% Practical hands-on training with retained toolkits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    <span>Supported by Bucknell, Projects for Peace, Ashinaga & Open Dreams</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Button href="/impact" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View Cohort 1 Winners
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-soft h-72 sm:h-80 bg-ink-900">
                  <Image
                    src="/images/Closing-day/1.jpg"
                    alt="Cohort 1 Finale and Fellowship"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* Cohort 1 Gallery */}
      <CohortGallerySection
        title="Cohort 1 Photo Highlights"
        subtitle="Memories of fellowship, practical exercises, and celebration."
      />

      {/* Cohort 2 Prominent Section (Coming Soon) */}
      <CohortTwoBanner />

    </div>
  );
}
