import type { Metadata } from 'next';
import { visibleZones, zoneById } from '@/lib/data';
import { getEntries, typeSlug } from '@/lib/content';
import { formatDate, readingTime, tagSlug } from '@/lib/format';
import { site } from '@/lib/site';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { Footer } from '@/components/Footer';
import { WritingIndex, type WritingItem } from '@/components/writing/WritingIndex';

const DESCRIPTION =
  'Every essay, guide and playbook by Abhirupa Mitra on agentic AI interfaces, frontend for AI and design thinking, newest first, filterable by format and topic.';

export const metadata: Metadata = {
  title: 'Writing',
  description: DESCRIPTION,
  alternates: { canonical: '/writing/' },
  openGraph: {
    type: 'website',
    title: `Writing · ${site.name}`,
    description: DESCRIPTION,
    url: `${site.url}/writing/`,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Writing · ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Writing · ${site.name}`,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
};

const pluralize = (label: string) => (/s$/i.test(label) ? label : `${label}s`);

/** Every published, page-backed piece across the visible sections, newest first. */
function allItems(): WritingItem[] {
  return visibleZones
    .flatMap((zone) => getEntries(zone.id))
    .filter((e) => !e.draft && !e.link)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((e) => ({
      href: `/${e.section}/${e.slug}/`,
      title: e.title,
      description: e.description,
      type: e.type,
      typeSlug: typeSlug(e.type),
      date: e.date,
      dateLabel: formatDate(e.date),
      year: e.date.slice(0, 4),
      minutes: readingTime(e.body),
      section: zoneById[e.section]?.kicker ?? e.section,
      tags: e.tags.map(tagSlug),
      tagNames: e.tags,
      cover: e.cover ? cloudinaryUrl(e.cover, { width: 800 }) : '',
      coverAlt: e.coverAlt || e.title,
    }));
}

function facets(values: string[], label: (v: string) => string) {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([slug, count]) => ({ slug, label: label(slug), count }));
}

export default function WritingPage() {
  const items = allItems();
  const typeLabels = new Map(items.map((i) => [i.typeSlug, i.type]));
  const types = facets(
    items.map((i) => i.typeSlug),
    (slug) => pluralize(typeLabels.get(slug) ?? slug),
  );
  // Tags are written as display names ("Agentic UI"); the filter keys on their
  // slug ("agentic-ui") and shows the display name.
  const topicNames = new Map<string, string>();
  visibleZones
    .flatMap((zone) => getEntries(zone.id))
    .forEach((e) => e.tags.forEach((t) => topicNames.set(tagSlug(t), t)));
  const topics = facets(items.flatMap((i) => i.tags), (slug) => topicNames.get(slug) ?? slug);

  const structured = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: `${site.url}/writing/`,
    name: `Writing · ${site.name}`,
    description: DESCRIPTION,
    isPartOf: { '@id': `${site.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((i, n) => ({
        '@type': 'ListItem',
        position: n + 1,
        url: `${site.url}${i.href}`,
        name: i.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
      />
      <main className="zone pt-24 pb-16 md:pt-32 md:pb-24">
        <header className="max-w-4xl">
          <span className="font-rounded text-xs font-semibold uppercase tracking-[0.14em] text-parchment-muted">
            Essays · Guides · Playbooks · {items.length} pieces
          </span>
          <h1 className="mt-3.5 font-display text-[3.6rem] font-semibold leading-[0.95] tracking-[-0.02em] text-parchment [font-variation-settings:'opsz'_144,'SOFT'_50] sm:text-[4.5rem] lg:text-[6rem]">
            Writing,{' '}
            <em className="font-normal italic text-highlight">out loud.</em>
          </h1>
          <p className="mt-5 max-w-[620px] font-rounded text-lg leading-relaxed text-parchment-muted md:text-[1.1875rem]">
            Essays, guides and playbooks on designing and building frontends for AI agents.
          </p>
        </header>
        <div className="mt-10">
          <WritingIndex items={items} types={types} topics={topics} />
        </div>
      </main>
      <Footer />
    </>
  );
}
