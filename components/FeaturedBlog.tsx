import type { ContentEntry } from '@/lib/content';
import { formatDate, plainExcerpt, readingTime } from '@/lib/format';
import { site } from '@/lib/site';
import { CoverImage } from './CoverImage';
import { Reveal } from './motion/Reveal';
import { HoverLink, AnimatedTitle } from './motion/HoverLink';

/**
 * The homepage's featured "hero blog": the single newest piece across every
 * section, given full editorial billing right after the intro and before the
 * section lists. A large cover on the left with a short tag row
 * beneath it; the story's framing on the right. Ships BlogPosting structured
 * data so the piece can rank on its own from the homepage.
 */

/** BlogPosting JSON-LD for the featured piece — headline, dates, author,
 *  image, keywords, canonical, word count. */
function FeaturedStructuredData({ entry, minutes }: { entry: ContentEntry; minutes: number }) {
  const url = `${site.url}/${entry.section}/${entry.slug}/`;
  const image = entry.cover
    ? entry.cover.startsWith('http')
      ? entry.cover
      : `${site.url}/og-image.png`
    : `${site.url}/og-image.png`;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: entry.title,
    description: entry.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: entry.date || undefined,
    dateModified: entry.date || undefined,
    author: { '@type': 'Person', name: site.name, url: site.url },
    publisher: { '@type': 'Person', name: site.name, url: site.url },
    image: [image],
    keywords: entry.tags.join(', '),
    articleSection: entry.type,
    wordCount: entry.body.trim().split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${minutes}M`,
    inLanguage: 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * The piece's first few tags as a static, wrapping row under the cover. Kept
 * to four so the row never runs off the card.
 */
function TagRow({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.slice(0, 4).map((tag) => (
        <li
          key={tag}
          className="rounded-lg border border-hairline bg-secondary-bg/50 px-3 py-1 font-rounded text-[0.75rem] text-parchment-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Call-to-action wording that matches the piece's type: "Read the essay". */
function ctaLabel(type: string): string {
  const t = type.trim().toLowerCase();
  return t ? `Read the ${t}` : 'Read the piece';
}

export function FeaturedBlog({ entry }: { entry: ContentEntry }) {
  const minutes = readingTime(entry.body);
  const preview = plainExcerpt(entry.body, 260);
  const href = `/${entry.section}/${entry.slug}/`;

  return (
    <section id="featured" className="zone scroll-mt-24 pt-2 pb-10 md:pt-6 md:pb-16">
      <FeaturedStructuredData entry={entry} minutes={minutes} />

      <Reveal as="article">
        <HoverLink
          href={href}
          ariaLabel={`Read: ${entry.title}`}
          className="group grid grid-cols-1 gap-7 md:grid-cols-2 md:items-center md:gap-12"
        >
          {/* Left: cover with its tag row below */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-parchment/10 shadow-sm">
              <CoverImage
                src={entry.cover}
                alt={entry.title}
                ratio="landscape"
                className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <TagRow tags={entry.tags} />
          </div>

          {/* Right: the story's framing */}
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className="label inline-flex items-center gap-2 rounded-full border border-spark/30 bg-spark/10 px-3 py-1 text-spark">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-spark opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-spark" />
                </span>
                Latest
              </span>
              {entry.date && (
                <span className="label text-parchment-faint">
                  {formatDate(entry.date)} · {minutes} min read
                </span>
              )}
            </div>

            <h2 className="mt-4">
              <AnimatedTitle className="t-feature-title">
                {entry.title}
              </AnimatedTitle>
            </h2>

            {entry.description && (
              <p className="mt-3 max-w-xl t-feature-sub text-parchment/80">
                {entry.description}
              </p>
            )}

            {/* A taste of the opening lines, under the framing. */}
            {preview && (
              <p className="mt-4 max-w-xl border-l border-hairline pl-4 font-rounded text-sm leading-relaxed text-parchment-muted line-clamp-4">
                {preview}
              </p>
            )}

            <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-spark/40 bg-spark/10 px-5 py-2.5 font-rounded text-sm font-medium text-spark transition-[gap,background-color] duration-300 group-hover:gap-3.5 group-hover:bg-spark/20">
              {ctaLabel(entry.type)}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </HoverLink>
      </Reveal>
    </section>
  );
}
