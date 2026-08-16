import type { ContentEntry } from '@/lib/content';
import { RelatedPosts } from './RelatedPosts';

/**
 * The end-of-article block:
 *  1. "If you liked this…" — three related pieces as cover cards, spreading
 *     link equity across the site and keeping readers in the garden.
 *  2. A Medium attribution note, when the piece was first published there.
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
    </footer>
  );
}
