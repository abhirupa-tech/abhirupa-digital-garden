import type { ReactNode } from 'react';

/**
 * Inline emphasis wash — explicit-only, no markdown shorthand for this.
 * Carries the body's own font/size explicitly (mark doesn't inherit it by
 * default), so it matches whether used inline mid-sentence or as its own
 * standalone block.
 */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-xs bg-[#fce0c0] px-1 font-rounded text-[1.02rem] leading-[1.6] text-parchment sm:text-[1.15rem]">
      {children}
    </mark>
  );
}
