export interface GalleryImage {
  id: string;
  title: string;
  label: string; // Data-driven editable label (e.g. Closing Day, Studio Workshop, Hands-On Practice)
  category: 'Studio Workshop' | 'Closing Ceremony' | 'Hands-On Practice' | 'Fellow Showcase';
  src: string;
  aspect: 'portrait' | 'landscape' | 'square';
  caption: string;
  side: 'left' | 'right'; // For the Left-Right Zig-Zag layout
  objectPosition?: string; // Positioning for face visibility (e.g. 'object-top')
}

export const cohortOneGallery: GalleryImage[] = [
  {
    id: 'closing-1',
    title: 'Grand Finale & Award Ceremony',
    label: 'Closing Day',
    category: 'Closing Ceremony',
    src: '/images/Closing-day/1.jpg',
    aspect: 'landscape',
    caption: 'Fellows celebrating successful completion and receiving micro-grant prizes in Yaoundé.',
    side: 'left',
    objectPosition: 'object-top',
  },
  {
    id: 'gall-1',
    title: 'Intensive Practical Studio Session',
    label: 'Studio Workshop',
    category: 'Studio Workshop',
    src: '/images/Gallery/gall1.jpg',
    aspect: 'portrait',
    caption: 'Hands-on instruction where fellows refine technical craft techniques with dedicated instructors.',
    side: 'right',
    objectPosition: 'object-center',
  },
  {
    id: 'closing-2',
    title: 'Exhibition & Craft Demonstrations',
    label: 'Exhibition',
    category: 'Closing Ceremony',
    src: '/images/Closing-day/2.jpg',
    aspect: 'landscape',
    caption: 'Presenting finished original works to guests, family members, and community mentors.',
    side: 'left',
    objectPosition: 'object-top',
  },
  {
    id: 'gall-2',
    title: 'Material Craftsmanship & Precision',
    label: 'Hands-On Practice',
    category: 'Hands-On Practice',
    src: '/images/Gallery/gall2.jpg',
    aspect: 'portrait',
    caption: 'Focus, dedication, and precision during live studio challenges.',
    side: 'right',
    objectPosition: 'object-center',
  },
  {
    id: 'closing-3',
    title: 'Fellowship Solidarity & Community',
    label: 'Community',
    category: 'Closing Ceremony',
    src: '/images/Closing-day/3.jpg',
    aspect: 'landscape',
    caption: 'Building lifelong bonds, mutual encouragement, and professional networks.',
    side: 'left',
    objectPosition: 'object-top',
  },
  {
    id: 'gall-3',
    title: 'Collaborative Studio Exploration',
    label: 'Collaboration',
    category: 'Studio Workshop',
    src: '/images/Gallery/gall3.jpg',
    aspect: 'portrait',
    caption: 'Fellows exchanging ideas and peer feedback on complex artistic projects.',
    side: 'right',
    objectPosition: 'object-center',
  },
  {
    id: 'gall-4',
    title: 'Artisan Toolkit Mastery',
    label: 'Toolkit Mastery',
    category: 'Hands-On Practice',
    src: '/images/Gallery/gall4.jpg',
    aspect: 'portrait',
    caption: 'Mastering professional equipment that fellows keep upon graduating the fellowship.',
    side: 'left',
    objectPosition: 'object-top',
  },
];
