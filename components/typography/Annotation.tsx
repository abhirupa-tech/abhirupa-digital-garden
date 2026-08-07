'use client';

import { useState, type ReactNode } from 'react';

type AnnotationProps = {
  trigger: ReactNode;
  note: ReactNode;
  triggerClassName?: string;
  /** Render a small round "i" info badge just before the trigger. */
  icon?: boolean;
  /** Typography classes for the note bubble; falls back to the citation default. */
  noteClassName?: string;
};

/**
 * Shared hover/focus/tap tooltip primitive powering Subnote and Citation.
 * The note grows in above the trigger on hover or keyboard focus, and on
 * touch devices a tap toggles it — never obscures the trigger itself.
 */
export function Annotation({ trigger, note, triggerClassName, icon, noteClassName }: AnnotationProps) {
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
        className={`cursor-help align-baseline focus-visible:outline-hidden ${
          icon ? 'inline-flex items-center' : ''
        } ${triggerClassName ?? ''}`}
      >
        {icon && (
          <span
            aria-hidden="true"
            className="mr-[0.35em] inline-flex h-[1.05em] w-[1.05em] items-center justify-center rounded-full border border-sand/60 bg-sand/10 font-rounded text-[0.62em] font-semibold not-italic leading-none text-sand"
          >
            i
          </span>
        )}
        {trigger}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-xs origin-bottom -translate-x-1/2 rounded-xs border border-sand/20 bg-ink-800/95 px-3 py-2 text-left leading-snug shadow-lg backdrop-blur-xs transition-all duration-200 ease-out ${
          noteClassName ?? 'font-body text-sm text-parchment-muted'
        } ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {note}
      </span>
    </span>
  );
}
