import type { ReactNode } from 'react';

type HeadingProps = {
  /** 1 = page masthead title; 2 and 3 = in-body subheadings (same size). */
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
};

const sizes: Record<NonNullable<HeadingProps['level']>, string> = {
  // Level 1 is the article masthead, on the display serif.
  // Levels 2 and 3 are in-body sub-headings and share ONE size, like Medium:
  // bold sans, slightly tightened, so the hierarchy is title > subheading > body.
  1: 'font-display text-section font-medium',
  2: 'font-rounded text-[1.375rem] md:text-[1.625rem] font-bold leading-snug tracking-[-0.01em]',
  3: 'font-rounded text-[1.375rem] md:text-[1.625rem] font-bold leading-snug tracking-[-0.01em]',
};

const tags = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = tags[level];
  return (
    <Tag className={`text-parchment ${sizes[level]} ${className ?? ''}`}>{children}</Tag>
  );
}
