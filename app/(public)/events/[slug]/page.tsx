import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { pastEventsData } from '@/data/events';
import { siteConfig } from '@/data/siteConfig';
import { formatDate } from '@/lib/utils';
import { getEventLifecycleStatus, formatEventDateTime } from '@/lib/events';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ConvergenceDay1Video } from '@/components/events/ConvergenceDay1Video';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Video,
  Mic,
  Trophy,
  ExternalLink,
  ShieldAlert,
  Film,
  Quote,
  Target,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  let dbEvent: any = null;
  try {
    dbEvent = await db.event.findUnique({
      where: { slug: params.slug },
    });
  } catch {
    dbEvent = null;
  }

  const staticEvent = pastEventsData.find((e) => e.slug === params.slug);
  const title = dbEvent?.title || staticEvent?.title || 'Event Details';
  const description = dbEvent?.description || staticEvent?.description || 'Skill to Leadership Event';

  return {
    title: `${title} | Skill to Leadership`,
    description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  let dbEvent: any = null;
  try {
    dbEvent = await db.event.findUnique({
      where: { slug: params.slug },
      include: {
        eventParticipants: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
        eventMedia: { where: { published: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
  } catch (err) {
    console.error('Error fetching event by slug from DB:', err);
    dbEvent = null;
  }

  const staticEvent = pastEventsData.find((e) => e.slug === params.slug);

  if (!dbEvent && !staticEvent) notFound();

  // Unified Event Model
  const title = dbEvent?.title || staticEvent?.title || 'Event';
  const description = dbEvent?.description || staticEvent?.description || '';
  const coverImage = dbEvent?.coverImage || staticEvent?.coverImage || '/images/Events/Event1.jpg';
  const location = dbEvent?.location || staticEvent?.location || 'Yaoundé, Cameroon';
  const eventType = dbEvent?.eventType || staticEvent?.eventType || 'EVENT';
  const isCompetition = Boolean(dbEvent?.eventType === 'COMPETITION' || dbEvent?.isSpotlight || eventType === 'SPOTLIGHT' || eventType === 'COMPETITION');
  const theme = staticEvent?.theme || (isCompetition ? 'Discovering & Celebrating Young Cameroonian Entrepreneurs' : null);
  const time = dbEvent?.time || staticEvent?.time || '9:00 AM Sharp';

  // Compute real-time lifecycle status for competitions
  const eventStatusSource = dbEvent || { date: staticEvent?.date, status: staticEvent?.status };
  const status = isCompetition ? getEventLifecycleStatus(eventStatusSource) : null;
  const isApplicationOpen = status === 'ACTIVE';

  const applicationUrl = isCompetition ? (dbEvent?.applicationUrl || siteConfig.spotlight.googleFormUrl) : null;

  const participants = dbEvent?.eventParticipants || [];
  const mediaItems = dbEvent?.eventMedia || [];

  const sections = staticEvent?.sections || [
    {
      title: 'Event Overview',
      description: description,
    },
  ];

  const highlights = staticEvent?.highlights || [
    'Direct vocational engagement with industry leaders',
    'Interactive capstone showcases and peer evaluation',
    'Networking and career mentorship in Yaoundé',
  ];

  const PANEL_SPEAKERS = [
    {
      name: 'Afopezi Moses',
      role: 'Panelist',
      topic: 'Technology, Digital Media & Youth Agency',
    },
    {
      name: 'Serena Axelle',
      role: 'Panelist',
      topic: 'Creative Arts & Artisan Micro-Enterprise',
    },
    {
      name: 'Moukam Jules',
      role: 'Panelist',
      topic: 'Youth Leadership & Strategic Execution',
    },
    {
      name: 'Agbor Darren',
      role: 'Panelist',
      topic: 'Community Building & Entrepreneurial Resilience',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24 py-8 sm:py-12 lg:py-16 bg-cream-canvas text-ink-900">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-muted hover:text-ink-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* 1. EVENT HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-surface border border-neutral-border text-gold-900 text-xs font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-gold-700" />
                <span>{isCompetition ? 'Competition' : (eventType === 'EVENT' ? 'Event' : eventType)}</span>
              </div>

              {/* Status Badge (Only for Competitions) */}
              {isCompetition && (
                isApplicationOpen ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Applications Open</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>APPLICATION CLOSED</span>
                  </div>
                )
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display uppercase leading-[1.08]">
              {title}
            </h1>

            {theme && (
              <p className="text-base sm:text-xl font-bold text-gold-800 font-display">
                {theme}
              </p>
            )}

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-neutral-muted font-medium border-t border-b border-cream-border py-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-700 shrink-0" />
                <span>{dbEvent?.date ? formatDate(dbEvent.date) : (staticEvent?.date || 'Scheduled Date')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-700 shrink-0" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-700 shrink-0" />
                <span>{location}</span>
              </div>
              {isCompetition && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold-700 shrink-0" />
                  <span>100,000 FCFA Prize</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            {isCompetition && (
              <div className="pt-2">
                {isApplicationOpen ? (
                  <div className="space-y-3">
                    <a
                      href={applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-button liquid-glass-button text-ink-900 font-black text-base shadow-elevated uppercase tracking-wider"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <p className="text-xs text-neutral-muted">
                      Applications are open to Cameroonian entrepreneurs under 25 years old.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl max-w-lg space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs font-black uppercase text-rose-800 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Applications are currently closed</span>
                      </div>
                      <p className="text-xs text-rose-900 font-light">
                        The application window for this competition has concluded. Review selected participants and final winners below.
                      </p>
                    </div>
                    {participants.length > 0 && (
                      <div>
                        <a
                          href="#competition-archive"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink-900 hover:bg-ink-800 text-white rounded-xl text-xs font-bold transition-all shadow-soft"
                        >
                          <span>Explore Competition Archive & Stories</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* 2. COVER IMAGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative h-72 sm:h-96 lg:h-[480px] w-full rounded-card-lg overflow-hidden shadow-elevated bg-ink-950">
            <Image
              src={coverImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
          </div>
        </ScrollReveal>
      </section>

      {/* CONVERGENCE DAY 1 VIDEO RECAP */}
      {staticEvent?.slug === 'convergence-day-1' && staticEvent?.videoSrc && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg p-6 sm:p-10 text-white shadow-elevated space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-300">
                <Film className="w-4 h-4 text-gold-300" />
                <span>Cinematic Video Recap</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <ConvergenceDay1Video videoSrc={staticEvent.videoSrc} />
                </div>
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="text-xl font-bold text-white font-display">
                    Convergence Day 1 Highlights
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    Experience the energy of Cohort 1 fellows entering the studio for the very first time. From meeting instructors to receiving their starter kits, Convergence Day 1 set the benchmark for collaborative learning.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* CONVERGENCE DAY 2: UNCROPPED PANEL POSTER & KEYNOTE + 4 PANEL SPEAKERS */}
      {(staticEvent?.slug === 'convergence-day-2' || params.slug === 'convergence-day-2') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal>
            <div className="space-y-3 text-center sm:text-left">
              <div className="text-xs font-bold uppercase tracking-widest text-gold-800">
                Featured Guest Leadership & Panel Discussion
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-ink-900 tracking-tight font-display uppercase">
                "Leveraging Our Youth"
              </h2>
            </div>
          </ScrollReveal>

          {/* Uncropped 1080x1080 Panel Discussion Poster */}
          <ScrollReveal delay={50}>
            <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg p-6 sm:p-10 text-white shadow-elevated space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Uncropped Panel Poster Container */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden bg-ink-950 border border-white/10 shadow-soft">
                    <Image
                      src="/images/convergence/convegence-2-speakers.jpg"
                      alt="Mr. Akaba James and guest panel speakers: Afopezi Moses, Serena Axelle, Moukam Jules, Agbor Darren"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Right: Keynote Speaker Spotlight */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-300 text-xs font-bold uppercase tracking-wider">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Keynote Address</span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                      Mr. Akaba James
                    </h3>
                    <p className="text-sm font-bold text-gold-300 mt-0.5">
                      Director, Open Dreams
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                    Mr. Akaba James addressed Cohort 1 fellows with a deeply inspiring keynote on educational ambition, resilience, and ethical leadership in Cameroon. He emphasized how practical craftsmanship combined with global vision enables young people to create sustainable economic self-reliance.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border-l-4 border-gold-400 text-xs sm:text-sm text-gray-200 italic">
                    "When ambition meets dedicated skill acquisition, young leaders become the builders of our nation's future."
                  </div>
                </div>
              </div>

              {/* 4 Panel Discussion Speakers Grid */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  Panel Discussion Speakers
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PANEL_SPEAKERS.map((speaker) => (
                    <div
                      key={speaker.name}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/40 transition-colors space-y-1.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
                        {speaker.name[0]}
                      </div>
                      <div className="font-bold text-sm text-white font-display pt-1">
                        {speaker.name}
                      </div>
                      <div className="text-[11px] font-semibold text-gold-300">
                        {speaker.role}
                      </div>
                      <div className="text-[11px] text-gray-300 font-light leading-snug">
                        {speaker.topic}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* 3. DYNAMIC FINAL WINNER SECTION (Visible ONLY when applications are CLOSED and hasWinner is true) */}
      {!isApplicationOpen && dbEvent?.hasWinner && dbEvent?.winnerName && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-850 rounded-card-lg p-6 sm:p-10 lg:p-12 text-white shadow-elevated border border-gold/30 relative overflow-hidden">
              <div className="ambient-glow-gold top-0 right-0 w-80 h-80 opacity-25" />

              <div className="relative z-10 space-y-6 sm:space-y-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gold text-ink-900 flex items-center justify-center font-bold shadow-soft">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-300">Official Grand Champion</span>
                    <h2 className="text-xl sm:text-3xl font-black text-white font-display">
                      Grand Prize Winner
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
                  {dbEvent.winnerPhoto && (
                    <div className="lg:col-span-5 relative">
                      <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-gold/40 bg-ink-950 shadow-soft">
                        <Image
                          src={dbEvent.winnerPhoto}
                          alt={dbEvent.winnerName}
                          fill
                          className="object-cover object-top"
                        />
                        <div className="absolute top-3 right-3 bg-gold text-ink-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-soft">
                          {dbEvent.winnerPrize || '100,000 FCFA Prize'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`space-y-4 ${dbEvent.winnerPhoto ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white font-display">{dbEvent.winnerName}</h3>
                      {dbEvent.winnerBusiness && (
                        <p className="text-sm sm:text-base font-bold text-gold-300 mt-1 font-display">{dbEvent.winnerBusiness}</p>
                      )}
                    </div>

                    {dbEvent.winnerStory && (
                      <p className="text-xs sm:text-base text-gray-200 leading-relaxed font-light whitespace-pre-wrap">
                        {dbEvent.winnerStory}
                      </p>
                    )}

                    {dbEvent.winnerQuote && (
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border-l-4 border-gold-400 text-white text-xs sm:text-sm italic">
                        "{dbEvent.winnerQuote}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* 4. DYNAMIC MEET THE ENTREPRENEURS / SELECTED PARTICIPANTS (Visible ONLY when applications are CLOSED) */}
      {!isApplicationOpen && participants.length > 0 && (
        <section id="competition-archive" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 scroll-mt-20">
          <ScrollReveal>
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs font-black uppercase tracking-widest text-gold-700">
                Spotlight Archive & Participant Stories
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-ink-900 tracking-tight font-display uppercase">
                Meet the Entrepreneurs
              </h2>
              <p className="text-xs sm:text-base text-neutral-muted font-light max-w-2xl">
                Discover the ambitious young founders, artisans, and innovators selected for this initiative.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {participants.map((p: any, idx: number) => (
              <ScrollReveal key={p.id} delay={idx * 60}>
                <div className="bg-white rounded-card-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-neutral-border flex flex-col justify-between h-full">
                  <div>
                    {p.photoUrl && (
                      <div className="relative h-56 sm:h-60 w-full bg-ink-950 overflow-hidden">
                        <Image src={p.photoUrl} alt={p.name} fill className="object-cover object-top" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold rounded-full text-ink-900 uppercase">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 sm:p-6 space-y-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-ink-900 font-display">{p.name}</h3>
                        <p className="text-xs font-bold text-gold-700">{p.businessName}</p>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light whitespace-pre-wrap">
                        {p.story}
                      </p>

                      {p.quote && (
                        <div className="p-3 bg-gold-50 rounded-xl text-xs text-ink-900 italic border-l-2 border-gold-500">
                          "{p.quote}"
                        </div>
                      )}
                    </div>
                  </div>

                  {p.website && (
                    <div className="p-4 border-t border-neutral-border bg-cream-surface/40">
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-primary-navy hover:text-gold-700 flex items-center gap-1.5"
                      >
                        <span>Visit Business Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* 5. AGENDA & TIMELINE SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-black uppercase tracking-widest text-gold-700">
              Event Structure & Agenda
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-ink-900 tracking-tight font-display uppercase">
              Program Breakdown
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {sections.map((sec: any, idx: number) => (
            <ScrollReveal key={idx} delay={idx * 40}>
              <div className="bg-white rounded-card p-6 sm:p-8 shadow-soft border border-neutral-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-gold/20 text-gold-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 font-display">
                    {sec.title}
                  </h3>
                </div>
                {sec.tagline && (
                  <p className="text-xs font-bold text-gold-700 pl-10">
                    {sec.tagline}
                  </p>
                )}
                <div className="pl-10 space-y-2 text-xs sm:text-sm text-neutral-muted font-light leading-relaxed">
                  {Array.isArray(sec.description) ? (
                    sec.description.map((p: string, pIdx: number) => (
                      <p key={pIdx}>{p}</p>
                    ))
                  ) : (
                    <p>{sec.description}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 6. KEY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal>
          <div className="bg-white rounded-card-lg p-6 sm:p-10 shadow-soft border border-neutral-border space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-ink-900 font-display uppercase">
              Key Event Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-muted font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
