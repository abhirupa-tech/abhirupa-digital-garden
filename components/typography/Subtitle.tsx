import type { ReactNode } from 'react';

/**
 * Dek/standfirst line — sits under a Heading, no markdown equivalent. When
 * used in an MDX body its multi-line text arrives already wrapped in a
 * Paragraph-rendered `p`, so the root here is a `div` (a `p` can't legally
 * contain another `p`) with a `[&_p]` override carrying the same look.
 * 1.6rem from `sm` up, stepped down on phones so a long dek doesn't fill
 * the first screen; dark grey (secondary-text) at regular weight.
 */
export function Subtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mt-4 font-rounded text-[1.35rem] font-normal not-italic leading-snug tracking-tight text-secondary-text sm:text-[1.6rem] [&_p]:mb-0 [&_p]:font-rounded [&_p]:text-[1.35rem] [&_p]:font-normal [&_p]:not-italic [&_p]:leading-snug [&_p]:tracking-tight [&_p]:text-secondary-text sm:[&_p]:text-[1.6rem] ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
