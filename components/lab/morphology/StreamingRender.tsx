import { TileFrame } from './TileFrame';

/**
 * Partial text-to-speech render. A speech waveform sits above a transcript in
 * which committed words are solid and the trailing, still-being-spoken words
 * fade to faint — the visible difference between committed and partial output.
 * Static bar heights (deterministic, no randomness) keep the export stable.
 */
const BARS = [
  8, 14, 22, 30, 24, 16, 10, 18, 28, 34, 26, 20, 12, 22, 32, 38, 30, 24, 16, 10,
  14, 24, 30, 22, 14, 9, 16, 26, 20, 12,
];

export function StreamingRender() {
  // The first N bars are "spoken" (committed); the rest are ahead of the cursor.
  const spoken = 19;
  return (
    <TileFrame
      label="Streaming render · TTS"
      hint="Committed speech is solid; the trailing edge is still forming."
      className="min-h-[15rem]"
    >
      <div className="w-full">
        <div className="flex h-16 items-end gap-[3px]" aria-hidden="true">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`w-1.5 flex-1 rounded-full ${i < spoken ? 'bg-highlight' : 'bg-hairline'}`}
              style={{ height: `${h + 6}px` }}
            />
          ))}
        </div>
        <p className="mt-5 font-rounded text-base leading-relaxed">
          <span className="text-parchment">
            Here is the summary you asked for, drawn from the three most recent
          </span>{' '}
          <span className="text-parchment/45">
            reports before I move on to the open questions&hellip;
          </span>
        </p>
      </div>
    </TileFrame>
  );
}
