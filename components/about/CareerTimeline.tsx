'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Glyph, type GlyphName } from './Glyph';

/**
 * A single, vertical, scroll-driven career timeline. Every event's details are
 * always visible; as you scroll, the event crossing the viewport's middle
 * becomes "active" — its node and card warm to sunset. A marker rides the rail:
 * it rests as a squircle framing the active node, and shrinks to a small solid
 * dot while it springs between events. Scroll-driven (no hover), so it behaves
 * the same on touch; collapses to a plain, fully-lit list under reduced-motion.
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
};

const EVENTS: Event[] = [
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
  },
  {
    year: '2023 — 2025',
    company: 'Microsoft',
    context: 'M365 Copilot',
    location: 'Noida',
    title: 'Software Engineer 2',
    glyph: 'pane',
    detail:
      'Performance and UX for the Microsoft Copilot side pane across every M365 Office app and platform — shared ownership of one seamless Copilot experience.',
    stack: ['React', 'TypeScript', 'Relay', 'Fluent UI'],
  },
  {
    year: '2021 — 2025',
    company: 'Microsoft',
    context: 'Office · Word & Outlook',
    location: 'Noida',
    title: 'Software Engineer',
    glyph: 'mic',
    detail:
      'Voice dictation in Word and Outlook for Android, and a better microphone click funnel — across an Android, shared C++, and Kotlin stack.',
    stack: ['Android', 'C++', 'Kotlin'],
  },
  {
    year: '2020 — 2021',
    company: 'Microsoft',
    context: 'Word Web · iOS',
    location: 'Noida',
    title: 'Engineering Intern',
    glyph: 'calendar',
    detail:
      'Voice-to-math expression conversion in Word on the web (speak out equations), and a LUIS-powered intelligent system for an iOS app.',
    stack: ['Speech', 'iOS'],
  },
];

// Marker colour — sunset orange throughout (rgb so framer interpolates the
// glow smoothly).
const MARK = 'rgb(242,105,47)';
const nodeVariants: Variants = {
  off: { scale: 1 },
  on: { scale: 1.12 },
};

export function CareerTimeline() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [markY, setMarkY] = useState(0);
  const [traveling, setTraveling] = useState(false);

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mounted = useRef(false);

  // Scroll-spy: the event crossing the viewport's vertical middle is active.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Measure the active node's centre → marker target. Trigger the shrink-to-dot
  // travel morph on active changes (but not on the very first measure/resize).
  // Node center relative to the <ol> = the item's offsetTop + half the node
  // height (the node sits at the item's top, h-10 → +20). offsetTop is layout-
  // accurate, so the marker lines up with the icon exactly.
  const measure = (morph: boolean) => {
    const li = itemRefs.current[active];
    if (!li) return;
    setMarkY(li.offsetTop + 20);
    if (morph && !reduce) setTraveling(true);
  };

  useLayoutEffect(() => {
    measure(mounted.current);
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => measure(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const nodeTx = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 16, mass: 0.6 };

  return (
    <ol className="relative mt-10 md:mt-12">
      {/* Vertical rail — behind everything. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-[20px] top-6 z-0 w-px bg-parchment/15"
      />

      {/* The rail marker: rides BEHIND the icon squircles (z-0). It rests as a
          squircle matching the node's size (a warm backing/glow), and shrinks to
          a small solid dot while it springs — slowly — between events. It stays
          solid orange throughout (plain rgba, so no colour artefacts on the
          journey). */}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-[20px] z-0"
          style={{ translateX: '-50%', translateY: '-50%', backgroundColor: MARK }}
          initial={false}
          animate={{
            top: markY,
            width: traveling ? 12 : 40,
            height: traveling ? 12 : 40,
            borderRadius: traveling ? 999 : 15,
            boxShadow: traveling
              ? '0 0 10px 3px rgba(242,105,47,0.5)'
              : '0 0 18px 3px rgba(242,105,47,0.45)',
          }}
          transition={{ type: 'spring', stiffness: 110, damping: 20, mass: 1.2 }}
          onAnimationComplete={() => setTraveling(false)}
        />
      )}

      {EVENTS.map((e, i) => {
        const on = active === i;
        return (
          <li
            key={e.title}
            data-idx={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative pb-10 pl-16 last:pb-0 sm:pb-12"
          >
            {/* Node — orange glyph, lifts a touch when active */}
            <motion.span
              aria-hidden="true"
              variants={nodeVariants}
              animate={on ? 'on' : 'off'}
              transition={nodeTx}
              className={`absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border bg-secondary-bg text-sunset shadow-xs transition-colors duration-300 ${
                on ? 'border-sunset/50' : 'border-parchment/12'
              }`}
            >
              <Glyph name={e.glyph} className="h-[1.15rem] w-[1.15rem]" />
            </motion.span>

            {/* Header — year, then COMPANY | context | 📍 location */}
            <span
              className={`block pt-0.5 font-rounded text-sm font-normal leading-tight transition-colors duration-300 md:text-[0.95rem] ${
                on ? 'text-sunset' : 'text-parchment-faint'
              }`}
            >
              {e.year}
            </span>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-rounded text-sm">
              <span
                className={`font-rounded text-[0.7rem] font-medium uppercase tracking-label ${
                  on ? 'text-parchment-muted' : 'text-parchment-faint'
                }`}
              >
                {e.company}
              </span>
              <span aria-hidden="true" className="text-parchment-faint/50">|</span>
              <span className="text-parchment-muted">{e.context}</span>
              <span aria-hidden="true" className="text-parchment-faint/50">|</span>
              <span className="inline-flex items-center gap-1 text-parchment-muted">
                <Glyph name="pin" className="h-3.5 w-3.5 text-sunset" />
                {e.location}
              </span>
            </div>
            <h3
              className={`mt-1 font-rounded text-base font-medium leading-snug transition-colors duration-300 md:text-lg ${
                on ? 'text-parchment' : 'text-parchment/80'
              }`}
            >
              {e.title}
            </h3>

            {/* Detail card — always shown; whiter, the active one brighter */}
            <div
              className={`mt-3 rounded-2xl border p-4 transition-all duration-500 sm:p-5 ${
                on
                  ? 'border-sunset/30 bg-[#fdfcfa] opacity-100 dark:bg-tertiary-bg'
                  : 'border-parchment/10 bg-[#fdfcfa]/70 opacity-80 dark:bg-secondary-bg/50'
              }`}
            >
              <p className="font-rounded text-sm font-light leading-relaxed text-parchment-muted">
                {e.detail}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {e.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-sunset/25 bg-sunset/10 px-2.5 py-0.5 font-rounded text-[0.7rem] text-sunset"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
