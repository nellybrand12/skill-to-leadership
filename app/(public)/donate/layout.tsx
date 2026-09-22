import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate & Support | Skill to Leadership',
  description:
    'Support practical vocational training, starter toolkits, and seed capital for young leaders and entrepreneurs across Cameroon.',
  alternates: {
    canonical: '/donate',
  },
  openGraph: {
    title: 'Donate & Support | Skill to Leadership',
    description:
      'Support practical vocational training, starter toolkits, and seed capital for young leaders in Cameroon.',
    url: '/donate',
    siteName: 'Skill to Leadership',
    images: [
      {
        url: '/Skill-to-leadership-logo.jpg',
        width: 800,
        height: 800,
        alt: 'Support Skill to Leadership',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donate & Support | Skill to Leadership',
    description:
      'Support practical vocational training, starter toolkits, and seed capital for young leaders in Cameroon.',
    images: ['/Skill-to-leadership-logo.jpg'],
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
