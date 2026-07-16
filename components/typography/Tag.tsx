import type { ReactNode } from 'react';

/** A tiny pill — muted burnt-orange fill, white text, readable at label size. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="label inline-block rounded-full bg-rust px-3 py-1 text-[0.65rem] font-medium tracking-label text-white">
      {children}
    </span>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="my-6 flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}
