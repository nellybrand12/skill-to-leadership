export interface ProgramItem {
  id: string;
  slug: string;
  slugAliases?: string[];
  name: string;
  shortDesc: string;
  fullDesc: string;
  coverImage: string;
  videoSrc: string;
  iconName: string;
  curriculum: string[];
  toolsIncluded: string[];
  outcomes: string[];
  badge: string;
  highlights: string[];
}

export const programsData: ProgramItem[] = [
  {
    id: 'braiding',
    slug: 'braiding',
    slugAliases: ['braiding', 'braiding-hairstyling'],
    name: 'Braiding & Hairstyling',
    badge: 'Craft Track 01',
    shortDesc:
      'Master precision African braiding, knotless styling, protective hair treatments, client hygiene protocols, and salon micro-enterprise management.',
    fullDesc:
      'Participants in the Braiding track delve deeply into traditional and contemporary African hairstyling techniques. From knotless braids and loc maintenance to precision parting, ergonomic practice, and salon unit economics, students build a resilient foundation for an immediate income-generating career in Cameroon and beyond.',
    coverImage: '/images/Braiding.jpg',
    videoSrc: '/images/programs/Braiding.mp4',
    iconName: 'Scissors',
    curriculum: [
      'Precision parting & ergonomic posture techniques',
      'Knotless braiding, stitch braids, and feed-in methods',
      'Protective styling, natural hair care, and scalp hygiene',
      'Client consultation, timing efficiency, and salon sanitization',
      'Service pricing, client retention, and freelance brand launch',
    ],
    toolsIncluded: [
      'Professional Braiding Toolkit & Parting Combs',
      'Styling Combs & Sectioning Clips',
      'Mannequin Practice Head & Table Clamp',
      'Organic Hair Conditioning Oils & Edge Controls',
      'Salon Client Booking Logbook & Sanitizing Tray',
    ],
    outcomes: [
      'Mastery of 8+ in-demand African braiding styles',
      'Hygiene, safety, and studio sanitation certification',
      'Pricing strategy, client acquisition & freelance setup',
      'Professional client portfolio of completed styles',
    ],
    highlights: [
      'Over 60+ intensive studio practice hours logged per fellow',
      'Direct one-on-one mentorship with head hair artistry instructors',
      'Comprehensive professional kit retained permanently upon graduation',
      'Client communication, booking workflows, and deposit etiquette',
    ],
  },
  {
    id: 'clay-ceramic-arts',
    slug: 'ceramic-sculpting',
    slugAliases: ['ceramic-sculpting', 'clay-and-ceramic-art', 'clay-ceramic-arts'],
    name: 'Clay & Ceramic Arts',
    badge: 'Craft Track 02',
    shortDesc:
      'Explore pottery, sculptural modeling, terracotta finishing, kiln curing, and artisan home-decor product design.',
    fullDesc:
      'The Clay & Ceramic Arts track connects ancient Cameroonian craft heritage with modern commercial artisan design. Fellows work directly with local clay materials to sculpt functional pottery, decorative terracotta, and sculptural artifacts while mastering surface finishing, durability curing, and packaging for contemporary markets.',
    coverImage: '/images/Clay_and_ceramic_art.jpg',
    videoSrc: '/images/programs/Clay-ceramic-arts.mp4',
    iconName: 'Shapes',
    curriculum: [
      'Clay preparation, wedging, and material texture balancing',
      'Hand-building pottery methods: pinch, coil, and slab construction',
      'Sculptural modeling, relief carving, and figurative aesthetics',
      'Surface smoothing, glazing, and kiln heat treatment cycles',
      'Artisan product commercialization, pricing, and gallery pitching',
    ],
    toolsIncluded: [
      'Sculpting & Modeling Wooden Tool Set',
      'Terracotta Smoothing Ribs & Wire Cutters',
      'Finishing Sponges & Detail Loop Tools',
      'Ceramic Starter Clay Blocks & Sealing Glazes',
      'Artisan Display Stand & Portfolio Sketchbook',
    ],
    outcomes: [
      'Proficiency in hand-building and sculptural ceramics',
      'Creation of commercial-ready home decor and pottery lines',
      'Understanding of firing, durability, and packaging',
      'Finished physical artisan exhibition portfolio',
    ],
    highlights: [
      'Hands-on tactile work using natural regional clay blends',
      'Exhibited original functional tableware and decorative sculptures',
      'Training on artisan packaging and gallery presentation',
      'Lifelong toolkit for independent pottery production',
    ],
  },
  {
    id: 'nail-arts',
    slug: 'nail-artistry',
    slugAliases: ['nail-artistry', 'nail-art', 'nail-arts'],
    name: 'Nail Artistry & Aesthetics',
    badge: 'Craft Track 03',
    shortDesc:
      'Develop precision nail aesthetics, gel extensions, 3D hand-painted designs, studio sanitation, and client booking workflows.',
    fullDesc:
      'The Nail Artistry track elevates nail aesthetics from standard cosmetic application into fine micro-art and profitable freelance enterprise. Fellows learn aseptic nail preparation, gel overlays, acrylic sculpting, custom 3D art, and salon sanitation protocols, equipping them to build high-end client rosters.',
    coverImage: '/images/Nail_Art.jpg',
    videoSrc: '/images/programs/nail-arts.mp4',
    iconName: 'Palette',
    curriculum: [
      'Nail anatomy, cuticle care, and aseptic sterilization',
      'Gel extension techniques, apex structuring, and shaping (coffin, almond, square)',
      'Fine-line hand painting, 3D embellishments, and ombre fades',
      'Safe removal, nail health maintenance, and product chemistry',
      'Client booking workflows, social media showcasing, and pricing',
    ],
    toolsIncluded: [
      'Professional UV/LED Gel Curing Lamp',
      'Precision Nail Art Fine Brushes & Dotting Tools',
      'Electric Nail File (E-File) & Diamond Drill Bits',
      'Gel Polish Starter Palette & Top/Base Coats',
      'Aseptic Disinfection & Tool Sterilization Case',
    ],
    outcomes: [
      'Aseptic manicure & structural gel application mastery',
      'Custom 3D nail artistry & precision design capability',
      'Salon hygiene compliance & client appointment systems',
      'High-resolution visual nail art lookbook',
    ],
    highlights: [
      'Aseptic salon sanitation protocols certified by master instructors',
      'Custom 3D gel sculpting and fine-brush detailing techniques',
      'Full professional UV curing kit and e-file machine retained by students',
      'Client consultation and appointment rate card structuring',
    ],
  },
  {
    id: 'content-creation',
    slug: 'content-creation',
    slugAliases: ['content-creation', 'digital-content-creation'],
    name: 'Digital Content Creation',
    badge: 'Craft Track 04',
    shortDesc:
      'Learn mobile videography, visual editing, commercial social media pitching, sound recording, and narrative brand storytelling.',
    fullDesc:
      'In an increasingly digital economy, storytelling is the ultimate amplifier of enterprise. The Content Creation track trains fellows in mobile cinematic videography, lighting setups, CapCut/Premiere visual editing, audio clarity, narrative scripting, and pitching commercial content services to local businesses.',
    coverImage: '/images/Content_creation.jpg',
    videoSrc: '/images/programs/Content-creation.mp4',
    iconName: 'Video',
    curriculum: [
      'Smartphone cinematography, composition rules, and frame rates',
      'Lighting setups using ring lights, softboxes, and natural ambient light',
      'Audio capture with lavalier microphones and noise reduction',
      'Mobile visual editing (pacing, text overlays, b-roll, transitions)',
      'Brand pitching, short-form viral storytelling, and commercial contracts',
    ],
    toolsIncluded: [
      'Smartphone Video Rig Cage & Cold Shoe Mounts',
      'Wireless Lavalier Microphone System (Type-C / Lightning)',
      'Portable Adjustable Studio Ring Light & Tripod Stand',
      'Wide-Angle & Macro Mobile Clip-on Lens Kit',
      'High-Speed External Storage Drive & Media Binder',
    ],
    outcomes: [
      'Cinematic mobile videography & audio production mastery',
      'Proficiency in fast-turnaround visual editing workflows',
      'Social media strategy, commercial client pitch decks',
      'Showreel of branded short-form commercial videos',
    ],
    highlights: [
      'Mobile video rigging and wireless mic audio mastery',
      'Live commercial pitch assignments for local businesses in Yaoundé',
      'Fast-turnaround CapCut & mobile editing workflows',
      'Full video hardware kit retained to launch freelance media agencies',
    ],
  },
];

export function getProgramBySlug(slug: string): ProgramItem | undefined {
  return programsData.find(
    (p) => p.slug === slug || (p.slugAliases && p.slugAliases.includes(slug))
  );
}
