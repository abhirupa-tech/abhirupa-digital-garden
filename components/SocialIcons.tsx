'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { site } from '@/lib/site';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const icons = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...stroke} x="3" y="3" width="18" height="18" rx="3" />
      <path {...stroke} d="M7 10.5V17M7 7.4v.1M11 17v-3.6c0-1.4 1-2.4 2.3-2.4S16 11.9 16 13.3V17" />
    </svg>
  ),
  medium: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <ellipse {...stroke} cx="7" cy="12" rx="4.5" ry="5" />
      <ellipse {...stroke} cx="16" cy="12" rx="1.8" ry="5" />
      <path {...stroke} d="M21 7.4v9.2" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...stroke} x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path {...stroke} d="M4 7.5l8 5.5 8-5.5" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        {...stroke}
        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
      />
    </svg>
  ),
};

const socials = [
  { key: 'linkedin' as const, href: site.social.linkedin, label: 'LinkedIn' },
  { key: 'medium' as const, href: site.social.medium, label: 'Medium' },
  { key: 'github' as const, href: site.social.github, label: 'GitHub' },
  { key: 'email' as const, href: site.social.email, label: 'Email' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// The whole link lifts slightly and an underline wipes in on hover. The
// underline uses currentColor, so it takes the tone's hover color — dark navy
// (sand) on light backgrounds, warm sand on the dark footer.
const linkVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -2 },
};
const underlineVariants: Variants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
};

export function SocialIcons({
  className,
  tone = 'default',
}: {
  className?: string;
  /** 'light' for use on dark backgrounds (e.g. the footer). */
  tone?: 'default' | 'light';
}) {
  const reduce = useReducedMotion();
  const toneClass =
    tone === 'light'
      ? 'text-white/70 hover:text-[#e8c9a0] focus-visible:text-[#e8c9a0]'
      : 'text-sand hover:text-sand-soft focus-visible:text-sand-soft';

  return (
    <ul className={`flex items-center gap-6 ${className ?? ''}`}>
      {socials.map((s) => (
        <li key={s.key}>
          <motion.a
            href={s.href}
            target={s.key === 'email' ? undefined : '_blank'}
            rel={s.key === 'email' ? undefined : 'noopener noreferrer'}
            aria-label={`Abhirupa Mitra on ${s.label}`}
            initial="rest"
            animate="rest"
            whileHover={reduce ? undefined : 'hover'}
            whileFocus="hover"
            variants={linkVariants}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
            className={`inline-flex items-center gap-2 transition-colors duration-500 focus-visible:outline-hidden ${toneClass}`}
          >
            {icons[s.key]}
            <span className="relative">
              <span className="label text-[0.72rem] text-current">{s.label}</span>
              <motion.span
                aria-hidden="true"
                variants={underlineVariants}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                style={{ transformOrigin: 'left' }}
                className="absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-current"
              />
            </span>
          </motion.a>
        </li>
      ))}
    </ul>
  );
}
