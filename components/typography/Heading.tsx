import type { ReactNode } from 'react';

type HeadingProps = {
  /** 1 = page masthead title; 2 = an in-body subsection break. */
  level?: 1 | 2;
  children: ReactNode;
  className?: string;
};

const sizes: Record<NonNullable<HeadingProps['level']>, string> = {
  1: 'font-display text-section font-medium',
  2: 'font-display text-2xl md:text-3xl font-medium',
};

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <Tag className={`text-parchment ${sizes[level]} ${className ?? ''}`}>{children}</Tag>
  );
}
