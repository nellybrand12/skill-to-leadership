export interface StaffMember {
  id: string;
  name: string;
  role: string;
  domain: string;
  description: string;
  quote: string;
  initials: string;
  image?: string;
}

export const staffMembers: StaffMember[] = [
  {
    id: 'braiding-lead',
    name: "CHOH LAURA KENDZU'U",
    role: 'Head of Hair Artistry & Protective Styling',
    domain: 'Hairstyling & Salon Management',
    description:
      'Oversees studio training in precision African braiding, knotless techniques, client hygiene, and salon unit economics.',
    quote: '"Skill" is today\'s currency, but "leadership" is what multiplies it',
    initials: 'CK',
    image: '/images/staff/Braiding-staff.jpg',
  },
  {
    id: 'ceramics-lead',
    name: 'KANA LAURE',
    role: 'Studio Instructor & Artisan Mentor',
    domain: 'Pottery & Sculptural Arts',
    description:
      'Guides fellows in sculptural clay modeling, pottery finishing, kiln curing, and artisan product commercialization.',
    quote: 'Le "succès", c\'est d\'aller d\'échec en échec sans perdre son "enthousiasme"',
    initials: 'KL',
    image: '/images/staff/Clay-art-staff.jpg',
  },
  {
    id: 'nail-lead',
    name: 'GINETT DONFACK',
    role: 'Studio Hygiene & Aesthetics Specialist',
    domain: 'Nail Art & Micro-Enterprise',
    description:
      'Directs precision nail aesthetics, gel extensions, 3D designs, salon sanitation protocols, and client booking workflows.',
    quote: 'if there was ever a right time to "act", to "build", and to "lead", that time is "now"',
    initials: 'GD',
    image: '/images/staff/Nail-artist-staff.jpg',
  },
  {
    id: 'content-lead',
    name: 'HILARY ORIANE',
    role: 'Digital Storytelling & Production Director',
    domain: 'Media & Communications',
    description:
      'Equips creators with mobile videography rigs, visual editing, narrative storytelling, and commercial media pitching.',
    quote: 'La "passion" te rend constant. La "discipline" te fait évoluer. Le "leadership", lui, nait de leur alliance.',
    initials: 'HO',
    image: '/images/staff/Content_creation_staff.jpg',
  },
];
