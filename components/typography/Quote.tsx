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
    <blockquote className="my-8 border-l-2 border-sand/50 pl-6 font-display text-2xl italic leading-snug text-parchment [&_p]:mb-0 [&_p]:font-display [&_p]:text-2xl [&_p]:italic [&_p]:leading-snug [&_p]:text-parchment">
      {children}
      {attribution && (
        <cite className="label mt-4 block not-italic text-parchment-faint">— {attribution}</cite>
      )}
    </blockquote>
  );
}
