import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-primary-navy hover:bg-primary-navy-light text-white shadow-soft focus:ring-primary-navy',
      secondary: 'bg-primary-navy/10 hover:bg-primary-navy/15 text-primary-navy focus:ring-primary-navy',
      gold: 'bg-gold hover:bg-gold-600 text-primary-navy font-bold shadow-soft focus:ring-gold',
      outline: 'bg-primary-navy/5 hover:bg-primary-navy/10 text-primary-navy shadow-soft focus:ring-primary-navy',
      ghost: 'text-primary-navy hover:bg-primary-navy/5 focus:ring-primary-navy',
      white: 'bg-white hover:bg-neutral-offwhite text-primary-navy font-bold shadow-soft focus:ring-white',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5',
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {!isLoading && leftIcon}
          <span>{children}</span>
          {!isLoading && rightIcon}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
