import type { ReactNode } from 'react';

/**
 * Bold, minimal glyphs for each kind of piece — drawn on a 24×24 grid with a
 * thick 2px stroke so they read clearly even at chip size. `currentColor` lets
 * the surrounding text color show through. Shared across the home page so a
 * book, paper, post, or essay always carries the same mark.
 */
const icons: Record<string, ReactNode> = {
  book: (
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v15H5.5A1.5 1.5 0 0 0 4 20.5V5.5ZM20 5.5A1.5 1.5 0 0 0 18.5 4H12v15h6.5a1.5 1.5 0 0 1 1.5 1.5V5.5Z" />
  ),
  paper: (
    <>
      <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8h4.5M8 12h8M8 15.5h8M8 8.5h3" />
    </>
  ),
  post: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
      <path d="M8 8.5h8M8 11.5h5" />
    </>
  ),
  essay: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 2.8 2.8L7.9 18.9 4 20Z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  playbook: (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 5 4.5V18c3.5 0 5.5.5 7 2 1.5-1.5 3.5-2 7-2V4.5c-3.5 0-5.5.5-7 2Z" />
      <path d="M12 6.5V20" />
    </>
  ),
  art: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 2-1 2-2 0-1.4-1-1.6-1-3 0-1 .9-2 2.2-2H18a3 3 0 0 0 3-3c0-4.2-4-7-9-7Z" />
      <circle cx="8" cy="10" r="1.1" />
      <circle cx="12" cy="7.5" r="1.1" />
      <circle cx="16" cy="10" r="1.1" />
    </>
  ),
  default: <path d="M6 3.5h12v17l-6-3.5-6 3.5v-17Z" />,
};

/** Map a piece's free-text `type` onto a glyph. */
function iconFor(type: string): ReactNode {
  const t = type.toLowerCase();
  if (t.includes('book')) return icons.book;
  if (t.includes('paper') || t.includes('research')) return icons.paper;
  if (t.includes('post') || t.includes('blog') || t.includes('note')) return icons.post;
  if (t.includes('playbook')) return icons.playbook;
  if (t.includes('essay') || t.includes('guide') || t.includes('article')) return icons.essay;
  if (t.includes('art')) return icons.art;
  return icons.default;
}

export function TypeGlyph({ type, className }: { type: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {iconFor(type)}
    </svg>
  );
}
