'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Fixed, full-height beige navigation bar — runs top to bottom on the left.
 * Minimalist black line-art icons, no text; they warm to a muted blue on hover
 * and for the section currently in view (scroll-spy). Collapses to a beige
 * hamburger panel below `lg`.
 */

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const icons = {
  cursor: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path {...S} d="M6 4 18 9.2 12.8 11 11 16.2Z" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path {...S} d="M4 20l4-1L18 9l-3-3L5 16z" />
      <path {...S} d="M13.5 7.5l3 3" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <circle {...S} cx="12" cy="12" r="8.5" />
      <path {...S} d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path {...S} d="M5 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H5z" />
      <path {...S} d="M19 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <rect {...S} x="3.5" y="6" width="17" height="12" rx="2" />
      <path {...S} d="M4.5 7.5l7.5 5.5 7.5-5.5" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path {...S} d="M4 7h16" />
      <path {...S} d="M4 12h16" />
      <path {...S} d="M4 17h16" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path {...S} d="M6 6l12 12" />
      <path {...S} d="M18 6L6 18" />
    </svg>
  ),
};

const iconItems: { id: string; label: string; icon: keyof typeof icons }[] = [
  { id: 'the-practice', label: 'The Practice', icon: 'cursor' },
  { id: 'field-notes', label: 'Field Notes', icon: 'pen' },
  { id: 'design-thinking', label: 'Design Thinking', icon: 'compass' },
  { id: 'knowledge-library', label: 'Knowledge Library', icon: 'book' },
  { id: 'stay-updated', label: 'Stay updated', icon: 'mail' },
];

const spyIds = ['top', ...iconItems.map((i) => i.id)];

// Black by default; muted blue on hover / when active.
function iconClass(active: boolean) {
  return `flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 hover:text-[#274a80] focus-visible:text-[#274a80] focus-visible:outline-none ${
    active ? 'text-[#274a80]' : 'text-[#0b0c10]'
  }`;
}

// Nav icon link: a dark-blue circle grows from a dot behind the icon on
// hover/focus (and shrinks back inward on hover-out), turning the icon white.
function NavIcon({
  href,
  label,
  active,
  onClick,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none ${
        active ? 'text-[#274a80]' : 'text-[#0b0c10]'
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 scale-0 rounded-full bg-[#274a80] transition-transform duration-300 ease-out group-hover:scale-100 group-focus-visible:scale-100"
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
        {children}
      </span>
    </a>
  );
}

export function SideNav() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState('top');
  const [open, setOpen] = useState(false);

  // Scroll-spy: mark the section crossing the viewport's vertical middle.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    spyIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop full-height bar — soft ivory-to-taupe gradient */}
      <nav
        aria-label="Section navigation"
        className="fixed inset-y-0 left-0 z-40 hidden w-20 flex-col items-center border-r border-black/10 bg-gradient-to-b from-[#f5f1e9]/95 to-[#ddd6c4]/95 lg:flex"
      >
        <a
          href="/#top"
          aria-label="Top"
          title="Top"
          aria-current={active === 'top' ? 'true' : undefined}
          className={`mt-7 font-display text-2xl leading-none transition-colors duration-300 hover:text-[#274a80] ${
            active === 'top' ? 'text-[#274a80]' : 'text-[#0b0c10]'
          }`}
        >
          A
        </a>

        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          {iconItems.map((it) => (
            <NavIcon key={it.id} href={`/#${it.id}`} label={it.label} active={active === it.id}>
              {icons[it.icon]}
            </NavIcon>
          ))}
        </div>
      </nav>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#f5f1e9] to-[#ddd6c4] text-[#0b0c10] shadow-sm transition-colors duration-300 hover:text-[#274a80]"
        >
          {open ? icons.close : icons.menu}
        </button>

        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Section navigation"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-4 top-[4.75rem] z-40 flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-b from-[#f5f1e9] to-[#ddd6c4] p-2.5 shadow-lg"
            >
              <a
                href="/#top"
                aria-label="Top"
                title="Top"
                onClick={() => setOpen(false)}
                className={iconClass(active === 'top')}
              >
                <span className="font-display text-xl leading-none">A</span>
              </a>
              {iconItems.map((it) => (
                <NavIcon
                  key={it.id}
                  href={`/#${it.id}`}
                  label={it.label}
                  active={active === it.id}
                  onClick={() => setOpen(false)}
                >
                  {icons[it.icon]}
                </NavIcon>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
