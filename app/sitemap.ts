import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { pastEventsData } from '@/data/events';
import { programsData } from '@/data/programs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://skilltoleadership.org').replace(/\/$/, '');

  // 1. Static Public Pages
  const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/events', changeFrequency: 'daily', priority: 0.9 },
    { path: '/programs', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/cohorts', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/impact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/volunteer', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/donate', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  // 2. Dynamic Event Slugs (De-duplicated between DB and static fallbacks)
  const seenEventSlugs = new Set<string>();

  try {
    const dbEvents = await db.event.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    for (const ev of dbEvents) {
      if (ev.slug && !seenEventSlugs.has(ev.slug)) {
        seenEventSlugs.add(ev.slug);
        sitemapEntries.push({
          url: `${baseUrl}/events/${ev.slug}`,
          lastModified: ev.updatedAt ? new Date(ev.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch (err) {
    console.error('Error querying events for sitemap:', err);
  }

  // Include static fallback events ONLY if their slug was not already added from the DB
  for (const pe of pastEventsData) {
    if (pe.slug && !seenEventSlugs.has(pe.slug)) {
      seenEventSlugs.add(pe.slug);
      sitemapEntries.push({
        url: `${baseUrl}/events/${pe.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 3. Dynamic Program Track Routes
  for (const p of programsData) {
    if (p.slug) {
      sitemapEntries.push({
        url: `${baseUrl}/programs/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return sitemapEntries;
}
