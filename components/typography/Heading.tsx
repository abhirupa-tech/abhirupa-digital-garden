import type { ReactNode } from 'react';

type HeadingProps = {
  /** 1 = page masthead title; 2 = a section break; 3 = a lighter subsection. */
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
};

const sizes: Record<NonNullable<HeadingProps['level']>, string> = {
  // Level 1 is the article masthead — stays on the display serif.
  // Levels 2–3 are in-body sub-headings — set on the rounded sans (Quicksand).
  1: 'font-display text-section font-medium',
  2: 'font-rounded text-2xl md:text-3xl font-bold',
  3: 'font-rounded text-xl md:text-2xl font-bold text-parchment/90',
};

const tags = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = tags[level];
  return (
    <Tag className={`text-parchment ${sizes[level]} ${className ?? ''}`}>{children}</Tag>
  );
}
