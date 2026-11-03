import type { Metadata } from 'next';
import { visibleZones, zoneById } from '@/lib/data';
import { getEntries, typeSlug } from '@/lib/content';
import { formatDate, readingTime, topicLabel } from '@/lib/format';
import { site } from '@/lib/site';
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
      tags: e.tags,
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
  const topics = facets(items.flatMap((i) => i.tags), topicLabel);

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
      <main className="zone pt-28 pb-16 md:pt-36 md:pb-24">
        <header className="max-w-3xl">
          <span className="label">The Garden · {items.length} pieces</span>
          <h1 className="mt-4 font-display text-section font-medium leading-[1.05] text-parchment">
            Writing
          </h1>
          <p className="mt-5 font-rounded text-lg leading-relaxed text-secondary-text md:text-xl">
            Essays, guides and playbooks on designing and building frontends for AI agents,
            gathered from The Practice, Field Notes and Design Thinking.
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
