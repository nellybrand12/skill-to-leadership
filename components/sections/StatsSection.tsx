import React from 'react';
import { ImpactCounter } from '@/components/ui/ImpactCounter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Sparkles, Users, Award, Landmark } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      number: '01',
      value: 4,
      suffix: '+',
      label: 'Skills Taught',
      sublabel: 'Braiding, Ceramics, Content & Nails',
      icon: Sparkles,
    },
    {
      number: '02',
      value: 100,
      prefix: '',
      suffix: '%',
      label: 'Practical & Hands-On',
      sublabel: 'Equipped with direct starter toolkits',
      icon: Users,
    },
    {
      number: '03',
      value: 4,
      suffix: ' Champions',
      label: 'Competition Winners',
      sublabel: '100,000 FCFA for each skill category',
      icon: Award,
    },
    {
      number: '04',
      value: 400,
      prefix: '',
      suffix: 'K FCFA+',
      label: 'Prize Money Awarded',
      sublabel: 'Direct seed capital for winners',
      icon: Landmark,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white py-16 lg:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={stat.number} delay={idx * 60}>
                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-soft hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center justify-between text-gold/80 mb-3">
                    <span className="text-xs font-mono font-bold tracking-widest">{stat.number}</span>
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-gold group-hover:text-ink-900 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display mb-1 group-hover:text-gold transition-colors">
                    <ImpactCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>

                  <div className="text-sm font-bold text-gold-light mt-1 font-display">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-light">
                    {stat.sublabel}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
