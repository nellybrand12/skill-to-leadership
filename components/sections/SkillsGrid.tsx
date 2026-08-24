import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { programsData } from '@/data/programs';
import {
  Scissors,
  Shapes,
  Video,
  Palette,
  Sparkles,
  ArrowRight,
  Compass,
  Wrench,
  Award,
  Lightbulb,
  GraduationCap,
  Target,
  Trophy,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Scissors,
  Shapes,
  Video,
  Palette,
  Sparkles,
  Compass,
  Wrench,
  Award,
  Lightbulb,
  GraduationCap,
  Target,
  Trophy,
};

export async function SkillsGrid() {
  let dbSkills: any[] = [];
  try {
    dbSkills = await db.skill.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (err) {
    console.error('Error loading skills for SkillsGrid:', err);
    dbSkills = [];
  }

  const skills = dbSkills.length > 0
    ? dbSkills.map((s) => ({
        name: s.name,
        slug: s.slug,
        shortDesc: s.shortDesc,
        icon: ICON_MAP[s.iconName] || Scissors,
        coverImage: s.coverImage || '/images/Braiding.jpg',
        prize: `${(s.prizeAmount || 100000).toLocaleString()} FCFA Winner`,
        badge: s.cohort?.title || 'Fellowship Track',
      }))
    : programsData.map((p) => ({
        name: p.name,
        slug: p.slug,
        shortDesc: p.shortDesc,
        icon: ICON_MAP[p.iconName] || Scissors,
        coverImage: p.coverImage,
        prize: '100,000 FCFA Winner',
        badge: 'Cohort 1 Track',
      }));

  return (
    <section className="py-20 lg:py-28 bg-neutral-offwhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink-900 tracking-tight font-display uppercase">
              Practical Disciplines
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-muted leading-relaxed font-light">
              Cohort 1 focused on 4 high-potential creative and technical crafts, pairing each with dedicated mentors, starter toolkits, and seed capital.
            </p>
          </div>
          <div>
            <Link
              href="/programs"
              className="intro-link inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-bold text-primary-navy hover:bg-gold/15 transition-all duration-500 ease group"
            >
              <span>Explore All Disciplines</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.slug}
                className="bg-white rounded-card-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-primary-navy">
                  <Image
                    src={skill.coverImage}
                    alt={skill.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-navy/85 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/95 text-primary-navy shadow-sm">
                      {skill.badge}
                    </span>
                  </div>

                  {/* Icon Box */}
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-2xl bg-gold text-primary-navy flex items-center justify-center shadow-gold font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gold-700 tracking-wider uppercase font-display">
                      {skill.prize}
                    </div>
                    <h3 className="text-lg font-bold text-primary-navy group-hover:text-gold-600 transition-colors font-display">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-neutral-muted leading-relaxed line-clamp-3 font-light">
                      {skill.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/programs/${skill.slug}`}
                      className="intro-link inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-primary-navy hover:bg-gold/15 transition-all duration-500 ease"
                    >
                      <span>View Program Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
