'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Section = { id: string; text: string; level: 2 | 3 };

// Dark mocha into dark orange: the reading-progress and active-section accent.
// Dark mode lifts the mocha a little so the start of the gradient stays visible.
const GRADIENT = 'from-[#3b2a20] to-[#b4501a] dark:from-[#7a5a45] dark:to-[#d2621f]';

/**
 * Reading aids for an article page, driven by one scroll listener:
 *  - a thin progress bar pinned to the top of the viewport;
 *  - on xl screens, a sticky "In this piece" rail in the right gutter with a
 *    progress track and the section currently being read highlighted;
 *  - below xl, a floating pill naming the current section that opens the same
 *    contents as a bottom sheet.
 *
 * Sections are the h2/h3 headings inside `.article-body` (each carries an id
 * from the Heading component). Render it inside the article element: the rail
 * positions itself against the article's right edge.
 */
export function ArticleNavigator() {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  // The pill shows only while the body is being read, not over the masthead or footer.
  const [inBody, setInBody] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const bodyRef = useRef<HTMLElement | null>(null);
  const headingsRef = useRef<HTMLElement[]>([]);

  // Collect the headings once the article has painted.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const body = document.querySelector<HTMLElement>('.article-body');
      if (!body) return;
      bodyRef.current = body;
      const seen = new Set<string>();
      const els = Array.from(body.querySelectorAll<HTMLElement>('h2, h3')).filter((el) => {
        if (!el.id || seen.has(el.id)) return false;
        seen.add(el.id);
        return true;
      });
      headingsRef.current = els;
      setSections(
        els.map((el) => ({
          id: el.id,
          text: el.textContent?.trim() ?? '',
          level: el.tagName === 'H3' ? 3 : 2,
        })),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Progress through the body, and the last heading scrolled past the upper third.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const body = bodyRef.current;
      if (!body) return;
      const vh = window.innerHeight;
      const rect = body.getBoundingClientRect();
      const read = (vh * 0.35 - rect.top) / Math.max(rect.height, 1);
      setProgress(Math.min(1, Math.max(0, read)));
      setInBody(rect.top < vh * 0.5 && rect.bottom > vh * 0.6);

      let current: string | null = null;
      for (const el of headingsRef.current) {
        if (el.getBoundingClientRect().top <= vh * 0.35) current = el.id;
        else break;
      }
      setActive(current ?? headingsRef.current[0]?.id ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  // Escape closes the sheet; the page behind it doesn't scroll while it's open.
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [sheetOpen]);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setSheetOpen(false);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  }, []);

  const hasContents = sections.length >= 2;
  const current = sections.find((s) => s.id === active);
  const pct = Math.round(progress * 100);

  const list = (variant: 'rail' | 'sheet') => (
    <ol className={variant === 'rail' ? 'space-y-1' : 'space-y-0.5'}>
      {sections.map((s) => {
        const isActive = s.id === active;
        return (
          <li key={s.id} className={s.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${s.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                jump(s.id);
              }}
              className={`group relative block rounded-md transition-colors duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rust/50 ${
                variant === 'rail' ? 'py-1.5 pl-4 pr-1 text-[0.84rem] leading-snug' : 'py-2.5 pl-4 pr-2 text-base'
              } font-rounded ${
                isActive ? 'text-rust-deep dark:text-rust-soft' : 'text-parchment-muted hover:text-parchment'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 h-[70%] w-[3px] -translate-y-1/2 rounded-full bg-linear-to-b ${GRADIENT} transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {s.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Top-of-viewport reading progress */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div
          className={`h-full origin-left bg-linear-to-r ${GRADIENT} transition-transform duration-150 ease-out`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {hasContents && (
        <>
          {/* xl+: sticky rail in the right gutter */}
          <aside aria-label="In this piece" className="absolute inset-y-0 left-full hidden w-52 pl-2 xl:block">
            <div className="sticky top-28 max-h-[calc(100svh-9rem)] overflow-y-auto pb-6">
              <p className="label mb-3 flex items-baseline justify-between pr-1 text-parchment-faint">
                <span>In this piece</span>
                <span className="tabular-nums">{pct}%</span>
              </p>
              <div className="relative">
                {/* Track + fill */}
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-parchment/10" />
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 w-[3px] rounded-full bg-linear-to-b ${GRADIENT} opacity-60 transition-[height] duration-150 ease-out`}
                  style={{ height: `${pct}%` }}
                />
                {list('rail')}
              </div>
            </div>
          </aside>

          {/* Below xl: floating pill → bottom sheet */}
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              aria-controls="article-contents"
              tabIndex={inBody ? 0 : -1}
              className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 overflow-hidden rounded-full bg-linear-to-r ${GRADIENT} py-2.5 pl-3 pr-4 text-left text-white shadow-lg shadow-black/20 transition-all duration-300 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70 ${
                inBody && !sheetOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
              }`}
            >
              {/* Progress ring */}
              <svg viewBox="0 0 36 36" aria-hidden="true" className="h-8 w-8 shrink-0 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15}
                  strokeDashoffset={2 * Math.PI * 15 * (1 - progress)}
                />
              </svg>
              <span className="min-w-0 flex-1">
                <span className="block font-rounded text-[0.65rem] uppercase tracking-label text-white/70">
                  In this piece · {pct}%
                </span>
                <span className="block truncate font-rounded text-sm">{current?.text ?? sections[0].text}</span>
              </span>
              <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 shrink-0 text-white/80">
                <path
                  d="M2.5 7.5 6 4l3.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {sheetOpen && (
              <div className="fixed inset-0 z-[70]">
                <button
                  type="button"
                  aria-label="Close contents"
                  onClick={() => setSheetOpen(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                />
                <div
                  id="article-contents"
                  role="dialog"
                  aria-modal="true"
                  aria-label="In this piece"
                  className="absolute inset-x-0 bottom-0 mx-auto max-h-[75svh] max-w-xl overflow-hidden rounded-t-2xl bg-primary-bg shadow-2xl"
                >
                  <div className={`h-1 bg-linear-to-r ${GRADIENT}`} />
                  <div className="flex items-center justify-between px-6 pt-4 pb-2">
                    <p className="label text-parchment-faint">In this piece · {pct}% read</p>
                    <button
                      type="button"
                      autoFocus
                      onClick={() => setSheetOpen(false)}
                      aria-label="Close contents"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-parchment-muted hover:text-parchment"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                        <path
                          d="M6 6l12 12M18 6 6 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <nav className="max-h-[calc(75svh-4.5rem)] overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                    {list('sheet')}
                  </nav>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
