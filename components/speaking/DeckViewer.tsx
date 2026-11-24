'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type DeckViewerProps = {
  title: string;
  /** The downloadable PDF. */
  pdfHref: string;
  /** Human size for the download button, e.g. "15 MB". */
  pdfSize?: string;
  /** Slide images live at `${dir}/01.webp` … */
  dir: string;
  count: number;
  /** ISO instant the deck unlocks; omitted or past = open. */
  availableAt?: string;
  /** Whether the deck was already unlocked when the page was built. */
  openAtBuild: boolean;
};

const GRADIENT = 'from-[#3b2a20] to-[#b4501a]';
const slideSrc = (dir: string, i: number) => `${dir}/${String(i + 1).padStart(2, '0')}.webp`;

/** "Thu, Nov 26 · 9:00 AM IST" for an ISO instant, always in India time. */
function unlockLabel(iso: string) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric' }).format(d);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(d);
  return `${day} · ${time} IST`;
}

/** "1d 16h 24m", or "16m 05s" inside the last hour. */
function countdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${String(s % 60).padStart(2, '0')}s`;
}

function Icon({ d, className = 'h-4 w-4' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/**
 * The talk's slide deck, on the page: one slide at a time with arrows,
 * keyboard, swipe and full screen, plus a PDF download. Until `availableAt`
 * passes it shows a locked stage with a live countdown instead, and neither
 * the viewer nor the download can be opened; it unlocks on its own at the
 * release time, no reload needed.
 */
export function DeckViewer({ title, pdfHref, pdfSize, dir, count, availableAt, openAtBuild }: DeckViewerProps) {
  const unlockAt = availableAt ? Date.parse(availableAt) : 0;
  const [now, setNow] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  // Phones without the Fullscreen API (iOS Safari) get a fixed overlay instead.
  const [theater, setTheater] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerX = useRef<number | null>(null);

  const open = openAtBuild || (now !== null && now >= unlockAt);

  // Tick once a second until the release time, then stop.
  useEffect(() => {
    if (openAtBuild) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(() => {
      tick();
      if (Date.now() >= unlockAt) clearInterval(timer);
    }, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [openAtBuild, unlockAt]);

  const go = useCallback((next: number) => setIndex(Math.min(count - 1, Math.max(0, next))), [count]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // While expanded, the arrow keys page the deck wherever focus is.
  const expanded = fullscreen || theater;
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') go(index + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(index - 1);
      else if (e.key === 'Escape') setTheater(false);
      else return;
      e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    if (theater) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [expanded, theater, go, index]);

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (theater) setTheater(false);
    else if (document.fullscreenEnabled && el.requestFullscreen) void el.requestFullscreen();
    else setTheater(true);
  };

  /* ── Locked ─────────────────────────────────────────────────────────── */
  if (!open) {
    return (
      <div className="rounded-[1.75rem] bg-pastel-peach p-3 sm:p-4">
        <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#2a1a3d] via-[#1b1029] to-[#0f0a16] px-6 text-center">
          <span aria-hidden="true" className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#b4501a]/25 blur-3xl" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#f3ece4] ring-1 ring-white/15">
            <Icon d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v6.5h-9z" className="h-6 w-6" />
          </span>
          <p className="relative mt-4 font-display text-xl text-[#f3ece4] sm:text-2xl">Slides unlock on talk day</p>
          {availableAt && (
            <p className="relative mt-1 font-rounded text-sm text-[#f3ece4]/75 sm:text-base">{unlockLabel(availableAt)}</p>
          )}
          <p
            aria-live="off"
            className={`relative mt-4 rounded-full bg-linear-to-r ${GRADIENT} px-4 py-1.5 font-rounded text-sm font-medium tabular-nums text-white shadow-md transition-opacity duration-300 ${
              now === null ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Opens in {now === null ? '—' : countdown(unlockAt - now)}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="font-rounded text-sm font-semibold text-pastel-ink">
            {title} · {count} slides
          </p>
          <span
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-pastel-ink/30 px-4 py-2 font-rounded text-sm font-medium text-pastel-ink/60"
          >
            <Icon d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
            Download PDF
          </span>
        </div>
      </div>
    );
  }

  /* ── Open ───────────────────────────────────────────────────────────── */
  const btn =
    'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#b4501a]/60';

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="slide deck"
      aria-label={title}
      tabIndex={-1}
      className={
        expanded
          ? 'fixed inset-0 z-[80] flex flex-col justify-center bg-black p-2 sm:p-6'
          : 'rounded-[1.75rem] bg-pastel-peach p-3 sm:p-4'
      }
    >
      <div
        tabIndex={0}
        aria-label={`Slide ${index + 1} of ${count}. Use the arrow keys to move.`}
        onKeyDown={(e) => {
          if (expanded) return;
          if (e.key === 'ArrowRight') go(index + 1);
          else if (e.key === 'ArrowLeft') go(index - 1);
          else return;
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          pointerX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const start = pointerX.current;
          pointerX.current = null;
          if (start === null) return;
          const dx = e.clientX - start;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          else {
            // A tap: left third goes back, anywhere else goes forward.
            const rect = e.currentTarget.getBoundingClientRect();
            go(index + (e.clientX - rect.left < rect.width / 3 ? -1 : 1));
          }
        }}
        className={`relative mx-auto aspect-video w-full cursor-pointer touch-pan-y select-none overflow-hidden rounded-2xl bg-[#0f0a16] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#b4501a]/60 ${
          expanded ? 'max-h-[calc(100svh-5rem)] max-w-[calc((100svh-5rem)*16/9)]' : ''
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={index}
          src={slideSrc(dir, index)}
          alt={`${title}, slide ${index + 1} of ${count}`}
          draggable={false}
          className="h-full w-full object-contain"
        />
        {/* Warm the neighbours so paging feels instant. */}
        {[index - 1, index + 1]
          .filter((i) => i >= 0 && i < count)
          .map((i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`pre-${i}`} src={slideSrc(dir, i)} alt="" aria-hidden="true" className="hidden" />
          ))}
      </div>

      {/* Progress */}
      <div className={`mx-auto mt-3 h-1 w-full overflow-hidden rounded-full ${expanded ? 'max-w-[calc((100svh-5rem)*16/9)] bg-white/15' : 'bg-pastel-ink/10'}`}>
        <div
          className={`h-full rounded-full bg-linear-to-r ${GRADIENT} transition-[width] duration-300 ease-out`}
          style={{ width: `${((index + 1) / count) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div
        className={`mx-auto mt-2 flex w-full flex-wrap items-center justify-between gap-2 ${
          expanded ? 'max-w-[calc((100svh-5rem)*16/9)] text-white' : 'text-pastel-ink'
        }`}
      >
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide" className={`${btn} hover:bg-black/5 dark:hover:bg-white/10`}>
            <Icon d="M10 3.5 5.5 8l4.5 4.5" />
          </button>
          <span className="min-w-[4.5rem] text-center font-rounded text-sm font-medium tabular-nums" aria-live="polite">
            {index + 1} / {count}
          </span>
          <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next slide" className={`${btn} hover:bg-black/5 dark:hover:bg-white/10`}>
            <Icon d="M6 3.5 10.5 8 6 12.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={expanded ? 'Exit full screen' : 'Full screen'}
            className={`${btn} hover:bg-black/5 dark:hover:bg-white/10`}
          >
            <Icon d={expanded ? 'M6 2.5v3.5H2.5M10 2.5v3.5h3.5M6 13.5V10H2.5M10 13.5V10h3.5' : 'M2.5 6V2.5H6M13.5 6V2.5H10M2.5 10v3.5H6M13.5 10v3.5H10'} />
          </button>
          <a
            href={pdfHref}
            download
            className={`inline-flex items-center gap-2 rounded-full bg-linear-to-r ${GRADIENT} px-4 py-2 font-rounded text-sm font-medium text-white shadow-md shadow-[#3b2a20]/20 transition-shadow duration-300 hover:shadow-lg hover:shadow-[#b4501a]/30`}
          >
            <Icon d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
            <span>
              Download PDF{pdfSize && <span className="hidden text-white/75 sm:inline"> · {pdfSize}</span>}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
