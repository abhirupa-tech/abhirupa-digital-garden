import type { ReactNode, SVGProps } from 'react';

/**
 * One hand-drawn, single-stroke line-art icon set for the whole About page —
 * facets, the horizontal timeline, and the bento all draw from this map so the
 * pictograms read as a deliberate system rather than assorted SVGs. Same stroke
 * language as the site's nav icons (1.5, round caps). Colour comes from
 * `currentColor`, so callers set the sunset tone.
 */

export type GlyphName =
  | 'spark' // agentic AI
  | 'brackets' // frontend
  | 'compass' // design thinking
  | 'sprout' // slow living
  | 'pin' // location
  | 'pen' // writes
  | 'wrench' // toolbox
  | 'building' // previous employer / office
  | 'hash' // team / channels
  | 'mic' // voice work
  | 'pane' // split-pane / copilot
  | 'calendar'; // tenure / years

const paths: Record<GlyphName, ReactNode> = {
  spark: <path d="M12 3 13.6 9.2 20 11 13.6 12.8 12 19 10.4 12.8 4 11 10.4 9.2Z" />,
  brackets: <path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13 5.5 11 18.5" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z" />
    </>
  ),
  sprout: <path d="M12 21v-8M12 13c0-3 2-5 5-5 0 3-2 5-5 5ZM12 15c0-3-2-4.5-4.5-4.5C7.5 13 9.5 15 12 15Z" />,
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l4-1L18 9l-3-3L5 16z" />
      <path d="M13.5 7.5l3 3" />
    </>
  ),
  wrench: <path d="M14.5 6.5a3.5 3.5 0 0 1-4.7 4.7l-4.6 4.6 2 2 4.6-4.6a3.5 3.5 0 0 0 4.7-4.7l-2 2-2-2z" />,
  building: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="1.5" />
      <path d="M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M10.5 20v-3h3v3" />
    </>
  ),
  hash: <path d="M9 4 7.5 20M16.5 4 15 20M5 9h14M4.5 15h14" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="10.5" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17.5V21M9.5 21h5" />
    </>
  ),
  pane: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M14.5 5v14" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 9.5h16M8 3.5v4M16 3.5v4" />
    </>
  ),
};

export function Glyph({
  name,
  className,
  ...rest
}: { name: GlyphName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
