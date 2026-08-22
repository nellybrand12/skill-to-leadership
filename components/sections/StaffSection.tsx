import React from 'react';
import Image from 'next/image';
import { staffMembers } from '@/data/staff';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GoldenQuoteText } from '@/components/ui/GoldenQuoteText';
import { Quote } from 'lucide-react';

export function StaffSection() {
  return (
    <section className="py-20 lg:py-28 bg-cream-canvas relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-gold-700">
              Leadership & Faculty
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display">
              The Team Behind The Mission
            </h2>
            <p className="text-base sm:text-lg text-neutral-muted leading-relaxed font-light">
              Meet the dedicated professionals, instructors, and coordinators helping turn practical skills into leadership.
            </p>
          </div>
        </ScrollReveal>

        {/* Staff Equal-Height Grid (CSS Stretch & Flex-1 Architecture) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {staffMembers.map((staff, idx) => (
            <ScrollReveal key={staff.id} delay={idx * 60} className="h-full flex flex-col">
              <div className="bg-cream-surface rounded-card-lg p-6 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between h-full w-full border border-cream-border group">
                
                {/* Upper Body Area (Flex-1) */}
                <div className="flex-1 flex flex-col space-y-3">
                  
                  {/* Real Staff Photo with Face Priority */}
                  {staff.image ? (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-soft bg-ink-950 shrink-0">
                      <Image
                        src={staff.image}
                        alt={staff.name}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-700 text-gold flex items-center justify-center font-display font-black text-xl shadow-soft shrink-0">
                      {staff.initials}
                    </div>
                  )}
                  
                  <div className="pt-1">
                    <span className="text-[10px] font-extrabold text-gold-700 uppercase tracking-widest block mb-0.5">
                      {staff.domain}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-ink-900 font-display leading-snug uppercase tracking-wide">
                      {staff.name}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-muted mt-0.5">
                      {staff.role}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-muted leading-relaxed font-light pt-1 flex-1">
                    {staff.description}
                  </p>
                </div>

                {/* Uniform Bottom Quote Strip (Attached to bottom of every card) */}
                <div className="mt-auto pt-4 border-t border-cream-border/70 space-y-2">
                  <Quote className="w-4 h-4 text-gold-600 fill-gold-200" />
                  <p className="text-xs italic text-ink-900 font-medium leading-relaxed font-display">
                    <GoldenQuoteText
                      text={staff.quote}
                      goldClassName="text-gold-700 font-bold not-italic"
                    />
                  </p>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
