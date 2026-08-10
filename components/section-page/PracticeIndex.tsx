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
 * The Practice archive: a large-type editorial index, no imagery. Pieces run in
 * plain reading order — a straight list that flows into two columns on wider
 * screens (rows × two columns), so a long archive stays compact without ever
 * staggering or indenting. Descriptions ride along for context.
 */
export function PracticeIndex({ entries }: { entries: ContentEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <ol className="mt-10 grid border-t border-parchment/12 sm:grid-cols-2 sm:gap-x-12 md:mt-12">
      {entries.map((entry, i) => (
        <Reveal key={`${entry.section}/${entry.slug}`} delay={0.06 * i} as="li">
          <HoverLink
            href={`/${entry.section}/${entry.slug}/`}
            className="group relative block py-5 md:py-6"
          >
            <div className="flex items-start gap-5 md:gap-8">
              {/* Same size + line-height as the title, top-aligned, so the
                  number sits on the title's first line even when it wraps. */}
              <motion.span
                variants={indexVariants}
                transition={{ duration: 0.4, ease: EASE }}
                className="shrink-0 font-rounded text-xl font-medium leading-snug tabular-nums md:text-2xl"
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
                  <p className="mt-2 max-w-2xl font-rounded text-sm leading-relaxed text-parchment/70 md:text-base">
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
