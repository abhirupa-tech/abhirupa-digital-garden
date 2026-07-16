import type { ReactNode } from 'react';

/**
 * Dek/standfirst line — sits under a Heading, no markdown equivalent. When
 * used in an MDX body its multi-line text arrives already wrapped in a
 * Paragraph-rendered `p`, so the root here is a `div` (a `p` can't legally
 * contain another `p`) with a `[&_p]` override carrying the same look.
 */
export function Subtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mt-3 font-rounded text-lg font-light not-italic leading-tight tracking-tight text-parchment-muted [&_p]:mb-0 [&_p]:font-rounded [&_p]:text-lg [&_p]:font-light [&_p]:not-italic [&_p]:leading-tight [&_p]:tracking-tight [&_p]:text-parchment-muted ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
