import type { ReactNode } from 'react';

/** Maps markdown's `p` — the body text workhorse. */
export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="mb-8 font-serif text-2xl font-light leading-[1.8] text-[#eef0f2]/90 last:mb-0">
      {children}
    </p>
  );
}
