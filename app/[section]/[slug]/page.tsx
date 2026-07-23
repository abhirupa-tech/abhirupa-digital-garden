import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getEntries, getEntry, type ContentEntry } from '@/lib/content';
import { zoneById, visibleZones, type Zone } from '@/lib/data';
import { site } from '@/lib/site';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { SideNav } from '@/components/SideNav';
import { Footer } from '@/components/Footer';
import { ArticleFooter } from '@/components/ArticleFooter';
import { Heading, Subtitle, TagList, typographyComponents } from '@/components/typography';

type PageParams = { section: string; slug: string };

/** Absolute, trailing-slash canonical URL for a piece. */
function pieceUrl(section: string, slug: string) {
  return `${site.url}/${section}/${slug}/`;
}

/** OG/Twitter image for a piece — its cover if set, else the site default. */
function pieceImage(entry: ContentEntry) {
  return entry.cover ? cloudinaryUrl(entry.cover, { width: 1200 }) : '/og-image.png';
}

/**
 * A Medium-style article page for a single /content piece. The body is
 * authored as MDX and rendered through the typography component set, so
 * standard markdown and explicit component tags both work in the source file.
 */
export function generateStaticParams() {
  return visibleZones.flatMap((zone) =>
    getEntries(zone.id).map((entry) => ({ section: zone.id, slug: entry.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const zone = zoneById[section];
  const entry = getEntry(section, slug);
  if (!zone || !entry) return {};

  const url = pieceUrl(section, slug);
  const description = entry.description || site.description;
  const image = pieceImage(entry);
  // Per-article keywords: the piece's own tags first, then the site's target
  // search intents (agentic UI, frontend for AI, human–AI interaction, …).
  const keywords = [...entry.tags, entry.type, zone.kicker, ...site.keywords];

  return {
    title: entry.title,
    description,
    keywords,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: zone.kicker,
    alternates: { canonical: url },
    // Placeholder drafts stay out of the index (thin/duplicate content hurts
    // the whole domain) — but they still carry full metadata, so flipping
    // `draft: false` on real copy makes them index-ready instantly.
    robots: entry.draft
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    openGraph: {
      type: 'article',
      url,
      title: entry.title,
      description,
      siteName: `${site.name} — Digital Garden`,
      locale: site.locale,
      publishedTime: entry.date || undefined,
      modifiedTime: entry.date || undefined,
      authors: [site.url],
      section: zone.kicker,
      tags: entry.tags,
      images: [{ url: image, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description,
      images: [image],
    },
  };
}

/**
 * Article + Breadcrumb structured data. The author and publisher point (by
 * @id) at the Person/WebSite nodes declared once in the root layout, so search
 * engines resolve every piece back to a single authoritative identity.
 */
function ArticleStructuredData({
  zone,
  entry,
  url,
}: {
  zone: Zone;
  entry: ContentEntry;
  url: string;
}) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: entry.title,
        description: entry.description || site.description,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: pieceImage(entry),
        datePublished: entry.date || undefined,
        dateModified: entry.date || undefined,
        author: { '@id': `${site.url}/#person` },
        publisher: { '@id': `${site.url}/#person` },
        isPartOf: { '@id': `${site.url}/#website` },
        articleSection: zone.kicker,
        keywords: [...entry.tags, zone.kicker].join(', '),
        inLanguage: 'en-US',
        // This site stays canonical; sameAs just notes the piece is also
        // mirrored on Medium, without ceding search ranking to it.
        ...(entry.medium ? { sameAs: [entry.medium] } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: zone.kicker, item: `${site.url}/#${zone.id}` },
          { '@type': 'ListItem', position: 3, name: entry.title, item: url },
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

export default async function PiecePage({ params }: { params: Promise<PageParams> }) {
  const { section, slug } = await params;
  const zone = zoneById[section];
  const entry = zone ? getEntry(section, slug) : null;
  if (!zone || !entry) notFound();

  const url = pieceUrl(section, slug);
  // Other pieces in the same section, for the "More in …" cross-links.
  const siblings = getEntries(section)
    .filter((e) => e.slug !== slug)
    .slice(0, 4);

  const { content } = await compileMDX({
    source: entry.body,
    components: typographyComponents,
    // Content is authored locally by the site owner, not remote/untrusted —
    // safe to allow JS expressions in JSX props (e.g. `<Citation n={1} />`),
    // which next-mdx-remote strips by default as an XSS precaution.
    options: { blockJS: false },
  });

  return (
    <>
      <ArticleStructuredData zone={zone} entry={entry} url={url} />
      <SideNav />
      <div className="lg:pl-20">
        <main>
          <article className="zone max-w-4xl pb-10 pt-10 sm:pb-16 sm:pt-16 md:pt-28">
            <a
              href={`/#${zone.id}`}
              className="label inline-flex items-center gap-2 text-sand/80 transition-colors duration-300 hover:text-sand"
            >
              ← {zone.kicker}
            </a>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-display text-lg text-sand/70">{zone.index}</span>
              <span className="label">{entry.type}</span>
              {entry.date && <span className="label text-parchment-faint">{entry.date}</span>}
            </div>

            <Heading level={1} className="mt-4">
              {entry.title}
            </Heading>
            {entry.description && <Subtitle>{entry.description}</Subtitle>}
            <TagList tags={entry.tags} />

            <div className="mt-9 sm:mt-16">{content}</div>
          </article>

          <ArticleFooter zone={zone} entry={entry} siblings={siblings} />
        </main>

        <Footer />
      </div>
    </>
  );
}
