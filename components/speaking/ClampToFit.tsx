'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Fills the space its flex parent gives it and clamps the text with "…" so it
 * never grows the card. Clamping only applies from `minWidth` up (where the
 * card sits beside another one); below that the full text shows.
 */
export function ClampToFit({
  children,
  className = '',
  innerClassName = '',
  minWidth = '64rem',
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  minWidth?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const mq = window.matchMedia(`(min-width: ${minWidth})`);

    const fit = () => {
      i.style.webkitLineClamp = '';
      i.style.display = '';
      if (!mq.matches) return;
      const lh = parseFloat(getComputedStyle(i).lineHeight) || 28;
      let n = Math.max(1, Math.floor(o.clientHeight / lh));
      i.style.display = '-webkit-box';
      i.style.webkitBoxOrient = 'vertical';
      i.style.webkitLineClamp = String(n);
      // Paragraph gaps take height the line count ignores; trim until the
      // clamped box (offsetHeight, not scrollHeight) fits.
      while (n > 1 && i.offsetHeight > o.clientHeight + 1) {
        n -= 1;
        i.style.webkitLineClamp = String(n);
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    mq.addEventListener('change', fit);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', fit);
    };
  }, [minWidth]);

  return (
    <div ref={outer} className={`min-h-0 overflow-hidden ${className}`}>
      <div ref={inner} className={`overflow-hidden ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
