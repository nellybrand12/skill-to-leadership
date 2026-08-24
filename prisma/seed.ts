import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting comprehensive database seed for Skill to Leadership...');

  // 1. Admin User
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || 'password123';
  const passwordHash = await bcrypt.hash(initialPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skilltoleadership.org' },
    update: { password: passwordHash },
    create: {
      email: 'admin@skilltoleadership.org',
      password: passwordHash,
      firstName: 'Christopher',
      lastName: 'Fonye',
      role: 'SUPER_ADMIN',
    },
  });

  const founderAdmin = await prisma.user.upsert({
    where: { email: 'fonyechris@gmail.com' },
    update: { password: passwordHash },
    create: {
      email: 'fonyechris@gmail.com',
      password: passwordHash,
      firstName: 'Christopher',
      lastName: 'Fonye',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin users created/verified:', admin.email, founderAdmin.email);

  // 2. Cohorts (Cohort 1 & Cohort 2)
  const cohort1 = await prisma.cohort.upsert({
    where: { cohortNumber: 1 },
    update: {
      title: 'Cohort 1: The Inaugural Fellows',
      theme: 'Foundations of Mastery & Entrepreneurship',
      description: 'The historic first cohort of Skill to Leadership brought together talented Cameroonian youths across 4 hands-on disciplines, culminating in a high-stakes 400,000 FCFA competition.',
      startDate: new Date('2026-05-20'),
      endDate: new Date('2026-06-05'),
      status: 'COMPLETED',
      maxParticipants: 30,
      totalPrizeMoney: 400000,
    },
    create: {
      cohortNumber: 1,
      title: 'Cohort 1: The Inaugural Fellows',
      theme: 'Foundations of Mastery & Entrepreneurship',
      description: 'The historic first cohort of Skill to Leadership brought together talented Cameroonian youths across 4 hands-on disciplines, culminating in a high-stakes 400,000 FCFA competition.',
      startDate: new Date('2026-05-20'),
      endDate: new Date('2026-06-05'),
      status: 'COMPLETED',
      maxParticipants: 30,
      totalPrizeMoney: 400000,
    },
  });

  const cohort2 = await prisma.cohort.upsert({
    where: { cohortNumber: 2 },
    update: {
      title: 'Cohort 2: The Next Generation',
      theme: 'Expansion, Advanced Enterprise & Creative Tech',
      description: 'Something bigger is coming. Cohort 2 expands curriculum capacity, international mentorship, enhanced toolkits, and bigger prize pools for young changemakers in Cameroon.',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-12-20'),
      applicationDeadline: new Date('2026-09-30'),
      status: 'UPCOMING',
      maxParticipants: 60,
      totalPrizeMoney: 1000000,
    },
    create: {
      cohortNumber: 2,
      title: 'Cohort 2: The Next Generation',
      theme: 'Expansion, Advanced Enterprise & Creative Tech',
      description: 'Something bigger is coming. Cohort 2 expands curriculum capacity, international mentorship, enhanced toolkits, and bigger prize pools for young changemakers in Cameroon.',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-12-20'),
      applicationDeadline: new Date('2026-09-30'),
      status: 'UPCOMING',
      maxParticipants: 60,
      totalPrizeMoney: 1000000,
    },
  });
  console.log('✅ Cohort 1 & Cohort 2 ready');

  // 3. The 4 Core Skills
  const skillsData = [
    {
      name: 'Braiding & Hairstyling',
      slug: 'braiding',
      shortDesc: 'Master professional African hair artistry, protective styling, client management, and salon business fundamentals.',
      fullDesc: 'Participants in the Braiding track delve deeply into traditional and contemporary African hairstyling techniques. From knotless braids and loc maintenance to precision parting, ergonomic practice, and salon unit economics, students build a resilient foundation for an immediate income-generating career in Cameroon and beyond.',
      iconName: 'Scissors',
      coverImage: '/images/Braiding.jpg',
      videoUrl: '/images/programs/Braiding.mp4',
      instructor: "Choh Laura Kendzu'u",
      toolsIncluded: JSON.stringify(['Professional Braiding Kit', 'Styling Combs & Sectioning Clips', 'Mannequin Practice Head', 'Organic Hair Conditioning Oils', 'Salon Client Logbook']),
      outcomes: JSON.stringify(['Mastery of 8+ in-demand braiding patterns', 'Client sanitation and hygiene certification', 'Pricing, client retention & studio startup strategy', 'Portfolio of completed hair artistry projects']),
      prizeAmount: 100000,
      displayOrder: 1,
      published: true,
      cohortId: cohort1.id,
    },
    {
      name: 'Clay & Ceramic Arts',
      slug: 'ceramic-sculpting',
      shortDesc: 'Shape clay into artistic masterpieces, functional pottery, cultural sculptures, and marketable artisan products.',
      fullDesc: 'The Clay & Ceramic Arts track connects ancient Cameroonian craft heritage with modern commercial artisan design. Fellows work directly with local clay materials to sculpt functional pottery, decorative terracotta, and sculptural artifacts while mastering surface finishing, durability curing, and packaging for contemporary markets.',
      iconName: 'Shapes',
      coverImage: '/images/Clay_and_ceramic_art.jpg',
      videoUrl: '/images/programs/Clay-ceramic-arts.mp4',
      instructor: 'Kana Laure',
      toolsIncluded: JSON.stringify(['Sculpting Clay & Toolset', 'Rib & Loop Modeling Tools', 'Pottery Sponge & Wire Cutters', 'Finishing Glazes & Underglazes', 'Protective Studio Apron']),
      outcomes: JSON.stringify(['Hand-building and sculpting precision', 'Understanding clay chemistry, firing & curing', 'Exhibition curation & pricing art pieces', 'Sustainable artisan brand building']),
      prizeAmount: 100000,
      displayOrder: 2,
      published: true,
      cohortId: cohort1.id,
    },
    {
      name: 'Content Creation & Digital Media',
      slug: 'content-creation',
      shortDesc: 'Learn smartphone videography, visual storytelling, audio capture, video editing, and digital brand monetization.',
      fullDesc: 'In the digital economy, storytelling is leverage. The Content Creation track equips students to produce high-impact short-form videos, visual campaigns, podcasts, and commercial media using accessible tools like smartphones, mobile editing suites, lighting equipment, and wireless microphone setups.',
      iconName: 'Video',
      coverImage: '/images/Content_creation.jpg',
      videoUrl: '/images/programs/Content-creation.mp4',
      instructor: 'Hilary Oriane',
      toolsIncluded: JSON.stringify(['Smartphone Video Rig & Tripod', 'Wireless Lavalier Microphone', 'LED Video Light Panel', 'Video Editing Asset Bundle', 'Content Strategy Playbook']),
      outcomes: JSON.stringify(['Short-form video directing, filming & editing', 'Audio recording and sound design basics', 'Social media algorithm growth & monetization', 'Freelance media kit & client pitch deck']),
      prizeAmount: 100000,
      displayOrder: 3,
      published: true,
      cohortId: cohort1.id,
    },
    {
      name: 'Nail Artistry & Beauty Tech',
      slug: 'nail-artistry',
      shortDesc: 'Develop precision nail aesthetics, gel extensions, acrylic sculpting, custom 3D nail art, and studio management.',
      fullDesc: 'The Nail Artistry track blends health-conscious nail care with intricate artistic expression. Participants learn anatomy of the nail, manicuring, acrylic dipping, UV gel curation, freehand micro-painting, gem application, and the customer experience essential to running a boutique beauty studio.',
      iconName: 'Palette',
      coverImage: '/images/Nail_Art.jpg',
      videoUrl: '/images/programs/Nail-art.mp4',
      instructor: 'Ginett Donfack',
      toolsIncluded: JSON.stringify(['UV/LED Curing Lamp', 'Professional Acrylic & Gel Kit', 'Detail Nail Art Brushes & Dotting Tools', 'Sanitation & Disinfection Kit', 'Color Palette & Swatch Wheels']),
      outcomes: JSON.stringify(['Sanitary manicure & extension techniques', 'Intricate 3D design & freehand nail art', 'Client appointment scheduling & costing', 'Mobile beauty technician service setup']),
      prizeAmount: 100000,
      displayOrder: 4,
      published: true,
      cohortId: cohort1.id,
    },
  ];

  for (const s of skillsData) {
    await prisma.skill.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('✅ 4 Core Skills ready');

  // 4. Events (Entrepreneur Spotlight + 3 Convergence Events)
  const eventsData = [
    {
      title: 'Entrepreneur Spotlight 2026',
      slug: 'entrepreneurs-spotlight',
      description: 'Entrepreneur Spotlight is a flagship initiative by Skill to Leadership designed to discover, promote, and celebrate young entrepreneurs under 25 in Cameroon who are building businesses with passion, resilience, and purpose. Selected finalists receive spotlight storytelling, business mentorship, starter kits, and compete for a 100,000 FCFA seed grant prize.',
      date: new Date('2026-11-20T09:00:00Z'),
      startDateTime: new Date('2026-09-01T09:00:00Z'),
      endDateTime: new Date('2026-11-30T18:00:00Z'),
      time: '9:00 AM – 5:00 PM',
      location: 'Yaoundé, Cameroon & Online Showcase',
      isVirtual: false,
      coverImage: '/images/Spotlight.jpg',
      organizer: 'Skill to Leadership',
      eventType: 'COMPETITION',
      status: 'ACTIVE',
      capacity: 50,
      isSpotlight: true,
      applicationsEnabled: true,
      applicationUrl: 'https://forms.gle/F6oE11xL1bK5Xv7V9',
      eligibilityInfo: 'Young Cameroonian entrepreneurs under 25 operating early-stage businesses across craft, beauty, digital services, tailoring, culinary, or retail.',
      statisticsInfo: '10 Finalists Selected · 5 Featured Venture Stories · 1 Winner · 100,000 FCFA Grand Prize',
      published: true,
    },
    {
      title: 'Convergence Day 1',
      slug: 'convergence-day-1',
      description: 'The inaugural convergence milestone bringing together Cohort 1 fellows, expert instructors, and institutional partners at the Open Dreams Center in Obili to officially launch the Skill to Leadership journey.',
      date: new Date('2026-05-22T09:00:00Z'),
      startDateTime: new Date('2026-05-22T09:00:00Z'),
      endDateTime: new Date('2026-05-22T17:00:00Z'),
      time: '9:00 AM Sharp',
      location: 'OPEN DREAMS Center, Obili',
      isVirtual: false,
      coverImage: '/images/Events/Event1.jpg',
      organizer: 'Skill to Leadership',
      eventType: 'EVENT',
      status: 'COMPLETED',
      capacity: 100,
      isSpotlight: false,
      applicationsEnabled: false,
      published: true,
    },
    {
      title: 'Convergence Day 2',
      slug: 'convergence-day-2',
      description: 'A pivotal mid-program assessment and reflection milestone hosted at the Open Dreams Center in Obili, featuring student evaluations, instructor growth reports, guest leadership addresses, and an esteemed panel discussion on "Leveraging our Youth".',
      date: new Date('2026-05-29T09:00:00Z'),
      startDateTime: new Date('2026-05-29T09:00:00Z'),
      endDateTime: new Date('2026-05-29T17:00:00Z'),
      time: '9:00 AM Sharp',
      location: 'OPEN DREAMS Center, Obili',
      isVirtual: false,
      coverImage: '/images/Events/Event2.jpg',
      organizer: 'Skill to Leadership',
      eventType: 'EVENT',
      status: 'COMPLETED',
      capacity: 100,
      isSpotlight: false,
      applicationsEnabled: false,
      published: true,
    },
    {
      title: 'End of Program Gala',
      slug: 'end-of-program-gala',
      description: 'The grand graduation, live exhibition, and award celebration hosted at La Cantine in Hippodrome, commemorating the culmination of Cohort 1 and awarding 100,000 FCFA micro-grants to category champions.',
      date: new Date('2026-06-05T11:00:00Z'),
      startDateTime: new Date('2026-06-05T11:00:00Z'),
      endDateTime: new Date('2026-06-05T16:00:00Z'),
      time: '11:00 AM – 4:00 PM',
      location: 'La Cantine, Hippodrome',
      isVirtual: false,
      coverImage: '/images/Events/Event3.jpg',
      organizer: 'Skill to Leadership',
      eventType: 'EVENT',
      status: 'COMPLETED',
      capacity: 150,
      isSpotlight: false,
      applicationsEnabled: false,
      published: true,
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: ev,
      create: ev,
    });
  }
  console.log('✅ Events & Entrepreneur Spotlight ready');

  // 5. Partners (Including Sakura & Gigi Nails with real logos)
  const partnersData = [
    {
      name: 'Bucknell University',
      slug: 'bucknell-university',
      logoUrl: '/partners/Bucknell.png',
      description: 'A private liberal arts university in Lewisburg, Pennsylvania, supporting youth leadership development, intercultural educational exchange, and social venture innovation.',
      website: 'https://www.bucknell.edu',
      category: 'ACADEMIC',
      isFeatured: true,
      published: true,
      orderIndex: 1,
    },
    {
      name: 'Projects for Peace',
      slug: 'projects-for-peace',
      logoUrl: '/partners/Project-for-peace.png',
      description: 'An initiative founded by Kathryn W. Davis that funds grassroots peacebuilding projects designed and implemented by university students worldwide.',
      website: 'https://www.projectsforpeace.org',
      category: 'GLOBAL_FELLOWSHIP',
      isFeatured: true,
      published: true,
      orderIndex: 2,
    },
    {
      name: 'Ashinaga',
      slug: 'ashinaga',
      logoUrl: '/partners/Ashinaga.png',
      description: 'An international nonprofit organization dedicated to providing educational and emotional support to orphaned and underprivileged youth across Africa and Japan.',
      website: 'https://www.ashinaga.org',
      category: 'GLOBAL_FELLOWSHIP',
      isFeatured: true,
      published: true,
      orderIndex: 3,
    },
    {
      name: 'Open Dreams',
      slug: 'open-dreams',
      logoUrl: '/partners/Open-dreams.png',
      description: 'An educational organization that democratizes access to world-class university scholarships and leadership opportunities for high-achieving low-income students in Cameroon.',
      website: 'https://www.open-dreams.org',
      category: 'COMMUNITY',
      isFeatured: true,
      published: true,
      orderIndex: 4,
    },
    {
      name: 'Gigi Nails',
      slug: 'gigi-nails',
      logoUrl: '/partners/Gigi-nails.png',
      description: 'Supporting studio beauty training, professional salon equipment, and masterclass sessions for young technicians.',
      website: null,
      category: 'CORPORATE',
      isFeatured: true,
      published: true,
      orderIndex: 5,
    },
    {
      name: 'Sakura',
      slug: 'sakura',
      logoUrl: '/partners/Sakura.png',
      description: 'Partnering in craft disciplines, artisan development, and community empowerment in Cameroon.',
      website: null,
      category: 'COMMUNITY',
      isFeatured: true,
      published: true,
      orderIndex: 6,
    },
  ];

  for (const p of partnersData) {
    await prisma.partner.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('✅ 6 Partners ready (including Sakura & Gigi Nails)');

  // 5.1 Gallery Items (Unified Cohort 1 & Impact Gallery)
  const galleryItemsSeed = [
    {
      title: 'Grand Finale & Award Ceremony',
      description: 'Fellows celebrating successful completion and receiving micro-grant prizes in Yaoundé.',
      imageUrl: '/images/Closing-day/1.jpg',
      category: 'AWARDS',
      cohortId: cohort1.id,
      orderIndex: 1,
      published: true,
    },
    {
      title: 'Intensive Practical Studio Session',
      description: 'Hands-on instruction where fellows refine technical craft techniques with dedicated instructors.',
      imageUrl: '/images/Gallery/gall1.jpg',
      category: 'WORKSHOPS',
      cohortId: cohort1.id,
      orderIndex: 2,
      published: true,
    },
    {
      title: 'Exhibition & Craft Demonstrations',
      description: 'Presenting finished original works to guests, family members, and community mentors.',
      imageUrl: '/images/Closing-day/2.jpg',
      category: 'COMPETITION',
      cohortId: cohort1.id,
      orderIndex: 3,
      published: true,
    },
    {
      title: 'Material Craftsmanship & Precision',
      description: 'Focus, dedication, and precision during live studio challenges.',
      imageUrl: '/images/Gallery/gall2.jpg',
      category: 'WORKSHOPS',
      cohortId: cohort1.id,
      orderIndex: 4,
      published: true,
    },
    {
      title: 'Fellowship Solidarity & Community',
      description: 'Building lifelong bonds, mutual encouragement, and professional networks.',
      imageUrl: '/images/Closing-day/3.jpg',
      category: 'AWARDS',
      cohortId: cohort1.id,
      orderIndex: 5,
      published: true,
    },
    {
      title: 'Collaborative Studio Exploration',
      description: 'Fellows exchanging ideas and peer feedback on complex artistic projects.',
      imageUrl: '/images/Gallery/gall3.jpg',
      category: 'WORKSHOPS',
      cohortId: cohort1.id,
      orderIndex: 6,
      published: true,
    },
    {
      title: 'Artisan Toolkit Mastery',
      description: 'Mastering professional equipment that fellows keep upon graduating the fellowship.',
      imageUrl: '/images/Gallery/gall4.jpg',
      category: 'WORKSHOPS',
      cohortId: cohort1.id,
      orderIndex: 7,
      published: true,
    },
  ];

  for (const gi of galleryItemsSeed) {
    const existing = await prisma.galleryItem.findFirst({
      where: { imageUrl: gi.imageUrl },
    });
    if (existing) {
      await prisma.galleryItem.update({
        where: { id: existing.id },
        data: gi,
      });
    } else {
      await prisma.galleryItem.create({
        data: gi,
      });
    }
  }
  console.log('✅ Gallery items ready for Cohort 1 & Impact');

  // 6. Stories
  const storiesData = [
    {
      title: 'From Skills to Self-Reliance: Highlights from Our Inaugural Cohort',
      slug: 'from-skills-to-self-reliance-cohort-1',
      excerpt: 'How four intensive skill tracks and dedicated mentorship transformed the confidence and economic trajectories of young Cameroonian fellows.',
      content: `The inaugural cohort of Skill to Leadership began with a bold premise: that when you combine practical hands-on vocational craft with structured leadership training and competitive incentives, young people unlock unstoppable momentum.`,
      coverImage: '/images/Closing-day/1.jpg',
      author: 'Christopher Fonye',
      authorRole: 'Founder & Director',
      category: 'YOUTH_EMPOWERMENT',
      readingTime: '5 min read',
      isPublished: true,
      isFeatured: true,
    },
    {
      title: 'Skills, Creativity & 400,000 FCFA: Inside the Cohort 1 Competition',
      slug: 'inside-the-cohort-1-competition',
      excerpt: 'Discover how healthy competition, peer evaluation, and 100,000 FCFA category prizes propelled our students to produce their best work.',
      content: `A skill without practice is potential; a skill tested in competition is mastery. The Cohort 1 Competition was designed to simulate the real-world pressure of client delivery, creative innovation, and pitching to stakeholders.`,
      coverImage: '/images/Closing-day/2.jpg',
      author: 'Program Operations Desk',
      authorRole: 'Competition Desk',
      category: 'SUCCESS_STORY',
      readingTime: '4 min read',
      isPublished: true,
      isFeatured: true,
    },
  ];

  for (const st of storiesData) {
    await prisma.story.upsert({
      where: { slug: st.slug },
      update: st,
      create: st,
    });
  }
  console.log('✅ Stories ready');

  // 7. Testimonials
  const testimonialsData = [
    {
      name: 'Brenda Mbuh',
      role: 'Cohort 1 Participant',
      track: 'Braiding & Protective Hairstyling',
      image: '/images/CH1-candidates/1.jpg',
      text: 'Joining the braiding track gave me far more than technical styling speed. For the first time, I learned how to treat my craft as a real service business, pricing my work with confidence and understanding client care in Yaoundé. The mentorship helped me see my talent as a sustainable livelihood.',
      outcome: 'Mastered 8 intricate styles · Launched boutique booking service',
      displayOrder: 1,
      published: true,
    },
    {
      name: 'Daniel Tanyi',
      role: 'Cohort 1 Participant',
      track: 'Clay & Ceramic Arts',
      image: '/images/CH1-candidates/2.jpg',
      text: 'Working with clay in the ceramic studio was a humbling journey. You learn patience, structural balance, and artistic discipline from every piece. Winning seed prize support allowed me to invest in high-grade pottery tools that I now use every single day to supply local interior galleries.',
      outcome: 'Artisan apprentice · Studio supplier for local interior galleries',
      displayOrder: 2,
      published: true,
    },
    {
      name: 'Faith Nji',
      role: 'Cohort 1 Participant',
      track: 'Content Creation & Digital Storytelling',
      image: '/images/CH1-candidates/3.jpg',
      text: 'I always loved capturing video on my smartphone, but Skill to Leadership taught me commercial storytelling, lighting geometry, and client branding. It completely transformed how I perceive my creative voice, allowing me to produce professional social media content for small businesses in my community.',
      outcome: 'Smartphone creator · Commercial brand media consultant',
      displayOrder: 3,
      published: true,
    },
    {
      name: 'Kevin Manka',
      role: 'Cohort 1 Participant',
      track: 'Precision Nail Artistry',
      image: '/images/CH1-candidates/4.jpg',
      text: 'The nail artistry sessions opened my eyes to precision geometry, clinical hygiene standards, and customer retention. Having dedicated mentors who genuinely believed in our capacity made all the difference in building my self-worth and giving me the confidence to build a loyal client schedule.',
      outcome: 'Nail technician · Booked studio client schedule across Centre Region',
      displayOrder: 4,
      published: true,
    },
    {
      name: 'Ruth Asong',
      role: 'Cohort 1 Participant',
      track: 'Artisan Craft & Micro-Enterprise',
      image: '/images/CH1-candidates/5.jpg',
      text: 'Before this fellowship, I struggled to see how my practical passion could ever lead to sustainable financial independence. The program bridged that gap, connecting us with peers and mentors who pushed us to lead with integrity, fine craftsmanship, and true entrepreneurial purpose.',
      outcome: 'Fellowship graduate · Independent artisan workshop owner',
      displayOrder: 5,
      published: true,
    },
    {
      name: 'Brian Fon',
      role: 'Cohort 1 Participant',
      track: 'Digital Media & Creative Leadership',
      image: '/images/CH1-candidates/6.jpg',
      text: 'The grand finale competition challenged everyone to deliver our absolute highest quality work under real pressure. Competing alongside such talented peers proved to me that young Africans are ready to create, innovate, and build sustainable enterprises when given real tools and mentorship.',
      outcome: 'Competition finalist · Digital storytelling producer for youth initiatives',
      displayOrder: 6,
      published: true,
    },
    {
      name: 'Esther Nchang',
      role: 'Cohort 1 Participant',
      track: 'Hairstyling & Salon Management',
      image: '/images/CH1-candidates/7.jpg',
      text: 'Learning modern styling alongside financial recordkeeping gave me the courage to open my own client chair. Meeting other young creators showed me that we aren\'t just doing hair — we are building community wealth and setting a new standard for youth excellence in Cameroon.',
      outcome: 'Salon entrepreneur · Mentoring 3 new apprentices',
      displayOrder: 7,
      published: true,
    },
    {
      name: 'Michael Nfor',
      role: 'Cohort 1 Participant',
      track: 'Ceramic Sculpting & Product Design',
      image: '/images/CH1-candidates/8.jpg',
      text: 'I discovered that ceramic arts can preserve our cultural heritage while meeting modern architectural demand. The instructors didn\'t just teach technique; they instilled leadership, personal discipline, and the ambition to build a sustainable artisan studio in Yaoundé.',
      outcome: 'Ceramic sculptor · Commissioned for cultural exhibition decor',
      displayOrder: 8,
      published: true,
    },
  ];

  for (const tm of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({ where: { name: tm.name } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: tm });
    } else {
      await prisma.testimonial.create({ data: tm });
    }
  }
  // 8. Site Settings (Defaults)
  const defaultSiteSettings = [
    { key: 'hero_heading', value: 'TURNING SKILLS INTO LEADERSHIP', label: 'Hero Heading', group: 'HERO' },
    { key: 'hero_subtext', value: 'An experiential youth development non-profit empowering young changemakers in Cameroon with hands-on craft mastery, mentorship, starter toolkits, and seed prize capital.', label: 'Hero Subtext', group: 'HERO' },
    { key: 'founder_image', value: '/images/Founder.jpg', label: 'Founder Image', group: 'BRAND' },
    { key: 'founder_name', value: 'Christopher Fonye', label: 'Founder Name', group: 'BRAND' },
    { key: 'founder_title', value: 'Civil Engineering Student at Bucknell University · Ashinaga Scholar · Projects for Peace grantee · Founder, Skill to Leadership', label: 'Founder Title', group: 'BRAND' },
    { key: 'founder_quote', value: 'In a world where time is a luxury, "Youths" are the wealthiest', label: 'Founder Quote', group: 'BRAND' },
    { key: 'feature_1_title', value: 'Practical Skills', label: 'Feature 1 Title', group: 'HERO' },
    { key: 'feature_1_desc', value: 'Hands-on learning through real-world craft mastery', label: 'Feature 1 Description', group: 'HERO' },
    { key: 'feature_1_icon', value: 'Scissors', label: 'Feature 1 Icon', group: 'HERO' },
    { key: 'feature_2_title', value: 'Mentorship & Leadership', label: 'Feature 2 Title', group: 'HERO' },
    { key: 'feature_2_desc', value: 'Personal growth and guidance beyond technical ability', label: 'Feature 2 Description', group: 'HERO' },
    { key: 'feature_2_icon', value: 'Compass', label: 'Feature 2 Icon', group: 'HERO' },
    { key: 'feature_3_title', value: 'Community & Opportunity', label: 'Feature 3 Title', group: 'HERO' },
    { key: 'feature_3_desc', value: 'Connecting ambitious youth with networks, toolkits and seed capital', label: 'Feature 3 Description', group: 'HERO' },
    { key: 'feature_3_icon', value: 'Users', label: 'Feature 3 Icon', group: 'HERO' },
    { key: 'contact_email', value: 'fonyechris@gmail.com', label: 'Contact Email', group: 'CONTACT' },
    { key: 'contact_whatsapp', value: '+237 668 62 06 75', label: 'Contact WhatsApp', group: 'CONTACT' },
    { key: 'contact_whatsapp_link', value: 'https://wa.me/237668620675', label: 'WhatsApp Direct Link', group: 'CONTACT' },
    { key: 'contact_location', value: 'Yaoundé, Centre Region, Cameroon', label: 'Location', group: 'CONTACT' },
    { key: 'contact_working_hours', value: 'Monday – Friday: 8:30 AM – 5:30 PM WAT', label: 'Working Hours', group: 'CONTACT' },
  ];

  for (const st of defaultSiteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: st.key },
      update: {},
      create: st,
    });
  }
  console.log('✅ Site Settings ready');

  console.log('✨ All seed data verified and ready!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
