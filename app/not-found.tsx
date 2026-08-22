import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-light text-primary-navy flex items-center justify-center shadow-soft">
          <Compass className="w-10 h-10 text-gold-700 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-gold-700 uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-primary-navy tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-neutral-muted leading-relaxed">
            Even leaders sometimes take the wrong path. The page you are looking for has been moved or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Homepage
          </Button>
          <Button href="/programs" variant="outline" size="md">
            Explore Programs
          </Button>
        </div>

      </div>
    </div>
  );
}
