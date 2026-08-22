export interface AboutJourneyStep {
  step: string;
  title: string;
  tagline: string;
  description: string;
}

export interface WhatWeDoPillar {
  title: string;
  tagline: string;
  description: string;
  iconName: string;
}

export interface CohortTrackHighlight {
  title: string;
  category: string;
  description: string;
  image: string;
  prizeText: string;
}

export const aboutPageData = {
  hero: {
    badge: 'About Skill to Leadership',
    headline: 'TURNING SKILLS INTO LEADERSHIP',
    subtitle:
      'Skill to Leadership is a youth-focused non-profit program designed to empower young people with practical skills, mentorship, confidence, and opportunities for leadership.',
    missionTagline:
      'Empowering Cameroonian youth with hands-on craft mastery, mentorship, starter toolkits, and launch platforms.',
  },

  missionVision: {
    mission: {
      title: 'Our Mission',
      text: 'To empower young people with practical skills, mentorship, and leadership opportunities that help them build confidence, discover their potential, and grow into capable leaders.',
    },
    vision: {
      title: 'Our Vision',
      text: 'A generation of skilled, confident, and purpose-driven young people capable of creating opportunities for themselves and positively influencing the communities around them.',
    },
    nonProfitIdentity:
      'Skill to Leadership is an experiential youth-development non-profit initiative operating in Cameroon, dedicated to turning vocational competence into community leadership and entrepreneurial self-reliance.',
  },

  problem: {
    badge: 'The Motivation',
    title: 'Bridging the Gap Between Ambition and Opportunity',
    intro:
      'Across our communities, countless young people possess boundless creativity, talent, ambition, ideas, and leadership potential.',
    description: [
      'Yet too often, they lack access to practical hands-on training, structured mentorship, meaningful exposure, confidence-building opportunities, professional networks, and platforms where their abilities can be recognized and celebrated.',
      'Conventional education frequently remains abstract and theoretical, leaving passionate young people without the immediate, tangible skills needed to create economic independence and shape their own destinies.',
      'Skill to Leadership was founded specifically to bridge this divide — providing the tools, mentorship, and platforms young changemakers need to transform their natural gifts into lasting leadership.',
    ],
    highlightQuote:
      'Potential without a platform remains unrealized. When we equip young people with tangible tools and belief, they build their own futures.',
  },

  whatWeDo: {
    badge: 'What We Do',
    title: 'A Holistic Framework for Youth Empowerment',
    subtitle:
      'We combine five complementary pillars that turn vocational mastery into personal and economic leadership.',
    pillars: [
      {
        title: 'Practical Skills',
        tagline: 'Tangible, Income-Generating Craft',
        description:
          'Young people learn practical, creative, and market-demanded skills taught by seasoned artisans with studio equipment and starter toolkits.',
        iconName: 'Wrench',
      },
      {
        title: 'Mentorship',
        tagline: 'Guidance from Experienced Role Models',
        description:
          'Participants interact closely with instructors, professionals, and guest mentors who help them understand their potential, navigate challenges, and seize opportunities.',
        iconName: 'Compass',
      },
      {
        title: 'Leadership',
        tagline: 'Character, Agency & Responsibility',
        description:
          'The program goes beyond technical training by cultivating self-confidence, effective communication, initiative, collaborative teamwork, and ethical responsibility.',
        iconName: 'Award',
      },
      {
        title: 'Community',
        tagline: 'Peer Collaboration & Shared Growth',
        description:
          'Fellows are given vibrant spaces to meet, collaborate, network, compete, and learn from one another, forging lifelong bonds and mutual support systems.',
        iconName: 'Users',
      },
      {
        title: 'Opportunity',
        tagline: 'Platforms to Showcase & Launch',
        description:
          'We create public showcases, live exhibitions, and seed-grant competitions where young people tell their stories, demonstrate their work, and access new horizons.',
        iconName: 'Sparkles',
      },
    ] as WhatWeDoPillar[],
  },

  journey: {
    badge: 'The Program Journey',
    title: 'From First Skill to Community Leadership',
    subtitle:
      'Skill to Leadership is not simply a training workshop — it is a deliberate progression from learning a craft to leading a meaningful life.',
    steps: [
      {
        step: '01',
        title: 'DISCOVER',
        tagline: 'Uncovering Inherent Gifts',
        description: 'Young people identify their creative passions and select a discipline aligned with their natural strengths.',
      },
      {
        step: '02',
        title: 'LEARN',
        tagline: 'Foundational Craft Mastery',
        description: 'Intensive studio instruction on core techniques, tool safety, sanitation protocols, and material excellence.',
      },
      {
        step: '03',
        title: 'PRACTICE',
        tagline: 'Hands-On Studio Hours',
        description: 'Fellows receive dedicated starter toolkits and log rigorous practice hours crafting original works.',
      },
      {
        step: '04',
        title: 'CONNECT',
        tagline: 'Mentorship & Convergence',
        description: 'Convergence Days bring participants together for panel discussions, instructor feedback, and peer collaboration.',
      },
      {
        step: '05',
        title: 'COMPETE',
        tagline: 'Challenge & Recognition',
        description: 'Fellows test their skills in healthy category competitions evaluated by professional craft judges.',
      },
      {
        step: '06',
        title: 'GROW',
        tagline: 'Business & Brand Foundations',
        description: 'Masterclasses in client relations, fair pricing, digital storytelling, and venture unit economics.',
      },
      {
        step: '07',
        title: 'LEAD',
        tagline: 'Independent Venture & Community Impact',
        description: 'Graduating as empowered changemakers who launch micro-enterprises and train others in their communities.',
      },
    ] as AboutJourneyStep[],
  },

  firstCohort: {
    badge: 'Cohort 1 Milestone',
    title: 'The Inaugural Cohort in Cameroon',
    description:
      'The inaugural cohort brought together talented young people across Yaoundé, providing them with comprehensive training, professional equipment toolkits, and dedicated mentorship across four practical craft disciplines.',
    tracks: [
      {
        title: 'Braiding & Hair Artistry',
        category: 'Hairstyling & Salon Economics',
        description:
          'Precision African braiding, knotless styling, client hygiene protocols, and salon micro-enterprise management.',
        image: '/images/Braiding.jpg',
        prizeText: '100,000 FCFA Micro-Grant Prize',
      },
      {
        title: 'Nail Artistry & Aesthetics',
        category: 'Beauty & Micro-Enterprise',
        description:
          'Precision nail aesthetics, gel extensions, 3D design, sanitary studio standards, and client booking workflows.',
        image: '/images/Nail_Art.jpg',
        prizeText: '100,000 FCFA Micro-Grant Prize',
      },
      {
        title: 'Clay & Ceramic Arts',
        category: 'Pottery & Sculptural Craft',
        description:
          'Sculptural modeling, terracotta finishing, kiln curing, and commercial artisan product design.',
        image: '/images/Clay_and_ceramic_art.jpg',
        prizeText: '100,000 FCFA Micro-Grant Prize',
      },
      {
        title: 'Digital Content Creation',
        category: 'Media & Digital Storytelling',
        description:
          'Mobile videography rigs, visual editing, commercial social media pitching, and narrative brand production.',
        image: '/images/Content_creation.jpg',
        prizeText: '100,000 FCFA Micro-Grant Prize',
      },
    ] as CohortTrackHighlight[],
  },

  competition: {
    badge: 'Culminating Challenges',
    title: 'Healthy Competition, Real Recognition',
    paragraphs: [
      'The first cohort culminated in rigorous, live-judged competitions connected to each of the four training disciplines. The challenges gave participants a dynamic platform to demonstrate what they had learned, push their creative boundaries, showcase their originality under time constraints, and experience the thrill of healthy merit-based competition.',
      'Category winners received substantial 100,000 FCFA seed micro-grant prizes along with advanced starter equipment to directly fund their independent ventures and freelance studios.',
      'Beyond prizes, every participant gained the invaluable experience of having their craftsmanship exhibited publicly, earning respect from mentors, peers, and community leaders.',
    ],
  },

  philosophy: {
    badge: 'Our Core Philosophy',
    title: 'Why "Skill to Leadership"?',
    text: [
      'We chose the name Skill to Leadership because we firmly believe that a practical craft is never just a technical manual skill — it is an engine of personal transformation.',
      'When placed in an encouraging, disciplined environment, mastering a craft unlocks deep self-confidence, self-discipline, creative agency, economic independence, clear communication, responsibility, and entrepreneurial initiative.',
    ],
    closingQuote:
      '“We do not only want young people to learn something. We want them to discover what they can become through what they learn.”',
  },

  partnerships: {
    badge: 'Collaboration & Community',
    title: 'Growing Through Shared Purpose',
    text:
      'Skill to Leadership flourishes through collaboration with global and local institutions that share our unwavering belief in youth potential. We are deeply grateful for the foundational support of Bucknell University, Projects for Peace, Ashinaga, and Open Dreams.',
  },

  cta: {
    headline: 'BE PART OF THE JOURNEY',
    copy:
      "Whether you're a young person with a skill to develop, a mentor with knowledge to share, an organization looking to collaborate, or someone who believes in investing in young people, there is a place for you in this journey.",
    links: [
      { label: 'Explore Programs', href: '/programs', variant: 'gold' as const },
      { label: 'Explore Cohorts', href: '/cohorts', variant: 'outline' as const },
      { label: 'Attend an Event', href: '/events', variant: 'outline' as const },
      { label: 'Get Involved', href: '/volunteer', variant: 'outline' as const },
    ],
  },
};
