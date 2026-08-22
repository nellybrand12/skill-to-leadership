import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { programsData, getProgramBySlug } from '@/data/programs';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  Scissors,
  Shapes,
  Video,
  Palette,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Discipline Tracks & Programs | Skill to Leadership',
  description:
    'Explore the core practical disciplines taught in Skill to Leadership: Braiding, Ceramic Sculpting, Content Creation, Nail Artistry, and newly launched tracks in Cameroon.',
};

export default async function ProgramsPage() {
  let dbSkills: any[] = [];
  try {
    dbSkills = await db.skill.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (err) {
    console.error('Error loading skills from database, falling back to static data:', err);
    dbSkills = [];
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'Scissors':
        return Scissors;
      case 'Shapes':
        return Shapes;
      case 'Video':
        return Video;
      case 'Palette':
        return Palette;
      default:
        return Sparkles;
    }
  };

  // Merge DB skills with rich static program items for fallback resilience & accurate program images
  const displayTracks =
    dbSkills.length > 0
      ? dbSkills.map((s, idx) => {
          const matchedStatic = getProgramBySlug(s.slug) || programsData[idx] || null;
          let parsedTools: string[] = [];
          let parsedOutcomes: string[] = [];

          try {
            parsedTools = typeof s.toolsIncluded === 'string' ? JSON.parse(s.toolsIncluded) : s.toolsIncluded || [];
          } catch {
            parsedTools = [];
          }

          try {
            parsedOutcomes = typeof s.outcomes === 'string' ? JSON.parse(s.outcomes) : s.outcomes || [];
          } catch {
            parsedOutcomes = [];
          }

          return {
            slug: s.slug,
            name: s.name,
            iconName: s.iconName || matchedStatic?.iconName || 'Sparkles',
            coverImage: s.coverImage || matchedStatic?.coverImage || '/images/Braiding.jpg',
            videoSrc: s.videoUrl || matchedStatic?.videoSrc,
            fullDesc: s.fullDesc || matchedStatic?.fullDesc || '',
            shortDesc: s.shortDesc || matchedStatic?.shortDesc || '',
            tools: parsedTools.length > 0 ? parsedTools : matchedStatic?.toolsIncluded || ['Studio equipment kit', 'Hands-on mentorship', 'Capstone materials'],
            outcomes: parsedOutcomes.length > 0 ? parsedOutcomes : matchedStatic?.outcomes || ['Technical craft mastery', 'Client pricing & studio setup', 'Venture grant eligibility'],
          };
        })
      : programsData.map((p) => ({
          slug: p.slug,
          name: p.name,
          iconName: p.iconName,
          coverImage: p.coverImage,
          videoSrc: p.videoSrc,
          fullDesc: p.fullDesc,
          shortDesc: p.shortDesc,
          tools: p.toolsIncluded,
          outcomes: p.outcomes,
        }));

  return (
    <div className="space-y-16 py-12 lg:py-20 bg-cream-canvas relative overflow-hidden">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>Practical Disciplines</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display">
              Skills for Self-Reliance
            </h1>
            <p className="text-base sm:text-lg text-neutral-muted leading-relaxed font-light">
              Every program track at Skill to Leadership combines intensive technical craft, comprehensive toolkits, client etiquette, and startup mentorship.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Cohort 1 Archive-Style Left-Right Zig-Zag Layout with Soft Blurred Edge Vignettes */}
      <section className="py-12 bg-cream-surface/60 relative overflow-hidden">
        {/* Soft Blurred Edge Masks */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cream-canvas to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream-canvas to-transparent pointer-events-none z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-16 lg:space-y-20">
            {displayTracks.map((skill, index) => {
              const Icon = getIcon(skill.iconName);
              const isLeft = index % 2 === 0;

              return (
                <ScrollReveal key={skill.slug} delay={index * 60}>
                  <div
                    id={skill.slug}
                    className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-14 ${
                      isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Large Visual Showcase (Using program-specific assets) */}
                    <div className="w-full lg:w-6/12 relative rounded-card-lg overflow-hidden bg-ink-900 shadow-soft hover:shadow-elevated transition-all duration-300 h-80 sm:h-96 group">
                      <Image
                        src={skill.coverImage}
                        alt={skill.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent" />

                      {/* Floating Liquid Glass Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="liquid-glass-badge px-3.5 py-1 text-xs font-bold rounded-full text-ink-900 shadow-soft">
                          Track {index + 1}
                        </span>
                      </div>

                      {/* Video indicator pill */}
                      {skill.videoSrc && (
                        <div className="absolute bottom-4 right-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-950/70 text-gold text-[11px] font-bold backdrop-blur-md">
                            <Play className="w-3 h-3 fill-gold" />
                            <span>Video Available</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Editorial Content & Details Column */}
                    <div className={`w-full lg:w-6/12 space-y-5 ${isLeft ? 'lg:pl-4' : 'lg:pr-4'}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gold text-ink-900 flex items-center justify-center font-bold shadow-soft">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-extrabold uppercase tracking-widest text-gold-700">
                              Discipline Track
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight font-display">
                              {skill.name}
                            </h2>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-light pt-1">
                          {skill.fullDesc}
                        </p>
                      </div>

                      {/* Toolkits & Competencies Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                        <div className="p-4 rounded-2xl bg-white shadow-soft space-y-2">
                          <div className="font-extrabold text-ink-900 uppercase tracking-wider text-[11px] font-display">
                            Starter Toolkits
                          </div>
                          <ul className="space-y-1.5 text-neutral-muted font-light">
                            {skill.tools.slice(0, 3).map((t: string) => (
                              <li key={t} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-gold-light/50 shadow-soft space-y-2">
                          <div className="font-extrabold text-gold-900 uppercase tracking-wider text-[11px] font-display">
                            Career Competencies
                          </div>
                          <ul className="space-y-1.5 text-ink-900 font-medium">
                            {skill.outcomes.slice(0, 3).map((o: string) => (
                              <li key={o} className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-gold-700 shrink-0" />
                                <span>{o}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button
                          href={`/programs/${skill.slug}`}
                          variant="primary"
                          size="md"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          View Discipline Details & Video
                        </Button>
                        <Button href="/donate" variant="gold" size="md" className="liquid-glass-button">
                          Support This Track
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
