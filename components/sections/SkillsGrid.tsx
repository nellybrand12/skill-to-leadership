import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Scissors, Shapes, Video, Palette } from 'lucide-react';

export function SkillsGrid() {
  const skills = [
    {
      name: 'Braiding & Hairstyling',
      slug: 'braiding',
      shortDesc:
        'Young participants developed professional hairstyling, intricate braiding techniques, client care, and salon entrepreneurship.',
      icon: Scissors,
      coverImage: '/images/Braiding.jpg',
      prize: '100,000 FCFA Winner',
      badge: 'Cohort 1 Track',
    },
    {
      name: 'Nail Arts & Beauty',
      slug: 'nail-artistry',
      shortDesc:
        'Participants developed practical beauty, precision nail artistry, custom extensions, and studio hygiene with an entrepreneurial mindset.',
      icon: Palette,
      coverImage: '/images/Nail_Art.jpg',
      prize: '100,000 FCFA Winner',
      badge: 'Cohort 1 Track',
    },
    {
      name: 'Clay & Ceramic Arts',
      slug: 'ceramic-sculpting',
      shortDesc:
        'Participants explored creativity, craftsmanship, cultural heritage, and artistic expression through tactile ceramic sculpting.',
      icon: Shapes,
      coverImage: '/images/Clay_and_ceramic_art.jpg',
      prize: '100,000 FCFA Winner',
      badge: 'Cohort 1 Track',
    },
    {
      name: 'Content Creation & Media',
      slug: 'content-creation',
      shortDesc:
        'Participants learned how to produce compelling digital video content, storytelling, and commercial branding through modern media.',
      icon: Video,
      coverImage: '/images/Content_creation.jpg',
      prize: '100,000 FCFA Winner',
      badge: 'Cohort 1 Track',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-neutral-offwhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>The First Cohort Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-navy tracking-tight font-display">
              From Skills to Success
            </h2>
            <p className="text-neutral-muted text-base sm:text-lg font-light leading-relaxed">
              The first cohort successfully trained young people across four practical disciplines, pairing technical mastery with hands-on enterprise tools.
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

        {/* 4 Cards Grid */}
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
