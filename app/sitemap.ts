import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { visibleZones } from '@/lib/data';
import { getEntries } from '@/lib/content';

// Emit as a static file for `output: 'export'`.
export const dynamic = 'force-static';

/**
 * Full sitemap: the homepage plus every published article, so search engines
 * discover and index each piece. URLs carry a trailing slash to match the
 * static export (`trailingSlash: true`) and the canonical tags on each page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: `${site.url}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1,
  };

  const articles = visibleZones.flatMap((zone) =>
    getEntries(zone.id)
      .filter((entry) => !entry.draft)
      .map((entry) => ({
        url: `${site.url}/${zone.id}/${entry.slug}/`,
        lastModified: entry.date ? new Date(entry.date) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
  );

  return [home, ...articles];
}
