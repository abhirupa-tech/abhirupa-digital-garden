import type { ReactNode } from 'react';

/** Maps markdown's `p` — the body text workhorse. */
export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="mb-8 font-rounded text-[1.15rem] font-normal leading-[1.6] text-parchment last:mb-0">
      {children}
    </p>
  );
}
