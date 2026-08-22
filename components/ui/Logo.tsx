import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function Logo({
  variant = 'dark',
  size = 'md',
  className,
  showText = true,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 32, height: 32, text: 'text-xs sm:text-sm' },
    md: { icon: 38, height: 38, text: 'text-xs sm:text-base' },
    lg: { icon: 48, height: 48, text: 'text-sm sm:text-lg' },
  };

  const current = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center gap-2 sm:gap-3 group focus:outline-none transition-transform duration-200 hover:scale-[1.01] min-w-0',
        className
      )}
      aria-label="Skill to Leadership Home"
    >
      {/* Official Circular Brand Emblem (No Hard Border) */}
      <div className="relative rounded-full overflow-hidden shrink-0 shadow-sm">
        <Image
          src="/Skill-to-leadership-logo.jpg"
          alt="Skill to Leadership Logo"
          width={current.icon}
          height={current.icon}
          priority
          className="object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col items-start leading-tight min-w-0">
          <span
            className={cn(
              'font-black tracking-tight leading-none uppercase font-display whitespace-nowrap text-xs sm:text-sm lg:text-[15px]',
              variant === 'light' ? 'text-white' : 'text-ink-900'
            )}
          >
            Skill to Leadership
          </span>
          <span
            className={cn(
              'text-[8px] sm:text-[9.5px] lg:text-[10px] font-bold tracking-wider sm:tracking-widest uppercase mt-0.5 whitespace-nowrap',
              variant === 'light' ? 'text-gold-300' : 'text-gold-700'
            )}
          >
            Turning Skills Into Leadership
          </span>
        </div>
      )}
    </Link>
  );
}
