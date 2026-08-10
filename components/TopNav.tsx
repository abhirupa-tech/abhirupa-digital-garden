'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { zones } from '@/lib/data';
import { ThemeToggle } from './ThemeToggle';

// Sections whose article pages (/section/slug) render the fixed left SideNav.
const SECTION_IDS = new Set(zones.map((z) => z.id));

/**
 * Minimal, page-aware top navigation.
 *
 * - Two links, About and Contact, plus a light/dark theme toggle. When a
 *   link's page is active it rests in the highlight color with its underline
 *   already drawn.
 * - On every non-home page a "← Home" affordance sits at the left, sticky in
 *   the same fixed bar as About/Contact — one consistent way back to the top.
 * - Transparent at the top of the page; once scrolled it fades in an opaque
 *   canvas-colored background so page content never bleeds through behind it.
 * - Colors read through the semantic theme tokens (secondary-text, highlight),
 *   so the bar adapts to light and dark without per-mode overrides.
 * - Layout avoids the fixed left SideNav (desktop) and its hamburger (mobile,
 *   home only) by aligning the links left on the home page's small screens and
 *   right everywhere else.
 */

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className="group relative inline-block font-body text-base tracking-wide focus-visible:outline-hidden"
    >
      <span
        className={`transition-colors duration-300 ${
          active ? 'text-highlight' : 'text-secondary-text group-hover:text-highlight'
        }`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        style={{ transformOrigin: 'left' }}
        className={`absolute -bottom-1 left-0 h-px w-full rounded-full bg-highlight transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </a>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The site exports with trailingSlash, so usePathname yields e.g. "/about/".
  // Normalize the trailing slash before matching routes.
  const path = pathname && pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
  const isHome = path === '/';
  // Article pages (/section/slug) render the fixed left SideNav on desktop, so
  // the Home affordance is inset past it there to avoid sitting under the bar.
  const segments = isHome ? [] : path.split('/').filter(Boolean);
  const isArticle = segments.length >= 2 && SECTION_IDS.has(segments[0]);
  // One consistent "← Home" on every non-home page, sticky in the top bar.
  const showHome = !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-hairline bg-primary-bg/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className={`flex items-center gap-6 px-6 py-4 md:px-10 lg:pr-12 ${isArticle ? 'lg:pl-24' : ''}`}
      >
        {showHome && (
          <a
            href="/"
            aria-label="Home"
            className="group flex items-center gap-2 font-body text-base tracking-wide text-secondary-text transition-colors duration-300 hover:text-highlight focus-visible:outline-hidden"
          >
            <span className="text-lg leading-none transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            <span>Home</span>
          </a>
        )}

        {/* Links rest on the left on mobile so the fixed top-right hamburger
            (home + article pages) never overlaps them; they move to the right
            edge from lg up, where the hamburger is replaced by the side rail. */}
        <div className="flex items-center gap-8 lg:ml-auto">
          <NavLink href="/about/" active={path === '/about'}>
            About
          </NavLink>
          <NavLink href="/#stay-updated" active={false}>
            Contact
          </NavLink>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
