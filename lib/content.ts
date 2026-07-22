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
