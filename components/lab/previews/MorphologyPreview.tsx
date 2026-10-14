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
 */
export function MorphologyPreview() {
  const { ref, step } = useLoopStep(DELAYS);
  const committed = Math.min(step, WORDS.length);
  const spokenBars = Math.round((committed / WORDS.length) * BARS.length);
  const thinking = committed < WORDS.length;

  return (
    <div
      ref={ref}
      className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary-bg via-tertiary-bg/70 to-secondary-bg p-[7%]"
      aria-hidden
    >
      <div className="w-full max-w-md rounded-xl border border-hairline bg-primary-bg/85 p-[5%] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full bg-highlight ${thinking ? 'motion-safe:animate-pulse' : 'opacity-30'}`}
                style={{ animationDelay: `${i * 160}ms`, opacity: thinking ? 0.9 - i * 0.25 : undefined }}
              />
            ))}
          </span>
          <span className="label text-parchment-faint">{thinking ? 'Speaking' : 'Committed'}</span>
        </div>

        <div className="mt-3 flex h-10 items-end gap-[3px]">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`flex-1 rounded-full transition-colors duration-300 ${i < spokenBars ? 'bg-highlight' : 'bg-hairline'}`}
              style={{ height: `${Math.round((h + 6) * 0.9)}px` }}
            />
          ))}
        </div>

        <p className="mt-3 font-rounded text-[clamp(0.7rem,1.5vw,0.9rem)] leading-relaxed">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={`transition-colors duration-300 ${i < committed ? 'text-parchment' : 'text-parchment/35'}`}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
