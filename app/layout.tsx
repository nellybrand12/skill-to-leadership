import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skill to Leadership | Turning Skills Into Leadership',
  description:
    'Skill to Leadership is a youth-focused non-profit program empowering young people with practical skills, mentorship and leadership opportunities in Cameroon.',
  keywords: [
    'Skill to Leadership',
    'youth non-profit Cameroon',
    'youth skills training Cameroon',
    'leadership programs Cameroon',
    'practical skills for youth',
    'youth development programs Africa',
    'African youth entrepreneurship',
    'Yaoundé vocational training',
  ],
  authors: [{ name: 'Skill to Leadership' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Skill to Leadership — Turning Skills Into Leadership',
    description: 'A youth-focused non-profit empowering African youth with practical crafts, mentorship & leadership.',
    url: '/',
    siteName: 'Skill to Leadership',
    images: [
      {
        url: '/Skill-to-leadership-logo.jpg',
        width: 800,
        height: 800,
        alt: 'Skill to Leadership Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/round-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: 'google666673f56dd9d7dc',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-ink-900 bg-cream-canvas selection:bg-gold-light selection:text-ink-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
