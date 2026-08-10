'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared hover treatment for the homepage index links (Sections 01 & 03).
 *
 * No background, border, or shadow shifts on hover — instead the title text
 * eases slightly larger and to rust orange, and the existing grey separator
 * line beneath each item recolors to rust. Built on framer-motion variant
 * *propagation*: the link sets the `rest`/`hover` state and every descendant
 * motion element that defines those variant keys animates in sync — no shared
 * state or context needed.
 */

// Hover accent + rest colors read through the semantic theme tokens so titles
// and dividers stay legible in both light and dark (the raw hex would leave
// near-black text on the dark canvas).
const HIGHLIGHT = 'var(--c-highlight)';
// Matches the static `border-hairline` dividers, which flip with the theme.
const LINE_GREY = 'var(--c-hairline)';
const EASE = [0.16, 1, 0.3, 1] as const;

export function HoverLink({
  href,
  className,
  external,
  ariaLabel,
  children,
}: {
  href: string;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={className}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
    >
      {children}
    </motion.a>
  );
}

/**
 * A title that grows a touch and warms to rust on hover. Render it inside a
 * `HoverLink` (or any motion element driving the `rest`/`hover` variants).
 * Honors reduced motion by dropping the scale and snapping the color.
 */
export function AnimatedTitle({
  children,
  className,
  restColor = 'var(--c-primary-text)',
}: {
  children: ReactNode;
  className?: string;
  /** Base (non-hover) text color; hover always resolves to the highlight. */
  restColor?: string;
}) {
  const reduce = useReducedMotion();

  const titleVariants: Variants = {
    rest: { color: restColor, scale: 1 },
    hover: { color: HIGHLIGHT, scale: reduce ? 1 : 1.04 },
  };

  return (
    <motion.span
      variants={titleVariants}
      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
      style={{ transformOrigin: 'left center' }}
      className={`inline-block max-w-full align-baseline ${className ?? ''}`}
    >
      {children}
    </motion.span>
  );
}

/**
 * The separator line beneath an index item. Sits at rest in the same grey as
 * the site's static dividers and recolors to rust when its parent `HoverLink`
 * is hovered/focused. Position it with `className` (the caller owns placement).
 */
export function HoverDivider({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const dividerVariants: Variants = {
    rest: { backgroundColor: LINE_GREY },
    hover: { backgroundColor: HIGHLIGHT },
  };

  return (
    <motion.span
      aria-hidden="true"
      variants={dividerVariants}
      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
      className={`absolute inset-x-3 bottom-0 h-px ${className ?? ''}`}
    />
  );
}
