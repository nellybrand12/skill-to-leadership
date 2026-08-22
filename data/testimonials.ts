export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  track: string;
  image: string;
  text: string;
  outcome: string;
}

export const testimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Brenda Mbuh',
    role: 'Cohort 1 Participant',
    track: 'Braiding & Protective Hairstyling',
    image: '/images/CH1-candidates/1.jpg',
    text: 'Joining the braiding track gave me far more than technical styling speed. For the first time, I learned how to treat my craft as a real service business, pricing my work with confidence and understanding client care in Yaoundé. The mentorship helped me see my talent as a sustainable livelihood.',
    outcome: 'Mastered 8 intricate styles · Launched boutique booking service',
  },
  {
    id: 'test-2',
    name: 'Daniel Tanyi',
    role: 'Cohort 1 Participant',
    track: 'Clay & Ceramic Arts',
    image: '/images/CH1-candidates/2.jpg',
    text: 'Working with clay in the ceramic studio was a humbling journey. You learn patience, structural balance, and artistic discipline from every piece. Winning seed prize support allowed me to invest in high-grade pottery tools that I now use every single day to supply local interior galleries.',
    outcome: 'Artisan apprentice · Studio supplier for local interior galleries',
  },
  {
    id: 'test-3',
    name: 'Faith Nji',
    role: 'Cohort 1 Participant',
    track: 'Content Creation & Digital Storytelling',
    image: '/images/CH1-candidates/3.jpg',
    text: 'I always loved capturing video on my smartphone, but Skill to Leadership taught me commercial storytelling, lighting geometry, and client branding. It completely transformed how I perceive my creative voice, allowing me to produce professional social media content for small businesses in my community.',
    outcome: 'Smartphone creator · Commercial brand media consultant',
  },
  {
    id: 'test-4',
    name: 'Kevin Manka',
    role: 'Cohort 1 Participant',
    track: 'Precision Nail Artistry',
    image: '/images/CH1-candidates/4.jpg',
    text: 'The nail artistry sessions opened my eyes to precision geometry, clinical hygiene standards, and customer retention. Having dedicated mentors who genuinely believed in our capacity made all the difference in building my self-worth and giving me the confidence to build a loyal client schedule.',
    outcome: 'Nail technician · Booked studio client schedule across Centre Region',
  },
  {
    id: 'test-5',
    name: 'Ruth Asong',
    role: 'Cohort 1 Participant',
    track: 'Artisan Craft & Micro-Enterprise',
    image: '/images/CH1-candidates/5.jpg',
    text: 'Before this fellowship, I struggled to see how my practical passion could ever lead to sustainable financial independence. The program bridged that gap, connecting us with peers and mentors who pushed us to lead with integrity, fine craftsmanship, and true entrepreneurial purpose.',
    outcome: 'Fellowship graduate · Independent artisan workshop owner',
  },
  {
    id: 'test-6',
    name: 'Brian Fon',
    role: 'Cohort 1 Participant',
    track: 'Digital Media & Creative Leadership',
    image: '/images/CH1-candidates/6.jpg',
    text: 'The grand finale competition challenged everyone to deliver our absolute highest quality work under real pressure. Competing alongside such talented peers proved to me that young Africans are ready to create, innovate, and build sustainable enterprises when given real tools and mentorship.',
    outcome: 'Competition finalist · Digital storytelling producer for youth initiatives',
  },
  {
    id: 'test-7',
    name: 'Esther Nchang',
    role: 'Cohort 1 Participant',
    track: 'Hairstyling & Salon Management',
    image: '/images/CH1-candidates/7.jpg',
    text: 'Learning modern styling alongside financial recordkeeping gave me the courage to open my own client chair. Meeting other young creators showed me that we aren\'t just doing hair — we are building community wealth and setting a new standard for youth excellence in Cameroon.',
    outcome: 'Salon entrepreneur · Mentoring 3 new apprentices',
  },
  {
    id: 'test-8',
    name: 'Michael Nfor',
    role: 'Cohort 1 Participant',
    track: 'Ceramic Sculpting & Product Design',
    image: '/images/CH1-candidates/8.jpg',
    text: 'I discovered that ceramic arts can preserve our cultural heritage while meeting modern architectural demand. The instructors didn\'t just teach technique; they instilled leadership, personal discipline, and the ambition to build a sustainable artisan studio in Yaoundé.',
    outcome: 'Ceramic sculptor · Commissioned for cultural exhibition decor',
  },
];

export const allTestimonials = testimonials;
export const row1Testimonials = testimonials.slice(0, 4);
export const row2Testimonials = testimonials.slice(4, 8);
