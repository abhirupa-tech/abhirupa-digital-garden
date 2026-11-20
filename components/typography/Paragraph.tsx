import type { ReactNode } from 'react';

/** Maps markdown's `p` — the body text workhorse. */
export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 font-rounded text-[1.15rem] font-normal leading-[1.7] text-parchment last:mb-0 sm:mb-8 sm:text-[1.2rem]">
      {children}
    </p>
  );
}
