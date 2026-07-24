import { Reveal } from '../motion/Reveal';

const PORTRAIT_URL =
  'https://res.cloudinary.com/ra5tg986/image/upload/v1784876463/abhirupa-mitra_lozlsu.png';

/**
 * The tall 9:16 portrait with a floating annotation card. Meant to be dropped
 * into a sticky container by the page so it stays in view while the timeline
 * scrolls.
 */
export function Portrait() {
  return (
    <Reveal delay={0.15} from="right" className="relative mx-auto max-w-sm lg:mr-0">
      <div className="aspect-[9/16] overflow-hidden rounded-2xl border border-parchment/10 bg-ink-700/40 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PORTRAIT_URL}
          alt="Abhirupa Mitra"
          className="h-full w-full object-cover"
        />
      </div>
      {/* Floating annotation overlapping the portrait's lower-left */}
      <div className="absolute -bottom-5 -left-4 max-w-[13rem] rounded-xl border border-parchment/10 bg-[#f9f8f5] px-4 py-3 shadow-xs backdrop-blur-sm sm:-left-8">
        <span className="label text-parchment-faint">Based in</span>
        <p className="mt-1 font-display text-lg leading-tight text-parchment">
          Bengaluru, India
        </p>
        <p className="mt-1 font-rounded text-xs font-light text-parchment-muted">
          Frontend for AI · tending a digital garden
        </p>
      </div>
    </Reveal>
  );
}
