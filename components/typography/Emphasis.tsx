import type { ReactNode } from 'react';

/** Maps markdown's `strong` / `em`. */
export function Bold({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-parchment">{children}</strong>;
}

export function Italic({ children }: { children: ReactNode }) {
  return <em className="italic text-parchment/95">{children}</em>;
}
