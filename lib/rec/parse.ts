/**
 * Capture JSON (what the console snippet prints) -> Tape.
 *
 * The snippet records raw network reads, and a read rarely lines up with an
 * SSE event: one read can hold several events, or half of one. So the parser
 * re-frames the byte stream into events, and stamps each event with the time
 * of the read that completed it.
 *
 * Canonical copy. The portfolio gateway (abhirupa-digital-garden,
 * lib/rec/parse.ts) carries an identical copy — change both together.
 */
import type { Tape } from './tape';

export type Capture = {
  provider: 'openai';
  model?: string;
  /** performance.now() when the request was sent. */
  t0: number;
  /** One entry per network read: performance.now() and the decoded text. */
  chunks: { t: number; raw: string }[];
};

export class ParseError extends Error {
  override name = 'ParseError';
}

/** Parse pasted text into a tape. Throws ParseError with a message fit for the UI. */
export function parseCapture(text: string): Tape {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new ParseError('That isn’t JSON. Paste the whole object the capture snippet printed.');
  }
  return captureToTape(readCapture(value));
}

function readCapture(value: unknown): Capture {
  // `copy(rec.tapes)` pastes every capture; take the latest.
  if (Array.isArray(value)) value = value[value.length - 1];
  if (!value || typeof value !== 'object') {
    throw new ParseError('Expected an object with provider, t0 and chunks.');
  }
  const c = value as Record<string, unknown>;
  if (c.provider !== 'openai') {
    throw new ParseError(
      c.provider === undefined
        ? 'Missing "provider". Only "openai" (Chat Completions) is supported for now.'
        : `Provider "${String(c.provider)}" isn’t supported yet. Only "openai" (Chat Completions) is.`,
    );
  }
  if (typeof c.t0 !== 'number' || !Number.isFinite(c.t0)) {
    throw new ParseError('Missing "t0", the request start time.');
  }
  if (!Array.isArray(c.chunks) || c.chunks.length === 0) {
    throw new ParseError('No chunks were captured. Was the response streamed?');
  }
  for (const [i, chunk] of c.chunks.entries()) {
    if (
      !chunk ||
      typeof chunk !== 'object' ||
      typeof (chunk as { t?: unknown }).t !== 'number' ||
      typeof (chunk as { raw?: unknown }).raw !== 'string'
    ) {
      throw new ParseError(`Chunk ${i + 1} needs a numeric "t" and a string "raw".`);
    }
  }
  return {
    provider: 'openai',
    model: typeof c.model === 'string' ? c.model : undefined,
    t0: c.t0,
    chunks: c.chunks as Capture['chunks'],
  };
}

export function captureToTape(capture: Capture): Tape {
  const deltas: { t: number; text: string }[] = [];
  let model = capture.model;
  let buffer = '';

  const takeEvent = (event: string, t: number) => {
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).replace(/^ /, ''))
      .join('\n');
    if (!data || data === '[DONE]') return;

    let json: {
      model?: unknown;
      choices?: { delta?: { content?: unknown } }[];
      error?: { message?: unknown };
    };
    try {
      json = JSON.parse(data);
    } catch {
      throw new ParseError('A chunk holds data that isn’t JSON. Is this an OpenAI Chat Completions stream?');
    }
    if (json.error) {
      throw new ParseError(`The captured stream is an error response: ${String(json.error.message ?? 'unknown')}`);
    }
    if (!model && typeof json.model === 'string') model = json.model;
    const content = json.choices?.[0]?.delta?.content;
    if (typeof content === 'string' && content.length > 0) deltas.push({ t, text: content });
  };

  for (const { t, raw } of capture.chunks) {
    buffer += raw;
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? '';
    for (const event of events) takeEvent(event, t);
  }
  // A stream that ends without a trailing blank line still has a last event.
  if (buffer.trim()) takeEvent(buffer, capture.chunks[capture.chunks.length - 1].t);

  if (deltas.length === 0) {
    throw new ParseError('The stream has no text deltas. Tool-call-only responses aren’t supported yet.');
  }

  // Round offsets from the first delta, then diff them, so per-gap rounding
  // never drifts the total.
  const first = deltas[0].t;
  let previous = 0;
  return {
    v: 1,
    m: model ?? 'unknown',
    f: Math.max(0, Math.round(first - capture.t0)),
    c: deltas.map(({ t, text }) => {
      const offset = Math.max(previous, Math.round(t - first));
      const gap = offset - previous;
      previous = offset;
      return [gap, text];
    }),
  };
}
