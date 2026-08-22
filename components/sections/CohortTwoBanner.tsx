import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';

export function CohortTwoBanner() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="ambient-glow-gold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-20" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
        
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-gold text-xs font-black uppercase tracking-widest shadow-soft">
            <Sparkles className="w-4 h-4" />
            <span>The Next Chapter</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <div className="space-y-2">
            <div className="text-xl sm:text-2xl font-extrabold uppercase tracking-widest text-gold-light font-display">
              Cohort 2
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-display uppercase">
              Coming Soon
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-3xl mx-auto leading-relaxed font-light">
            Cohort 2 is coming soon — bringing together more young people, more practical skills, more opportunities to create, learn and grow, and an even bigger platform for young people to turn their potential into leadership.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed font-light">
            Our second cohort will expand capacity across Cameroon, providing young changemakers with advanced starter toolkits, high-impact mentorship, and real venture launch support.
          </p>
        </ScrollReveal>

        {/* Action CTAs */}
        <ScrollReveal delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              href="/donate"
              variant="gold"
              size="lg"
              leftIcon={<Heart className="w-5 h-5 text-red-500 fill-red-500" />}
              className="liquid-glass-button font-bold px-8 py-3.5 text-base shadow-soft"
            >
              Support Cohort 2
            </Button>

            <Button
              href="/cohorts"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 text-base font-bold backdrop-blur-md shadow-soft"
            >
              Learn About Cohort 1
            </Button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
