'use client';

import React from 'react';
import Image from 'next/image';
import { founderData } from '@/data/founder';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GoldenQuoteText } from '@/components/ui/GoldenQuoteText';
import { Quote, Compass, Award, Sparkles } from 'lucide-react';

interface FounderSectionProps {
  founderImage?: string;
  founderName?: string;
  founderQuote?: string;
}

export function FounderSection({
  founderImage,
  founderName,
  founderQuote,
}: FounderSectionProps) {
  const displayImage = founderImage || founderData.image;
  const displayName = founderName || founderData.name;
  const displayQuote = founderQuote || founderData.quote;

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-cream-canvas relative overflow-hidden">
      {/* Soft Ambient Glows */}
      <div className="ambient-glow-gold top-1/2 left-10 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
      <div className="ambient-glow-ink bottom-0 right-10 w-[350px] h-[350px] opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <ScrollReveal>
          <div className="mb-8 sm:mb-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
              WORD FROM THE FOUNDER
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Real Founder Image & Credentials Card */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal delay={100}>
              <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg overflow-hidden shadow-elevated text-white flex flex-col justify-between">
                
                {/* Large Founder Image */}
                <div className="relative w-full h-80 sm:h-96 bg-ink-950 overflow-hidden">
                  <Image
                    src={displayImage}
                    alt={displayName}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-300">
                      Founder, Skill to Leadership
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                      {displayName}
                    </h3>
                  </div>
                </div>

                {/* Credentials / Affiliations Strip */}
                <div className="p-5 sm:p-6 space-y-2.5 text-xs text-gray-300 bg-ink-900/90">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-gold-300 shrink-0" />
                    <span>Civil Engineering Student at Bucknell University</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold-300 shrink-0" />
                    <span>Ashinaga Africa Initiative Scholar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-300 shrink-0" />
                    <span>Projects for Peace grantee</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Narrative & Pull Quote */}
          <div className="lg:col-span-7 space-y-5">
            <ScrollReveal delay={150}>
              <div className="space-y-4 text-neutral-muted text-sm sm:text-base lg:text-lg leading-relaxed font-light">
                {founderData.story.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>

            {/* Liquid Glass Editorial Pullquote */}
            <ScrollReveal delay={220}>
              <div className="liquid-glass-card rounded-2xl p-5 sm:p-6 space-y-3 shadow-soft">
                <Quote className="w-6 h-6 text-gold-600 fill-gold-200" />
                <p className="text-sm sm:text-lg lg:text-xl font-semibold italic text-ink-900 leading-relaxed font-display">
                  <GoldenQuoteText
                    text={displayQuote}
                    goldClassName="text-gold-700 font-bold not-italic"
                  />
                </p>
                <div className="text-xs font-bold text-gold-800">
                  — {displayName}, Founder
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
