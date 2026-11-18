import type { ReactNode } from 'react';
import { tagSlug } from '@/lib/format';

/** A tiny pill — muted burnt-orange fill, white text, readable at label size. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="label inline-block rounded-full bg-rust px-3 py-1 text-[0.75rem] font-medium tracking-label text-white">
      {children}
    </span>
  );
}

/**
 * A piece's topics as Medium-style pills (soft tinted fill, fully rounded),
 * each opening the Writing index filtered to that topic.
 */
export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="my-6 flex flex-wrap gap-2" aria-label="Topics">
      {tags.map((t) => (
        <li key={t}>
          <a
            href={`/writing/?topic=${tagSlug(t)}`}
            className="inline-block rounded-full bg-black/[0.05] px-3.5 py-1.5 font-rounded text-sm leading-none text-parchment/80 transition-colors duration-200 hover:bg-black/[0.09] hover:text-parchment focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
          >
            {t}
          </a>
        </li>
      ))}
    </ul>
  );
}
