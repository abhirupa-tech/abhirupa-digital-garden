import type { ReactNode } from 'react';

type QuoteProps = {
  children: ReactNode;
  attribution?: string;
};

/**
 * Maps markdown's `blockquote` (`> …`) and is also usable directly. Markdown
 * quotes arrive with their text already wrapped in a Paragraph, so the pull-
 * quote type treatment is applied both to the blockquote itself (for plain
 * string children) and via a `[&_p]` override (for the nested Paragraph,
 * whose own classes would otherwise win on specificity).
 */
export function Quote({ children, attribution }: QuoteProps) {
  return (
    <blockquote className="my-8 border-l border-sand/25 pl-8 font-serif text-2xl font-light italic leading-relaxed tracking-tight text-parchment/95 sm:my-14 md:text-3xl [&_p]:mb-0 [&_p]:font-serif [&_p]:text-2xl [&_p]:font-light [&_p]:italic [&_p]:leading-relaxed [&_p]:tracking-tight [&_p]:text-parchment/95 md:[&_p]:text-3xl">
      {children}
      {attribution && (
        <cite className="label mt-4 block not-italic text-parchment-faint">— {attribution}</cite>
      )}
    </blockquote>
  );
}
