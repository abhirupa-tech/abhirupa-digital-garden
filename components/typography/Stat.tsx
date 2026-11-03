import type { ReactNode } from 'react';

type StatProps = {
  /** The figure itself, e.g. "152%" or "4,500". */
  value: string;
  /** What the figure measures. */
  label: string;
};

/** One large figure with a short label. Use inside StatRow. */
export function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-parchment/15 pt-4">
      <span className="font-serif text-4xl font-medium leading-none tracking-tight text-highlight sm:text-5xl">
        {value}
      </span>
      <span className="font-rounded text-sm leading-snug text-parchment-muted sm:text-base">
        {label}
      </span>
    </div>
  );
}

/**
 * Two or three Stat figures side by side (stacked on phones), with an optional
 * caption underneath, for numbers that make the argument on their own.
 */
export function StatRow({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8 sm:my-14">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] sm:gap-8">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-rounded text-[0.75rem] uppercase tracking-label text-parchment-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
