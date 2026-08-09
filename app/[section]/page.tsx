import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { zones, zoneById, type Zone } from '@/lib/data';
import { getSectionEntries, type ContentEntry } from '@/lib/content';
import { site } from '@/lib/site';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { SectionFeature } from '@/components/section-page/SectionFeature';
import { PracticeIndex } from '@/components/section-page/PracticeIndex';

type PageParams = { section: string };

/**
 * A dedicated landing page for each content section (The Practice, Field Notes,
 * Design Thinking). It leads with the latest piece as a hero, then lays out the
 * rest of the archive in a layout tuned to that section's character. Each page
 * is its own indexable URL with full metadata + CollectionPage structured data,
 * so a section can rank in search on its own.
 *
 * Sections whose entries are all external references (the Knowledge Library)
 * have no internal pieces, so no landing page is generated for them.
 */

/** The sections that actually have page-backed pieces to show. */
const PAGE_ZONES: Zone[] = zones.filter((z) => getSectionEntries(z.id).length > 0);

export function generateStaticParams() {
  return PAGE_ZONES.map((z) => ({ section: z.id }));
}

/** Extra, section-tuned keywords layered on top of the site-wide set. */
function sectionKeywords(zone: Zone): string[] {
  return [zone.kicker, zone.title, `${zone.kicker} by ${site.name}`, ...site.keywords];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { section } = await params;
  const zone = zoneById[section];
  if (!zone || getSectionEntries(section).length === 0) return {};

  const url = `${site.url}/${section}/`;
  const description = `${zone.title}. ${zone.blurb}`;
  const newest = getSectionEntries(section)[0];
  const image = newest?.cover
    ? newest.cover.startsWith('http')
      ? newest.cover
      : '/og-image.png'
    : '/og-image.png';

  return {
    title: zone.kicker,
    description,
    keywords: sectionKeywords(zone),
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: zone.kicker,
    alternates: { canonical: `/${section}/` },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      type: 'website',
      url,
      title: `${zone.kicker} · ${site.name}`,
      description,
      siteName: `${site.name} — Digital Garden`,
      locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: `${zone.kicker} · ${site.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${zone.kicker} · ${site.name}`,
      description,
      images: [image],
    },
  };
}

/**
 * CollectionPage + ItemList + Breadcrumb structured data. The ItemList names
 * every piece in the section (with its canonical URL) so search engines treat
 * the page as a genuine index and can deep-link the entries.
 */
function SectionStructuredData({
  zone,
  entries,
}: {
  zone: Zone;
  entries: ContentEntry[];
}) {
  const url = `${site.url}/${zone.id}/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collectionpage`,
        url,
        name: `${zone.kicker} · ${site.name}`,
        description: `${zone.title}. ${zone.blurb}`,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${site.url}/#person` },
        inLanguage: 'en-US',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: entries.length,
          itemListElement: entries.map((e, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${site.url}/${e.section}/${e.slug}/`,
            name: e.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: zone.kicker, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function SectionPage({ params }: { params: Promise<PageParams> }) {
  const { section } = await params;
  const zone = zoneById[section];
  const entries = zone ? getSectionEntries(section) : [];
  if (!zone || entries.length === 0) notFound();

  const [feature, ...rest] = entries;

  return (
    <>
      <SectionStructuredData zone={zone} entries={entries} />

      <main className="zone relative pt-24 pb-8 md:pt-28 md:pb-14">
        <Reveal className="max-w-2xl">
          <div className="flex items-baseline gap-4">
            <span className="font-rounded text-lg font-medium text-sand/90">{zone.index}</span>
            <span className="label text-parchment-muted">{zone.kicker}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-parchment md:text-[2.6rem]">
            {zone.title}
          </h1>
          <p className="mt-3 font-rounded text-lg font-light leading-snug text-parchment-muted">
            {zone.blurb}
          </p>
          <p className="label mt-4 text-parchment-faint">
            {entries.length} {entries.length === 1 ? 'piece' : 'pieces'}
          </p>
        </Reveal>

        <SectionFeature entry={feature} />

        <PracticeIndex entries={rest} />
      </main>

      <Footer />
    </>
  );
}
