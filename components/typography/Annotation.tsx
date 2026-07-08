'use client';

import { useState, type ReactNode } from 'react';

type AnnotationProps = {
  trigger: ReactNode;
  note: ReactNode;
  triggerClassName?: string;
};

/**
 * Shared hover/focus/tap tooltip primitive powering Subnote and Citation.
 * The note grows in above the trigger on hover or keyboard focus, and on
 * touch devices a tap toggles it — never obscures the trigger itself.
 */
export function Annotation({ trigger, note, triggerClassName }: AnnotationProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`cursor-help align-baseline focus-visible:outline-none ${triggerClassName ?? ''}`}
      >
        {trigger}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-xs origin-bottom -translate-x-1/2 rounded-sm border border-parchment/15 bg-ink-800/95 px-3 py-2 text-left font-body text-sm leading-snug text-parchment-muted shadow-lg backdrop-blur-sm transition-all duration-200 ease-out ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {note}
      </span>
    </span>
  );
}
