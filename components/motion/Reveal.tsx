'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds for sequenced reveals. */
  delay?: number;
  /** Direction the content eases in from. */
  from?: 'up' | 'left' | 'right' | 'none';
  as?: 'div' | 'section' | 'article' | 'li' | 'ol' | 'ul' | 'figure' | 'header' | 'footer';
};

/**
 * Gentle scroll reveal: content eases up and fades in once, never bouncy.
 *
 * Visibility is checked on every scroll frame rather than with an
 * IntersectionObserver "in view" event: an observer only reports an element
 * when it crosses the viewport edge between two frames, so a fast scroll can
 * jump clean over a short block and leave it hidden for good. Here a block is
 * revealed once its top is above a point a quarter-screen below the viewport,
 * which also covers everything the reader has already scrolled past.
 *
 * With prefers-reduced-motion it renders visible from the start. Without
 * JavaScript, or when printing, the failsafe in layout.tsx / globals.css shows
 * anything still hidden.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const offset =
    from === 'up'
      ? { y: 16 }
      : from === 'left'
        ? { x: -18 }
        : from === 'right'
          ? { x: 18 }
          : {};

  const variants: Variants = {
    hidden: { opacity: 0, ...(reduce ? {} : offset) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const stop = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
    const check = () => {
      frame = 0;
      if (el.getBoundingClientRect().top < window.innerHeight * 1.25) {
        setShown(true);
        stop();
      }
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(check);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return stop;
  }, []);

  return (
    <MotionTag
      ref={ref as React.Ref<never>}
      className={className}
      variants={variants}
      // Reduced motion: never hidden, so nothing waits on scrolling.
      initial={reduce ? false : 'hidden'}
      animate={reduce || shown ? 'visible' : 'hidden'}
    >
      {children}
    </MotionTag>
  );
}
