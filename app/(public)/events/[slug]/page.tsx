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
  Sparkles,
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
  Quote
} from 'lucide-react';

export const dynamic = 'force-dynamic';

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

  return (
    <div className="space-y-16 lg:space-y-24 py-10 lg:py-16 bg-cream-canvas text-ink-900">
      
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                <span>{isCompetition ? 'Competition' : (eventType === 'EVENT' ? 'Event' : eventType)}</span>
              </div>

              {/* Status Badge (Only for Competitions) */}
              {isCompetition && (
                isApplicationOpen ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Applications Open</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-600/20 text-rose-800 border border-rose-400 text-xs font-black uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>APPLICATION CLOSED</span>
                  </div>
                )
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display uppercase leading-tight">
              {title}
            </h1>

            {theme && (
              <p className="text-lg sm:text-xl font-bold text-gold-800 font-display">
                {theme}
              </p>
            )}

            <p className="text-base sm:text-lg text-neutral-muted leading-relaxed font-light">
              {description}
            </p>

            {/* Quick Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs sm:text-sm font-semibold text-ink-900">
              {isCompetition && dbEvent?.startDateTime && dbEvent?.endDateTime ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-cream-border">
                  <Calendar className="w-4 h-4 text-gold-700" />
                  <span>{formatEventDateTime(dbEvent.startDateTime)} – {formatEventDateTime(dbEvent.endDateTime)}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-cream-border">
                    <Calendar className="w-4 h-4 text-gold-700" />
                    <span>{dbEvent?.date ? formatDate(dbEvent.date) : staticEvent?.date}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-cream-border">
                    <Clock className="w-4 h-4 text-gold-700" />
                    <span>{time}</span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white shadow-xs border border-cream-border">
                <MapPin className="w-4 h-4 text-gold-700" />
                <span>{location}</span>
              </div>
            </div>

            {/* CTA Action / Closed Notice (Only for Competitions) */}
            {isCompetition && applicationUrl && (
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {isApplicationOpen ? (
                  <>
                    <a
                      href={applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-button liquid-glass-button text-ink-900 font-bold text-sm shadow-gold transition-all"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <span className="text-xs text-emerald-700 font-bold">📩 Submissions are open to all eligible youth.</span>
                  </>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-rose-600 text-white font-black text-[10px] rounded-md uppercase tracking-wider">
                      APPLICATION CLOSED
                    </span>
                    <span>The application window has closed. Explore the selected entrepreneur stories and winner below.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* 2. DEDICATED MEDIA SHOWCASE PER EVENT (Static Fallback for Convergence 1, 2, Gala) */}
      {staticEvent?.slug === 'convergence-day-1' && staticEvent?.videoSrc && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-800">
                <Video className="w-4 h-4 text-gold-700" />
                <span>Live Event Video Highlight</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                  <ConvergenceDay1Video
                    src={staticEvent.videoSrc}
                    poster={staticEvent.coverImage}
                  />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white rounded-card p-6 shadow-soft border border-cream-border space-y-4">
                    <h3 className="text-base font-bold text-ink-900 font-display">
                      Orientation Atmosphere
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-muted font-light leading-relaxed">
                      Experience the energy of Cohort 1 fellows entering the studio for the very first time. From meeting instructors to receiving their starter kits, Convergence Day 1 set the benchmark for collaborative learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {staticEvent?.slug === 'convergence-day-2' && staticEvent?.speakerImage && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-800">
                <Mic className="w-4 h-4 text-gold-700" />
                <span>Featured Guest Leadership & Panel</span>
              </div>

              <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 rounded-card-lg p-6 sm:p-10 text-white shadow-elevated">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-soft h-72 sm:h-96 w-full bg-ink-950 border border-white/10 select-none cursor-default">
                      <Image
                        src={staticEvent.speakerImage}
                        alt="Mr. Akaba James and esteemed guest panel speakers at Convergence Day 2 in Yaoundé"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 text-xs font-bold text-gold pointer-events-none font-display">
                        Mr. Akaba James & Esteemed Guest Panelists
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
                      <span>Panel Discussion</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                      "Leveraging our Youth"
                    </h2>

                    <p className="text-sm text-gray-300 font-light leading-relaxed">
                      A central highlight of Convergence Day 2 was the keynote address by <strong>Mr. Akaba James</strong>, Director of Open Dreams, followed by an interdisciplinary panel exploring how youth talent, technical skills, and creative ambition can be channeled into sustainable ventures in Cameroon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* 3. DYNAMIC FINAL WINNER SECTION (If designated by Super Admin) */}
      {dbEvent?.hasWinner && dbEvent?.winnerName && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-850 rounded-card-lg p-8 sm:p-12 text-white shadow-elevated border border-gold/30 relative overflow-hidden">
              <div className="ambient-glow-gold top-0 right-0 w-80 h-80 opacity-30" />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gold text-ink-900 flex items-center justify-center font-bold shadow-soft">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold">Official Grand Champion</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                      Grand Prize Winner
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {dbEvent.winnerPhoto && (
                    <div className="lg:col-span-5 relative">
                      <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border-2 border-gold shadow-gold bg-ink-950">
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
                      <h3 className="text-3xl font-black text-white font-display">{dbEvent.winnerName}</h3>
                      {dbEvent.winnerBusiness && (
                        <p className="text-base font-bold text-gold mt-1 font-display">{dbEvent.winnerBusiness}</p>
                      )}
                    </div>

                    {dbEvent.winnerStory && (
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light whitespace-pre-wrap">
                        {dbEvent.winnerStory}
                      </p>
                    )}

                    {dbEvent.winnerQuote && (
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border-l-4 border-gold text-white text-xs sm:text-sm italic">
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

      {/* 4. DYNAMIC MEET THE ENTREPRENEURS / SELECTED PARTICIPANTS */}
      {participants.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal>
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs font-black uppercase tracking-widest text-gold-700">
                Selected Finalists & Stories
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-ink-900 tracking-tight font-display uppercase">
                Meet the Entrepreneurs
              </h2>
              <p className="text-sm sm:text-base text-neutral-muted font-light max-w-2xl">
                Discover the ambitious young founders, artisans, and innovators selected for this initiative.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {participants.map((p: any, idx: number) => (
              <ScrollReveal key={p.id} delay={idx * 60}>
                <div className="bg-white rounded-card-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-cream-border flex flex-col justify-between h-full">
                  <div>
                    {p.photoUrl && (
                      <div className="relative h-60 w-full bg-ink-950 overflow-hidden">
                        <Image src={p.photoUrl} alt={p.name} fill className="object-cover object-top" />
                        <div className="absolute top-3 left-3">
                          <span className="liquid-glass-badge px-3 py-1 text-[10px] font-bold rounded-full text-ink-900 uppercase">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-ink-900 font-display">{p.name}</h3>
                        <p className="text-xs font-bold text-gold-700">{p.businessName}</p>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light whitespace-pre-wrap">
                        {p.story}
                      </p>

                      {p.quote && (
                        <div className="p-3 bg-gold-light/30 rounded-xl text-xs text-ink-900 italic border-l-2 border-gold">
                          "{p.quote}"
                        </div>
                      )}
                    </div>
                  </div>

                  {p.website && (
                    <div className="p-4 border-t border-cream-border bg-cream-surface/40">
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-gold-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit Venture Profile</span>
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

      {/* 5. DYNAMIC EVENT MEDIA HIGHLIGHTS GALLERY (Optional) */}
      {mediaItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ScrollReveal>
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-widest text-gold-700">
                Visual Archives
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-ink-900 tracking-tight font-display uppercase">
                Event Highlights
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((m: any, idx: number) => (
              <div key={m.id || idx} className="relative rounded-card overflow-hidden shadow-soft h-64 bg-ink-950 border border-cream-border">
                {m.mediaType === 'VIDEO' ? (
                  <video src={m.url} controls className="w-full h-full object-cover" />
                ) : (
                  <Image src={m.url} alt={m.caption || 'Event highlight'} fill className="object-cover" />
                )}
                {m.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-ink-950/80 text-white text-xs font-medium backdrop-blur-sm">
                    {m.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. DETAILED EVENT AGENDA & STORY TIMELINE */}
      {sections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal>
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-widest text-gold-700">
                Gathering Chronology
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-ink-900 tracking-tight font-display uppercase">
                About {title}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {sections.map((sec: any, idx: number) => (
                <ScrollReveal key={idx} delay={idx * 50}>
                  <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft border border-cream-border space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gold-light text-gold-900 font-mono font-black text-xs flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-ink-900 font-display">
                          {sec.title}
                        </h3>
                        {sec.tagline && (
                          <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider">
                            {sec.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {Array.isArray(sec.description) ? (
                        sec.description.map((p: string, pIdx: number) => (
                          <p key={pIdx} className="text-xs sm:text-sm text-neutral-muted font-light leading-relaxed">
                            {p}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-neutral-muted font-light leading-relaxed">
                          {sec.description}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Right Sidebar: Poster & Quick Summary */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <ScrollReveal delay={100}>
                <div className="bg-white rounded-card-lg p-5 shadow-soft border border-cream-border space-y-4">
                  <div className="text-xs font-bold text-ink-900 uppercase tracking-wider font-display">
                    Official Event Poster
                  </div>
                  <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-ink-950">
                    <Image
                      src={coverImage}
                      alt={title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </ScrollReveal>

              {highlights && (
                <ScrollReveal delay={150}>
                  <div className="bg-cream-surface rounded-card-lg p-5 shadow-soft space-y-3">
                    <div className="text-xs font-bold text-ink-900 uppercase tracking-wider font-display">
                      Key Event Highlights
                    </div>
                    <ul className="space-y-2">
                      {highlights.map((h: string, hIdx: number) => (
                        <li key={hIdx} className="text-xs text-neutral-muted font-light flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. BOTTOM NAVIGATION: RETURN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="p-6 sm:p-10 rounded-card-lg bg-ink-900 text-white shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs uppercase font-extrabold tracking-widest text-gold">
                Explore More Gatherings
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Skill to Leadership Initiatives
              </h3>
              <p className="text-xs text-gray-300 font-light max-w-md">
                Discover the complete progression of gatherings, workshops, and celebrations in Cameroon.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button href="/events" variant="white" size="md">
                All Events
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
