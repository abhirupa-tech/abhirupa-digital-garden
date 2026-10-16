'use client';

import { useLoopStep } from './useLoopStep';

const BARS = [8, 14, 22, 30, 24, 16, 10, 18, 28, 34, 26, 20, 12, 22, 32, 38, 30, 24, 16, 10, 14, 24];
const WORDS = 'Here is the summary you asked for, drawn from the three most recent reports'.split(' ');
// One step per committed word; hold on the full frame, then start over.
const DELAYS = [...WORDS.map((_, i) => (i === 0 ? 900 : 220 + ((i * 53) % 140))), 2400];

/**
 * Lab tile preview for Morphology in AI components: one agent-state card in
 * motion. The waveform's committed edge advances with the transcript, and
 * words firm from faint (partial) to solid (committed) as they're spoken.
 * Follows the site theme: parchment field in light mode, ember-dark in dark.
 */
export function MorphologyPreview() {
  const { ref, step } = useLoopStep(DELAYS);
  const committed = Math.min(step, WORDS.length);
  const spokenBars = Math.round((committed / WORDS.length) * BARS.length);
  const thinking = committed < WORDS.length;

  return (
    <div
      ref={ref}
      className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#fbe1c8_0%,#f4e8d7_55%,#ede3d2_100%)] px-[8%] py-[12%] dark:bg-[radial-gradient(ellipse_at_50%_35%,#3a2316_0%,#1a1513_55%,#0f0d0c_100%)]"
      aria-hidden
    >
      <div className="w-[78%] max-w-sm rounded-lg border border-black/10 bg-white/85 px-3.5 py-3 dark:border-white/10 dark:bg-[#1f1c19]/90 shadow-[0_20px_60px_-20px_rgba(224,86,26,0.35)]">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full bg-[#ef6a2a] ${thinking ? 'motion-safe:animate-pulse' : 'opacity-30'}`}
                style={{ animationDelay: `${i * 160}ms`, opacity: thinking ? 0.9 - i * 0.25 : undefined }}
              />
            ))}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-black/45 dark:text-white/50">{thinking ? 'Speaking' : 'Committed'}</span>
        </div>

        <div className="mt-2.5 flex h-7 items-end gap-[3px]">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`flex-1 rounded-full transition-colors duration-300 ${i < spokenBars ? 'bg-[#ef6a2a]' : 'bg-black/10 dark:bg-white/12'}`}
              style={{ height: `${Math.round((h + 6) * 0.62)}px` }}
            />
          ))}
        </div>

        <p className="mt-2.5 line-clamp-2 font-rounded text-[0.72rem] leading-relaxed">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={`transition-colors duration-300 ${i < committed ? 'text-[#141210] dark:text-[#efe8dc]' : 'text-[#141210]/30 dark:text-[#efe8dc]/30'}`}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
