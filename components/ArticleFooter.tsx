import type { ContentEntry } from '@/lib/content';
import { site } from '@/lib/site';
import { RelatedPosts } from './RelatedPosts';

/**
 * The end-of-article block:
 *  1. "If you liked this…" — three related pieces as cover cards, spreading
 *     link equity across the site and keeping readers in the garden.
 *  2. A Medium attribution note, when the piece was first published there.
 *  3. An author card — a keyword-rich bio that links back to the topic hubs
 *     (agentic AI, frontend for AI, design thinking) for SEO.
 */
export function ArticleFooter({
  entry,
  related,
}: {
  entry: ContentEntry;
  related: ContentEntry[];
}) {
  return (
    <footer className="zone mx-auto mt-14 max-w-4xl border-t border-parchment/12 pt-8 sm:mt-24 sm:pt-12">
      <RelatedPosts entries={related} />

      {entry.medium && (
        <p className="label mb-8 text-parchment-faint sm:mb-14">
          Originally published on{' '}
          <a
            href={entry.medium}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-highlight"
          >
            Medium
          </a>
          .
        </p>
      )}

      {/* Author card — a quiet callout, not body copy. Keyword-rich links kept for SEO. */}
      <section aria-labelledby="author-heading" className="pb-10 sm:pb-16">
        <div className="flex flex-col gap-5 rounded-2xl border border-gray-300/25 bg-gray-400/[0.14] p-7 sm:flex-row sm:items-start sm:gap-6 md:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[28%] border border-sand/25 bg-sand/10">
            <span className="font-display text-base text-sand">
              {site.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </span>
          </div>
          <div>
            <h2 id="author-heading" className="label text-sand/70">
              About the author
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-parchment/85">
              <a href="/" className="text-parchment underline decoration-sand/40 underline-offset-4 hover:text-highlight">
                {site.name}
              </a>{' '}
              is a {site.role} designing{' '}
              <a href="/#the-practice" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-highlight">
                agentic AI interfaces
              </a>{' '}
              — the frontend for AI where agents reason alongside people. She writes on{' '}
              <a href="/#field-notes" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-highlight">
                human–AI interaction
              </a>
              ,{' '}
              <a href="/#design-thinking" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-highlight">
                design thinking for intelligent systems
              </a>
              , and the craft of{' '}
              <a href="/#field-notes" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-highlight">
                frontend engineering
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
