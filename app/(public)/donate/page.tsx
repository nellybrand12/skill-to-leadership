'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Heart, ExternalLink, Copy, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function DonatePage() {
  const [copiedMtn, setCopiedMtn] = useState(false);
  const [copiedOrange, setCopiedOrange] = useState(false);

  const mtnNumber = siteConfig.donations.mtnMoMo;
  const orangeNumber = siteConfig.donations.orangeMoney;
  const goFundMeUrl = siteConfig.donations.goFundMeUrl;

  const copyNumber = (text: string, type: 'mtn' | 'orange') => {
    navigator.clipboard.writeText(text);
    if (type === 'mtn') {
      setCopiedMtn(true);
      setTimeout(() => setCopiedMtn(false), 3000);
    } else {
      setCopiedOrange(true);
      setTimeout(() => setCopiedOrange(false), 3000);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-20 py-12 lg:py-18 bg-cream-canvas">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Philanthropic Giving</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight uppercase font-display">
              Support the Next Generation
            </h1>
            <p className="text-base sm:text-lg text-neutral-muted leading-relaxed font-light">
              Your support helps Skill to Leadership provide young people with practical skills, mentorship, toolkits, and meaningful experiences that transform their futures.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Motivational Emotional Support Message (No Hard Borders) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={60}>
          <div className="p-6 sm:p-8 rounded-3xl liquid-glass-card text-center shadow-soft space-y-2">
            <Sparkles className="w-6 h-6 text-gold-600 mx-auto" />
            <blockquote className="text-lg sm:text-xl font-semibold text-ink-900 font-sans italic leading-relaxed">
              &ldquo;Every contribution, no matter how small, helps us move one step closer to changing another life.&rdquo;
            </blockquote>
          </div>
        </ScrollReveal>
      </section>

      {/* Support Cohort 2 Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={100}>
          <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white rounded-card-lg p-8 sm:p-12 text-center space-y-4 shadow-soft relative overflow-hidden">
            <div className="ambient-glow-gold top-0 right-0 w-80 h-80 opacity-25" />
            <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
              <div className="text-xs uppercase font-extrabold tracking-widest text-gold-300">Upcoming Milestone</div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
                Support Cohort 2
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                Every contribution goes directly toward purchasing hands-on starter toolkits, workshop studio materials, expert mentor sessions, and seed grants for our upcoming second cohort in Cameroon.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3 Donation Methods (No Hard Borders) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <ScrollReveal delay={120}>
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 font-display">
                Choose a Direct Giving Option
              </h2>
              <p className="text-sm text-neutral-muted font-light">
                Select your preferred mobile money provider in Cameroon or donate globally via GoFundMe.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. MTN Mobile Money (Full-Container Fill) */}
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-6 h-full">
                <div className="space-y-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-soft bg-white">
                    <Image
                      src="/images/Donation/MTN.jpg"
                      alt="MTN Mobile Money"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider font-display">Local Mobile Money</div>
                  <h3 className="text-xl font-bold text-ink-900 font-display">MTN MoMo</h3>
                  <div className="text-lg font-mono font-black text-ink-900 bg-cream-surface p-3 rounded-2xl select-all shadow-soft">
                    {mtnNumber}
                  </div>
                  <p className="text-xs text-neutral-muted font-light leading-relaxed">
                    Direct transfer via MTN Cameroon Mobile Money wallet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyNumber(mtnNumber, 'mtn')}
                  className="w-full py-3 rounded-button bg-ink-900 hover:bg-ink-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-soft"
                >
                  {copiedMtn ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gold" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </ScrollReveal>

            {/* 2. Orange Money (Full-Container Fill) */}
            <ScrollReveal delay={60}>
              <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-6 h-full">
                <div className="space-y-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-soft bg-white">
                    <Image
                      src="/images/Donation/Orange.jpg"
                      alt="Orange Money"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider font-display">Local Mobile Money</div>
                  <h3 className="text-xl font-bold text-ink-900 font-display">Orange Money</h3>
                  <div className="text-lg font-mono font-black text-ink-900 bg-cream-surface p-3 rounded-2xl select-all shadow-soft">
                    {orangeNumber}
                  </div>
                  <p className="text-xs text-neutral-muted font-light leading-relaxed">
                    Direct transfer via Orange Cameroun Money wallet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyNumber(orangeNumber, 'orange')}
                  className="w-full py-3 rounded-button bg-ink-900 hover:bg-ink-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-soft"
                >
                  {copiedOrange ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gold" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </ScrollReveal>

            {/* 3. GoFundMe */}
            <ScrollReveal delay={120}>
              <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-6 h-full">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shadow-soft">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                  </div>
                  <div className="text-xs font-bold text-neutral-muted uppercase tracking-wider font-display">International Giving</div>
                  <h3 className="text-xl font-bold text-ink-900 font-display">GoFundMe</h3>
                  <div className="text-xs text-neutral-muted leading-relaxed font-light">
                    Support our international campaign securely with any debit or credit card worldwide.
                  </div>
                </div>

                <a
                  href={goFundMeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-button liquid-glass-button text-ink-900 font-bold text-xs flex items-center justify-center gap-2 shadow-soft transition-all"
                >
                  <span>Donate via GoFundMe</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>

          </div>

          <div className="p-4 rounded-2xl bg-cream-surface text-center text-xs text-neutral-muted flex items-center justify-center gap-2 shadow-soft">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% of all contributions directly fund fellow toolkits and cohort workshops.</span>
          </div>

        </div>
      </section>

    </div>
  );
}
