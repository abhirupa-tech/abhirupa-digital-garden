'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { zones, visibleZones } from '@/lib/data';
import { site } from '@/lib/site';
import { ThemeToggle } from './ThemeToggle';

// Article pages (/section/slug) and home render the fixed left icon rail on
// desktop, so the bar's left edge is inset past it there.
const SECTION_IDS = new Set(zones.map((z) => z.id));

// Lab projects that present as their own product, without the site nav.
const STANDALONE_PREFIXES = ['/lab/rec'];

/** The Writing menu: the full index first, then each writing section. */
const WRITING_LINKS: { href: string; label: string; blurb: string }[] = [
  { href: '/writing/', label: 'All writing', blurb: 'Every piece, filterable by format and topic' },
  ...visibleZones
    .filter((z) => z.id !== 'lab' && z.id !== 'knowledge-library')
    .map((z) => ({ href: `/${z.id}/`, label: z.kicker, blurb: z.title })),
];

const PAGE_LINKS = [
  { href: '/lab/', label: 'Lab' },
  { href: '/now/', label: 'Now' },
  { href: '/about/', label: 'About' },
];

function isActive(path: string, href: string) {
  const target = href.replace(/\/$/, '');
  return path === target || path.startsWith(`${target}/`);
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
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
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'
        }`}
      />
    </a>
  );
}

/** Desktop "Writing" disclosure: opens on hover, click, or keyboard. */
function WritingMenu({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active =
    isActive(path, '/writing/') || WRITING_LINKS.some((l) => isActive(path, l.href)) || path.startsWith('/collections');

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="writing-menu"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 font-body text-base tracking-wide transition-colors duration-300 hover:text-highlight focus-visible:text-highlight focus-visible:outline-hidden ${
          active ? 'text-highlight' : 'text-secondary-text'
        }`}
      >
        Writing
        <svg viewBox="0 0 12 12" aria-hidden="true" className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      {/* pt-3 bridges the gap so moving the pointer into the panel keeps it open. */}
      <div
        id="writing-menu"
        hidden={!open}
        className="absolute right-0 top-full w-80 pt-3"
      >
        <ul className="rounded-xl border border-parchment/10 bg-primary-bg p-2 shadow-lg">
          {WRITING_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={isActive(path, l.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-secondary-bg focus-visible:bg-secondary-bg focus-visible:outline-hidden"
              >
                <span className="block font-body text-base text-parchment">{l.label}</span>
                <span className="mt-0.5 block font-rounded text-sm leading-snug text-parchment-muted">
                  {l.blurb}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Phone menu: one button, everything inside. */
function MobileMenu({ path }: { path: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const item = (href: string, label: string, blurb?: string) => (
    <li key={href}>
      <a
        href={href}
        aria-current={isActive(path, href) ? 'page' : undefined}
        onClick={() => setOpen(false)}
        className="block py-2.5"
      >
        <span className={`block font-body text-lg ${isActive(path, href) ? 'text-highlight' : 'text-parchment'}`}>
          {label}
        </span>
        {blurb && <span className="block font-rounded text-sm text-parchment-muted">{blurb}</span>}
      </a>
    </li>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-11 w-11 items-center justify-center rounded-full text-parchment transition-colors duration-300 hover:text-highlight"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>
      <nav
        id="mobile-menu"
        aria-label="Site"
        hidden={!open}
        className="fixed inset-x-0 top-[4.25rem] bottom-0 overflow-y-auto border-t border-parchment/10 bg-primary-bg px-6 pb-10 pt-4"
      >
        <p className="label">Writing</p>
        <ul className="mt-1 divide-y divide-parchment/10">
          {WRITING_LINKS.map((l) => item(l.href, l.label, l.blurb))}
        </ul>
        <ul className="mt-6 divide-y divide-parchment/10 border-t border-parchment/10">
          {PAGE_LINKS.map((l) => item(l.href, l.label))}
          {item('#stay-updated', 'Stay updated')}
        </ul>
        <div className="mt-6 flex items-center gap-3">
          <ThemeToggle />
          <span className="font-rounded text-sm text-parchment-muted">Light / dark</span>
        </div>
      </nav>
    </div>
  );
}

/**
 * Site header: name on the left (home link), labelled destinations on the
 * right — a Writing menu with each section and its one-line description, then
 * Lab, Now, About and the theme switch. Phones get the name and one menu
 * button. Transparent at the top, an opaque canvas once scrolled.
 */
export function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The site exports with trailingSlash, so usePathname yields e.g. "/about/".
  const path = pathname && pathname !== '/' ? pathname.replace(/\/$/, '') : '/';
  const isHome = path === '/';
  const segments = isHome ? [] : path.split('/').filter(Boolean);
  const hasRail = isHome || (segments.length >= 2 && SECTION_IDS.has(segments[0]));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (STANDALONE_PREFIXES.some((prefix) => path.startsWith(prefix))) return null;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-hairline bg-primary-bg/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className={`flex items-center justify-between gap-6 px-6 py-3 md:px-10 lg:pr-12 ${hasRail ? 'lg:pl-28' : ''}`}
      >
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="font-display text-lg leading-none text-parchment transition-colors duration-300 hover:text-highlight"
        >
          {site.name}
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <WritingMenu path={path} />
          {PAGE_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={isActive(path, l.href)}>
              {l.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </div>

        <MobileMenu path={path} />
      </nav>
    </div>
  );
}
