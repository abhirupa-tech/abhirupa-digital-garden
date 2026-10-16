'use client';

import { silkscreen } from '../rec/fonts';
import { PixelDeck } from '../rec/PixelDeck';
import { useLoopStep } from './useLoopStep';
import '../rec/rec.css';

const TOKENS = ['Streams', ' never', ' repeat', '.', ' Tapes', ' do', '.'];
// ms before each step: a recorded-feeling rhythm, then a hold before rewinding.
const DELAYS = [700, 140, 90, 210, 60, 380, 120, 2200];

/**
 * Lab tile preview for rec: the deck playing, a stream typing in below it.
 * Ember palette and a warm dark field, to sit with the portfolio's rust and
 * parchment (the rec page itself keeps its night palette). The deck sizes by
 * height so it fits both the tall and the wide specimen windows.
 */
export function RecPreview() {
  const { ref, step, running } = useLoopStep(DELAYS);
  const text = TOKENS.slice(0, step).join('');

  return (
    <div
      ref={ref}
      className="rec-root flex h-full w-full flex-col items-center justify-center gap-[6%] bg-[radial-gradient(ellipse_at_50%_35%,#3a2316_0%,#1a1513_55%,#0f0d0c_100%)] p-[6%]"
      data-playing={running && step > 0 && step < TOKENS.length}
      aria-hidden
    >
      <div className="aspect-[96/56] h-[52%] max-w-[70%]">
        <PixelDeck playing={running} speed={1} palette="ember" />
      </div>
      <div
        className={`${silkscreen.className} flex w-[78%] max-w-96 items-center gap-2 rounded-md border border-[#f2dfb6]/15 bg-black/30 px-3 py-2 text-[clamp(0.55rem,1.4vw,0.8rem)] text-[#efe8dc]`}
      >
        <span className="rec-led inline-block h-1.5 w-1.5 shrink-0 bg-[#e2342b]" />
        <span className="truncate">
          {text}
          <span className="ml-0.5 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-[#ef6a2a] motion-safe:animate-pulse" />
        </span>
      </div>
    </div>
  );
}
