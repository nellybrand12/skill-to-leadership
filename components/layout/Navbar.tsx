'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Menu, X, Heart } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Cohorts', href: '/cohorts' },
  { name: 'Impact', href: '/impact' },
  { name: 'Events', href: '/events' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const activeHref =
    hoveredHref ||
    NAV_LINKS.find((link) => pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))?.href ||
    '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding underline indicator position whenever active/hovered link changes
  useEffect(() => {
    if (!navRef.current) return;
    const targetElement = navRef.current.querySelector(`[data-nav-href="${activeHref}"]`) as HTMLElement;
    if (targetElement) {
      const navRect = navRef.current.getBoundingClientRect();
      const elemRect = targetElement.getBoundingClientRect();
      setIndicatorStyle({
        left: elemRect.left - navRect.left,
        width: elemRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeHref, pathname]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-cream-canvas/95 backdrop-blur-md shadow-soft py-2.5'
          : 'bg-cream-canvas/85 backdrop-blur-sm py-3.5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Official Emblem + Title Brand (with mobile spacing) */}
          <div className="flex items-center min-w-0 pr-2">
            <Logo variant="dark" size="md" />
          </div>

          {/* Desktop Navigation Links (With Single Shared Sliding Underline) */}
          <nav
            ref={navRef}
            onMouseLeave={() => setHoveredHref(null)}
            className="relative hidden lg:flex items-center gap-6 py-1"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  data-nav-href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={cn(
                    'text-sm font-semibold transition-colors duration-200 py-1.5 border-none outline-none active:border-none active:outline-none active:ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-md',
                    isActive ? 'text-ink-900 font-bold' : 'text-ink-900/80 hover:text-gold-700'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Single shared sliding underline */}
            <span
              className="absolute bottom-0 h-0.5 bg-gold rounded-full transition-all duration-300 ease-out pointer-events-none"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
          </nav>

          {/* Desktop Liquid Glass Donate CTA (With Red Heart) */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              href="/donate"
              variant="gold"
              size="md"
              leftIcon={<Heart className="w-4 h-4 text-red-500 fill-red-500" />}
              className="liquid-glass-button font-extrabold px-6 py-2.5 text-sm tracking-wide text-ink-900 shadow-soft"
            >
              Donate
            </Button>
          </div>

          {/* Mobile Actions with Clear Margin/Spacing Before Menu Button */}
          <div className="flex items-center gap-2 lg:hidden shrink-0 ml-3">
            <Button
              href="/donate"
              variant="gold"
              size="sm"
              leftIcon={<Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />}
              className="liquid-glass-button px-3.5 py-1.5 text-xs font-bold text-ink-900"
            >
              Donate
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-900 hover:bg-cream-surface focus:outline-none ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-canvas shadow-elevated animate-fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-base font-semibold transition-colors',
                    isActive
                      ? 'bg-gold-light text-ink-900 font-bold'
                      : 'text-ink-900 hover:bg-cream-surface hover:text-gold-700'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-2">
              <Button
                href="/donate"
                variant="gold"
                size="md"
                leftIcon={<Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                className="w-full justify-center font-bold liquid-glass-button text-ink-900"
              >
                Donate to Skill to Leadership
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
