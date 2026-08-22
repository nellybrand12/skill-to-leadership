import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Trophy, CheckCircle2, ArrowRight } from 'lucide-react';

export function CompetitionSection() {
  const prizeHighlights = [
    { title: '4 Skill Categories', desc: 'Braiding, Nail Arts, Ceramics & Content' },
    { title: '4 Winner Fellows', desc: '1 champion selected per discipline' },
    { title: '100,000 FCFA Each', desc: 'Direct micro-grant seed funding' },
    { title: '400,000 FCFA Total', desc: 'Total competition prize pool awarded' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-ink-950 text-white relative overflow-hidden">
      <div className="ambient-glow-gold top-0 right-0 w-[500px] h-[500px] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Competition Lore */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-extrabold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>High-Stakes Finale</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display">
              Skills. Creativity. <span className="gold-gradient-text">Competition.</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light">
              After intensive practical training, participants competed in rigorous real-world challenges related to their respective skills.
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              The winners received <strong className="text-gold font-bold">100,000 FCFA</strong> for each skill category to launch their micro-enterprises and procure professional client equipment.
            </p>

            {/* 4 Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {prizeHighlights.map((item) => (
                <div key={item.title} className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm shadow-soft">
                  <div className="text-sm font-bold text-gold flex items-center gap-1.5 font-display">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 font-light">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button href="/impact" variant="gold" size="md" className="liquid-glass-button">
                Meet Cohort 1 Winners
              </Button>
              <Button href="/cohorts" variant="white" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Cohort Milestones
              </Button>
            </div>
          </div>

          {/* Right Column: Highlighted Prize Card */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-ink-900/90 to-ink-950 rounded-3xl p-8 shadow-gold-glow backdrop-blur-xl text-center space-y-6">
              
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gold/20 flex items-center justify-center text-gold shadow-soft">
                <Trophy className="w-10 h-10 text-gold" />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gold-light font-display">
                  Grand Prize Per Category
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-display">
                  100,000 <span className="text-gold text-2xl sm:text-3xl font-bold">FCFA</span>
                </div>
                <div className="text-xs text-gray-300 mt-2 font-medium">
                  Awarded to 4 category champions (400,000 FCFA Total)
                </div>
              </div>

              {/* Category Breakdown (No Hard Borders) */}
              <div className="space-y-2 text-left pt-2 text-xs">
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5">
                  <span className="text-gray-300">Braiding Champion</span>
                  <span className="font-bold text-gold">100,000 FCFA</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5">
                  <span className="text-gray-300">Nail Arts Champion</span>
                  <span className="font-bold text-gold">100,000 FCFA</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5">
                  <span className="text-gray-300">Clay & Ceramic Arts Champion</span>
                  <span className="font-bold text-gold">100,000 FCFA</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5">
                  <span className="text-gray-300">Content Creation Champion</span>
                  <span className="font-bold text-gold">100,000 FCFA</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gold/10 text-[11px] text-gold-200">
                ⭐ Seed capital designed for startup tools, client materials, and studio equipment.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
