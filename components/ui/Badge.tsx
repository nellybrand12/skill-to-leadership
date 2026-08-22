import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'navy' | 'green' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'gold', size = 'md', className }: BadgeProps) {
  const variants = {
    gold: 'bg-gold-light text-gold-900 border border-gold-300 font-semibold',
    navy: 'bg-primary-navy/10 text-primary-navy border border-primary-navy/20 font-semibold',
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold',
    blue: 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold',
    gray: 'bg-neutral-surface text-neutral-muted border border-neutral-border font-medium',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full',
    md: 'text-xs px-3 py-1 rounded-full',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 uppercase tracking-wider', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
