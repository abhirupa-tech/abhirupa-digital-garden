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

/**
 * Editorial copy per format. A collection page that is only a wall of cards is
 * a thin page — to a reader who arrived from search it never says what the
 * format *is*, and it gives a crawler almost nothing to distinguish it from
 * its sibling collections. `lede` is the on-page introduction; `meta` is the
 * search description, deliberately written separately so the snippet isn't a
 * clipped version of the first paragraph.
 *
 * Keyed by type slug. Formats without an entry fall back to a generated line,
 * so adding a new `type:` to a piece never breaks the page.
 */
const FORMAT_COPY: Record<string, { lede: string; meta: string }> = {
  essay: {
    lede: 'Arguments, not instructions. An essay is where a question gets turned over long enough to be worth saying out loud — how AI systems actually reason, what the interfaces around them keep getting wrong, and what changes once a model becomes a material you design with rather than a feature you bolt on.',
    meta: "Essays by Abhirupa Mitra on agentic AI interfaces, mode collapse, agent orchestration, and the design thinking behind human-AI systems — long-form arguments rather than how-tos.",
  },
  guide: {
    lede: 'Instructions that assume you are actually going to build the thing. A guide runs end to end — the setup, the decisions made along the way, and the parts most write-ups skip because they are tedious rather than difficult.',
    meta: 'Step-by-step guides by Abhirupa Mitra on frontend for AI — MCP servers, AI-assisted coding setups, harness engineering, and shipping LLM interfaces at scale.',
  },
  playbook: {
    lede: 'Repeatable method. A playbook is what is left after doing something enough times to know which steps matter, which ones are ritual, and where it usually goes wrong.',
    meta: 'Playbooks by Abhirupa Mitra — repeatable, battle-tested setups for building with AI, from MCP server tooling to production frontend workflows.',
  },
};

function formatCopy(slug: string, label: string, count: number) {
  const known = FORMAT_COPY[slug];
  return {
    lede:
      known?.lede ??
      `Every ${label.toLowerCase()} in the garden, gathered in one place — written across the practice, field notes, and design thinking.`,
    meta:
      known?.meta ??
      `${count} ${count === 1 ? label.toLowerCase() : `${label.toLowerCase()}s`} by ${site.name} on agentic AI interfaces, frontend for AI, and design thinking.`,
  };
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
  const description = formatCopy(
    match.slug,
    match.label,
    getEntriesByType(match.label, SECTIONS).length,
  ).meta;
  const url = `${site.url}/collections/${type}/`;
  return {
    title,
    description,
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
  const { lede, meta } = formatCopy(match.slug, match.label, entries.length);

  return (
    <>
      <CollectionStructuredData
        title={title}
        slug={match.slug}
        description={meta}
        entries={entries}
      />
      <main className="zone relative pt-28 pb-10 md:pt-36 md:pb-20">
        <Reveal className="max-w-2xl">
          <span className="label text-parchment-muted">The Garden · by format</span>
          <h1 className="mt-5 font-display text-section font-medium leading-[1.05] text-parchment">
            {title}
          </h1>
          <p className="mt-5 font-body text-lg leading-relaxed text-parchment-muted md:text-xl">
            {lede}
          </p>
          <p className="mt-4 font-rounded text-base font-light leading-relaxed text-parchment-faint">
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
