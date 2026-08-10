'use client';

import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { CoverImage } from './CoverImage';
import { TypeBadge } from './TypeBadge';
import { Reveal } from './motion/Reveal';
import { HoverLink, AnimatedTitle } from './motion/HoverLink';

/**
 * End-of-article cross-link: three related pieces as compact cover cards. Kept
 * deliberately minimal — thumbnail, a line of meta, the title, and a quiet
 * "Read →". Cards equalize height in their row and lift a touch on hover, so
 * the block reads as one neat set rather than a heavy grid.
 */
export function RelatedPosts({ entries }: { entries: ContentEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mb-10 sm:mb-16">
      <h2 id="related-heading" className="font-display text-2xl leading-tight text-parchment md:text-3xl">
        If you liked this, you&rsquo;ll like these
      </h2>
      <p className="label mt-2 text-parchment-muted">A few more from the garden</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        {entries.map((entry, i) => (
          <Reveal key={`${entry.section}/${entry.slug}`} delay={0.08 * i}>
            <HoverLink
              href={`/${entry.section}/${entry.slug}/`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f9f8f4] transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-secondary-bg"
            >
              <div className="overflow-hidden">
                <CoverImage
                  src={entry.cover}
                  alt={entry.title}
                  ratio="landscape"
                  className="transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                  <TypeBadge type={entry.type} />
                  {entry.date && (
                    <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
                  )}
                </div>
                <h3 className="mt-2">
                  <AnimatedTitle className="font-rounded text-base leading-snug sm:text-lg">
                    {entry.title}
                  </AnimatedTitle>
                </h3>
                <span className="label mt-auto inline-flex items-center gap-1 pt-3 text-sand/80">
                  Read
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </HoverLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
