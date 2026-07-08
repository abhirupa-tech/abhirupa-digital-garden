import type { ReactNode } from 'react';

/** Dek/standfirst line — sits under a Heading, no markdown equivalent. */
export function Subtitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`mt-3 font-rounded text-lg font-light not-italic leading-tight tracking-tight text-parchment-muted ${className ?? ''}`}
    >
      {children}
    </p>
  );
}
