import { site } from '@/lib/site';
import { visibleZones } from '@/lib/data';
import { getSectionEntries } from '@/lib/content';

// Emit as a static file for `output: 'export'`.
export const dynamic = 'force-static';

/**
 * RSS 2.0 feed of every published, page-backed piece, newest first.
 *
 * Exists mainly for discovery: Google re-fetches feeds far more often than
 * sitemaps, so a freshly published piece gets picked up in hours rather than
 * whenever the sitemap is next re-read. Submit it in Search Console under
 * Sitemaps alongside `sitemap.xml`. Readers get a subscribable feed for free.
 */
function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET(): Response {
  const entries = visibleZones
    .flatMap((zone) => getSectionEntries(zone.id))
    .filter((e) => e.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const items = entries
    .map((e) => {
      const url = `${site.url}/${e.section}/${e.slug}/`;
      const pubDate = new Date(`${e.date}T00:00:00Z`).toUTCString();
      return [
        '    <item>',
        `      <title>${escape(e.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        e.description ? `      <description>${escape(e.description)}</description>` : '',
        ...e.tags.map((t) => `      <category>${escape(t)}</category>`),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const lastBuild = entries[0]
    ? new Date(`${entries[0].date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}/</link>
    <description>${escape(site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
