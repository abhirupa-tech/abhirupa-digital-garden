import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import covers from './covers.json';

/**
 * Reads the file-based content in /content at build time. Each section is a
 * static folder of Markdown entries with front matter. This is the data source
 * the homepage previews from and that future per-section pages will render.
 *
 * Server-only: uses the filesystem, so import it only from server components.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Cover images, keyed by "section/slug", edited in lib/covers.json instead of
 * per-file front matter — one place to update instead of opening every piece.
 * Falls back to a piece's own `cover` front matter when its slug isn't listed.
 */
const coverOverrides: Record<string, string> = covers;

export type ContentEntry = {
  slug: string;
  section: string;
  title: string;
  type: string;
  description: string;
  tags: string[];
  date: string;
  cover: string;
  /** Optional URL of the original Medium post, for attribution — this site stays canonical. */
  medium: string;
  /**
   * Optional external source URL. When set, the entry is a curated reference
   * (a book, paper, or post that lives elsewhere): its card links out to the
   * source and no internal article page is generated for it.
   */
  link: string;
  aspect: 'tall' | 'wide' | 'square';
  draft: boolean;
  body: string;
};

function coerceAspect(value: unknown): ContentEntry['aspect'] {
  return value === 'tall' || value === 'wide' || value === 'square' ? value : 'square';
}

/** "The End of the Single Truth!" -> "the-end-of-the-single-truth" */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Mn}/gu, '') // strip accents left behind by NFKD decomposition
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** All entries for a section, sorted by filename (piece-01, piece-02, …). */
export function getEntries(section: string): ContentEntry[] {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      // The filename (piece-01, …) stays the internal identity — it's what
      // covers.json keys on and what keeps sort order stable. The public
      // slug is a readable blog-name, derived from front matter `slug` if
      // set, else the title, so URLs read as /the-practice/blog-name.
      const fileId = file.replace(/\.mdx?$/, '');
      const title = String(data.title ?? file);
      const slug =
        (typeof data.slug === 'string' && slugify(data.slug)) || slugify(title) || fileId;
      return {
        slug,
        section,
        title,
        type: String(data.type ?? 'Note'),
        description: String(data.description ?? ''),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        date: String(data.date ?? ''),
        cover: coverOverrides[`${section}/${fileId}`] || String(data.cover ?? ''),
        medium: String(data.medium ?? ''),
        link: String(data.link ?? ''),
        aspect: coerceAspect(data.aspect),
        draft: Boolean(data.draft),
        body: content.trim(),
      } satisfies ContentEntry;
    });
}

/** A single entry, for future dedicated per-section pages. */
export function getEntry(section: string, slug: string): ContentEntry | null {
  return getEntries(section).find((e) => e.slug === slug) ?? null;
}

/**
 * Published, page-backed entries for a section — no drafts, no external
 * references (curated links live on the shelf, not on a section page) — sorted
 * newest first. The data source for both the homepage previews and the
 * dedicated /<section> landing pages, so a freshly published piece surfaces at
 * the top of both automatically.
 */
export function getSectionEntries(section: string): ContentEntry[] {
  return getEntries(section)
    .filter((e) => !e.draft && !e.link)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Every content folder under /content (the section ids). */
function allSections(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/**
 * Up to `limit` other published pieces most related to the given one — ranked
 * by how many tags they share, then by recency. Falls back to recency alone so
 * the "you might also like" block is always filled when enough content exists.
 * Draws from every section (cross-linking spreads reader attention and link
 * equity); drafts and external references are excluded.
 */
export function getRelatedEntries(section: string, slug: string, limit = 3): ContentEntry[] {
  const current = getEntry(section, slug);
  const tags = new Set(current?.tags ?? []);
  return allSections()
    .flatMap((s) => getEntries(s))
    .filter((e) => !e.draft && !e.link && !(e.section === section && e.slug === slug))
    .map((e) => ({ e, score: e.tags.reduce((n, t) => n + (tags.has(t) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score || (a.e.date < b.e.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.e);
}

/** "Guide" -> "guide"; used for /collections/<type> URLs. */
export function typeSlug(type: string): string {
  return slugify(type);
}

/**
 * Every published entry across the given sections whose `type` slug matches —
 * the data source for the /collections/<type> pages. Newest first.
 */
export function getEntriesByType(type: string, sections: string[]): ContentEntry[] {
  return sections
    .flatMap((section) => getEntries(section))
    // Curated references (external `link`) aren't authored pieces — they live
    // on the shelf and link out, so they're kept out of the format collections.
    .filter((e) => !e.draft && !e.link && typeSlug(e.type) === typeSlug(type))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Distinct published entry types across the given sections (label + slug). */
export function getAllTypes(sections: string[]): { label: string; slug: string }[] {
  const bySlug = new Map<string, string>();
  sections
    .flatMap((section) => getEntries(section))
    .filter((e) => !e.draft && !e.link)
    .forEach((e) => bySlug.set(typeSlug(e.type), e.type));
  return [...bySlug.entries()].map(([slug, label]) => ({ slug, label }));
}
