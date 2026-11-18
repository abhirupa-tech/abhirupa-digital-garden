import type { ReactNode } from 'react';

type QuoteProps = {
  children: ReactNode;
  attribution?: string;
};

/**
 * A pull quote in the Medium style: large, light-grey sans text, no italics,
 * with a thin rule on the left. The blockquote has no left margin, so the
 * rule sits exactly on the body column's left edge. Maps markdown's `blockquote`
 * (`> …`) and is usable directly. Markdown quotes arrive wrapped in a
 * Paragraph, so the same treatment is applied to nested `p` through `[&_p]`
 * (the Paragraph's own classes would otherwise win on specificity).
 */
export function Quote({ children, attribution }: QuoteProps) {
  return (
    <blockquote className="my-8 border-l-2 border-parchment/20 pl-5 font-rounded text-[1.45rem] font-normal leading-[1.45] text-parchment-muted sm:my-12 sm:pl-7 md:text-[1.75rem] [&_p]:mb-0 [&_p]:font-rounded [&_p]:text-[1.45rem] [&_p]:font-normal [&_p]:leading-[1.45] [&_p]:text-parchment-muted md:[&_p]:text-[1.75rem]">
      {children}
      {attribution && (
        <cite className="mt-4 block font-rounded text-base not-italic text-parchment-faint">
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}
