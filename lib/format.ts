/** "2026-07-23" -> "Jul 23, 2026". Falls back to the raw string if it doesn't parse. */
export function formatDate(date: string): string {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Estimated reading time in whole minutes for a piece's raw Markdown body.
 * Counts whitespace-separated tokens at ~220 wpm (a common prose reading
 * pace), floored to at least 1. Rough by design — it's a "~N min read" hint,
 * not a stopwatch — so it ignores code-fence/markup stripping.
 */
export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Strip Markdown syntax down to readable prose — used to preview a piece's
 * actual opening in surfaces that show a body excerpt (e.g. the section-page
 * hero). Not a full parser: it drops code blocks, images, list/heading/quote
 * markers, emphasis, and MDX component markup, unwraps links to their text,
 * then collapses whitespace and trims to `max` characters on a word boundary.
 *
 * The MDX handling matters for more than tidiness: this text is rendered into
 * the static HTML of the section hubs, so an unstripped `<Subnote>` ends up in
 * the crawlable copy search engines read off those pages.
 */
export function plainExcerpt(markdown: string, max = 500): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    // Self-closing MDX components (<Figure src="…" />) carry no prose — drop
    // them whole, along with any props spanning multiple lines.
    .replace(/<[A-Z][\w.]*(?:\s[^>]*?)?\/>/gs, ' ')
    // Wrapping MDX components (<Quote>…</Quote>) do — keep the children and
    // shed only the tags.
    .replace(/<\/?[A-Z][\w.]*(?:\s[^>]*?)?>/gs, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> label
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // ATX headings
    .replace(/^\s{0,3}>+\s?/gm, '') // blockquotes
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '') // list markers
    .replace(/^\s*([-=*_]){3,}\s*$/gm, ' ') // horizontal rules
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1') // emphasis / strikethrough
    .replace(/\|/g, ' ') // table pipes
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}
