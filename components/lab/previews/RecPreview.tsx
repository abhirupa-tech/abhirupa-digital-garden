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
 * Ember palette on a field that follows the site theme (warm parchment or warm
 * dark), to sit with the portfolio; the rec page itself is always dark. The deck sizes by
 * height so it fits both the tall and the wide specimen windows.
 */
export function RecPreview() {
  const { ref, step, running } = useLoopStep(DELAYS);
  const text = TOKENS.slice(0, step).join('');

  return (
    <div
      ref={ref}
      className="rec-root flex h-full w-full flex-col items-center justify-center gap-[6%] bg-[radial-gradient(ellipse_at_50%_35%,#fbe1c8_0%,#f4e8d7_55%,#ede3d2_100%)] p-[6%] dark:bg-[radial-gradient(ellipse_at_50%_35%,#3a2316_0%,#1a1513_55%,#0f0d0c_100%)]"
      data-playing={running && step > 0 && step < TOKENS.length}
      aria-hidden
    >
      <div className="aspect-[96/56] h-[52%] max-w-[70%]">
        <PixelDeck playing={running} speed={1} palette="ember" />
      </div>
      <div
        className={`${silkscreen.className} flex w-[78%] max-w-96 items-center gap-2 rounded-md border border-[#3a2a20]/15 bg-white/60 px-3 py-2 text-[clamp(0.55rem,1.4vw,0.8rem)] text-[#3a2a20] dark:border-[#f2dfb6]/15 dark:bg-black/30 dark:text-[#efe8dc]`}
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
