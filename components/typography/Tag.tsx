import type { ReactNode } from 'react';

/** A tiny pill — muted burnt-orange fill, white text, readable at label size. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="label inline-block rounded-full bg-rust px-3 py-1 text-[0.75rem] font-medium tracking-label text-white">
      {children}
    </span>
  );
}

/**
 * A piece's topics as quiet text links, each opening the Writing index
 * filtered to that topic.
 */
export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="my-6 flex flex-wrap gap-x-4 gap-y-1" aria-label="Topics">
      {tags.map((t) => (
        <li key={t}>
          <a
            href={`/writing/?topic=${encodeURIComponent(t)}`}
            className="font-rounded text-sm text-rust underline decoration-rust/0 underline-offset-4 transition-colors duration-200 hover:decoration-rust/60"
          >
            #{t}
          </a>
        </li>
      ))}
    </ul>
  );
}
