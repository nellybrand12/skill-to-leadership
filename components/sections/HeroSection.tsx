'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Sparkles, ArrowRight, ShieldCheck, Trophy, Users } from 'lucide-react';

interface HeroSectionProps {
  heading?: string;
  subtext?: string;
}

export function HeroSection({
  heading = 'TURNING SKILLS INTO LEADERSHIP',
  subtext = 'An experiential youth development non-profit empowering young changemakers in Cameroon with hands-on craft mastery, mentorship, starter toolkits, and seed prize capital.',
}: HeroSectionProps) {
  return (
    <section
      data-section="hero"
      className="hero-section relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-ink-950 text-white"
    >
      {/* 1. Full-Bleed Photographic Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/background.jpg"
          alt="Skill to Leadership fellows and workshops in Yaoundé, Cameroon"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[center_35%] filter brightness-[0.88]"
        />
      </div>

      {/* 2. Cinematic Left-to-Right Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 sm:via-ink-950/75 to-transparent z-10 pointer-events-none" />
      
      {/* Subtle top and bottom vignette shadows for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/80 z-10 pointer-events-none" />

      {/* Ambient subtle warm gold glow behind text */}
      <div className="ambient-glow-gold top-1/3 left-10 w-[500px] h-[500px] opacity-25 z-10" />

      {/* 3. Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-7">
          
          {/* Main Cinematic Headline (Large, Bold, All-Caps Editorial Style) */}
          <ScrollReveal>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05] font-display drop-shadow-md">
              TURNING SKILLS <br />
              <span className="gold-gradient-text">INTO LEADERSHIP</span>
            </h1>
          </ScrollReveal>

          {/* Subtitle & Mission Statement */}
          <ScrollReveal delay={60}>
            <p className="text-base sm:text-xl text-gray-200 max-w-xl font-light leading-relaxed">
              {subtext}
            </p>
          </ScrollReveal>

          {/* Action CTAs (Intro Links with 0.5s Ease Hover Transition) */}
          <ScrollReveal delay={120}>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href="/programs"
                variant="gold"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5 text-ink-900" />}
                className="intro-link liquid-glass-button text-ink-900 font-bold text-sm sm:text-base px-8 py-4 uppercase tracking-wider justify-center shadow-soft"
              >
                Explore Programs
              </Button>
              <Button
                href="/donate"
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="intro-link bg-white/10 hover:bg-white/25 text-white font-bold text-sm sm:text-base px-8 py-4 uppercase tracking-wider backdrop-blur-md justify-center shadow-soft border border-white/20 hover:border-white/40"
              >
                Support Mission
              </Button>
            </div>
          </ScrollReveal>

          {/* Translucent Frosted Glass Quick Metrics */}
          <ScrollReveal delay={180}>
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-2xl bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold/25 backdrop-blur-md flex items-center justify-center text-gold font-bold shrink-0">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">4 Practical Tracks</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-300 font-light">Hands-on craft</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-2xl bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/25 backdrop-blur-md flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">400K FCFA</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-300 font-light">Seed prize capital</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-2xl bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-bold shrink-0">
                  <Users className="w-4 h-4 text-gold-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">Global Network</div>
                  <div className="text-[10px] sm:text-[11px] text-gray-300 font-light">Top partnerships</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
