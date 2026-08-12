import { TileFrame } from './TileFrame';

/**
 * Agent-to-agent handoff that has stalled: the connection between two agents
 * dropped, and the interface is waiting for it to come back. Two agent nodes
 * with a broken link between them and a "reconnecting" status. Static frame.
 */
export function AgentHandoff() {
  return (
    <TileFrame
      label="Agent handoff"
      hint="The link between two agents dropped — waiting to reconnect."
      className="min-h-[15rem]"
    >
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <AgentNode name="Planner" state="done" />
          <div className="flex flex-1 items-center" aria-hidden="true">
            <span className="h-px flex-1 bg-hairline" />
            <span className="mx-1 border-t border-dashed border-highlight/70 px-2 text-highlight">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <span className="h-px flex-1 bg-hairline" />
          </div>
          <AgentNode name="Executor" state="waiting" />
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-highlight/30 bg-highlight/[0.06] px-3 py-2">
          <span
            className="h-2 w-2 rounded-full bg-highlight motion-safe:animate-pulse"
            aria-hidden="true"
          />
          <p className="font-rounded text-sm text-parchment-muted">
            Connection lost — reconnecting to Executor&hellip;
          </p>
        </div>
      </div>
    </TileFrame>
  );
}

function AgentNode({ name, state }: { name: string; state: 'done' | 'waiting' }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm ${
          state === 'done'
            ? 'border-sand/50 bg-sand/10 text-sand'
            : 'border-highlight/50 bg-highlight/10 text-highlight'
        }`}
      >
        {name[0]}
      </span>
      <span className="label text-parchment-faint">{name}</span>
    </div>
  );
}
