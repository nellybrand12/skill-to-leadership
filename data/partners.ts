export interface PartnerItem {
  id: string;
  name: string;
  role: string;
  logo: string;
  description: string;
}

export const partnersData: PartnerItem[] = [
  {
    id: 'bucknell',
    name: 'Bucknell University',
    role: 'Academic & Project Partner',
    logo: '/partners/Bucknell.png',
    description: 'Supporting global youth leadership and social innovation fellowships in Africa.',
  },
  {
    id: 'projects-for-peace',
    name: 'Projects for Peace',
    role: 'Grantor & Global Initiative',
    logo: '/partners/Project-for-peace.png',
    description: 'Empowering young peacebuilders and grassroots changemakers to create sustainable economic resilience.',
  },
  {
    id: 'ashinaga',
    name: 'Ashinaga',
    role: 'Educational Foundation',
    logo: '/partners/Ashinaga.png',
    description: 'Dedicated to providing educational and leadership opportunities for African youth to expand their impact.',
  },
  {
    id: 'open-dreams',
    name: 'Open Dreams',
    role: 'Community & Talent Partner',
    logo: '/partners/Open-dreams.png',
    description: 'Fostering educational access, talent discovery, and entrepreneurial mentorship across Cameroon.',
  },
  {
    id: 'gigi-nails',
    name: 'Gigi Nails',
    role: 'Industry & Studio Partner',
    logo: '/partners/Gigi-nails.png',
    description: 'Supporting studio beauty training, professional salon equipment, and masterclass sessions.',
  },
  {
    id: 'sakura',
    name: 'Sakura',
    role: 'Artisan & Cultural Partner',
    logo: '/partners/Sakura.png',
    description: 'Partnering in craft disciplines, artisan development, and community empowerment.',
  },
];
