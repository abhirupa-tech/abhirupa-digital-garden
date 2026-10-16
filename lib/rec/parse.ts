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

type StreamEvent = {
  type?: unknown;
  object?: unknown;
  model?: unknown;
  error?: string | { message?: unknown };
  // OpenAI Chat Completions
  choices?: { delta?: { content?: unknown } }[];
  // OpenAI Responses, Vercel AI SDK (delta is a string); Anthropic (delta.text)
  delta?: unknown;
  // Anthropic message_start, OpenAI Responses response.created
  message?: { model?: unknown };
  response?: { model?: unknown };
  // Gemini
  candidates?: { content?: { parts?: { text?: unknown }[] } }[];
  modelVersion?: unknown;
};

/**
 * The text a streamed event adds, across the common LLM stream formats. Replay
 * always re-emits OpenAI Chat Completions, so any of these can become a tape.
 */
function textOf(e: StreamEvent): string {
  // OpenAI Chat Completions
  const chat = e.choices?.[0]?.delta?.content;
  if (typeof chat === 'string') return chat;
  // OpenAI Responses API, Vercel AI SDK UI stream
  if ((e.type === 'response.output_text.delta' || e.type === 'text-delta') && typeof e.delta === 'string') {
    return e.delta;
  }
  // Anthropic Messages
  if (e.type === 'content_block_delta' && e.delta && typeof e.delta === 'object') {
    const text = (e.delta as { text?: unknown }).text;
    if (typeof text === 'string') return text;
  }
  // Gemini
  const parts = e.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('');
  }
  return '';
}

function modelOf(e: StreamEvent): string | undefined {
  for (const m of [e.model, e.message?.model, e.response?.model, e.modelVersion]) {
    if (typeof m === 'string' && m) return m;
  }
  return undefined;
}

/**
 * ChatGPT's web app (chatgpt.com) streams `event: delta` operations against a
 * message object rather than text deltas (`delta_encoding: v1`):
 *
 *   {"p": "", "o": "add", "v": {"message": {author, content, metadata}}}   start a message
 *   {"p": "/message/content/parts/0", "o": "append", "v": "Hel"}          add text
 *   {"v": "lo"}                                                             repeat the last op
 *   {"p": "", "o": "patch", "v": [ ...ops ]}  or  {"v": [ ...ops ]}         a batch of ops
 *
 * Only the assistant's visible text message counts: the user's input and any
 * reasoning ("thoughts") messages are skipped. An undocumented, private format,
 * so it may need updating if it changes.
 */
type ChatgptOp = { p?: unknown; o?: unknown; v?: unknown };
type ChatgptMessage = {
  author?: { role?: unknown };
  content?: { content_type?: unknown; parts?: unknown[] };
  metadata?: { model_slug?: unknown };
};

function chatgptDecoder() {
  const state = { path: '', op: '', active: false };
  let model: string | undefined;

  const apply = (op: ChatgptOp): string => {
    // A bare list of ops is a batch, and leaves the "last op" untouched.
    if (op.p === undefined && op.o === undefined && Array.isArray(op.v)) {
      return (op.v as ChatgptOp[]).map(apply).join('');
    }
    if (typeof op.p === 'string') state.path = op.p;
    if (typeof op.o === 'string') state.op = op.o;
    const { path, op: kind } = state;

    if (kind === 'patch' && Array.isArray(op.v)) return (op.v as ChatgptOp[]).map(apply).join('');

    if (kind === 'add' && path === '' && op.v && typeof op.v === 'object' && 'message' in op.v) {
      const message = (op.v as { message?: ChatgptMessage }).message ?? {};
      const type = message.content?.content_type;
      state.active = message.author?.role === 'assistant' && (type === 'text' || type === 'multimodal_text');
      if (state.active && typeof message.metadata?.model_slug === 'string') model ??= message.metadata.model_slug;
      const first = message.content?.parts?.[0];
      return state.active && typeof first === 'string' ? first : '';
    }

    if (kind === 'append' && path === '/message/content/parts/0' && state.active && typeof op.v === 'string') {
      return op.v;
    }
    return '';
  };

  return {
    get model() {
      return model;
    },
    text(e: StreamEvent, name: string | undefined): string {
      if (typeof e.type === 'string') return ''; // input_message, message_marker, …
      if (name !== 'delta' && !('v' in e)) return '';
      return apply(e as ChatgptOp);
    },
  };
}

export function captureToTape(capture: Capture): Tape {
  const deltas: { t: number; text: string }[] = [];
  let model = capture.model;
  let buffer = '';

  const seen = new Set<string>();
  let nonJson = 0;
  const chatgpt = chatgptDecoder();
  let sawData = false;

  const takeEvent = (event: string, t: number) => {
    const lines = event.split(/\r?\n/);
    const name = lines.find((line) => line.startsWith('event:'))?.slice(6).trim();
    const data = lines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).replace(/^ /, ''))
      .join('\n');
    if (!data) return;
    sawData = true;
    if (data === '[DONE]') return;

    let json: StreamEvent;
    try {
      json = JSON.parse(data);
    } catch {
      nonJson++; // keepalives and comments: skip, judge the stream as a whole
      return;
    }
    if (!json || typeof json !== 'object') {
      if (name) seen.add(name); // e.g. ChatGPT's `event: delta_encoding` / `data: "v1"`
      return;
    }
    if (json.error) {
      const message = typeof json.error === 'string' ? json.error : json.error.message;
      throw new ParseError(`The captured stream is an error response: ${String(message ?? 'unknown')}`);
    }
    seen.add(typeof json.type === 'string' ? json.type : (name ?? (json.object as string) ?? 'untyped'));
    model ??= modelOf(json);
    const text = textOf(json) || chatgpt.text(json, name);
    model ??= chatgpt.model;
    if (text) deltas.push({ t, text });
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
    if (seen.size === 0) {
      throw new ParseError(
        nonJson
          ? 'The stream’s data isn’t JSON, so this isn’t an LLM text stream rec can read.'
          : sawData
            ? 'The stream ended without any text.'
            : 'The capture has no SSE data lines. Was the answer streamed (stream: true)?',
      );
    }
    const kinds = [...seen].slice(0, 6).join(', ');
    throw new ParseError(
      `No text found in this stream. It carried these event types: ${kinds}. ` +
        'rec reads OpenAI Chat Completions and Responses, ChatGPT web, Anthropic, Gemini and Vercel AI SDK text streams.',
    );
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
