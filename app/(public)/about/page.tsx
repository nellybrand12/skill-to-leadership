import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { aboutPageData } from '@/data/about';
import { founderData } from '@/data/founder';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GoldenQuoteText } from '@/components/ui/GoldenQuoteText';
import {
  Sparkles,
  Target,
  Compass,
  Wrench,
  Award,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Heart,
  Quote,
  Lightbulb,
  Building2,
  GraduationCap,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Turning Skills into Leadership',
  description:
    'Skill to Leadership is a youth-focused non-profit program in Cameroon empowering young people with practical craft skills, mentorship, confidence, and leadership opportunities.',
};

export default function AboutPage() {
  const {
    hero,
    missionVision,
    problem,
    whatWeDo,
    journey,
    firstCohort,
    competition,
    philosophy,
    partnerships,
    cta,
  } = aboutPageData;

  const pillarIcons: Record<string, React.ElementType> = {
    Wrench,
    Compass,
    Award,
    Users,
    Sparkles,
  };

  return (
    <div className="space-y-20 lg:space-y-28 py-12 lg:py-20 bg-cream-canvas text-ink-900 overflow-hidden">
      
      {/* =========================================================================
          1. HERO & CORE INTRODUCTION (Section 2 & 36)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-badge text-gold-900 text-xs font-black uppercase tracking-widest shadow-soft">
              <Sparkles className="w-4 h-4 text-gold-700" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-ink-900 tracking-tight leading-[1.05] font-display uppercase">
              {hero.headline}
            </h1>

            <p className="text-lg sm:text-2xl text-ink-900 font-medium max-w-3xl mx-auto leading-relaxed">
              {hero.subtitle}
            </p>

            <p className="text-sm sm:text-base text-neutral-muted max-w-2xl mx-auto font-light leading-relaxed">
              {hero.missionTagline}
            </p>
          </div>
        </ScrollReveal>

        {/* Mission, Vision & Non-Profit Identity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <ScrollReveal delay={60}>
            <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft border border-cream-border h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-light text-gold-900 flex items-center justify-center font-bold shadow-xs">
                  <Target className="w-5 h-5 text-gold-700" />
                </div>
                <h3 className="text-xl font-bold text-ink-900 font-display">
                  {missionVision.mission.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                  {missionVision.mission.text}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft border border-cream-border h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-navy/5 text-primary-navy flex items-center justify-center font-bold shadow-xs">
                  <Compass className="w-5 h-5 text-primary-navy" />
                </div>
                <h3 className="text-xl font-bold text-ink-900 font-display">
                  {missionVision.vision.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                  {missionVision.vision.text}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white rounded-card-lg p-6 sm:p-8 shadow-elevated h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-gold flex items-center justify-center font-bold shadow-xs">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">
                  Non-Profit Identity
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                  {missionVision.nonProfitIdentity}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          2. THE PROBLEM / MOTIVATION (Section 3 & 37)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Left Side with Real Studio Image */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal>
              <div className="relative rounded-card-lg overflow-hidden shadow-elevated bg-ink-950 h-96 sm:h-[480px]">
                <Image
                  src="/images/Gallery/gall1.jpg"
                  alt="Skill to Leadership hands-on studio session in Yaoundé"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider font-display">
                    Hands-On Studio Practice
                  </span>
                  <p className="text-xs text-gray-200 font-light mt-1">
                    Equipping young changemakers with real tools and real agency.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Narrative Right Side */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal delay={80}>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
                  <Lightbulb className="w-3.5 h-3.5 text-gold-700" />
                  <span>{problem.badge}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display">
                  {problem.title}
                </h2>

                <p className="text-base sm:text-lg font-bold text-gold-800 leading-relaxed font-display">
                  {problem.intro}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                {problem.description.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="p-5 rounded-2xl bg-cream-surface border-l-4 border-gold shadow-soft">
                <p className="text-xs sm:text-sm font-semibold text-ink-900 italic font-display">
                  {problem.highlightQuote}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. WHAT WE DO (5 PILLARS) (Section 4)
          ========================================================================= */}
      <section className="bg-cream-surface/60 py-16 lg:py-24 border-y border-cream-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                <span>{whatWeDo.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
                {whatWeDo.title}
              </h2>
              <p className="text-sm sm:text-base text-neutral-muted font-light leading-relaxed">
                {whatWeDo.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.pillars.map((pillar, idx) => {
              const IconComponent = pillarIcons[pillar.iconName] || Sparkles;
              return (
                <ScrollReveal key={pillar.title} delay={idx * 60}>
                  <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between h-full border border-cream-border">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gold-light text-gold-900 flex items-center justify-center font-bold shadow-xs">
                        <IconComponent className="w-6 h-6 text-gold-700" />
                      </div>
                      <h3 className="text-xl font-bold text-ink-900 font-display">
                        {pillar.title}
                      </h3>
                      <div className="text-xs font-bold text-gold-700 uppercase tracking-wider">
                        {pillar.tagline}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE PROGRAM JOURNEY (7-STAGE PROGRESSION) (Section 5)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>{journey.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
              {journey.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-muted font-light leading-relaxed">
              {journey.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 7-Step Sequence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {journey.steps.map((st, idx) => (
            <ScrollReveal key={st.step} delay={idx * 40}>
              <div className="bg-white rounded-2xl p-5 shadow-soft border border-cream-border flex flex-col justify-between h-full text-center space-y-3 relative group hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-black text-gold-700">
                    {st.step}
                  </div>
                  <h4 className="text-base font-black text-ink-900 font-display uppercase tracking-wider">
                    {st.title}
                  </h4>
                  <div className="text-[11px] font-bold text-gold-800 uppercase">
                    {st.tagline}
                  </div>
                  <p className="text-[11px] text-neutral-muted font-light leading-relaxed pt-1">
                    {st.description}
                  </p>
                </div>

                {idx < journey.steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-gold-400 z-10">
                    →
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. FIRST COHORT & 4 CRAFT DISCIPLINES (Section 6)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal>
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>{firstCohort.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
              {firstCohort.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-muted font-light leading-relaxed">
              {firstCohort.description}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Real Craft Discipline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {firstCohort.tracks.map((tr, idx) => (
            <ScrollReveal key={tr.title} delay={idx * 60}>
              <div className="bg-white rounded-card-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between border border-cream-border h-full group">
                <div className="relative h-60 w-full bg-ink-950 overflow-hidden">
                  <Image
                    src={tr.image}
                    alt={tr.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold font-display">
                      {tr.category}
                    </span>
                    <h4 className="text-base font-black tracking-tight text-white font-display">
                      {tr.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-neutral-muted leading-relaxed font-light">
                    {tr.description}
                  </p>
                  <div className="pt-2 border-t border-cream-border flex items-center justify-between text-xs font-bold text-gold-700">
                    <span>{tr.prizeText}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. COMPETITION & SEED PRIZES (Section 7)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg p-8 sm:p-12 lg:p-14 text-white shadow-elevated relative overflow-hidden">
            <div className="ambient-glow-gold top-0 right-0 w-96 h-96 opacity-25" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{competition.badge}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight uppercase">
                  {competition.title}
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  {competition.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button href="/impact" variant="gold" size="md" className="liquid-glass-button">
                    View Cohort 1 Winners & Prizes
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-soft h-80 sm:h-96 w-full bg-ink-950 border border-white/10">
                  <Image
                    src="/images/Closing-day/1.jpg"
                    alt="Cohort 1 Prize and award celebration"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          7. LEADERSHIP PHILOSOPHY (Section 8)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-white rounded-card-lg p-8 sm:p-12 lg:p-16 shadow-soft border border-cream-border space-y-8 text-center max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
                <Award className="w-3.5 h-3.5 text-gold-700" />
                <span>{philosophy.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
                {philosophy.title}
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-neutral-muted leading-relaxed font-light max-w-2xl mx-auto">
              {philosophy.text.map((t, idx) => (
                <p key={idx}>{t}</p>
              ))}
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-gold-light/40 border border-gold/30 shadow-soft max-w-2xl mx-auto">
              <Quote className="w-8 h-8 text-gold-700 mx-auto mb-2 opacity-60" />
              <p className="text-base sm:text-xl font-bold text-ink-900 font-display leading-relaxed">
                {philosophy.closingQuote}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          8. FOUNDER SECTION (Section 9)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Founder Image Card */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal>
              <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg overflow-hidden shadow-elevated text-white">
                <div className="relative w-full h-80 sm:h-96 bg-ink-950 overflow-hidden">
                  <Image
                    src={founderData.image}
                    alt={founderData.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    className="object-cover object-top"
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

                <div className="p-6 space-y-2 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {founderData.title}
                  </p>
                  <p className="text-[11px] text-gold font-semibold">
                    {founderData.location}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Founder Story & Quote */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal delay={80}>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                  <span>Leadership Vision</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
                  Word from the Founder
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <div className="p-5 rounded-2xl bg-cream-surface border-l-4 border-gold shadow-soft">
                <p className="text-sm sm:text-base font-semibold italic text-ink-900 font-display leading-relaxed">
                  <GoldenQuoteText
                    text={founderData.quote}
                    goldClassName="text-gold-700 font-bold not-italic"
                  />
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                {founderData.story.map((st, sIdx) => (
                  <p key={sIdx}>{st}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. COMMUNITY & PARTNERSHIPS (Section 10)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-cream-surface rounded-card-lg p-8 sm:p-10 shadow-soft border border-cream-border text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
              <Building2 className="w-3.5 h-3.5 text-gold-700" />
              <span>{partnerships.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight font-display uppercase">
              {partnerships.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light max-w-2xl mx-auto">
              {partnerships.text}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-gold-900">
              <span className="px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-cream-border">
                Bucknell University
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-cream-border">
                Projects for Peace
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-cream-border">
                Ashinaga
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-cream-border">
                Open Dreams
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          10. CLOSING CALL TO ACTION (Section 11)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-3xl p-10 sm:p-14 text-white space-y-6 relative overflow-hidden shadow-elevated">
            <div className="ambient-glow-gold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20" />

            <div className="max-w-3xl mx-auto space-y-4 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display uppercase">
                {cta.headline}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                {cta.copy}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {cta.links.map((link) => (
                  <Button
                    key={link.label}
                    href={link.href}
                    variant={link.variant}
                    size="lg"
                    className={
                      link.variant === 'gold'
                        ? 'liquid-glass-button font-bold text-sm sm:text-base'
                        : 'bg-white/10 text-white hover:bg-white/20 font-bold text-sm sm:text-base backdrop-blur-md'
                    }
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
