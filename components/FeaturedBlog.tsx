import type { ContentEntry } from '@/lib/content';
import { formatDate, readingTime } from '@/lib/format';
import { site } from '@/lib/site';
import { CoverImage } from './CoverImage';
import { Reveal } from './motion/Reveal';
import { HoverLink, AnimatedTitle } from './motion/HoverLink';

/**
 * The homepage's featured "hero blog": the single newest piece across every
 * section, given full editorial billing right after the intro and before the
 * section lists. A large cover on the left with a glassmorphism tag marquee
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
 * The tag marquee: translucent, blurred glass pills scrolling horizontally
 * beneath the cover. The list is rendered twice so the -50% slide loops
 * seamlessly; edges are masked to fade into the canvas.
 */
function TagMarquee({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  const run = [...tags, ...tags];
  return (
    <div
      className="mt-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]"
      aria-hidden="true"
    >
      <ul className="marquee-track flex w-max items-center gap-2.5">
        {run.map((tag, i) => (
          <li
            key={`${tag}-${i}`}
            className="whitespace-nowrap rounded-lg border border-hairline bg-secondary-bg/50 px-3 py-1.5 font-rounded text-[0.72rem] text-parchment-muted backdrop-blur-md"
          >
            #{tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeaturedBlog({ entry }: { entry: ContentEntry }) {
  const minutes = readingTime(entry.body);
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
          {/* Left: cover + glass tag marquee below it */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-parchment/10 shadow-sm">
              <CoverImage
                src={entry.cover}
                alt={entry.title}
                ratio="landscape"
                className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <TagMarquee tags={entry.tags} />
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

            <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-spark/40 bg-spark/10 px-5 py-2.5 font-rounded text-sm font-medium text-spark transition-[gap,background-color] duration-300 group-hover:gap-3.5 group-hover:bg-spark/20">
              Read the guide
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </HoverLink>
      </Reveal>
    </section>
  );
}
