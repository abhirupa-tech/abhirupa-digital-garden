import type { ContentEntry } from '@/lib/content';
import { site } from '@/lib/site';
import { RelatedPosts } from './RelatedPosts';

/**
 * The end-of-article block:
 *  1. A thin "buy me a coffee" card — the quiet thank-you at the piece's end.
 *  2. "If you liked this…" — three related pieces as cover cards, spreading
 *     link equity across the site and keeping readers in the garden.
 *  3. A Medium attribution note, when the piece was first published there.
 */
export function ArticleFooter({
  entry,
  related,
}: {
  entry: ContentEntry;
  related: ContentEntry[];
}) {
  return (
    <footer className="zone-article mt-14 border-t border-parchment/12 pt-8 sm:mt-24 sm:pt-12">
      <a
        href={site.coffee}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-10 flex items-center gap-3 rounded-full border border-parchment/15 px-5 py-3 transition-colors duration-300 hover:border-rust-soft sm:mb-16"
      >
        <span aria-hidden="true" className="text-xl leading-none">☕</span>
        <span className="font-rounded text-base text-parchment-muted">
          Love what you read?{' '}
          <span className="whitespace-nowrap text-parchment underline decoration-parchment/30 underline-offset-4 transition-colors duration-300 group-hover:text-rust-soft group-hover:decoration-rust-soft/60">
            Buy me a coffee
          </span>
        </span>
        <span aria-hidden="true" className="ml-auto text-parchment-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-rust-soft">→</span>
      </a>

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
