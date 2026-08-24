'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Sparkles, ArrowRight } from 'lucide-react';

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
      {/* 1. Photographic Background Image */}
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

      {/* 2. Left-to-Right Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 sm:via-ink-950/75 to-transparent z-10 pointer-events-none" />
      
      {/* Top and bottom vignette shadows for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/80 z-10 pointer-events-none" />

      {/* Ambient subtle warm gold behind text */}
      <div className="ambient-glow-gold top-1/3 left-10 w-[450px] h-[450px] opacity-20 z-10" />

      {/* 3. Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8">
          
          {/* Main Headline */}
          <ScrollReveal>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.08] font-display drop-shadow-md">
              TURNING SKILLS <br />
              <span className="gold-gradient-text">INTO LEADERSHIP</span>
            </h1>
          </ScrollReveal>

          {/* Subtitle & Mission Statement */}
          <ScrollReveal delay={60}>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xl font-light leading-relaxed">
              {subtext}
            </p>
          </ScrollReveal>

          {/* Action CTAs */}
          <ScrollReveal delay={120}>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button
                href="/programs"
                variant="gold"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5 text-ink-900" />}
                className="intro-link liquid-glass-button text-ink-900 font-bold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3.5 sm:py-4 uppercase tracking-wider justify-center shadow-soft"
              >
                Explore Programs
              </Button>
              <Button
                href="/donate"
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="intro-link bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3.5 sm:py-4 uppercase tracking-wider backdrop-blur-md justify-center shadow-soft border border-white/20 hover:border-white/40"
              >
                Support Mission
              </Button>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
