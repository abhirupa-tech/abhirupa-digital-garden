'use client';

import { motion, useScroll, useSpring, useReducedMotion, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { career, type CareerRole, type RoleIcon } from '@/lib/career';

const RUST = '#d1480f';
const EASE = [0.16, 1, 0.3, 1] as const;

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Line-art glyphs, one per kind of role — a spark for agentic work, a split
// pane for Copilot, a mic for voice dictation, sigma for the math intern, and
// a phone for the iOS intern.
const roleIcons: Record<RoleIcon, ReactNode> = {
  agent: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path {...S} d="M12 3.5 13.7 10.3 20.5 12 13.7 13.7 12 20.5 10.3 13.7 3.5 12 10.3 10.3Z" />
    </svg>
  ),
  pane: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...S} x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path {...S} d="M14.5 5v14" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...S} x="9" y="3" width="6" height="10.5" rx="3" />
      <path {...S} d="M6 11a6 6 0 0 0 12 0M12 17.5V21M9.5 21h5" />
    </svg>
  ),
  sigma: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path {...S} d="M16.5 5.5H7.5l5 6.5-5 6.5h9" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...S} x="7" y="3" width="10" height="18" rx="2.5" />
      <path {...S} d="M10.5 18h3" />
    </svg>
  ),
};

const cardVariants: Variants = {
  rest: { y: 0, borderColor: 'rgb(20 18 16 / 0.12)' },
  hover: { y: -4, borderColor: 'rgb(209 72 15 / 0.45)' },
};
const iconVariants: Variants = {
  rest: { backgroundColor: 'rgb(29 58 99 / 0.06)', color: '#1d3a63', rotate: 0 },
  hover: { backgroundColor: 'rgb(209 72 15 / 0.12)', color: RUST, rotate: -6 },
};

function RoleCard({ role, index, reduce }: { role: CareerRole; index: number; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.06 * index, ease: EASE }}
    >
      {/* Interactive card: lifts and warms to rust on hover */}
      <motion.div
        initial="rest"
        animate="rest"
        whileHover={reduce ? undefined : 'hover'}
        variants={cardVariants}
        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
        className="h-full rounded-2xl border bg-[#f9f8f5]/70 p-4 shadow-xs backdrop-blur-[1px]"
      >
        <div className="flex items-start gap-3">
          <motion.span
            aria-hidden="true"
            variants={iconVariants}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-parchment/10"
          >
            {roleIcons[role.icon]}
          </motion.span>
          <div className="min-w-0">
            <h4 className="font-display text-lg font-medium leading-snug text-parchment">
              {role.title}
            </h4>
            <p className="mt-0.5 label text-parchment-faint">{role.employment}</p>
          </div>
        </div>

        <p className="mt-3 label text-sand/80">
          {role.period} · {role.duration}
        </p>
        <p className="mt-2 font-rounded text-sm font-light leading-relaxed text-parchment-muted">
          {role.summary}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {role.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-sand/25 bg-sand/5 px-2.5 py-0.5 font-rounded text-[0.7rem] text-sand"
            >
              {tech}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

/**
 * A vertical career timeline whose rust rail *draws itself* as the section
 * scrolls through the viewport. Each company is a node on the rail; the roles
 * held there fan out as interactive icon cards beneath it — a clear company →
 * roles hierarchy without a second, nested rail. The rail draw is skipped
 * (shown fully drawn) under prefers-reduced-motion.
 */
export function CareerTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 70%'],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative mt-14 md:mt-20">
      {/* Static rail */}
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-parchment/12" />
      {/* Progress rail — draws top→bottom with scroll */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { scaleY }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-rust"
      />

      <ol>
        {career.map((group, gi) => (
          <li
            key={`${group.company}-${group.span}`}
            className="relative pb-16 pl-12 last:pb-0 md:pl-16"
          >
            {/* Company node */}
            <motion.span
              aria-hidden="true"
              initial={reduce ? { scale: 1 } : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
              className="absolute left-[7px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-rust ring-4 ring-[#f4f3ef]"
            />

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
              transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.04 * gi, ease: EASE }}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-display text-3xl font-medium text-sand md:text-4xl">
                  {group.year}
                </span>
                <span className="label text-parchment-faint">
                  {group.span}
                  {group.totalDuration ? ` · ${group.totalDuration}` : ''}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-medium leading-tight text-parchment md:text-3xl">
                {group.company}
              </h3>
            </motion.div>

            {/* Roles held here — interactive icon cards */}
            <div
              className={`mt-6 grid gap-4 ${group.roles.length > 1 ? 'sm:grid-cols-2' : ''}`}
            >
              {group.roles.map((role, ri) => (
                <RoleCard key={role.period} role={role} index={ri} reduce={reduce} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
