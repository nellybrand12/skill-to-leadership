import React from 'react';
import Image from 'next/image';
import { StatsSection } from '@/components/sections/StatsSection';
import { StaffSection } from '@/components/sections/StaffSection';
import { CohortGallerySection } from '@/components/sections/CohortGallerySection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Our Impact & Cohort 1 Winners | Skill to Leadership',
  description: 'Celebrating the winners of Cohort 1 and the tangible impact created through Skill to Leadership in Cameroon.',
};

export default function ImpactPage() {
  const winners = [
    {
      category: 'Braiding',
      image: '/images/Braiding.jpg',
      prize: '100,000 FCFA',
      desc: 'Mastery in protective hairstyling, precision partings, knotless techniques, and salon client management.',
    },
    {
      category: 'Nail Arts',
      image: '/images/Nail_Art.jpg',
      prize: '100,000 FCFA',
      desc: 'Excellence in precision manicuring, custom 3D nail artistry, UV gel extensions, and studio hygiene.',
    },
    {
      category: 'Clay & Ceramic Arts',
      image: '/images/Clay_and_ceramic_art.jpg',
      prize: '100,000 FCFA',
      desc: 'Artistic craftsmanship in hand-building, clay modeling, textural glazing, and cultural sculptural design.',
    },
    {
      category: 'Content Creation',
      image: '/images/Content_creation.jpg',
      prize: '100,000 FCFA',
      desc: 'Compelling digital storytelling, smartphone video production, commercial editing, and social media growth.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 py-10 sm:py-12 lg:py-18 bg-cream-canvas">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display">
              Impact & Cohort 1 Winners
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-muted leading-relaxed font-light">
              Celebrating the young people who turned their skills, creativity, and determination into leadership and sustainable independence.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 1. COHORT 1 WINNERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 sm:space-y-10">
          
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="text-xs font-black uppercase tracking-widest text-gold-700">
                The Inaugural Champions
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink-900 tracking-tight uppercase font-display">
                Cohort 1 Winners
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-neutral-muted leading-relaxed font-light">
                Celebrating the young people who turned their skills, creativity and determination into achievement.
              </p>
            </div>
          </ScrollReveal>

          {/* 2x2 Desktop Grid / Stacked Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {winners.map((winner, idx) => (
              <ScrollReveal key={winner.category} delay={idx * 50}>
                <div className="group relative rounded-card-lg overflow-hidden bg-cream-surface shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col border border-neutral-border">
                  
                  {/* Large Winner Image */}
                  <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-ink-900 overflow-hidden">
                    <Image
                      src={winner.image}
                      alt={`${winner.category} Winner`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-extrabold rounded-full text-ink-900 shadow-soft uppercase tracking-wider">
                        Winner
                      </span>
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/90 text-ink-900 backdrop-blur-sm shadow-soft">
                        Cohort 1
                      </span>
                    </div>

                    {/* Prize Amount Callout */}
                    <div className="absolute top-4 right-4 liquid-glass-card-dark px-3.5 py-1.5 rounded-full text-gold-300 text-xs font-mono font-black shadow-soft">
                      {winner.prize}
                    </div>

                    {/* Bottom Image Content */}
                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                      <div className="text-xs uppercase font-bold tracking-widest text-gold-300">
                        Category Champion
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight font-display">
                        {winner.category}
                      </h3>
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="p-5 sm:p-6 bg-white flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs sm:text-sm text-neutral-muted leading-relaxed font-light">
                      {winner.desc}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-neutral-border/60">
                      <span className="text-neutral-muted font-light">Awarded: <strong>100,000 FCFA Micro-Grant</strong></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verified Champion</span>
                      </span>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatsSection />

      {/* 3. STAFF SECTION */}
      <StaffSection />

      {/* 4. COHORT GALLERY */}
      <CohortGallerySection />

    </div>
  );
}
