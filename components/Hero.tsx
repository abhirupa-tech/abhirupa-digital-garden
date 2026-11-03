'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';
import { SocialIcons } from './SocialIcons';
import { EmberPhrase } from './motion/EmberPhrase';
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
    <header id="top" className="relative overflow-hidden">
      <div className="zone pt-24 pb-16 md:pt-32 md:pb-20">
        <motion.p {...rise(0.1)} className="label mb-5 sm:mb-8">
          <span className="sm:hidden">AI Frontend Engineer</span>
          <span className="hidden sm:inline">
            {site.name} · Senior Frontend Engineer · Agentic AI Interfaces
          </span>
        </motion.p>

        <motion.h1
          {...rise(0.25)}
          className="max-w-[18ch] font-display text-[clamp(1.9rem,4.6vw,4rem)] font-medium leading-[1.08] tracking-[-0.015em] text-parchment lg:max-w-[24ch]"
        >
          Abhirupa writes about designing and building frontends for{' '}
          <EmberPhrase text="AI agents" className="pr-[0.04em] font-semibold italic" />.
        </motion.h1>

        {/* The H1 says plainly what the site publishes (and carries the search
            intent); this line keeps the poetry. */}
        <motion.h2
          {...rise(0.5)}
          className="mt-5 max-w-2xl font-serif text-sub font-light text-secondary-text sm:mt-7"
        >
          Architecting spaces where AI breathes and thinks alongside humans —
          the surfaces where agents reason, pause, and hand control back to people.
        </motion.h2>

        <motion.div {...rise(0.65)} className="mt-7 max-w-2xl sm:mt-8">
          <HeroSparkDivider />
        </motion.div>

        <motion.div {...rise(0.8)} className="mt-6 sm:mt-7">
          <SocialIcons mobileIconsOnly />
        </motion.div>
      </div>

      <Wave tone="sand" className="absolute inset-x-0 bottom-0" />
    </header>
  );
}
