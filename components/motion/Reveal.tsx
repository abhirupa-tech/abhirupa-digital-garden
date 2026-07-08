'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

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
 * Gentle, deliberate scroll reveal. Content eases up and fades in once,
 * never bouncy. Honors prefers-reduced-motion by rendering statically.
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
      ? { y: 26 }
      : from === 'left'
        ? { x: -28 }
        : from === 'right'
          ? { x: 28 }
          : {};

  const variants: Variants = {
    hidden: { opacity: 0, ...(reduce ? {} : offset) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduce ? 0 : 1.05,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
    >
      {children}
    </MotionTag>
  );
}
