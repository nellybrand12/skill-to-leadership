export interface SiteSettingsMap {
  contact_email: string;
  contact_whatsapp: string;
  contact_whatsapp_link: string;
  contact_location: string;
  contact_working_hours: string;
  social_instagram: string;
  social_linkedin: string;
  social_x: string;
  footer_scripture: string;
  footer_scripture_reference: string;
  hero_heading: string;
  hero_subtext: string;
  hero_eyebrow: string;
  cohort2_countdown_date: string;
  cohort2_status: string;
  founder_image: string;
  founder_name: string;
  founder_title: string;
  founder_quote: string;
  feature_1_title: string;
  feature_1_desc: string;
  feature_1_icon: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_2_icon: string;
  feature_3_title: string;
  feature_3_desc: string;
  feature_3_icon: string;
  [key: string]: string;
}

export const defaultSettings: SiteSettingsMap = {
  contact_email: 'fonyechris@gmail.com',
  contact_whatsapp: '+237 668 62 06 75',
  contact_whatsapp_link: 'https://wa.me/237668620675',
  contact_location: 'Yaoundé, Centre Region, Cameroon',
  contact_working_hours: 'Monday – Friday: 8:30 AM – 5:30 PM WAT',
  social_instagram: 'https://www.instagram.com/skill_to_leadership?igsi=ZDNlZDc0MzIxNw==',
  social_linkedin: 'https://www.linkedin.com/in/mokijei-junior-fonye-christopher-4139ba384/',
  social_x: 'https://x.com/FonyeChris?s=20',
  footer_scripture: 'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.',
  footer_scripture_reference: 'Matthew 5:16',
  hero_heading: 'TURNING SKILLS INTO LEADERSHIP',
  hero_subtext: 'An experiential youth development non-profit empowering young changemakers in Cameroon with hands-on craft mastery, mentorship, starter toolkits, and seed prize capital.',
  hero_eyebrow: 'SKILL TO LEADERSHIP',
  cohort2_countdown_date: '2026-10-15T09:00:00Z',
  cohort2_status: 'Coming Soon — Applications Opening',
  founder_image: '/images/Founder.jpg',
  founder_name: 'Christopher Fonye',
  founder_title: 'Civil Engineering Student at Bucknell University · Ashinaga Scholar · Projects for Peace grantee · Founder, Skill to Leadership',
  founder_quote: 'In a world where time is a luxury, "Youths" are the wealthiest',
  feature_1_title: 'Practical Skills',
  feature_1_desc: 'Hands-on learning through real-world craft mastery',
  feature_1_icon: 'Scissors',
  feature_2_title: 'Mentorship & Leadership',
  feature_2_desc: 'Personal growth and guidance beyond technical ability',
  feature_2_icon: 'Compass',
  feature_3_title: 'Community & Opportunity',
  feature_3_desc: 'Connecting ambitious youth with networks, toolkits and seed capital',
  feature_3_icon: 'Users',
};
