import type { ReactNode } from 'react';

/** A tiny pill — styling lifted from the tag treatment in KnowledgeLibrary. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="label inline-block rounded-full border border-parchment/30 px-3 py-1 text-[0.6rem] text-parchment-muted">
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
