import { TileFrame } from './TileFrame';

/**
 * AI chat composer at rest: a text field with an attach affordance, a model
 * pill, and a send button. Presentational only.
 */
export function ChatComposer() {
  return (
    <TileFrame
      label="Composer"
      hint="Where the human hands intent to the agent."
      className="min-h-[15rem]"
    >
      <div className="w-full rounded-2xl border border-hairline bg-primary-bg/70 p-3 shadow-sm">
        <p className="min-h-[3.5rem] font-rounded text-base leading-relaxed text-parchment/70">
          Summarize this thread and draft a reply
          <span className="ml-0.5 inline-block h-5 w-px translate-y-1 bg-highlight align-middle" />
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Attach"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-parchment-muted"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9 17.3" />
              </svg>
            </button>
            <span className="label rounded-full border border-hairline px-2.5 py-1 text-parchment-muted">
              Claude Opus
            </span>
          </div>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full bg-highlight px-4 font-rounded text-sm font-medium text-white"
          >
            Send
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </TileFrame>
  );
}
