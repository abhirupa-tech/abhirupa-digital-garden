'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';
import { SocialIcons } from './SocialIcons';
import { HeroSparkDivider } from './motion/HeroSparkDivider';
import { Wave } from './Wave';

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <header id="top" className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      <div className="zone flex-1 flex flex-col justify-center pt-14 pb-10 md:pt-28 md:pb-16">
        <motion.p {...rise(0.1)} className="label mb-5 sm:mb-8">
          <span className="sm:hidden">AI Frontend Engineer</span>
          <span className="hidden sm:inline">
            {site.name} · Senior Frontend Engineer · Agentic AI Interfaces
          </span>
        </motion.p>

        <motion.h1
          {...rise(0.25)}
          className="max-w-[16ch] font-display text-[clamp(1.8rem,5.2vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.015em] text-parchment lg:max-w-[25ch]"
        >
          Abhirupa architects spaces where{' '}
          <span className="box-decoration-clone bg-linear-to-r from-rust-deep via-rust to-rust-soft bg-clip-text pr-[0.14em] font-semibold italic text-transparent">
            AI breathes and thinks
          </span>{' '}
          alongside humans.
        </motion.h1>

        {/* The H1 above carries the poetry; this H2 carries the search intent —
            plain, keyword-bearing copy ("frontend engineering for agentic AI
            interfaces") so the hero ranks for what the work actually is. */}
        <motion.h2
          {...rise(0.5)}
          className="mt-5 max-w-2xl font-serif text-sub font-light text-parchment-muted sm:mt-8"
        >
          Frontend engineering for agentic AI interfaces — designing the
          surfaces where agents reason, pause, and hand control back to people.
        </motion.h2>

        <motion.div {...rise(0.65)} className="mt-8 max-w-2xl sm:mt-10">
          <HeroSparkDivider />
        </motion.div>

        <motion.div {...rise(0.8)} className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6 sm:mt-10">
          <SocialIcons mobileIconsOnly />
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
