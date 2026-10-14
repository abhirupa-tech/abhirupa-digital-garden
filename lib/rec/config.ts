/**
 * Where replay URLs point. The portfolio is a static export on GitHub Pages,
 * which can't answer a POST, so replay runs on Vercel from its own repo:
 * github.com/abhirupa-tech/rec-mock-llm-response-recorder
 */
export const REPLAY_ORIGIN = (
  process.env.NEXT_PUBLIC_REC_REPLAY_ORIGIN || 'https://rec-mock-llm-response-recorder.vercel.app'
).replace(/\/+$/, '');

export const REC_REPO_URL = 'https://github.com/abhirupa-tech/rec-mock-llm-response-recorder';

export function replayUrl(encoded: string): string {
  return `${REPLAY_ORIGIN}/t/${encoded}`;
}

/** The encoded tape inside a replay URL. */
export function segmentFromUrl(url: string): string {
  return url.match(/\/t\/([^/?#]+)/)?.[1] ?? '';
}
