'use client';

import React from 'react';
import Image from 'next/image';
import { founderData } from '@/data/founder';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GoldenQuoteText } from '@/components/ui/GoldenQuoteText';
import { Quote, Sparkles, Compass, Award } from 'lucide-react';

export function FounderSection() {
  return (
    <section className="py-16 lg:py-20 bg-cream-canvas relative overflow-hidden">
      {/* Soft Ambient Glows */}
      <div className="ambient-glow-gold top-1/2 left-10 -translate-y-1/2 w-[450px] h-[450px] opacity-35" />
      <div className="ambient-glow-ink bottom-0 right-10 w-[400px] h-[400px] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Exact Section Title */}
        <ScrollReveal>
          <div className="mb-10 text-center lg:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-black uppercase tracking-widest shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>Leadership Vision</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
              WORD FROM THE FOUNDER
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Real Founder Image & Credentials Card */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={100}>
              <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg overflow-hidden shadow-ink-glow text-white flex flex-col justify-between">
                
                {/* Large Founder Image */}
                <div className="relative w-full h-80 sm:h-96 bg-ink-950 overflow-hidden">
                  <Image
                    src={founderData.image}
                    alt={founderData.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold">
                      Founder, Skill to Leadership
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white font-display">
                      {founderData.name}
                    </h3>
                  </div>
                </div>

                {/* Credentials / Affiliations Strip */}
                <div className="p-6 space-y-2.5 text-xs text-gray-300 bg-ink-900/90">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-gold shrink-0" />
                    <span>Civil Engineering Student at Bucknell University</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold shrink-0" />
                    <span>Ashinaga Africa Initiative Scholar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-gold-light font-bold">Projects for Peace grantee</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Narrative & Pull Quote */}
          <div className="lg:col-span-7 space-y-5">
            <ScrollReveal delay={150}>
              <div className="space-y-4 text-neutral-muted text-base sm:text-lg leading-relaxed font-light">
                {founderData.story.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>

            {/* Liquid Glass Editorial Pullquote (Soft Gold Highlight, No Hard Border) */}
            <ScrollReveal delay={220}>
              <div className="liquid-glass-card rounded-2xl p-6 space-y-3 shadow-soft">
                <Quote className="w-6 h-6 text-gold-600 fill-gold-200" />
                <p className="text-base sm:text-xl font-semibold italic text-ink-900 leading-relaxed font-display">
                  <GoldenQuoteText
                    text={founderData.quote}
                    goldClassName="text-gold-700 font-bold not-italic"
                  />
                </p>
                <div className="text-xs font-bold text-gold-800">
                  — {founderData.name}, Founder
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
