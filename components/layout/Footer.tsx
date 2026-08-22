'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/data/siteConfig';
import { partnersData } from '@/data/partners';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { Mail, CheckCircle2, AlertCircle, Heart, ArrowRight, Quote } from 'lucide-react';

export function Footer() {
  const [partners, setPartners] = useState(partnersData);
  const [settings, setSettings] = useState<Record<string, string>>({
    contact_email: siteConfig.contact.email,
    contact_whatsapp: siteConfig.contact.whatsapp,
    contact_whatsapp_link: siteConfig.contact.whatsappLink,
    contact_location: siteConfig.contact.address,
    social_instagram: siteConfig.socialLinks.instagram,
    social_linkedin: siteConfig.socialLinks.linkedin,
    social_x: siteConfig.socialLinks.x,
    footer_scripture: siteConfig.footerScripture.quote,
    footer_scripture_reference: siteConfig.footerScripture.reference,
  });

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Dynamic partners
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.partners && data.partners.length > 0) {
          setPartners(data.partners);
        }
      })
      .catch((err) => console.error('Failed to load dynamic partners:', err));

    // Dynamic settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch((err) => console.error('Failed to load dynamic settings:', err));
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Subscribed! Thank you for supporting our mission.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please check your connection.');
    }
  };

  return (
    <footer className="bg-ink-900 text-white pt-16 pb-12 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="ambient-glow-gold top-0 right-0 w-[450px] h-[450px] opacity-20" />
      <div className="ambient-glow-ink bottom-0 left-0 w-[400px] h-[400px] opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Dynamic Biblical Scripture Card */}
        <div className="liquid-glass-card-dark rounded-2xl p-6 sm:p-7 shadow-soft space-y-3 relative border border-white/10">
          <div className="flex items-start gap-4">
            <Quote className="w-6 h-6 text-gold shrink-0 opacity-75 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-xs sm:text-sm md:text-base text-gray-200 italic font-light leading-relaxed font-display">
                &ldquo;{settings.footer_scripture}&rdquo;
              </p>
              <div className="text-right pt-1">
                <span className="text-[11px] sm:text-xs font-black text-gold not-italic tracking-wider uppercase">
                  — {settings.footer_scripture_reference}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Desktop Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* COLUMN 1 (LEFT): Brand, Location, Dynamic Contact */}
          <div className="lg:col-span-6 space-y-7 flex flex-col justify-between h-full">
            <div className="space-y-3.5">
              <Logo variant="light" size="lg" />
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg font-light">
                Skill to Leadership is a youth-focused non-profit program empowering young people with practical skills, mentorship, toolkits, and leadership opportunities in Cameroon.
              </p>
              <div className="text-[11px] text-gray-400 font-light space-y-1 pt-1">
                <p>{settings.contact_location || 'Yaoundé, Centre Region, Cameroon'}</p>
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <a href={`mailto:${settings.contact_email}`} className="text-gold hover:underline">
                    {settings.contact_email}
                  </a>
                  {settings.contact_whatsapp && (
                    <>
                      <span>·</span>
                      <a
                        href={settings.contact_whatsapp_link || `https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:text-[#25D366]/80 font-medium inline-flex items-center gap-1"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>WhatsApp: {settings.contact_whatsapp}</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="hidden md:block space-y-2.5 pt-1">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold font-display">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-sm text-gray-300 max-w-sm">
                <div className="space-y-2 flex flex-col">
                  <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                  <Link href="/about" className="hover:text-gold transition-colors">About Us</Link>
                  <Link href="/programs" className="hover:text-gold transition-colors">Discipline Tracks</Link>
                  <Link href="/cohorts" className="hover:text-gold transition-colors">Fellowship Cohorts</Link>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Link href="/impact" className="hover:text-gold transition-colors">Impact & Winners</Link>
                  <Link href="/events" className="hover:text-gold transition-colors">Spotlight & Events</Link>
                  <Link href="/volunteer" className="hover:text-gold transition-colors">Get Involved</Link>
                  <Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link>
                  <Link
                    href="/donate"
                    className="text-red-400 font-extrabold hover:text-red-300 inline-flex items-center gap-1 transition-colors pt-0.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>Support / Donate</span>
                  </Link>
                </div>
              </div>
            </div>


          </div>

          {/* COLUMN 2 (Right): Newsletter, Socials, Partners */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full">
            
            {/* Newsletter */}
            <div className="rounded-2xl p-5 sm:p-6 liquid-glass-card-dark shadow-soft space-y-3">
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold font-display">
                  Stay Connected
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-display">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  Get cohort updates, exhibition invites, and stories directly in your inbox.
                </p>
              </div>

              {status === 'success' ? (
                <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{message}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-ink-900 font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <div className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold font-display">
                Connect With Us
              </div>
              <div className="flex items-center gap-3">
                {/* X */}
                <a
                  href={settings.social_x || 'https://x.com/FonyeChris?s=20'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Skill to Leadership on X"
                  className="w-11 h-11 rounded-full liquid-glass-card-dark flex items-center justify-center p-2.5 text-white hover:bg-gold hover:text-ink-900 transition-all shadow-soft group shrink-0"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={settings.social_instagram || 'https://www.instagram.com/skill_to_leadership?igsi=ZDNlZDc0MzIxNw=='}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Skill to Leadership on Instagram"
                  className="w-11 h-11 rounded-full liquid-glass-card-dark flex items-center justify-center p-2.5 text-white hover:bg-gold hover:text-ink-900 transition-all shadow-soft group shrink-0"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={settings.social_linkedin || 'https://www.linkedin.com/in/mokijei-junior-fonye-christopher-4139ba384/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Skill to Leadership on LinkedIn"
                  className="w-11 h-11 rounded-full liquid-glass-card-dark flex items-center justify-center p-2.5 text-white hover:bg-gold hover:text-ink-900 transition-all shadow-soft group shrink-0"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Partners Logos */}
            <div className="space-y-3 pt-2">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold font-display">
                Our Partners & Supporters
              </div>
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="relative h-10 sm:h-12 w-24 sm:w-28 opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 shrink-0 mix-blend-screen"
                    title={partner.name}
                  >
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/volunteer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-gold transition-colors font-light group"
                >
                  <span>Interested in partnering, joining our staff, or mentoring fellows?</span>
                  <span className="font-bold text-gold inline-flex items-center gap-0.5 group-hover:text-gold-light underline underline-offset-4">
                    Send a message
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright (Left) & Website Credit (Right) */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="space-y-0.5 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Skill to Leadership. All rights reserved.</p>
            <p className="text-[11px] text-gray-500 font-light">
              Registered non-profit initiative empowering African youth in Yaoundé, Cameroon.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>Website by</span>
            <a
              href={`https://wa.me/237658231168?text=${encodeURIComponent("Hi Nelly Brand, I came across the Skill to Leadership website and I'd love to discuss building something similar or creating a unique website tailored to my taste and vision.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light font-bold inline-flex items-center gap-1.5 transition-colors underline-offset-2 hover:underline group"
            >
              <span>Nelly Brand K.</span>
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
