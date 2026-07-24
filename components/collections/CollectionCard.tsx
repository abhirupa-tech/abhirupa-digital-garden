'use client';

import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { CoverImage } from '../CoverImage';
import { TypeBadge } from '../TypeBadge';
import { HoverLink, AnimatedTitle } from '../motion/HoverLink';

/**
 * A single blog preview on a /collections/<type> page. Each entry is rendered
 * in the visual language of its *source section*, and the three designs are
 * deliberately distinct so a mixed masonry still reads at a glance:
 *   • field-notes    → image card (thumbnail + brief)
 *   • design-thinking → brain-marked idea card, no imagery
 *   • the-practice    → text-only index card with a "Read →" affordance
 * Cards size to their content so they pack like tetris in the page's columns.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Line-art brain — the mark for design-thinking pieces.
const brainIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path {...stroke} d="M12 6.2V18.6" />
    <path
      {...stroke}
      d="M12 6.2a3 3 0 0 0-5.7-1.3A2.6 2.6 0 0 0 3.7 7.7 2.7 2.7 0 0 0 3 11.3a2.8 2.8 0 0 0 1.3 3.8A2.6 2.6 0 0 0 8 18.9a3 3 0 0 0 4 -.3"
    />
    <path
      {...stroke}
      d="M12 6.2a3 3 0 0 1 5.7-1.3A2.6 2.6 0 0 1 20.3 7.7 2.7 2.7 0 0 1 21 11.3a2.8 2.8 0 0 1-1.3 3.8A2.6 2.6 0 0 1 16 18.9a3 3 0 0 1-4 -.3"
    />
  </svg>
);

function Meta({ entry }: { entry: ContentEntry }) {
  return (
    <div className="flex items-center gap-2">
      <TypeBadge type={entry.type} />
      {entry.date && (
        <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
      )}
    </div>
  );
}

export function CollectionCard({ entry }: { entry: ContentEntry }) {
  const href = `/${entry.section}/${entry.slug}`;

  // Field Notes → image card (thumbnail on top, brief beneath).
  if (entry.section === 'field-notes') {
    return (
      <HoverLink
        href={href}
        className="group block overflow-hidden rounded-2xl border border-black/10 bg-[#f9f8f4]"
      >
        <CoverImage
          src={entry.cover}
          alt={entry.title}
          ratio="landscape"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="p-4">
          <Meta entry={entry} />
          <h3 className="mt-2">
            <AnimatedTitle className="font-rounded text-xl leading-snug">
              {entry.title}
            </AnimatedTitle>
          </h3>
          <p className="mt-2 line-clamp-3 font-rounded text-sm leading-relaxed text-parchment/80">
            {entry.description}
          </p>
        </div>
      </HoverLink>
    );
  }

  // Design Thinking → idea card marked with a brain glyph; never an image.
  if (entry.section === 'design-thinking') {
    return (
      <HoverLink
        href={href}
        className="group block rounded-2xl border border-rust/20 bg-[#fbe8dd] p-5"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rust/30 bg-rust/10 text-rust">
            {brainIcon}
          </span>
          <span className="label text-rust-deep">Design Thinking</span>
        </div>
        <div className="mt-4">
          <Meta entry={entry} />
        </div>
        <h3 className="mt-2">
          <AnimatedTitle className="font-rounded text-xl leading-snug">
            {entry.title}
          </AnimatedTitle>
        </h3>
        <p className="mt-2 line-clamp-4 font-rounded text-sm leading-relaxed text-parchment-muted">
          {entry.description}
        </p>
      </HoverLink>
    );
  }

  // The Practice (and any other) → text-only index card, no imagery, no icon.
  return (
    <HoverLink
      href={href}
      className="group block rounded-2xl border border-parchment/12 bg-[#f9f8f5]/60 p-5"
    >
      <Meta entry={entry} />
      <h3 className="mt-3">
        <AnimatedTitle className="font-rounded text-xl leading-tight">
          {entry.title}
        </AnimatedTitle>
      </h3>
      <p className="mt-2 line-clamp-3 font-rounded text-sm leading-relaxed text-parchment-muted">
        {entry.description}
      </p>
      <span className="label mt-4 inline-block text-sand/80">Read →</span>
    </HoverLink>
  );
}
