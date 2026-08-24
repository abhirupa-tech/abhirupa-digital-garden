'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * A hairline divider carrying a single blue "spark" ball whose position is
 * driven by scroll.
 *
 * As the reader scrolls down, the ball advances left→right along the divider,
 * following the scroll through a spring so it moves with a gentle, weighty lag
 * and overshoots a touch when scrolling stops — the "springy on scroll" feel.
 * Scrolling back up walks it home. A soft blue trail fills in behind it.
 *
 * Reduced-motion: the ball tracks scroll directly with no spring/overshoot.
 *
 * The colour is the shared `--color-spark` token — the one cool note in the
 * site's warm palette — so it ties to the featured-blog accent below.
 */
export function HeroSparkDivider({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // `end` = rest x for the ball (track width minus the ball radius). `range` =
  // how much scroll (px) maps to a full left→right traverse. Both are measured
  // from the live layout and kept fresh on resize.
  const [{ end, range }, setDims] = useState({ end: 0, range: 600 });

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      setDims({
        end: Math.max(0, el.clientWidth - 8),
        // Full traverse over ~60% of a viewport of scroll — long enough that the
        // divider is still on screen while the ball travels.
        range: Math.max(240, Math.round(window.innerHeight * 0.6)),
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollY } = useScroll();

  // Map raw scroll position → ball x, clamped to the divider.
  const target = useTransform(scrollY, (v) => {
    const p = Math.min(1, Math.max(0, v / range));
    return p * end;
  });

  // The spring gives the weighty follow + overshoot-on-stop. Reduced motion
  // bypasses it and tracks scroll 1:1.
  const springy = useSpring(target, { stiffness: 140, damping: 16, mass: 0.7 });
  const x = reduce ? target : springy;

  const leftPx = useTransform(x, (v) => `${v}px`);
  const fillWidth = useTransform(x, (v) => `${Math.max(0, v)}px`);

  return (
    <div ref={trackRef} aria-hidden="true" className={`relative h-5 w-full ${className ?? ''}`}>
      {/* base hairline */}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-hairline via-hairline to-transparent" />
      {/* blue trail the ball leaves behind it */}
      <motion.span
        className="absolute left-0 top-1/2 h-px -translate-y-1/2"
        style={{
          width: fillWidth,
          background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-spark) 55%, transparent))',
        }}
      />
      {/* the spark ball */}
      <motion.span
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: leftPx,
          background: 'var(--color-spark)',
          boxShadow:
            '0 0 0 4px color-mix(in srgb, var(--color-spark) 20%, transparent), 0 0 16px 2px color-mix(in srgb, var(--color-spark) 50%, transparent)',
        }}
      >
        {/* soft always-on halo ping */}
        <span
          className="absolute inset-0 rounded-full motion-reduce:hidden"
          style={{ background: 'var(--color-spark)', animation: 'spark-halo 2.8s ease-out infinite' }}
        />
      </motion.span>
    </div>
  );
}
