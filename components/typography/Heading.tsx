import { Children, isValidElement, type ReactNode } from 'react';

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
  2: 'font-subhead text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.2] tracking-[0.2px]',
  3: 'font-subhead text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.2] tracking-[0.2px]',
};

const tags = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

/** Plain text of a heading's children, through any inline elements. */
function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return '';
    })
    .join('');
}

/** "Where this architecture still gets criticized" -> "where-this-architecture-still-gets-criticized" */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = tags[level];
  // In-body headings get a stable id, so the contents rail and shared links
  // can jump straight to a section.
  const id = level > 1 ? slugify(textOf(children)) || undefined : undefined;
  return (
    <Tag id={id} className={`scroll-mt-24 text-parchment ${sizes[level]} ${className ?? ''}`}>
      {children}
    </Tag>
  );
}
