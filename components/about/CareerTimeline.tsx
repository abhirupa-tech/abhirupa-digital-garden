'use client';

import type { CSSProperties } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Glyph, type GlyphName } from './Glyph';

/**
 * A horizontal, chronological career timeline — a row of clean, shadowed
 * cards read left-to-right (oldest → now), joined by hand-drawn dashed arcs.
 * Each card carries a numbered badge on its left edge, a year sticker on its
 * top-right corner, a "company | context" line, the role, a short detail, the
 * stack, and a line-art glyph. On scroll the cards rise in sequence and the
 * arcs draw themselves between them; on hover a card lifts a touch and its
 * soft shadow deepens. Cards are plain, outline-free surfaces; each carries a
 * theme-token tint only in its number badge and year sticker. Stacks to two
 * columns, then one (left-aligned), on narrower screens; arcs only show in
 * the 4-up row, xl+. Renders statically under reduced-motion.
 */

type Event = {
  year: string;
  company: string;
  context: string;
  location: string;
  title: string;
  glyph: GlyphName;
  detail: string;
  stack: string[];
  /** Theme token the card is tinted from. */
  tint: string;
};

const EVENTS: Event[] = [
  {
    year: '2020 — 21',
    company: 'Microsoft',
    context: 'Word Web · iOS',
    location: 'Noida',
    title: 'Engineering Intern',
    glyph: 'calendar',
    detail:
      'Voice-to-math expression conversion in Word on the web (speak out equations), and a LUIS-powered intelligent system for an iOS app.',
    stack: ['Speech', 'iOS'],
    tint: 'var(--c-highlight-strong)',
  },
  {
    year: '2021 — 25',
    company: 'Microsoft',
    context: 'Word & Outlook',
    location: 'Noida',
    title: 'Software Engineer',
    glyph: 'mic',
    detail:
      'Voice dictation in Word and Outlook for Android, and a better microphone click funnel — across an Android, shared C++, and Kotlin stack.',
    stack: ['Android', 'C++', 'Kotlin'],
    tint: 'rgb(var(--raw-blush-whisper))',
  },
  {
    year: '2023 — 25',
    company: 'Microsoft',
    context: 'M365 Copilot',
    location: 'Noida',
    title: 'Software Engineer 2',
    glyph: 'pane',
    detail:
      'Performance and UX for the Microsoft Copilot side pane across every M365 Office app and platform — shared ownership of one seamless Copilot experience.',
    stack: ['React', 'TypeScript', 'Relay', 'Fluent UI'],
    tint: 'rgb(var(--raw-teal-whisper))',
  },
  {
    year: '2025 — Now',
    company: 'Slack',
    context: 'Slackforce Intelligence',
    location: 'Bengaluru',
    title: 'Senior Frontend Engineer, SMTS',
    glyph: 'spark',
    detail:
      'Building the Agent Profile View and the Slack Admin pages for Enterprise & Biz users, and wiring Salesforce MCP servers — and the Agents that followed — into Slack.',
    stack: ['React', 'TypeScript', 'MCP'],
    tint: 'var(--c-sunset)',
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER = 0.16;

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const badgeVariants: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { type: 'spring', stiffness: 380, damping: 14, delay: 0.35 } },
};

/** Exposes the card's tint as --tint for its accents (badge, rule). */
function tintStyle(tint: string): CSSProperties {
  return { ['--tint' as string]: tint };
}

const ARC = 'M24 42 C 60 2, 140 2, 176 40';

/** A dashed arc from the centre of card `i` to the centre of card `i + 1`. */
function Arc({ i, reduce }: { i: number; reduce: boolean }) {
  const delay = reduce ? 0 : 0.6 + i * STAGGER + 0.25;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-14 hidden h-12 xl:block"
      style={{ left: `${(i + 0.5) * 25}%`, width: '25%' }}
    >
      <svg viewBox="0 0 200 48" className="h-full w-full overflow-visible text-parchment-muted">
        {/* framer's pathLength drives strokeDasharray, so the dashed arc is
            revealed through a solid, self-drawing mask stroke instead. */}
        <mask id={`arc-mask-${i}`} maskUnits="userSpaceOnUse" x="0" y="-10" width="200" height="70">
          <motion.path
            d={ARC}
            fill="none"
            stroke="#fff"
            strokeWidth={6}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: reduce ? 0 : 0.9, delay, ease: 'easeInOut' }}
          />
        </mask>
        <path
          d={ARC}
          mask={`url(#arc-mask-${i})`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeDasharray="6 7"
        />
        <motion.path
          d="M166 36 L177 41 L179 29"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: reduce ? 0 : 0.3, delay: delay + 0.8 }}
          style={{ transformOrigin: '177px 41px' }}
        />
      </svg>
    </div>
  );
}

