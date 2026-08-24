'use client';

import { motion, type Variants } from 'framer-motion';
import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { CoverImage } from './CoverImage';
import { TypeBadge } from './TypeBadge';
import { Reveal } from './motion/Reveal';
import { HoverLink, AnimatedTitle, HoverDivider } from './motion/HoverLink';
import { SectionHeader } from './sections/SectionHeader';
import { ViewAllLink } from './sections/ViewAllLink';

// Index number + arrow warm to the highlight alongside the title, driven by the
// link's rest/hover variant state — matching the Practice list exactly. Colors
// read through the theme tokens (accent / faint-text / highlight) so the rest
// state stays legible on both the light and dark canvas.
const numberVariants: Variants = {
  rest: { color: 'var(--c-accent)' },
  hover: { color: 'var(--c-highlight)' },
};
const arrowVariants: Variants = {
  rest: { color: 'var(--c-faint-text)', x: 0 },
  hover: { color: 'var(--c-highlight)', x: 4 },
};

/** The one featured piece — image, and up to five lines of subtext. */
function HeroCard({ item }: { item: ContentEntry }) {
  return (
    <Reveal from="left">
      <HoverLink
        href={`/${item.section}/${item.slug}/`}
        className="group block rounded-xl border border-parchment/10 bg-[#f9f6e9] p-3 backdrop-blur-[2px] dark:bg-secondary-bg"
      >
        <div className="overflow-hidden rounded-lg">
          <CoverImage
            src={item.cover}
            alt={item.title}
            ratio="cinematic"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="px-0.5 pt-4">
          <div className="flex items-center gap-2">
            <TypeBadge type={item.type} />
            {item.date && (
              <time className="label text-parchment-faint">{formatDate(item.date)}</time>
            )}
          </div>
          <h3 className="mt-3">
            <AnimatedTitle className="t-card-title">
              {item.title}
            </AnimatedTitle>
          </h3>
          <p className="mt-3 line-clamp-4 t-card-sub text-parchment/85">
            {item.description}
          </p>
        </div>
      </HoverLink>
    </Reveal>
  );
}

/**
 * A single clean index row: a small type · date label, the title, and an arrow
 * that slides on hover. No imagery, no ragged descriptions — every row is the
 * same shape, so the list reads as one uniform, minimal set beneath the hero.
 */
function EntryRow({ item, index, delay }: { item: ContentEntry; index: number; delay: number }) {
  return (
    <Reveal from="right" delay={delay}>
      <HoverLink
        href={`/${item.section}/${item.slug}/`}
        className="group relative -mx-3 flex items-baseline gap-5 rounded-xl px-3 py-4"
      >
        <motion.span
          variants={numberVariants}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 shrink-0 font-display text-sm tabular-nums"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        <span className="min-w-0 flex-1">
          <AnimatedTitle className="t-card-title">
            {item.title}
          </AnimatedTitle>
          <span className="mt-1.5 flex items-center gap-2">
            <TypeBadge type={item.type} />
            {item.date && (
              <time className="label text-parchment-faint">{formatDate(item.date)}</time>
            )}
          </span>
        </span>
        <motion.span
          variants={arrowVariants}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="translate-y-[2px]"
        >
          →
        </motion.span>
        <HoverDivider />
      </HoverLink>
    </Reveal>
  );
}

export function KnowledgeLibrary({
  zone,
  entries,
  /**
   * `split` (default) lays the hero card and the row list side by side —
   * used when this section owns a full-width row. `stacked` puts the hero
   * "model" on top with the rows in a single column beneath it — used when
   * the section sits in the narrower left column of a shared row.
   */
  layout = 'split',
}: {
  zone: Zone;
  entries: ContentEntry[];
  layout?: 'split' | 'stacked';
}) {
  const [hero, ...rest] = entries;
  // Hero + rows. The stacked column runs vertically, so it shows fewer rows to
  // stay balanced against its neighbor; the split layout can hold more.
  const rows = rest.slice(0, layout === 'stacked' ? 5 : 7);

  if (!hero) {
    return (
      <div>
        <SectionHeader zone={zone} />
      </div>
    );
  }

  if (layout === 'stacked') {
    return (
      <div>
        <SectionHeader zone={zone} />
        <div className="mt-8">
          <HeroCard item={hero} />
        </div>
        {rows.length > 0 && (
          <div className="mt-4 border-t border-parchment/12">
            {rows.map((item, i) => (
              <EntryRow key={item.slug} item={item} index={i} delay={0.06 * i} />
            ))}
            <Reveal from="right" delay={0.06 * rows.length} className="mt-4 px-3">
              <ViewAllLink href={`/${zone.id}/`} count={entries.length} />
            </Reveal>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-start">
        {/* Left column: the section heading sits directly above the hero
            card, so the right column's row list — which starts at the
            same grid row — begins level with the heading, not the card. */}
        <div className="lg:col-span-6">
          <SectionHeader zone={zone} />
          <div className="mt-8">
            <HeroCard item={hero} />
          </div>
        </div>

        {rows.length > 0 && (
          <div className="lg:col-span-6">
            {rows.map((item, i) => (
              <EntryRow key={item.slug} item={item} index={i} delay={0.08 * i} />
            ))}
            <Reveal from="right" delay={0.08 * rows.length} className="mt-6 px-3">
              <ViewAllLink href={`/${zone.id}/`} count={entries.length} />
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
