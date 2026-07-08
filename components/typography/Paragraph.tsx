import type { ReactNode } from 'react';

/** Maps markdown's `p` — the body text workhorse. */
export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 font-body text-lg leading-relaxed text-parchment/90 last:mb-0">
      {children}
    </p>
  );
}
