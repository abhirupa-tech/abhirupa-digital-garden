'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { zones } from '@/lib/data';

// Sections whose article pages (/section/slug) render the fixed left SideNav.
const SECTION_IDS = new Set(zones.map((z) => z.id));

/**
 * Minimal, page-aware top navigation.
 *
 * - Two links, About and Contact. When a link's page is active it rests in
 *   rust with its underline already drawn.
 * - On subpages a "← Back" affordance appears at the left (returns to the
 *   previous page, or home if there's no history).
 * - Transparent at the top of the page; once scrolled it fades in an opaque
 *   canvas-colored background so page content never bleeds through behind it.
 * - Layout avoids the fixed left SideNav (desktop) and its hamburger (mobile,
 *   home only) by aligning the links left on the home page's small screens and
 *   right everywhere else.
 */

const RUST = '#d1480f';
const INK = '#3a3630';
const EASE = [0.16, 1, 0.3, 1] as const;

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  const labelVariants: Variants = {
    rest: { color: active ? RUST : INK },
    hover: { color: RUST },
  };
  const underlineVariants: Variants = {
    rest: { scaleX: active ? 1 : 0 },
    hover: { scaleX: 1 },
  };

  return (
    <motion.a
      href={href}
      aria-current={active ? 'page' : undefined}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className="relative inline-block font-body text-base tracking-wide focus-visible:outline-hidden"
    >
      <motion.span
        variants={labelVariants}
        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={underlineVariants}
        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
        style={{ transformOrigin: 'left' }}
        className="absolute -bottom-1 left-0 h-px w-full origin-left rounded-full bg-rust"
      />
    </motion.a>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  // The site exports with trailingSlash, so usePathname yields e.g. "/about/".
  // Normalize the trailing slash before matching routes.
  const path = pathname && pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
  const isHome = path === '/';
  // The Back affordance appears wherever there's no SideNav to navigate from.
  // SideNav renders on the home page and on article pages (/section/slug), so
  // Back shows everywhere else — /about, /collections/*, and any future page.
  const segments = isHome ? [] : path.split('/').filter(Boolean);
  const isArticle = segments.length >= 2 && SECTION_IDS.has(segments[0]);
  const showBack = !isHome && !isArticle;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/');
  };

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-parchment/10 bg-[#f5f4f1]/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="flex items-center px-6 py-4 md:px-10 lg:pr-12">
        {showBack && (
          <motion.button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileFocus="hover"
            className="flex items-center gap-2 font-body text-base tracking-wide focus-visible:outline-hidden"
          >
            <motion.span
              variants={{ rest: { x: 0, color: INK }, hover: { x: -4, color: RUST } }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
              className="text-lg leading-none"
            >
              ←
            </motion.span>
            <motion.span
              variants={{ rest: { color: INK }, hover: { color: RUST } }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            >
              Back
            </motion.span>
          </motion.button>
        )}

        <div className={`flex items-center gap-8 ${isHome ? 'lg:ml-auto' : 'ml-auto'}`}>
          <NavLink href="/about" active={path === '/about'}>
            About
          </NavLink>
          <NavLink href="/#stay-updated" active={false}>
            Contact
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
