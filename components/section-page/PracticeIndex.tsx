'use client';

import { motion, type Variants } from 'framer-motion';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { Reveal } from '../motion/Reveal';
import { HoverLink, AnimatedTitle, HoverDivider } from '../motion/HoverLink';
import { TypeBadge } from '../TypeBadge';

const RUST = '#d1480f';
const EASE = [0.16, 1, 0.3, 1] as const;

const indexVariants: Variants = {
  rest: { color: 'rgb(29 58 99 / 0.45)' },
  hover: { color: RUST },
};
const arrowVariants: Variants = {
  rest: { color: '#605a50', x: 0 },
  hover: { color: RUST, x: 6 },
};

/**
 * The Practice archive: a large-type editorial index, no imagery. Each row
 * steps a little further right than the last, so the list reads as a cascade
 * rather than a stack — the section's home-page "table of contents" character,
 * scaled up to fill its own page. Descriptions ride along for context.
 */
export function PracticeIndex({ entries }: { entries: ContentEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <ol className="mt-10 border-t border-parchment/12 md:mt-12">
      {entries.map((entry, i) => (
        <Reveal
          key={`${entry.section}/${entry.slug}`}
          delay={0.06 * i}
          as="li"
          // Cascade: every third row resets, so the indent never runs off-screen.
          className={['', 'md:pl-10', 'lg:pl-24'][i % 3]}
        >
          <HoverLink
            href={`/${entry.section}/${entry.slug}/`}
            className="group relative block py-5 md:py-6"
          >
            <div className="flex items-baseline gap-5 md:gap-8">
              <motion.span
                variants={indexVariants}
                transition={{ duration: 0.4, ease: EASE }}
                className="shrink-0 font-rounded text-xl font-medium tabular-nums md:text-2xl"
              >
                {String(i + 2).padStart(2, '0')}
              </motion.span>

              <div className="min-w-0 flex-1">
                <AnimatedTitle className="font-rounded text-xl font-medium leading-snug md:text-2xl">
                  {entry.title}
                </AnimatedTitle>

                <div className="mt-2 flex items-center gap-3">
                  <TypeBadge type={entry.type} />
                  {entry.date && (
                    <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
                  )}
                </div>

                {entry.description && (
                  <p className="mt-2 max-w-2xl font-rounded text-base leading-relaxed text-parchment/70">
                    {entry.description}
                  </p>
                )}
              </div>

              <motion.span
                variants={arrowVariants}
                transition={{ duration: 0.4, ease: EASE }}
                className="shrink-0 self-center text-xl"
              >
                →
              </motion.span>
            </div>
            <HoverDivider />
          </HoverLink>
        </Reveal>
      ))}
    </ol>
  );
}
