import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { visibleZones } from '@/lib/data';
import {
  getEntries,
  getSectionEntries,
  getAllTypes,
  getEntriesByType,
  type ContentEntry,
} from '@/lib/content';
import { labProjects } from '@/lib/lab';

// Emit as a static file for `output: 'export'`.
export const dynamic = 'force-static';

/**
 * The build timestamp — used only for pages whose freshness genuinely isn't
 * derivable from content (the About page, the Lab).
 *
 * Everything that lists pieces takes its `lastmod` from the newest piece it
 * lists instead. Stamping every URL with the build time would tell crawlers
 * the whole site changed on every deploy, including deploys that only touched
 * CSS — a signal that's wrong often enough to be worth discounting, which is
 * exactly what we don't want for a site still fighting to get crawled.
 */
const BUILD_TIME = new Date();

/** The most recent publication date among `entries`, or the build time. */
function newestDate(entries: ContentEntry[]): Date {
  const times = entries
    .map((e) => (e.date ? new Date(e.date).getTime() : NaN))
    .filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : BUILD_TIME;
}

/**
 * Full sitemap: the homepage plus every published article, so search engines
 * discover and index each piece. URLs carry a trailing slash to match the
 * static export (`trailingSlash: true`) and the canonical tags on each page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const sectionIds = visibleZones.map((z) => z.id);

  // Every published piece, in one list — the basis for the hubs' `lastmod`.
  // Curated references (external `link`) are excluded: no article page is
  // generated for them, so listing one would put a URL that 404s in the
  // sitemap. Harmless while the Knowledge Library flag is off, and wrong the
  // moment it isn't.
  const published = visibleZones.flatMap((zone) =>
    getEntries(zone.id).filter((entry) => !entry.draft && !entry.link),
  );

  const home: MetadataRoute.Sitemap[number] = {
    url: `${site.url}/`,
    lastModified: newestDate(published),
    changeFrequency: 'weekly',
    priority: 1,
  };

  const about: MetadataRoute.Sitemap[number] = {
    url: `${site.url}/about/`,
    lastModified: BUILD_TIME,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  // The Lab hub plus each experiment's own page.
  const lab: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/lab/`,
      lastModified: BUILD_TIME,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...labProjects.map((p) => ({
      url: `${site.url}${p.href}`,
      lastModified: BUILD_TIME,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // Section landing pages (The Practice, Field Notes, Design Thinking) — only
  // those with page-backed pieces get their own indexable hub.
  const sections = visibleZones
    .filter((zone) => getSectionEntries(zone.id).length > 0)
    .map((zone) => ({
      url: `${site.url}/${zone.id}/`,
      lastModified: newestDate(getSectionEntries(zone.id)),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // Format collection pages (Guides, Playbooks, Essays, …).
  const collections = getAllTypes(sectionIds).map((t) => ({
    url: `${site.url}/collections/${t.slug}/`,
    lastModified: newestDate(getEntriesByType(t.slug, sectionIds)),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const articles = published.map((entry) => ({
    url: `${site.url}/${entry.section}/${entry.slug}/`,
    lastModified: entry.date ? new Date(entry.date) : BUILD_TIME,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [home, about, ...lab, ...sections, ...collections, ...articles];
}
