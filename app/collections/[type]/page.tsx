import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { visibleZones } from '@/lib/data';
import { getAllTypes, getEntriesByType, type ContentEntry } from '@/lib/content';
import { site } from '@/lib/site';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { CollectionCard } from '@/components/collections/CollectionCard';

type PageParams = { type: string };

// Collections index across every surfaced section (the-practice, field-notes,
// design-thinking). Knowledge Library is excluded while its flag is off.
const SECTIONS = visibleZones.map((z) => z.id);

function pluralize(label: string): string {
  return /s$/i.test(label) ? label : `${label}s`;
}

export function generateStaticParams() {
  return getAllTypes(SECTIONS).map((t) => ({ type: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { type } = await params;
  const match = getAllTypes(SECTIONS).find((t) => t.slug === type);
  if (!match) return {};
  const title = pluralize(match.label);
  const description = `Every ${match.label.toLowerCase()} in ${site.name}'s digital garden — agentic AI interfaces, frontend for AI, and design thinking, gathered in one place.`;
  const url = `${site.url}/collections/${type}/`;
  return {
    title,
    description,
    keywords: [`${match.label.toLowerCase()}s`, ...site.keywords],
    alternates: { canonical: `/collections/${type}/` },
    openGraph: {
      type: 'website',
      title: `${title} · ${site.name}`,
      description,
      url,
      siteName: `${site.name} — Digital Garden`,
      locale: site.locale,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${title} · ${site.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${site.name}`,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

/**
 * CollectionPage + ItemList + Breadcrumb structured data. The ItemList names
 * every piece in the collection (with its canonical URL) so search engines can
 * treat the page as a genuine index and deep-link the entries.
 */
function CollectionStructuredData({
  title,
  slug,
  description,
  entries,
}: {
  title: string;
  slug: string;
  description: string;
  entries: ContentEntry[];
}) {
  const url = `${site.url}/collections/${slug}/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collectionpage`,
        url,
        name: `${title} · ${site.name}`,
        description,
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
          { '@type': 'ListItem', position: 2, name: title, item: url },
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

export default async function CollectionPage({ params }: { params: Promise<PageParams> }) {
  const { type } = await params;
  const match = getAllTypes(SECTIONS).find((t) => t.slug === type);
  const entries = match ? getEntriesByType(match.label, SECTIONS) : [];
  if (!match || entries.length === 0) notFound();

  const title = pluralize(match.label);
  const description = `Every ${match.label.toLowerCase()} in ${site.name}'s digital garden — agentic AI interfaces, frontend for AI, and design thinking, gathered in one place.`;

  return (
    <>
      <CollectionStructuredData
        title={title}
        slug={match.slug}
        description={description}
        entries={entries}
      />
      <main className="zone relative pt-28 pb-10 md:pt-36 md:pb-20">
        <Reveal className="max-w-2xl">
          <span className="label text-parchment-muted">The Garden · by format</span>
          <h1 className="mt-5 font-display text-section font-medium leading-[1.05] text-parchment">
            {title}
          </h1>
          <p className="mt-4 font-rounded text-lg font-light leading-relaxed text-parchment-muted">
            {entries.length} {entries.length === 1 ? 'piece' : 'pieces'} across the practice,
            field notes, and design thinking — each still wearing the look of where it lives.
          </p>
        </Reveal>

        {/* Masonry: cards flow into balanced columns and pack by height (tetris),
            never forced into a rigid row/column grid. */}
        <div className="mt-12 gap-6 [column-fill:balance] columns-1 sm:columns-2 lg:columns-3">
          {entries.map((entry, i) => (
            <Reveal
              key={`${entry.section}/${entry.slug}`}
              delay={0.05 * (i % 3)}
              className="mb-6 break-inside-avoid"
            >
              <CollectionCard entry={entry} />
            </Reveal>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
