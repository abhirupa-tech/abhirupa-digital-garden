'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { replayUrl, segmentFromUrl } from '@/lib/rec/config';
import { parseCapture, ParseError } from '@/lib/rec/parse';
import {
  listTapes,
  readShelf,
  removeTape,
  renameTape,
  saveTape,
  SHELF_KEY,
  SHELF_MAX,
  type Shelf,
  type TapeEntry,
} from '@/lib/rec/shelf';
import { sampleCapture } from '@/lib/rec/sample';
import { CAPTURE_SNIPPET } from '@/lib/rec/snippet';
import { decodeTape, encodeTape, MAX_ENCODED_BYTES, tapeDurationMs, tapeId, type Tape } from '@/lib/rec/tape';
import { PixelCassette, PixelDeck } from './PixelDeck';
import { usePlayback } from './usePlayback';
import './rec.css';

type View = 'record' | 'tape' | 'shelf';
type Draft = { tape: Tape; encoded: string; id: string };
type Current = { entry: TapeEntry; tape: Tape };

const SPEEDS = [0.5, 1, 2, 4];

export function RecGateway() {
  const [view, setView] = useState<View>('record');
  const [paste, setPaste] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Current | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1);
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const playback = usePlayback();
  const reduce = useReducedMotion();

  // The shelf is read from localStorage as an external store: empty in the
  // static build, then the browser's value, and kept in sync across tabs.
  const shelfRaw = useSyncExternalStore(subscribeShelf, readShelfRaw, () => null);
  const shelf = useMemo(() => readShelf(shelfRaw), [shelfRaw]);
  const commitShelf = useCallback((next: Shelf) => writeShelfRaw(JSON.stringify(next)), []);

  // Parse live as the user pastes; drop results from stale pastes.
  const parseRun = useRef(0);
  const onPaste = useCallback((value: string) => {
    setPaste(value);
    const run = ++parseRun.current;
    if (!value.trim()) {
      setDraft(null);
      setDraftError(null);
      return;
    }
    setNotice(null);
    (async () => {
      try {
        const tape = parseCapture(value);
        const encoded = await encodeTape(tape);
        const id = await tapeId(encoded);
        if (run !== parseRun.current) return;
        setDraft({ tape, encoded, id });
        setDraftError(null);
      } catch (error) {
        if (run !== parseRun.current) return;
        setDraft(null);
        setDraftError(error instanceof ParseError ? error.message : 'That capture couldn’t be read.');
      }
    })();
  }, []);

  const tooBig = draft ? draft.encoded.length > MAX_ENCODED_BYTES : false;

  const openEntry = useCallback(
    async (entry: TapeEntry) => {
      try {
        const tape = await decodeTape(segmentFromUrl(entry.url));
        playback.reset();
        setCurrent({ entry, tape });
        setView('tape');
      } catch {
        setNotice('That tape’s URL is damaged. Remove it and record it again.');
      }
    },
    [playback],
  );

  const save = useCallback(() => {
    if (!draft || tooBig) return;
    const entry: TapeEntry = {
      id: draft.id,
      name: `Tape ${draft.id.slice(0, 4)}`,
      url: replayUrl(draft.encoded),
      model: draft.tape.m,
      chunks: draft.tape.c.length,
      durationMs: tapeDurationMs(draft.tape),
      bytes: draft.encoded.length,
      createdAt: Date.now(),
    };
    const result = saveTape(shelf, entry);
    if (result.status === 'full') {
      setNotice(`The shelf holds ${SHELF_MAX} tapes. Remove one to save this.`);
      return;
    }
    commitShelf(result.shelf);
    const saved = result.shelf.tapes[draft.id];
    setNotice(result.status === 'exists' ? 'Already on your shelf. Same recording, same URL.' : null);
    setJustSaved(result.status === 'added' ? draft.id : null);
    onPaste('');
    playback.reset();
    setCurrent({ entry: saved, tape: draft.tape });
    setView('tape');
  }, [draft, tooBig, shelf, commitShelf, playback, onPaste]);

  const tapes = useMemo(() => listTapes(shelf), [shelf]);

  return (
    <div className="rec-root" data-playing={playback.playing}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* Deck */}
        <div className="lg:sticky lg:top-28">
          <div className="rec-glow rounded-2xl border border-(--rec-line) bg-(--rec-panel) p-5 md:p-7">
            <PixelDeck playing={playback.playing} speed={speed} />
            <div className="rec-pixel mt-5 flex items-center justify-between text-xs text-(--rec-muted)">
              <span className="flex items-center gap-2">
                <span className="rec-led inline-block h-2 w-2 bg-[#ff3b5c]" aria-hidden />
                {playback.playing ? 'Playing' : current ? 'Loaded' : 'No tape'}
              </span>
              <motion.span aria-label="Elapsed">{playback.elapsed}</motion.span>
            </div>
          </div>

          <div role="tablist" aria-label="rec" className="mt-4 grid grid-cols-3 gap-2">
            <DeckKey active={view === 'record'} onClick={() => setView('record')} label="Rec" glyph="●" />
            <DeckKey
              active={view === 'tape'}
              onClick={() => setView('tape')}
              label="Tape"
              glyph="▶"
              disabled={!current}
            />
            <DeckKey
              active={view === 'shelf'}
              onClick={() => setView('shelf')}
              label={`Shelf ${tapes.length}`}
              glyph="▤"
            >
              {/* Saving slides a cassette off the deck onto the Shelf key. */}
              <AnimatePresence>
                {justSaved && !reduce && (
                  <motion.span
                    key={justSaved}
                    aria-hidden
                    className="pointer-events-none absolute -top-4 left-1/2 -ml-4"
                    initial={{ x: -140, y: -36, opacity: 0, scale: 1.6 }}
                    animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: 1 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    onAnimationComplete={() => setJustSaved(null)}
                  >
                    <PixelCassette className="h-5 w-8" />
                  </motion.span>
                )}
              </AnimatePresence>
            </DeckKey>
          </div>
        </div>

        {/* Panel */}
        <div role="tabpanel" aria-live="polite" className="min-w-0">
          {notice && (
            <p className="mb-4 rounded-xl border border-(--rec-violet)/40 bg-(--rec-violet)/10 px-4 py-3 text-sm text-(--rec-fg)">
              {notice}
            </p>
          )}

          {view === 'record' && (
            <div className="space-y-10">
              <Step n={1} title="Open your app’s console">
                <p>
                  Open the app whose streaming you want to test, then open DevTools and its Console:{' '}
                  <Kbd>⌥⌘J</Kbd> on Mac, <Kbd>Ctrl+Shift+J</Kbd> on Windows and Linux.
                </p>
                <p>
                  Chrome may refuse the first paste. If it asks, type <Code>allow pasting</Code> and press
                  Enter.
                </p>
              </Step>

              <Step n={2} title="Paste the recorder and press Enter">
                <CodeBlock code={CAPTURE_SNIPPET} label="Copy snippet" maxHeight />
                <p>
                  The console should say <Code>● rec recording</Code>. It records response chunks only,
                  never headers, prompts or keys.
                </p>
              </Step>

              <Step n={3} title="Stream one answer">
                <p>
                  In your app, send a message and let the whole answer stream in. When it finishes, the
                  console says <Code>● rec captured N chunks</Code>.
                </p>
              </Step>

              <Step n={4} title="Copy the capture">
                <p>
                  Type <Code>rec.copy()</Code> in the console and press Enter. The capture is now on your
                  clipboard.
                </p>
              </Step>

              <Step n={5} title="Paste it here">
                <label htmlFor="rec-paste" className="sr-only">
                  Capture JSON
                </label>
                <textarea
                  id="rec-paste"
                  value={paste}
                  onChange={(e) => onPaste(e.target.value)}
                  spellCheck={false}
                  rows={7}
                  placeholder='{ "provider": "openai", "t0": …, "chunks": [ … ] }'
                  className="w-full resize-y rounded-xl border border-(--rec-line) bg-black/50 p-4 font-mono text-xs leading-relaxed text-(--rec-fg) placeholder:text-(--rec-faint) focus:border-(--rec-violet)/70 focus:outline-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-(--rec-faint)">
                    Anyone with a tape&rsquo;s URL can read its text. Don&rsquo;t record sensitive answers.
                  </p>
                  <button
                    type="button"
                    onClick={() => onPaste(sampleCapture())}
                    className="rec-pixel rounded-md border border-(--rec-line) px-2.5 py-1.5 text-[0.65rem] text-(--rec-muted) transition-colors hover:border-(--rec-violet)/60 hover:text-(--rec-hot)"
                  >
                    No app handy? Load a sample
                  </button>
                </div>

                {draftError && <p className="text-sm text-(--rec-hot)">{draftError}</p>}

                {draft && (
                  <div className="space-y-4 rounded-xl border border-(--rec-line) bg-(--rec-panel) p-4">
                    <dl className="rec-pixel grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
                      <Stat label="Chunks" value={String(draft.tape.c.length)} />
                      <Stat label="Duration" value={formatMs(tapeDurationMs(draft.tape))} />
                      <Stat label="TTFB" value={formatMs(draft.tape.f)} />
                      <Stat label="Model" value={draft.tape.m} />
                    </dl>
                    <SizeMeter bytes={draft.encoded.length} />
                    {tooBig ? (
                      <p className="text-sm text-(--rec-hot)">
                        This tape is {formatBytes(draft.encoded.length)}, over the{' '}
                        {formatBytes(MAX_ENCODED_BYTES)} a URL can safely carry. Record a shorter answer.
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={save}
                        className="rec-pixel inline-flex items-center gap-2 rounded-lg bg-(--rec-violet-deep) px-4 py-2.5 text-xs text-white transition-colors hover:bg-(--rec-violet)"
                      >
                        <span aria-hidden>●</span> Save tape
                      </button>
                    )}
                  </div>
                )}
              </Step>
            </div>
          )}

          {view === 'tape' && current && (
            <TapeView
              current={current}
              speed={speed}
              onSpeed={setSpeed}
              playback={playback}
            />
          )}

          {view === 'shelf' && (
            <ShelfView
              tapes={tapes}
              onOpen={openEntry}
              onRename={(id, name) => commitShelf(renameTape(shelf, id, name))}
              onRemove={(id) => {
                commitShelf(removeTape(shelf, id));
                if (current?.entry.id === id) {
                  playback.reset();
                  setCurrent(null);
                }
              }}
              onRecord={() => setView('record')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function TapeView({
  current,
  speed,
  onSpeed,
  playback,
}: {
  current: Current;
  speed: number;
  onSpeed: (speed: number) => void;
  playback: ReturnType<typeof usePlayback>;
}) {
  const { entry, tape } = current;
  const curl = `curl -N -X POST "${entry.url}"`;
  const sdk = `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'unused',
  baseURL: '${entry.url}/v1',
});

const stream = await client.chat.completions.create({
  model: '${tape.m}',
  messages: [{ role: 'user', content: 'replay' }],
  stream: true,
});`;

  return (
    <div className="space-y-6">
      <div>
        <p className="rec-pixel text-[0.65rem] text-(--rec-faint)">Replay URL</p>
        <h2 className="mt-1 rec-display text-2xl font-medium text-(--rec-fg)">{entry.name}</h2>
        <p className="rec-pixel mt-1 text-xs text-(--rec-muted)">
          {entry.model} · {entry.chunks} chunks · {formatMs(entry.durationMs)} · {formatBytes(entry.bytes)}
        </p>
      </div>

      <CodeBlock code={entry.url} label="Copy URL" wrap />

      <div className="rounded-2xl border border-(--rec-line) bg-(--rec-panel) p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          {playback.playing ? (
            <PixelButton onClick={playback.stop} glyph="■" label="Stop" />
          ) : (
            <PixelButton onClick={() => playback.play(tape, speed)} glyph="▶" label="Preview" primary />
          )}
          <div className="rec-pixel flex items-center gap-1 text-xs" role="radiogroup" aria-label="Speed">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={speed === s}
                onClick={() => onSpeed(s)}
                disabled={playback.playing}
                className={`rounded-md px-2 py-1.5 transition-colors disabled:opacity-50 ${
                  speed === s
                    ? 'bg-(--rec-panel-2) text-(--rec-fg)'
                    : 'text-(--rec-muted) hover:text-(--rec-hot)'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
        <motion.pre className="mt-4 min-h-28 whitespace-pre-wrap break-words rounded-xl bg-black/50 p-4 text-base leading-relaxed text-(--rec-fg)">
          {playback.text}
        </motion.pre>
        <p className="mt-2 text-xs text-(--rec-faint)">
          Plays in the page with the recorded timing. The URL streams the same thing over the network.
        </p>
      </div>

      <div className="space-y-3">
        <p className="rec-pixel text-[0.65rem] text-(--rec-faint)">curl</p>
        <CodeBlock code={curl} label="Copy" wrap />
        <p className="rec-pixel text-[0.65rem] pt-2 text-(--rec-faint)">OpenAI SDK drop-in</p>
        <CodeBlock code={sdk} label="Copy" />
        <p className="text-xs leading-relaxed text-(--rec-faint)">
          Add <code>?speed=2</code> (0.25 to 10) or <code>?mode=instant</code> to the URL. The request body is
          ignored: every call returns this tape. In a browser, the SDK also needs{' '}
          <code>dangerouslyAllowBrowser: true</code>.
        </p>
      </div>
    </div>
  );
}

function ShelfView({
  tapes,
  onOpen,
  onRename,
  onRemove,
  onRecord,
}: {
  tapes: TapeEntry[];
  onOpen: (entry: TapeEntry) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onRecord: () => void;
}) {
  const reduce = useReducedMotion();

  if (tapes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-(--rec-line) px-6 py-10 text-center">
        <PixelCassette className="mx-auto h-10 w-16" />
        <p className="mt-4 text-sm text-(--rec-muted)">
          The shelf is empty. Tapes you save live in this browser only.
        </p>
        <button
          type="button"
          onClick={onRecord}
          className="rec-pixel mt-4 text-xs text-(--rec-violet) underline-offset-4 hover:text-(--rec-hot) hover:underline"
        >
          Record one
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-(--rec-muted)">
        {tapes.length} of {SHELF_MAX} tapes, saved in this browser. Removing one takes it off your shelf; its URL
        keeps working, because the tape lives inside it.
      </p>
      <ul className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {tapes.map((entry) => (
            <motion.li
              key={entry.id}
              layout={!reduce}
              initial={false}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: 48, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-(--rec-line) bg-(--rec-panel) p-3 md:flex-nowrap"
            >
              <PixelCassette className="h-8 w-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <input
                  defaultValue={entry.name}
                  aria-label="Tape name"
                  maxLength={60}
                  onBlur={(e) => onRename(entry.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 rec-display text-lg text-(--rec-fg) hover:border-(--rec-line) focus:border-(--rec-violet)/70 focus:outline-none"
                />
                <p className="rec-pixel px-1 text-[0.65rem] text-(--rec-faint)">
                  {entry.model} · {formatMs(entry.durationMs)} · {formatBytes(entry.bytes)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <TextAction onClick={() => onOpen(entry)}>Open</TextAction>
                <CopyAction text={entry.url}>Copy URL</CopyAction>
                <TextAction onClick={() => onRemove(entry.id)}>Remove</TextAction>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 md:gap-x-6">
      <span aria-hidden className="rec-step-number">
        {String(n).padStart(2, '0')}
      </span>
      <div className="min-w-0 space-y-3 pt-1 text-sm leading-relaxed text-(--rec-muted) md:pt-2">
        <h2 className="rec-display text-xl font-medium text-(--rec-fg) md:text-2xl">
          <span className="sr-only">Step {n}: </span>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-(--rec-panel-2) px-1.5 py-0.5 text-xs text-(--rec-fg)">{children}</code>;
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-(--rec-line) bg-(--rec-panel-2) px-1.5 py-0.5 font-[family-name:var(--font-rec-mono)] text-xs text-(--rec-fg)">
      {children}
    </kbd>
  );
}

function DeckKey({
  active,
  onClick,
  label,
  glyph,
  disabled = false,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  glyph: string;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`rec-pixel relative flex items-center justify-center gap-2 rounded-lg border px-2 py-3 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-(--rec-violet)/60 bg-(--rec-violet)/10 text-(--rec-violet)'
          : 'border-(--rec-line) text-(--rec-muted) hover:border-(--rec-violet)/50 hover:text-(--rec-hot)'
      }`}
    >
      <span aria-hidden>{glyph}</span>
      {label}
      {children}
    </button>
  );
}

function PixelButton({
  onClick,
  glyph,
  label,
  primary = false,
}: {
  onClick: () => void;
  glyph: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rec-pixel inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs transition-colors ${
        primary
          ? 'bg-(--rec-violet-deep) text-white hover:bg-(--rec-violet)'
          : 'border border-(--rec-line) text-(--rec-fg) hover:border-(--rec-violet)/60 hover:text-(--rec-hot)'
      }`}
    >
      <span aria-hidden>{glyph}</span>
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-(--rec-faint)">{label}</dt>
      <dd className="mt-1 truncate text-(--rec-fg)" title={value}>
        {value}
      </dd>
    </div>
  );
}

