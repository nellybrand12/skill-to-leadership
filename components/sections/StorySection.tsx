import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, Target, Compass } from 'lucide-react';

export function StorySection() {
  const steps = [
    { title: 'Learn', desc: 'Master market-tested skills with structured guidance.' },
    { title: 'Practice', desc: 'Hands-on studio projects with real material kits.' },
    { title: 'Create', desc: 'Express original cultural creativity and craftsmanship.' },
    { title: 'Compete', desc: 'Test mastery in high-stakes category challenges.' },
    { title: 'Connect', desc: 'Build long-term bonds with peers and mentors.' },
    { title: 'Lead', desc: 'Launch independent enterprises and inspire others.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Transformation Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider">
            <span>The Core Transformation</span>
          </div>
          
          {/* Progression forced to single line on desktop and scaled on mobile */}
          <h2 className="text-[clamp(0.875rem,3.2vw,2.25rem)] font-extrabold text-primary-navy tracking-tight whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1.5 sm:gap-3 flex-nowrap font-display">
            <span>Skills</span>
            <span className="text-gold">→</span>
            <span>Confidence</span>
            <span className="text-gold">→</span>
            <span>Opportunity</span>
            <span className="text-gold">→</span>
            <span>Leadership</span>
          </h2>

          <p className="text-neutral-muted text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            We believe that leadership is not theoretical. It is born when young people gain tangible competence, discover self-belief, and create value for their communities.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-card-lg overflow-hidden shadow-elevated bg-ink-950 h-80 sm:h-[460px] group">
              <Image
                src="/images/our-story.jpg"
                alt="Skill to Leadership team, mentors, and community"
                fill
                priority
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-bold uppercase tracking-widest text-gold mb-1">
                  Our Philosophy
                </div>
                <div className="text-lg font-bold font-display">
                  Going beyond teaching a skill to building lasting self-reliance.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-navy tracking-tight font-display">
                Our Story & Purpose
              </h3>
              <p className="mt-3 text-neutral-muted leading-relaxed font-light">
                Skill to Leadership is a youth empowerment initiative focused on equipping young people with practical, marketable skills while developing their confidence, creativity, and leadership potential.
              </p>
              <p className="mt-2 text-neutral-muted leading-relaxed font-light">
                The program creates an immersive environment where young people can thrive at every step of their journey:
              </p>
            </div>

            {/* 6 Step Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {steps.map((s) => (
                <div key={s.title} className="p-3.5 bg-neutral-surface rounded-2xl">
                  <div className="flex items-center gap-1.5 text-primary-navy font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>{s.title}</span>
                  </div>
                  <div className="text-[11px] text-neutral-muted mt-1 leading-snug font-light">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-gold-light/40 space-y-1.5">
                <div className="flex items-center gap-2 text-gold-900 font-extrabold text-sm uppercase tracking-wider">
                  <Target className="w-4 h-4 text-gold-700" />
                  <span>Our Mission</span>
                </div>
                <p className="text-xs text-neutral-dark leading-relaxed font-medium">
                  To empower young people with practical skills, mentorship and leadership opportunities that help them build meaningful futures.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-surface space-y-1.5">
                <div className="flex items-center gap-2 text-primary-navy font-extrabold text-sm uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-primary-navy" />
                  <span>Our Vision</span>
                </div>
                <p className="text-xs text-neutral-dark leading-relaxed font-medium">
                  A generation of skilled, confident and purpose-driven young leaders capable of creating opportunities for themselves and others.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button href="/about" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Read Our Full Story
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
