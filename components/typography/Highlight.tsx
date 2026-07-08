import type { ReactNode } from 'react';

/** Inline emphasis wash — explicit-only, no markdown shorthand for this. */
export function Highlight({ children }: { children: ReactNode }) {
  return <mark className="rounded-sm bg-sand/25 px-1 text-parchment">{children}</mark>;
}
