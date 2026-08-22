import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { siteConfig } from '@/data/siteConfig';
import { getEventLifecycleStatus } from '@/lib/events';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Sparkles, Trophy, Users, BookOpen, ExternalLink, ShieldAlert, ArrowRight } from 'lucide-react';

export async function EntrepreneursSpotlightSection() {
  let spotlightEvent: any = null;
  try {
    spotlightEvent = await db.event.findFirst({
      where: {
        OR: [
          { isSpotlight: true },
          { eventType: 'SPOTLIGHT' },
          { slug: 'entrepreneurs-spotlight' },
        ],
        published: true,
      },
    });
  } catch (err) {
    console.error('Error loading spotlight event for homepage:', err);
    spotlightEvent = null;
  }

  const status = spotlightEvent ? getEventLifecycleStatus(spotlightEvent) : 'ACTIVE';
  const isApplicationOpen = status === 'ACTIVE';
  const googleFormUrl = spotlightEvent?.applicationUrl || siteConfig.spotlight.googleFormUrl;

  const stats = [
    { label: 'Entrepreneurs', value: '10', icon: Users },
    { label: 'Stories', value: '5', icon: BookOpen },
    { label: 'Winner', value: '1', icon: Trophy },
    { label: 'Grand Prize', value: '100,000 FCFA', icon: Sparkles },
  ];

  return (
    <section className="py-14 lg:py-18 bg-cream-canvas relative overflow-hidden">
      {/* Subtle ambient glows */}
      <div className="ambient-glow-gold top-6 left-10 w-80 h-80 opacity-35" />
      <div className="ambient-glow-ink bottom-6 right-10 w-80 h-80 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headline, Copy, Stats & CTA */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Liquid Glass Status Pill */}
            <ScrollReveal>
              {isApplicationOpen ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-badge text-emerald-900 text-xs font-black uppercase tracking-wider shadow-soft">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Featured Initiative · Applications Open</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/20 text-rose-800 border border-rose-300 text-xs font-black uppercase tracking-wider shadow-soft">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>APPLICATION CLOSED</span>
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal delay={60}>
              <div className="space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-widest text-gold-700">
                  Featured Initiative
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight leading-tight font-display">
                  {spotlightEvent?.title || 'Entrepreneurs'} <span className="gold-gradient-text">Spotlight</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="space-y-3 text-ink-900 text-base sm:text-lg leading-relaxed font-medium">
                <p className="text-ink-900 font-bold text-lg sm:text-xl font-display">
                  Have you been quietly building your business and waiting for the right opportunity to be seen?
                </p>
                <p className="text-gold-800 font-black text-xl sm:text-2xl font-display">
                  This is for you!!
                </p>
                <p className="text-neutral-muted text-base leading-relaxed font-light">
                  {spotlightEvent?.description || 'Entrepreneur Spotlight is an initiative by Skill to Leadership designed to discover, promote, and celebrate young entrepreneurs under 25 who are building businesses with passion, resilience, and purpose.'}
                </p>
              </div>
            </ScrollReveal>

            {/* 4 Stats Grid */}
            <ScrollReveal delay={180}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="p-3.5 bg-cream-surface rounded-2xl text-center space-y-1 shadow-soft">
                      <Icon className="w-4 h-4 text-gold-700 mx-auto mb-1" />
                      <div className="text-lg sm:text-xl font-black text-ink-900 font-display">{s.value}</div>
                      <div className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Copy */}
            <ScrollReveal delay={220}>
              <div className="space-y-2 text-xs sm:text-sm text-neutral-muted leading-relaxed font-light pt-1">
                <p>
                  Whether you’re a baker, nail technician, hairstylist, tailor, graphic designer, photographer, food vendor, or offer any product or service, if you are a small business and just starting, we want to hear your story.
                </p>
                <p className="text-ink-900 font-semibold">
                  This isn’t just a competition, it’s an opportunity to tell your story, grow your brand, and inspire others.
                </p>
              </div>
            </ScrollReveal>

            {/* CTA or Closed State */}
            <ScrollReveal delay={260}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {isApplicationOpen ? (
                  <>
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-button liquid-glass-button text-ink-900 font-bold text-base shadow-gold cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                      href={`/events/${spotlightEvent?.slug || 'entrepreneurs-spotlight'}`}
                      className="text-xs font-bold text-gold-800 hover:text-ink-900 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 bg-rose-600 text-white text-xs font-black rounded-xl uppercase tracking-wider">
                      APPLICATION CLOSED
                    </div>
                    <Link
                      href={`/events/${spotlightEvent?.slug || 'entrepreneurs-spotlight'}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-button bg-primary-navy text-white text-xs font-bold hover:bg-primary-navy-light transition-all"
                    >
                      <span>View Entrepreneur Stories & Winner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Visual */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={150}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-card-lg overflow-hidden shadow-elevated bg-ink-900">
                  <Image
                    src={spotlightEvent?.coverImage || '/images/Spotlight.jpg'}
                    alt="Young African entrepreneur building enterprise and community leadership"
                    width={600}
                    height={700}
                    priority
                    className="w-full h-[420px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-gold">Under 25 Initiative</div>
                    <div className="text-base font-bold font-display">100,000 FCFA Grand Prize for Emerging Changemakers</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
