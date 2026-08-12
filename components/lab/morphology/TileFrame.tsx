import type { ReactNode } from 'react';

/**
 * Shared chrome for a morphology bento tile: a hairline card carrying a small
 * eyebrow label + one-line descriptor at the top, and the component demo below.
 * `className` lets the composition set grid spans. Purely presentational.
 */
export function TileFrame({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-black/[0.12] bg-secondary-bg/40 p-5 dark:border-white/[0.08] md:p-6 ${className}`}
    >
      <div className="mb-4">
        <span className="label text-parchment-faint">{label}</span>
        <p className="mt-1 font-rounded text-sm leading-snug text-parchment-muted">{hint}</p>
      </div>
      <div className="flex flex-1 items-center">{children}</div>
    </div>
  );
}
