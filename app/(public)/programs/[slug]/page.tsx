import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { programsData, getProgramBySlug } from '@/data/programs';
import { ProgramVideoPlayer } from '@/components/programs/ProgramVideoPlayer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  Scissors,
  Shapes,
  Video,
  Palette,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProgramDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProgramDetailPageProps) {
  const program = getProgramBySlug(params.slug);
  let dbSkill: any = null;
  try {
    dbSkill = await db.skill.findFirst({
      where: {
        OR: [{ slug: params.slug }, { name: { contains: params.slug } }],
      },
    });
  } catch (err) {
    dbSkill = null;
  }

  const title = dbSkill?.name || program?.name || 'Discipline Track';
  const desc =
    dbSkill?.shortDesc || program?.shortDesc || 'Practical craft track at Skill to Leadership';

  return {
    title: `${title} | Skill to Leadership`,
    description: desc,
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const staticProgram = getProgramBySlug(params.slug);
  let dbSkill: any = null;
  try {
    dbSkill = await db.skill.findFirst({
      where: {
        OR: [{ slug: params.slug }, { name: { contains: params.slug } }],
      },
    });
  } catch (err) {
    dbSkill = null;
  }

  if (!staticProgram && !dbSkill) notFound();

  // Unified data model with robust fallback
  const programName = dbSkill?.name || staticProgram?.name || 'Craft Discipline';
  const shortDesc = dbSkill?.shortDesc || staticProgram?.shortDesc || '';
  const fullDesc = dbSkill?.fullDesc || staticProgram?.fullDesc || '';
  const coverImage = dbSkill?.coverImage || staticProgram?.coverImage || '/images/Braiding.jpg';
  const videoSrc = dbSkill?.videoUrl || staticProgram?.videoSrc || '/images/programs/Braiding.mp4';
  const badge = staticProgram?.badge || 'Practical Craft Track';

  let tools: string[] = [];
  try {
    tools = dbSkill?.toolsIncluded ? JSON.parse(dbSkill.toolsIncluded) : staticProgram?.toolsIncluded || [];
  } catch {
    tools = staticProgram?.toolsIncluded || [];
  }

  let outcomes: string[] = [];
  try {
    outcomes = dbSkill?.outcomes ? JSON.parse(dbSkill.outcomes) : staticProgram?.outcomes || [];
  } catch {
    outcomes = staticProgram?.outcomes || [];
  }

  const curriculum: string[] = staticProgram?.curriculum || [
    'Comprehensive safety and professional hygiene',
    'Practical hands-on technical tool application',
    'Creative styling, shaping, and fine craft execution',
    'Client consultations, pricing formulas, and timing',
    'Freelance venture launch and commercial portfolio',
  ];
  const highlights: string[] = staticProgram?.highlights || [
    'Intensive studio training with seasoned trade mentors',
    '100% toolkit retention by fellows upon graduation',
    'Real client interaction and quality benchmark testing',
    'Entrepreneurial unit economics and booking strategies',
  ];

  return (
    <div className="space-y-14 py-12 lg:py-18 bg-cream-canvas">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-muted hover:text-ink-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Discipline Tracks</span>
        </Link>
      </div>

      {/* 1. PROGRAM TITLE & INTRODUCTION HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display">
                {programName}
              </h1>

              <p className="text-base sm:text-lg text-neutral-muted leading-relaxed font-light">
                {shortDesc}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button href="/donate" variant="gold" size="lg" className="liquid-glass-button font-bold">
                  Support This Discipline
                </Button>
                <Button href="/cohorts" variant="outline" size="lg">
                  View Cohorts
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-card-lg overflow-hidden shadow-elevated h-80 sm:h-96 bg-ink-900 border border-cream-border group">
                <Image
                  src={coverImage}
                  alt={programName}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold">
                    Studio Program
                  </span>
                  <div className="text-lg font-bold font-display">{programName}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. PROGRAM DETAIL VIDEO SECTION */}
      {videoSrc && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-gold-700">
                    Studio In-Action
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-ink-900 font-display">
                    Watch {programName} Studio Training
                  </h2>
                </div>
              </div>

              {/* Video Player */}
              <ProgramVideoPlayer
                videoSrc={videoSrc}
                posterImage={coverImage}
                programName={programName}
              />
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* 3. WHAT PARTICIPANTS LEARN & COMPREHENSIVE CURRICULUM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview */}
            <div className="bg-white rounded-card p-6 sm:p-8 shadow-soft space-y-3 border border-cream-border">
              <h2 className="text-2xl font-bold text-ink-900 font-display">Discipline Overview</h2>
              <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-light">
                {fullDesc}
              </p>
            </div>

            {/* What Participants Learn (Curriculum Syllabus) */}
            <div className="bg-cream-surface rounded-card p-6 sm:p-8 space-y-4 border border-cream-border">
              <div className="flex items-center gap-2 text-ink-900">
                <BookOpen className="w-5 h-5 text-gold-700" />
                <h3 className="text-xl font-bold font-display">
                  What Participants Learn (Core Curriculum)
                </h3>
              </div>
              <ul className="space-y-3 pt-1">
                {curriculum.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-muted">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium text-ink-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Program Highlights */}
            <div className="bg-white rounded-card p-6 sm:p-8 shadow-soft space-y-4 border border-cream-border">
              <div className="flex items-center gap-2 text-ink-900">
                <Award className="w-5 h-5 text-gold-700" />
                <h3 className="text-xl font-bold font-display">Program Highlights & Mentorship</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-neutral-surface/60 rounded-xl text-xs font-medium text-ink-900 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials & Equipment Provided */}
            <div className="bg-cream-surface rounded-card p-6 sm:p-8 space-y-4 border border-cream-border">
              <h3 className="text-xl font-bold text-ink-900 font-display">
                Materials & Toolkits Provided
              </h3>
              <p className="text-xs sm:text-sm text-neutral-muted font-light">
                Each fellow receives full hands-on studio kits during the program, which remain theirs upon graduation to support their new ventures:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {tools.map((tool: string) => (
                  <div
                    key={tool}
                    className="flex items-center gap-2 p-3.5 bg-white rounded-xl text-xs font-semibold text-ink-900 shadow-soft border border-cream-border"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career & Entrepreneurial Outcomes */}
            <div className="bg-white rounded-card p-6 sm:p-8 shadow-soft space-y-4 border border-cream-border">
              <h3 className="text-xl font-bold text-ink-900 font-display">
                Expected Competencies & Career Outcomes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {outcomes.map((outcome: string) => (
                  <div
                    key={outcome}
                    className="flex items-center gap-2 p-3.5 bg-gold-light/30 rounded-xl text-xs font-semibold text-ink-900 border border-gold/20"
                  >
                    <Sparkles className="w-4 h-4 text-gold-700 shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white rounded-card-lg p-6 sm:p-8 space-y-6 shadow-ink-glow border border-cream-border">
              <h4 className="text-base font-bold uppercase tracking-widest text-gold font-display">
                Track Summary
              </h4>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Format</span>
                  <span className="font-bold text-white">In-Person Studios + Mentorship</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Location</span>
                  <span className="font-bold text-white">Yaoundé, Cameroon</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Toolkits</span>
                  <span className="font-bold text-emerald-400">100% Retained by Fellows</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Cohort 2 Status</span>
                  <span className="font-bold text-gold">Applications Coming Soon</span>
                </div>
              </div>

              <Button
                href="/donate"
                variant="gold"
                size="md"
                className="w-full justify-center font-bold liquid-glass-button"
              >
                Support This Discipline
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
