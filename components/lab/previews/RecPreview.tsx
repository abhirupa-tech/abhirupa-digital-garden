'use client';

import { Silkscreen } from 'next/font/google';
import { PixelDeck } from '../rec/PixelDeck';
import { useLoopStep } from './useLoopStep';
import '../rec/rec.css';

const silkscreen = Silkscreen({ subsets: ['latin'], weight: '400', display: 'swap' });

const TOKENS = ['Streams', ' never', ' repeat', '.', ' Tapes', ' do', '.'];
// ms before each step: a recorded-feeling rhythm, then a hold before rewinding.
const DELAYS = [700, 140, 90, 210, 60, 380, 120, 2200];

/** Lab tile preview for rec: the deck playing, a stream typing in below it. */
export function RecPreview() {
  const { ref, step, running } = useLoopStep(DELAYS);
  const text = TOKENS.slice(0, step).join('');

  return (
    <div
      ref={ref}
      className="rec-root flex h-full w-full flex-col items-center justify-center gap-[6%] bg-linear-to-br from-[#3a2a20] via-[#2b1d16] to-[#4a2616] p-[7%]"
      data-playing={running && step > 0 && step < TOKENS.length}
      aria-hidden
    >
      <div className="w-[62%] max-w-80">
        <PixelDeck playing={running} speed={1} />
      </div>
      <div
        className={`${silkscreen.className} flex w-[78%] max-w-96 items-center gap-2 rounded-md border border-[#f2dfb6]/15 bg-black/30 px-3 py-2 text-[clamp(0.55rem,1.4vw,0.8rem)] text-[#f2dfb6]`}
      >
        <span className="rec-led inline-block h-1.5 w-1.5 shrink-0 bg-[#e2342b]" />
        <span className="truncate">
          {text}
          <span className="ml-0.5 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-[#f2dfb6]/70 motion-safe:animate-pulse" />
        </span>
      </div>
    </div>
  );
}
