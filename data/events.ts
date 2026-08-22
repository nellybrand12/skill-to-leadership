export interface EventAgendaBlock {
  title: string;
  tagline?: string;
  description: string | string[];
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  coverImage: string;
  eventType: string;
  status: 'COMPLETED' | 'UPCOMING';
  description: string;
  theme?: string;
  videoSrc?: string;
  speakerImage?: string;
  galleryImages?: string[];
  sections: EventAgendaBlock[];
  highlights?: string[];
  nextEventSlug?: string;
}

export const pastEventsData: EventItem[] = [
  {
    id: 'event-1',
    title: 'Convergence Day 1',
    slug: 'convergence-day-1',
    date: 'Friday 22nd May 2026',
    time: '9:00 AM Sharp',
    location: 'OPEN DREAMS Center, Obili',
    coverImage: '/images/Events/Event1.jpg',
    videoSrc: '/images/convergence/Convergence-1.mp4',
    eventType: 'Orientation & Workshop',
    status: 'COMPLETED',
    description:
      'The inaugural convergence milestone bringing together Cohort 1 fellows, expert instructors, and institutional partners at the Open Dreams Center in Obili to officially launch the Skill to Leadership journey.',
    theme: 'Official Welcome, Orientation & Youth Leadership',
    highlights: [
      'Official welcome & comprehensive curriculum walkthrough',
      'Meet the studio craft faculty & mentors',
      'Keynote on leadership & youth empowerment in Cameroon',
      'Team building & interdisciplinary networking sessions',
      'Fellowship group photo & launch banquet',
    ],
    sections: [
      {
        title: 'WELCOME & PROGRAM OVERVIEW',
        tagline: 'Laying the Foundation for Excellence',
        description: [
          'The event commenced with an official welcome session, introducing fellows to the core mission, values, and expectations of Skill to Leadership.',
          'Participants received a detailed overview of the entire fellowship structure, the four intensive skill tracks (Braiding, Ceramic Arts, Content Creation, and Nail Artistry), and clear benchmarks regarding punctuality, active participation, peer respect, and dedicated studio hours.',
        ],
      },
      {
        title: 'MEET THE INSTRUCTORS',
        tagline: 'Learning Directly from Seasoned Practitioners',
        description: [
          'Fellows had the invaluable opportunity to hear directly from each discipline lead instructor.',
          'Instructors walked students through the rigorous hands-on syllabus, professional studio hygiene standards, specialized toolkit contents, and the transformative learning journey ahead.',
        ],
      },
      {
        title: 'LEADERSHIP & YOUTH EMPOWERMENT',
        tagline: 'Connecting Technical Mastery to Purpose',
        description: [
          'A compelling presentation underscored the critical role of leadership, agency, and youth empowerment in today’s rapidly evolving economic landscape.',
          'The session connected daily craft practice back to the broader vision of Skill to Leadership — equipping young people not just to perform tasks, but to become self-directed job creators and community role models.',
        ],
      },
      {
        title: 'TEAM BUILDING & NETWORKING',
        tagline: 'Forging Interdisciplinary Fellowship Bonds',
        description: [
          'Participants engaged in interactive team-building activities designed to break the ice, build mutual trust, and encourage cross-discipline collaboration.',
          'Fellows connected with peers from different backgrounds, exchanging personal goals, creative inspirations, and aspirations for their future ventures.',
        ],
      },
      {
        title: 'THE OFFICIAL LAUNCH & CLOSING',
        tagline: 'Celebrating the Start of the Cohort 1 Journey',
        description: [
          'The momentous day concluded with the distribution of initial materials, an official cohort group photograph, a celebratory shared meal, and enthusiastic momentum heading into the intensive training studios.',
        ],
      },
    ],
    nextEventSlug: 'convergence-day-2',
  },
  {
    id: 'event-2',
    title: 'Convergence Day 2',
    slug: 'convergence-day-2',
    date: 'Friday 29th May 2026',
    time: '9:00 AM Sharp',
    location: 'OPEN DREAMS Center, Obili',
    coverImage: '/images/Events/Event2.jpg',
    speakerImage: '/images/convergence/convegence-2-speakers.jpg',
    eventType: 'Mid-Program Assessment & Review',
    status: 'COMPLETED',
    description:
      'A pivotal mid-program assessment and reflection milestone hosted at the Open Dreams Center in Obili, featuring student evaluations, instructor growth reports, guest leadership addresses, and an esteemed panel discussion.',
    theme: 'Mid-Program Assessment, Student Voices & Leveraging Our Youth',
    highlights: [
      'Mid-program student check-ins & self-reflections',
      'Instructor growth assessments & studio milestone reviews',
      'Inspiring keynote address by Mr. Akaba James, Director of Open Dreams',
      'Esteemed Panel Discussion: "Leveraging our Youth"',
      'Cross-discipline interactive mini-competition & quiz',
      'Motivational session setting the stage for the Grand Finale',
    ],
    sections: [
      {
        title: 'OPENING REMARKS & PROGRAM RECAP',
        tagline: 'Reflecting on Halfway Milestones',
        description: [
          'Fellows were warmly welcomed back to the Open Dreams Center to mark the halfway milestone of Cohort 1.',
          'The opening session recapped the intensive craft hours completed so far, celebrating early studio breakthroughs while refocusing on the goals for the upcoming finale competitions.',
        ],
      },
      {
        title: 'STUDENT CHECK-IN & REFLECTIONS',
        tagline: 'Listening to the Learner Experience',
        description: [
          'Participants completed a thoughtful questionnaire and check-in to reflect honestly on their learning experience, daily challenges, technical growth, and peer interactions.',
          'This structured feedback ensured that every student’s voice was heard and tailored support could be provided for the remaining program duration.',
        ],
      },
      {
        title: 'TRACKING GROWTH: INSTRUCTOR REPORTS',
        tagline: 'Evaluating Technical & Personal Progression',
        description: [
          'Faculty instructors presented comprehensive observations evaluating student growth across all four training tracks.',
          'The reviews highlighted rapid skill development, consistency in technique, engagement during workshops, and targeted areas where fellows could push their craftsmanship to professional standard.',
        ],
      },
      {
        title: 'STUDENT VOICES: IN THEIR OWN WORDS',
        tagline: 'Sharing Journeys, Challenges & Mindset Shifts',
        description: [
          'Students were given the floor to speak openly about their journey in the program so far.',
          'They shared how working with professional tools, receiving regular feedback, and learning alongside supportive peers had transformed their confidence, work ethic, and vision for their future careers.',
        ],
      },
      {
        title: 'A MESSAGE FROM MR. AKABA JAMES',
        tagline: 'Director, Open Dreams',
        description: [
          'Mr. Akaba James, Director of Open Dreams, addressed the fellows with a warm, deeply encouraging speech on perseverance, educational ambition, and the power of youth-led innovation in Cameroon.',
        ],
      },
      {
        title: 'PANEL DISCUSSION: "LEVERAGING OUR YOUTH"',
        tagline: 'Unlocking African Potential for Meaningful Impact',
        description: [
          'A prominent highlight of Convergence Day 2 was a dynamic panel discussion featuring highly esteemed guests and community leaders centered on the theme "Leveraging our Youth".',
          'The panelists explored actionable strategies for young people to channel their creative energy, talent, and vocational skills into sustainable micro-enterprises and community development.',
        ],
      },
      {
        title: 'INTERDISCIPLINARY MINI-COMPETITION',
        tagline: 'Testing Knowledge Across Craft Disciplines',
        description: [
          'To energize the room, fellows participated in a fun and spirited mini-competition testing their grasp of core concepts across all four skill disciplines.',
          'The challenge encouraged fast recall, cross-track collaboration, and healthy camaraderie among participants.',
        ],
      },
      {
        title: 'MOTIVATIONAL SESSION & CLOSING REMARKS',
        tagline: 'Charging Forward to the Grand Gala',
        description: [
          'The gathering concluded with a high-energy motivational session urging students to maintain their discipline and prepare their finest works for the upcoming final exhibition and Gala.',
        ],
      },
    ],
    nextEventSlug: 'end-of-program-gala',
  },
  {
    id: 'event-3',
    title: 'End of Program Gala',
    slug: 'end-of-program-gala',
    date: 'Friday 5th June 2026',
    time: '11:00 AM – 4:00 PM',
    location: 'La Cantine, Hippodrome',
    coverImage: '/images/Events/Event3.jpg',
    galleryImages: [
      '/images/Closing-day/1.jpg',
      '/images/Closing-day/2.jpg',
      '/images/Closing-day/3.jpg',
    ],
    eventType: 'Award Ceremony & Gala',
    status: 'COMPLETED',
    description:
      'The grand graduation, live exhibition, and award celebration hosted at La Cantine in Hippodrome, commemorating the culmination of Cohort 1 and awarding 100,000 FCFA micro-grants to category champions.',
    theme: 'Celebration, Grand Finale Exhibition & Awarding Champions',
    highlights: [
      'Live craft exhibition of finished participant portfolios',
      'Keynote addresses by Founder Christopher Fonye and partners',
      'Presentation of official Certificates of Mastery',
      'Awarding 100,000 FCFA seed micro-grant prizes to 4 discipline winners',
      'Graduation banquet, celebratory photos, and network launch',
    ],
    sections: [
      {
        title: 'GRAND FINALE & WELCOME',
        tagline: 'A Celebration of Hard Work and Transformation',
        description: [
          'The End of Program Gala brought together fellows, family members, instructors, community mentors, and partners at La Cantine in Hippodrome for an unforgettable afternoon of celebration.',
          'The atmosphere was filled with pride and excitement as the culmination of weeks of intensive training, studio sweat, and creative growth was formally recognized.',
        ],
      },
      {
        title: 'LIVE EXHIBITION & CRAFT DEMONSTRATIONS',
        tagline: 'Showcasing Original Mastery to the Community',
        description: [
          'Fellows proudly displayed their finished craft portfolios across all four tracks: intricate braided hairstyles, custom sculptural ceramic pieces, professional digital video productions, and high-precision nail aesthetics.',
          'Guests and mentors toured the exhibition tables, interacting with creators and admiring the remarkable level of craftsmanship.',
        ],
      },
      {
        title: 'FOUNDER & PARTNER ADDRESSES',
        tagline: 'Words of Affirmation and Vision for the Future',
        description: [
          'Founder Christopher Fonye and institutional partners delivered inspiring closing remarks, recounting the journey from an ambitious idea to a thriving reality.',
          'They reaffirmed their commitment to supporting alumni as they launch independent ventures and continue developing into community leaders.',
        ],
      },
      {
        title: 'AWARDING 100,000 FCFA SEED PRIZES',
        tagline: 'Recognizing Excellence Across 4 Disciplines',
        description: [
          'The most anticipated moment arrived with the announcement of the category competition winners.',
          'Each of the four category champions received a 100,000 FCFA seed micro-grant prize along with starter equipment to accelerate their commercial studios and ventures.',
        ],
      },
      {
        title: 'GRADUATION CERTIFICATES & CELEBRATION',
        tagline: 'Stepping Forward into Leadership',
        description: [
          'Every fellow received an official Certificate of Mastery in recognition of their dedication, discipline, and successful completion of the program.',
          'The celebration concluded with a festive banquet, group photography, and joyful fellowship marking the beginning of their leadership journeys.',
        ],
      },
    ],
    nextEventSlug: 'convergence-day-1',
  },
];