export function CareerTimeline() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative mt-12 xl:mt-24">
      {EVENTS.slice(0, -1).map((_, i) => (
        <Arc key={i} i={i} reduce={reduce} />
      ))}

      <motion.ol
        className="grid grid-cols-1 gap-x-8 gap-y-10 pl-5 sm:grid-cols-2 sm:gap-x-12 xl:grid-cols-4 xl:gap-x-7"
        variants={listVariants}
        initial={reduce ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
      >
        {EVENTS.map((e, i) => (
          <motion.li
            key={e.title}
            variants={cardVariants}
            whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.3 } }}
            className="group relative flex flex-col rounded-xl bg-white px-5 pb-4 pt-6 shadow-[0_1px_2px_rgba(20,18,16,0.06),0_6px_20px_-6px_rgba(20,18,16,0.12)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(20,18,16,0.06),0_14px_32px_-10px_rgba(20,18,16,0.18)] dark:bg-secondary-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_-8px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_16px_36px_-10px_rgba(0,0,0,0.7)]"
            style={tintStyle(e.tint)}
          >
            {/* Numbered badge — straddles the card's left edge */}
            <motion.span
              aria-hidden="true"
              variants={badgeVariants}
              className="absolute -left-5 top-11 flex h-10 w-10 items-center justify-center rounded-full font-display text-lg font-bold text-parchment shadow-[0_1px_2px_rgba(20,18,16,0.08),0_4px_10px_-4px_rgba(20,18,16,0.2)]"
              style={{ backgroundColor: 'color-mix(in srgb, var(--tint) 32%, var(--c-primary-bg))' }}
            >
              {i + 1}
            </motion.span>

            {/* Year — a small sticker pinned over the card's top-right corner */}
            <motion.span
              variants={badgeVariants}
              className="absolute -top-3 right-4 rounded-md px-2.5 py-1 font-rounded text-[0.75rem] font-bold text-parchment shadow-[0_1px_2px_rgba(20,18,16,0.08),0_4px_10px_-4px_rgba(20,18,16,0.2)]"
              style={{ backgroundColor: 'color-mix(in srgb, var(--tint) 32%, var(--c-primary-bg))' }}
            >
              {e.year}
            </motion.span>

            {/* Company | context — one quiet line */}
            <p
              title={`${e.company} | ${e.context}`}
              className="truncate pl-4 font-rounded text-[0.78rem] font-normal text-parchment-muted"
            >
              {e.company}
              <span aria-hidden="true" className="mx-1.5 text-parchment-faint/60">|</span>
              {e.context}
            </p>

            <h3 className="mt-3 pl-4 font-rounded text-[0.95rem] font-bold leading-snug text-parchment">
              {e.title}
            </h3>
            <p className="mt-2 pl-4 font-rounded text-[0.875rem] font-normal leading-relaxed text-parchment-muted">
              {e.detail}
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5 pl-4">
              {e.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-sunset/15 px-2.5 py-0.5 font-rounded text-[0.72rem] font-semibold text-highlight-strong"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-end pr-10 pt-3">
              <span className="inline-flex items-center gap-1 font-rounded text-[0.78rem] font-semibold text-parchment-muted">
                <Glyph name="pin" className="h-3.5 w-3.5 text-sunset" />
                {e.location}
              </span>
            </div>

            {/* Glyph — small, tucked into the bottom-right corner */}
            <motion.span
              aria-hidden="true"
              className="absolute bottom-3 right-3 text-parchment/70"
              animate={reduce ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            >
              <Glyph
                name={e.glyph}
                className="h-8 w-8 transition-transform duration-500 group-hover:scale-110"
              />
            </motion.span>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
