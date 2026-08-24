import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { pastEventsData } from '@/data/events';
import { siteConfig } from '@/data/siteConfig';
import { formatDate } from '@/lib/utils';
import { getEventLifecycleStatus } from '@/lib/events';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Calendar, Clock, MapPin, Sparkles, Trophy, Users, BookOpen, ExternalLink, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Events & Initiatives | Skill to Leadership',
  description: 'Explore the Convergence milestones, End of Program Gala, and active Entrepreneurs Spotlight organized by Skill to Leadership in Cameroon.',
};

export default async function EventsPage() {
  let dbEvents: any[] = [];
  let spotlightEvent: any = null;

  try {
    const allDbEvents = await db.event.findMany({
      where: { published: true },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        eventParticipants: { where: { published: true } },
        eventMedia: { where: { published: true } },
      },
    });

    spotlightEvent = allDbEvents.find((e) => e.eventType === 'COMPETITION' || e.isSpotlight || e.eventType === 'SPOTLIGHT') || null;
    dbEvents = allDbEvents.filter((e) => e.id !== spotlightEvent?.id);
  } catch (err) {
    console.error('Error fetching events from DB:', err);
    dbEvents = [];
    spotlightEvent = null;
  }

  // Determine Spotlight lifecycle status
  const spotlightStatus = spotlightEvent ? getEventLifecycleStatus(spotlightEvent) : 'ACTIVE';
  const isSpotlightOpen = spotlightStatus === 'ACTIVE';
  const googleFormUrl = spotlightEvent?.applicationUrl || siteConfig.spotlight.googleFormUrl;

  const spotlightStats = [
    { label: 'Entrepreneurs', value: '10', icon: Users },
    { label: 'Stories', value: '5', icon: BookOpen },
    { label: 'Winner', value: '1', icon: Trophy },
    { label: 'Grand Prize', value: '100,000 FCFA', icon: Sparkles },
  ];

  // Merge events with fallback
  const displayEvents = dbEvents.length > 0
    ? dbEvents.map((ev) => {
        const isComp = ev.eventType === 'COMPETITION' || Boolean(ev.isSpotlight);
        return {
          id: ev.id,
          slug: ev.slug,
          title: ev.title,
          description: ev.description,
          coverImage: ev.coverImage || '/images/Events/Event1.jpg',
          date: formatDate(ev.date),
          time: ev.time || '9:00 AM Sharp',
          location: ev.location || 'Yaoundé, Cameroon',
          eventType: isComp ? 'Competition' : (ev.eventType === 'EVENT' ? 'Event' : ev.eventType),
          isCompetition: isComp,
          status: isComp ? getEventLifecycleStatus(ev) : null,
        };
      })
    : pastEventsData.map((ev) => ({
        id: ev.slug,
        slug: ev.slug,
        title: ev.title,
        description: ev.description,
        coverImage: ev.coverImage,
        date: ev.date,
        time: ev.time,
        location: ev.location,
        eventType: 'Event',
        isCompetition: false,
        status: null,
      }));

  return (
    <div className="space-y-16 sm:space-y-20 py-10 sm:py-12 lg:py-20 bg-cream-canvas">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display uppercase">
              Events & Initiatives
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-muted leading-relaxed font-light">
              Explore active platforms, convergence workshops, and graduation celebrations empowering Cameroonian youth.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 1. FEATURED / SPOTLIGHT EVENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-ink-900 text-white rounded-card-lg p-8 sm:p-12 lg:p-14 shadow-elevated relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="ambient-glow-gold top-0 right-0 w-96 h-96 opacity-30" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-6">
                
                {/* Dynamic Status Badge */}
                {isSpotlightOpen ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-soft">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Featured Ongoing Initiative · Applications Open</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/50 text-xs font-black uppercase tracking-wider shadow-soft">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>APPLICATION CLOSED</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-gold">Featured Initiative</div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display">
                    {spotlightEvent?.title || 'Entrepreneurs Spotlight'}
                  </h2>
                </div>

                <div className="space-y-3 text-gray-200 text-base sm:text-lg leading-relaxed font-light">
                  <p className="text-white font-bold text-lg sm:text-xl font-display">
                    Have you been quietly building your business and waiting for the right opportunity to be seen?
                  </p>
                  <p className="text-gold font-black text-xl sm:text-2xl font-display">
                    This is for you!!
                  </p>
                  <p className="text-sm sm:text-base text-gray-300">
                    {spotlightEvent?.description || 'Entrepreneur Spotlight is an initiative by Skill to Leadership designed to discover, promote, and celebrate young entrepreneurs under 25 who are building businesses with passion, resilience, and purpose.'}
                  </p>
                </div>

                {/* 4 Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {spotlightStats.map((s) => (
                    <div key={s.label} className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl text-center space-y-1 shadow-soft">
                      <div className="text-lg sm:text-xl font-black text-gold font-display">{s.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Action or Closed State */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  {isSpotlightOpen ? (
                    <>
                      <a
                        href={googleFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-button liquid-glass-button text-ink-900 font-bold text-base shadow-gold transition-all"
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <span className="text-xs text-gold-light font-bold">📩 Applications are currently OPEN!</span>
                    </>
                  ) : (
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs font-bold flex items-center gap-2">
                      <span className="px-3 py-1 bg-rose-600 text-white rounded-lg uppercase tracking-wider text-[11px] font-black">
                        APPLICATION CLOSED
                      </span>
                      <span>The submission deadline has passed. Selected entrepreneurs and winner stories are featured below.</span>
                    </div>
                  )}

                  {!isSpotlightOpen && spotlightEvent?.slug && (
                    <Link
                      href={`/events/${spotlightEvent.slug}`}
                      className="px-6 py-4 rounded-button bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
                    >
                      View Spotlight Archive & Stories →
                    </Link>
                  )}
                </div>

              </div>

              {/* Visual Right Column */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-soft h-[380px] sm:h-[420px] bg-ink-950">
                  <Image
                    src={spotlightEvent?.coverImage || '/images/Spotlight.jpg'}
                    alt="Young African entrepreneur pitching business and enterprise story"
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. ALL PAST EVENTS & MILESTONES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <ScrollReveal>
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-black uppercase tracking-widest text-gold-700">
              Community Gatherings
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-900 tracking-tight font-display">
              Events & Milestones
            </h2>
            <p className="text-sm sm:text-base text-neutral-muted font-light">
              Official convergence sessions, masterclasses, and celebratory awards in Cameroon.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((ev, idx) => (
            <ScrollReveal key={ev.slug} delay={idx * 80}>
              <div className="bg-white rounded-card-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between border border-cream-border h-full group">
                
                <div className="relative h-64 sm:h-72 w-full bg-ink-950 overflow-hidden">
                  <Image
                    src={ev.coverImage}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-2 group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="liquid-glass-badge px-3 py-1 text-[11px] font-bold rounded-full text-ink-900 uppercase tracking-wider shadow-sm">
                      {ev.eventType}
                    </span>
                  </div>
                  {ev.status && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full backdrop-blur-sm ${
                        ev.status === 'ACTIVE'
                          ? 'bg-emerald-500 text-white'
                          : ev.status === 'CLOSED'
                          ? 'bg-rose-600 text-white'
                          : 'bg-primary-navy/80 text-gold'
                      }`}>
                        {ev.status === 'ACTIVE' ? 'Applications Open' : ev.status === 'CLOSED' ? 'Application Closed' : ev.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-gold-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{ev.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-ink-900 font-display">
                      {ev.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-cream-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-muted font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <Link
                      href={`/events/${ev.slug}`}
                      className="text-xs font-bold text-ink-900 hover:text-gold-700 transition-colors shrink-0 ml-2"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
}
