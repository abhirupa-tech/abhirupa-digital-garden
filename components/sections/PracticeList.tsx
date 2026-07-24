'use client';

import { motion, type Variants } from 'framer-motion';
import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { Reveal } from '../motion/Reveal';
import { HoverLink, AnimatedTitle, HoverDivider } from '../motion/HoverLink';
import { TypeBadge } from '../TypeBadge';
import { SectionHeader } from './SectionHeader';

const RUST = '#d1480f';

// Number + arrow warm to rust alongside the title, driven by the link's
// rest/hover variant state (see HoverLink).
const numberVariants: Variants = {
  rest: { color: 'rgb(29 58 99 / 0.8)' },
  hover: { color: RUST },
};
const arrowVariants: Variants = {
  rest: { color: '#605a50', x: 0 },
  hover: { color: RUST, x: 4 },
};

/**
 * Format: a vertical index list — a table-of-contents feel, no imagery.
 * Proves that not every section needs a picture to have presence.
 */
export function PracticeList({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const items = entries.slice(0, 4);
  return (
    <div>
      <SectionHeader zone={zone} from="left" />

      <Reveal from="left" delay={0.1} as="ol" className="mt-9 border-t border-parchment/12">
        {items.map((entry, i) => (
          <li key={entry.slug}>
            <HoverLink
              href={`/${entry.section}/${entry.slug}`}
              className="relative -mx-3 flex items-baseline gap-5 rounded-xl px-3 py-5"
            >
              <motion.span
                variants={numberVariants}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 shrink-0 font-display text-sm tabular-nums"
              >
                {String(i + 1).padStart(2, '0')}
              </motion.span>
              <span className="flex-1">
                <AnimatedTitle className="font-rounded text-xl leading-tight">
                  {entry.title}
                </AnimatedTitle>
                <span className="mt-1.5 flex items-center gap-2">
                  <TypeBadge type={entry.type} />
                  {entry.date && (
                    <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
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
          </li>
        ))}
      </Reveal>
    </div>
  );
}
