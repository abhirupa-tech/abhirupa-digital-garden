/**
 * The Shelf: a browser's saved tapes, kept under one localStorage key.
 *
 * Pure functions over a plain object. The gateway does the localStorage
 * read/write around them, so all the rules (dedupe by id, the 10-tape cap,
 * tolerating a corrupt key) are testable without a browser.
 *
 * Canonical copy. The portfolio gateway (abhirupa-digital-garden,
 * lib/rec/shelf.ts) carries an identical copy — change both together.
 */

export const SHELF_KEY = 'recmockllm:v1';
export const SHELF_MAX = 10;

export type TapeEntry = {
  /** First 12 hex of sha256(encoded tape). */
  id: string;
  /** User-editable label. */
  name: string;
  /** Full replay URL, tape inside. */
  url: string;
  model: string;
  chunks: number;
  durationMs: number;
  /** Encoded size, shown against the cap. */
  bytes: number;
  createdAt: number;
};

export type Shelf = {
  v: 1;
  tapes: Record<string, TapeEntry>;
};

export type SaveResult =
  | { status: 'added'; shelf: Shelf }
  | { status: 'exists'; shelf: Shelf }
  | { status: 'full'; shelf: Shelf };

export function emptyShelf(): Shelf {
  return { v: 1, tapes: {} };
}

/** Read a stored value. Anything unreadable starts a fresh shelf, never throws. */
export function readShelf(raw: string | null): Shelf {
  if (!raw) return emptyShelf();
  try {
    const value = JSON.parse(raw) as Partial<Shelf>;
    if (value?.v === 1 && value.tapes && typeof value.tapes === 'object') {
      return { v: 1, tapes: { ...value.tapes } };
    }
  } catch {
    // fall through
  }
  return emptyShelf();
}

/**
 * Save a tape. The same recording always hashes to the same id, so a repeat
 * save keeps the existing entry (and its name) and reports "exists".
 */
export function saveTape(shelf: Shelf, entry: TapeEntry): SaveResult {
  if (shelf.tapes[entry.id]) return { status: 'exists', shelf };
  if (Object.keys(shelf.tapes).length >= SHELF_MAX) return { status: 'full', shelf };
  return { status: 'added', shelf: { v: 1, tapes: { ...shelf.tapes, [entry.id]: entry } } };
}

export function removeTape(shelf: Shelf, id: string): Shelf {
  const tapes = { ...shelf.tapes };
  delete tapes[id];
  return { v: 1, tapes };
}

export function renameTape(shelf: Shelf, id: string, name: string): Shelf {
  const entry = shelf.tapes[id];
  const trimmed = name.trim();
  if (!entry || !trimmed) return shelf;
  return { v: 1, tapes: { ...shelf.tapes, [id]: { ...entry, name: trimmed.slice(0, 60) } } };
}

/** Newest first. */
export function listTapes(shelf: Shelf): TapeEntry[] {
  return Object.values(shelf.tapes).sort((a, b) => b.createdAt - a.createdAt);
}
