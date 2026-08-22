import React from 'react';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Terms of Service | Skill to Leadership',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-sm text-neutral-dark leading-relaxed">
      <Badge variant="navy">Legal Compliance</Badge>
      <h1 className="text-3xl font-black text-primary-navy">Terms of Service</h1>
      <p className="text-xs text-neutral-muted">Last updated: August 2026</p>

      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h2 className="text-lg font-bold text-primary-navy">1. Acceptance of Terms</h2>
        <p className="text-neutral-muted">
          By accessing or using the Skill to Leadership website, application systems, or fellowship events, you agree to comply with all applicable terms and code of conduct.
        </p>

        <h2 className="text-lg font-bold text-primary-navy">2. Fellowship Code of Conduct</h2>
        <p className="text-neutral-muted">
          All cohort applicants and fellows are required to maintain the highest standards of integrity, respect, punctuality, and peer collaboration throughout workshops, studio exercises, and competitions.
        </p>

        <h2 className="text-lg font-bold text-primary-navy">3. Intellectual Property</h2>
        <p className="text-neutral-muted">
          Students retain intellectual property rights to original artisan pieces, hair designs, and video content produced during the cohort, while granting Skill to Leadership non-exclusive license to feature achievements for non-commercial educational and reporting purposes.
        </p>
      </div>
    </div>
  );
}
