import React from 'react';
import { db } from '@/lib/db';
import { HeroSection } from '@/components/sections/HeroSection';
import { FounderSection } from '@/components/sections/FounderSection';
import { StorySection } from '@/components/sections/StorySection';
import { SkillsGrid } from '@/components/sections/SkillsGrid';
import { EntrepreneursSpotlightSection } from '@/components/sections/EntrepreneursSpotlightSection';
import { CohortGallerySection } from '@/components/sections/CohortGallerySection';
import { ParticipantStories } from '@/components/sections/ParticipantStories';
import { CohortTwoBanner } from '@/components/sections/CohortTwoBanner';

import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-0 bg-cream-canvas">
      {/* 1. Hero Section */}
      <HeroSection
        heading={settings.hero_heading}
        subtext={settings.hero_subtext}
      />

      {/* 2. Word From The Founder */}
      <FounderSection
        founderImage={settings.founder_image}
        founderName={settings.founder_name}
        founderQuote={settings.founder_quote}
      />

      {/* 3. Our Story & The 6-Stage Journey */}
      <StorySection />

      {/* 4. Practical Disciplines */}
      <SkillsGrid />

      {/* 5. Entrepreneurs Spotlight (Active Featured Initiative with Time-Aware Status) */}
      <EntrepreneursSpotlightSection />

      {/* 6. Cohort 1 Visual Archive */}
      <CohortGallerySection />

      {/* 7. Participant Voices */}
      <ParticipantStories />

      {/* 8. Cohort 2 — Coming Soon */}
      <CohortTwoBanner />
    </div>
  );
}
