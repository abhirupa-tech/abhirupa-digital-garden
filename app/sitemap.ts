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
 * When the two pages with no dated content behind them — About and the Lab —
 * were last meaningfully rewritten. **Bump this by hand when you actually
 * change them**, and not otherwise.
 *
 * It's a hand-maintained constant rather than the build time on purpose. A
 * build timestamp would claim these pages changed on every deploy, including
 * deploys that only touched CSS. `lastmod` is the one sitemap field Google
 * actually acts on, and it only keeps that value if it's true — a feed that
 * cries "everything changed" on every push teaches a crawler to discount the
 * whole file, which is the opposite of what a site fighting for crawl budget
 * needs. Every other URL here derives its date from real content instead.
 */
const STATIC_PAGES_UPDATED = '2026-08-25';

/**
 * `lastmod` as a plain `YYYY-MM-DD` date.
 *
 * Deliberately not a full ISO timestamp: publication dates in frontmatter have
 * day precision, so emitting `T08:52:35.487Z` would invent a precision the
 * content doesn't have. The sitemap spec accepts either.
 */
function isoDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value;
  return Number.isNaN(d.getTime()) ? STATIC_PAGES_UPDATED : d.toISOString().slice(0, 10);
}

/** The most recent publication date among `entries`. */
function newestDate(entries: ContentEntry[]): string {
  const times = entries
    .map((e) => (e.date ? new Date(`${e.date}T00:00:00Z`).getTime() : NaN))
    .filter((t) => !Number.isNaN(t));
  return times.length ? isoDate(new Date(Math.max(...times))) : STATIC_PAGES_UPDATED;
}

/**
 * Full sitemap: the homepage plus every published article, so search engines
 * discover and index each piece. URLs carry a trailing slash to match the
 * static export (`trailingSlash: true`) and the canonical tags on each page.
 *
 * `changefreq` and `priority` are intentionally omitted. Google ignores both
 * for scheduling — `priority` is relative *within* one site and says nothing
 * about it versus any other, and `changefreq` was always a hint rather than a
 * fact. Leaving them out keeps the file to the two fields that carry meaning.
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
  };

  const about: MetadataRoute.Sitemap[number] = {
    url: `${site.url}/about/`,
    lastModified: STATIC_PAGES_UPDATED,
  };

  // The Lab hub plus each experiment's own page.
  const lab: MetadataRoute.Sitemap = [
    { url: `${site.url}/lab/`, lastModified: STATIC_PAGES_UPDATED },
    ...labProjects.map((p) => ({
      url: `${site.url}${p.href}`,
      lastModified: STATIC_PAGES_UPDATED,
    })),
  ];

  // Section landing pages (The Practice, Field Notes, Design Thinking) — only
  // those with page-backed pieces get their own indexable hub.
  const sections = visibleZones
    .filter((zone) => getSectionEntries(zone.id).length > 0)
    .map((zone) => ({
      url: `${site.url}/${zone.id}/`,
      lastModified: newestDate(getSectionEntries(zone.id)),
    }));

  // Format collection pages (Guides, Playbooks, Essays, …).
  const collections = getAllTypes(sectionIds).map((t) => ({
    url: `${site.url}/collections/${t.slug}/`,
    lastModified: newestDate(getEntriesByType(t.slug, sectionIds)),
  }));

  const articles = published.map((entry) => ({
    url: `${site.url}/${entry.section}/${entry.slug}/`,
    lastModified: entry.date ? isoDate(entry.date) : STATIC_PAGES_UPDATED,
  }));

  return [home, about, ...lab, ...sections, ...collections, ...articles];
}
