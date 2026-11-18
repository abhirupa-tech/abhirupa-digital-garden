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
  // a sturdy display serif (Young Serif, single weight), so the hierarchy is
  // title > subheading > body without faux-bolding.
  1: 'font-display text-section font-medium',
  2: 'font-subhead text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.2] tracking-[-0.005em]',
  3: 'font-subhead text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.2] tracking-[-0.005em]',
};

const tags = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = tags[level];
  return (
    <Tag className={`text-parchment ${sizes[level]} ${className ?? ''}`}>{children}</Tag>
  );
}
