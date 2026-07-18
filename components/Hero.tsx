'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';
import { SocialIcons } from './SocialIcons';
import { Wave } from './Wave';

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <header id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <div className="zone flex-1 flex flex-col justify-center pt-32 pb-16 md:pt-28">
        <motion.p {...rise(0.1)} className="label mb-8">
          {site.name} · Senior Frontend Engineer · Agentic AI Interfaces
        </motion.p>

        <motion.h1
          {...rise(0.25)}
          className="max-w-[16ch] font-display text-[clamp(2.25rem,5.2vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.015em] text-parchment lg:max-w-[25ch]"
        >
          Abhirupa architects spaces where{' '}
          <span className="bg-gradient-to-r from-rust-deep via-rust to-rust-soft bg-clip-text font-semibold italic text-transparent">
            AI breathes and thinks
          </span>{' '}
          alongside humans.
        </motion.h1>

        <motion.p
          {...rise(0.5)}
          className="mt-8 max-w-2xl font-serif text-sub font-light text-parchment-muted"
        >
          {site.subline} — designing the frontend where agents reason, and a
          quieter practice of slow living behind the work.
        </motion.p>

        <motion.div {...rise(0.7)} className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <SocialIcons />
          <div className="flex items-center gap-3 text-parchment-faint">
            <span className="accent-rule" />
            <span className="label text-[0.62rem]">Scroll to wander</span>
          </div>
        </motion.div>
      </div>

      <Wave tone="sand" className="absolute inset-x-0 bottom-0" />
    </header>
  );
}
