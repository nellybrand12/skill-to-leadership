import React from 'react';
import { Badge } from '@/components/ui/Badge';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Skill to Leadership',
  description:
    'Learn how Skill to Leadership collects, uses, and safeguards personal information across program applications, events, and website interactions.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Skill to Leadership',
    description: 'Privacy policy and data protection practices for Skill to Leadership.',
    url: '/privacy',
    siteName: 'Skill to Leadership',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-sm text-neutral-dark leading-relaxed">
      <Badge variant="navy">Legal Compliance</Badge>
      <h1 className="text-3xl font-black text-primary-navy">Privacy Policy</h1>
      <p className="text-xs text-neutral-muted">Last updated: August 2026</p>

      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h2 className="text-lg font-bold text-primary-navy">1. Information We Collect</h2>
        <p className="text-neutral-muted">
          Skill to Leadership collects information you provide directly when applying for a cohort, making a donation, subscribing to our newsletter, or contacting our team. This may include your name, email, phone number, location, and application motivation.
        </p>

        <h2 className="text-lg font-bold text-primary-navy">2. How We Use Your Information</h2>
        <p className="text-neutral-muted">
          We use your data solely for admissions processing, issuing donation receipts, organizing workshop sessions, communicating program milestones, and evaluating the educational impact of our initiatives. We never sell or distribute your data to third parties.
        </p>

        <h2 className="text-lg font-bold text-primary-navy">3. Contact</h2>
        <p className="text-neutral-muted">
          For privacy inquiries, reach us at <strong>contact@skilltoleadership.org</strong>.
        </p>
      </div>
    </div>
  );
}
