import { TileFrame } from './TileFrame';

/**
 * Agent "thinking" state — a reasoning trace with a shimmer line, showing the
 * agent is mid-thought rather than merely "busy". Static frame.
 */
export function AgentThinking() {
  return (
    <TileFrame
      label="Thinking"
      hint="Reasoning in the open, not a black box."
      className="min-h-[15rem]"
    >
      <div className="w-full">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-highlight/90" />
            <span className="h-2 w-2 rounded-full bg-highlight/60" />
            <span className="h-2 w-2 rounded-full bg-highlight/30" />
          </span>
          <span className="font-rounded text-sm font-medium text-parchment">Thinking</span>
        </div>
        <div className="mt-4 space-y-2.5">
          <p className="font-rounded text-sm leading-relaxed text-parchment/80">
            Checking the three linked reports for conflicting dates&hellip;
          </p>
          <div className="h-3 w-4/5 rounded-full bg-linear-to-r from-hairline via-sand/40 to-hairline" />
          <div className="h-3 w-3/5 rounded-full bg-hairline" />
        </div>
      </div>
    </TileFrame>
  );
}
