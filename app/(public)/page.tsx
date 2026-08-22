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

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let heroHeading = 'TURNING SKILLS INTO LEADERSHIP';
  let heroSubtext = 'An experiential youth development non-profit empowering young changemakers in Cameroon with hands-on craft mastery, mentorship, starter toolkits, and seed prize capital.';

  try {
    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          in: ['hero_heading', 'hero_subtext'],
        },
      },
    });

    const headingSetting = settings.find((s) => s.key === 'hero_heading');
    const subtextSetting = settings.find((s) => s.key === 'hero_subtext');

    if (headingSetting?.value) heroHeading = headingSetting.value;
    if (subtextSetting?.value) heroSubtext = subtextSetting.value;
  } catch (err) {
    console.error('Error fetching homepage settings from DB:', err);
  }

  return (
    <div className="space-y-0 bg-cream-canvas">
      {/* 1. Hero Section */}
      <HeroSection heading={heroHeading} subtext={heroSubtext} />

      {/* 2. Word From The Founder */}
      <FounderSection />

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
