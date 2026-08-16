import { TileFrame } from './TileFrame';

/**
 * A button frozen mid-load — the legacy paradigm the page critiques: a single
 * spinner that says "working" but nothing about state, confidence, or progress.
 * The spin runs only for motion-safe users; the frame stands alone otherwise.
 */
export function LoadingButton() {
  return (
    <TileFrame
      label="Loading button"
      hint="The legacy signal: busy, but silent about state."
    >
      <div className="flex w-full flex-col items-center gap-4">
        <button
          type="button"
          disabled
          className="flex h-11 items-center gap-2.5 rounded-full bg-sand px-6 font-rounded text-sm font-medium text-white opacity-90"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 motion-safe:animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
          Generating&hellip;
        </button>
        <p className="label text-parchment-faint">answer / no answer</p>
      </div>
    </TileFrame>
  );
}
