/**
 * Flat geometric shapes for the Speaking page's poster grid: an eight-armed
 * asterisk, a two-circle "metaball" blob, and quarter / half discs. Purely
 * decorative — every one is aria-hidden and takes its color from
 * `currentColor` or a className.
 */

export function Asterisk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="13" strokeLinecap="round">
        <path d="M50 10v80M10 50h80M21.7 21.7l56.6 56.6M78.3 21.7 21.7 78.3" />
      </g>
    </svg>
  );
}

/** Two circles fused by a thick stroke — the soft blob from a conference poster. */
export function Blob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 200" aria-hidden="true" className={className} fill="currentColor">
      <circle cx="68" cy="62" r="52" />
      <circle cx="126" cy="76" r="26" />
      <circle cx="46" cy="150" r="40" />
      <path d="M68 62 126 76M68 62 46 150" stroke="currentColor" strokeWidth="46" strokeLinecap="round" />
    </svg>
  );
}

type Corner = 'tl' | 'tr' | 'bl' | 'br';
const quarterRadius: Record<Corner, string> = {
  tl: 'rounded-tl-full',
  tr: 'rounded-tr-full',
  bl: 'rounded-bl-full',
  br: 'rounded-br-full',
};

/** A quarter disc; `corner` is the rounded corner. Size and color via className. */
export function Quarter({ corner, className }: { corner: Corner; className?: string }) {
  return <span aria-hidden="true" className={`block aspect-square ${quarterRadius[corner]} ${className ?? ''}`} />;
}

/** A half disc, flat edge down. */
export function Half({ className }: { className?: string }) {
  return <span aria-hidden="true" className={`block aspect-[2/1] rounded-t-full ${className ?? ''}`} />;
}
