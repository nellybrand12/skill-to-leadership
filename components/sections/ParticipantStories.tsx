'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { testimonials as defaultTestimonials, TestimonialItem } from '@/data/testimonials';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Quote, Sparkles } from 'lucide-react';

export function ParticipantStories() {
  const [items, setItems] = useState<TestimonialItem[]>(defaultTestimonials);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials && data.testimonials.length > 0) {
          setItems(data.testimonials);
        }
      })
      .catch((err) => console.error('Error fetching live testimonials:', err));
  }, []);

  const renderCard = (item: TestimonialItem, keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${item.id}`}
      className="w-[390px] sm:w-[460px] lg:w-[500px] shrink-0 liquid-glass-card rounded-3xl p-7 sm:p-9 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between space-y-6 select-none"
    >
      {/* Portrait & Meta Header */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 shadow-soft bg-ink-900">
          <Image
            src={item.image || '/images/CH1-candidates/1.jpg'}
            alt={item.name}
            fill
            sizes="72px"
            className="object-cover object-top"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-ink-900 font-display leading-tight">
            {item.name}
          </h3>
          {item.track && (
            <div className="text-xs sm:text-sm font-bold text-gold-700">
              {item.track}
            </div>
          )}
          <div className="text-xs text-neutral-muted font-light">
            {item.role}
          </div>
        </div>
      </div>

      {/* Multi-Line Authentic Reflection Text (35–70 words) */}
      <div className="space-y-2.5 relative">
        <Quote className="w-6 h-6 text-gold-600/75 fill-gold-200" />
        <p className="text-ink-900 font-normal italic text-sm sm:text-base leading-relaxed font-sans">
          &ldquo;{item.text}&rdquo;
        </p>
      </div>

      {/* Outcome Milestone Footer */}
      {item.outcome && (
        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-neutral-muted">
          <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
          <span className="truncate">{item.outcome}</span>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-20 lg:py-28 bg-cream-canvas relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="ambient-glow-gold top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] opacity-30" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 lg:mb-18 text-center space-y-3 relative z-10">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" />
            <span>Participant Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display">
            Stories of Transformation
          </h2>
          <p className="text-neutral-muted text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Authentic reflections from Cohort 1 fellows about hands-on craftsmanship, personal confidence, mentorship, and building sustainable enterprises in Cameroon.
          </p>
        </ScrollReveal>
      </div>

      {/* Single Continuous Smooth Marquee Line (Right -> Left, Generous Spacing) */}
      <div className="relative w-full overflow-hidden py-4">
        
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-cream-canvas to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-cream-canvas to-transparent z-20 pointer-events-none" />

        <div className="w-full overflow-hidden">
          <div className="animate-marquee-single gap-12 sm:gap-16 lg:gap-20 pr-12 sm:pr-16 lg:pr-20 select-none py-2">
            {items.map((item) => renderCard(item, 'orig'))}
            {/* Duplicated for seamless infinite loop */}
            {items.map((item) => renderCard(item, 'dup'))}
          </div>
        </div>

      </div>
    </section>
  );
}