function SizeMeter({ bytes }: { bytes: number }) {
  const ratio = Math.min(1, bytes / MAX_ENCODED_BYTES);
  const over = bytes > MAX_ENCODED_BYTES;
  return (
    <div>
      <div className="rec-pixel flex justify-between text-[0.65rem] text-(--rec-faint)">
        <span>URL size</span>
        <span className={over ? 'text-(--rec-hot)' : undefined}>
          {formatBytes(bytes)} / {formatBytes(MAX_ENCODED_BYTES)}
        </span>
      </div>
      {/* Segmented, like a VU meter. */}
      <div className="mt-1.5 grid grid-cols-20 gap-0.5" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className={`h-2 ${
              i < Math.ceil(ratio * 20) ? (over || i >= 16 ? 'bg-(--rec-hot)' : 'bg-(--rec-violet)') : 'bg-(--rec-panel-2)'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CodeBlock({
  code,
  label,
  wrap = false,
  maxHeight = false,
}: {
  code: string;
  label: string;
  wrap?: boolean;
  maxHeight?: boolean;
}) {
  return (
    <div className="relative">
      <pre
        className={`rounded-xl bg-(--rec-panel-2) p-4 pr-24 font-mono text-xs leading-relaxed text-(--rec-fg) ${
          wrap ? 'whitespace-pre-wrap break-all' : 'overflow-x-auto'
        } ${maxHeight ? 'max-h-56 overflow-y-auto' : ''}`}
      >
        {code}
      </pre>
      <div className="absolute right-2 top-2">
        <CopyAction text={code} boxed>
          {label}
        </CopyAction>
      </div>
    </div>
  );
}

function CopyAction({ text, children, boxed = false }: { text: string; children: ReactNode; boxed?: boolean }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard blocked: the text is still selectable on the page.
        }
      }}
      className={`rec-pixel rounded-md px-2 py-1.5 text-[0.65rem] transition-colors hover:text-(--rec-hot) ${
        boxed ? 'border border-(--rec-line) bg-black/60 text-(--rec-muted)' : 'text-(--rec-muted)'
      }`}
    >
      {copied ? 'Copied' : children}
    </button>
  );
}

function TextAction({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rec-pixel rounded-md px-2 py-1.5 text-[0.65rem] text-(--rec-muted) transition-colors hover:text-(--rec-hot)"
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------

function formatMs(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
}

function formatBytes(bytes: number): string {
  return bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} kB`;
}

// localStorage as an external store. `storage` events cover other tabs; the
// local listener set covers writes from this one.
const shelfListeners = new Set<() => void>();

function subscribeShelf(onChange: () => void) {
  shelfListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    shelfListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readShelfRaw(): string | null {
  try {
    return localStorage.getItem(SHELF_KEY);
  } catch {
    return memoryShelf;
  }
}

// Fallback when storage is blocked (some private modes): the shelf works for
// this visit but doesn't persist.
let memoryShelf: string | null = null;

function writeShelfRaw(value: string) {
  memoryShelf = value;
  try {
    localStorage.setItem(SHELF_KEY, value);
  } catch {
    // Blocked or full: memoryShelf carries this visit.
  }
  shelfListeners.forEach((listener) => listener());
}
