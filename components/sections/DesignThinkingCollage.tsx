import type { ReactNode } from 'react';
import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { Reveal } from '../motion/Reveal';
import { SectionHeader } from './SectionHeader';

/**
 * Bold, minimal glyphs for each kind of reference — drawn on a 24×24 grid with
 * a thick 2px stroke so they read clearly even at chip size. `currentColor`
 * lets the navy gradient (or light text) show through.
 */
const icons: Record<string, ReactNode> = {
  book: (
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v15H5.5A1.5 1.5 0 0 0 4 20.5V5.5ZM20 5.5A1.5 1.5 0 0 0 18.5 4H12v15h6.5a1.5 1.5 0 0 1 1.5 1.5V5.5Z" />
  ),
  paper: (
    <>
      <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8h4.5M8 12h8M8 15.5h8M8 8.5h3" />
    </>
  ),
  post: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
      <path d="M8 8.5h8M8 11.5h5" />
    </>
  ),
  essay: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 2.8 2.8L7.9 18.9 4 20Z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  art: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 2-1 2-2 0-1.4-1-1.6-1-3 0-1 .9-2 2.2-2H18a3 3 0 0 0 3-3c0-4.2-4-7-9-7Z" />
      <circle cx="8" cy="10" r="1.1" />
      <circle cx="12" cy="7.5" r="1.1" />
      <circle cx="16" cy="10" r="1.1" />
    </>
  ),
  default: <path d="M6 3.5h12v17l-6-3.5-6 3.5v-17Z" />,
};

/** Map a piece's free-text `type` onto a glyph. */
function iconFor(type: string): ReactNode {
  const t = type.toLowerCase();
  if (t.includes('book')) return icons.book;
  if (t.includes('paper') || t.includes('research')) return icons.paper;
  if (t.includes('post') || t.includes('blog') || t.includes('note')) return icons.post;
  if (t.includes('essay') || t.includes('guide') || t.includes('article')) return icons.essay;
  if (t.includes('art')) return icons.art;
  return icons.default;
}

function TypeGlyph({ type, className }: { type: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {iconFor(type)}
    </svg>
  );
}

/**
 * Format: a scrollable shelf of books, not a grid of cards. Portrait
 * proportions, a spine down the left edge, a stacked drop-shadow for page
 * depth, and a bookmark ribbon peeking out the top. Each cover carries a bold
 * type glyph on a navy → greyish-blue gradient — the whole shelf reads as one
 * cohesive palette. The title lives below the cover, and the shelf scrolls
 * horizontally so it can hold more than a fixed row would.
 *
 * Entries with an external `link` are curated references: their cards open the
 * source in a new tab rather than an internal article page.
 */
export function DesignThinkingCollage({
  zone,
  entries,
  /**
   * `shelf` (default) is a full-width horizontally-scrolling row of large book
   * spines. `compact` is a tidy two-column grid of half-size books — used when
   * the shelf lives in the narrow right column of a shared row.
   */
  layout = 'shelf',
}: {
  zone: Zone;
  entries: ContentEntry[];
  layout?: 'shelf' | 'compact';
}) {
  const compact = layout === 'compact';
  const items = entries.slice(0, compact ? 6 : 8);

  const cardShadow = compact
    ? 'shadow-[2px_2px_0_rgba(11,12,16,0.12),4px_4px_0_rgba(11,12,16,0.05)] group-hover:shadow-[3px_6px_0_rgba(11,12,16,0.16),6px_10px_0_rgba(11,12,16,0.07)]'
    : 'shadow-[3px_3px_0_rgba(11,12,16,0.12),6px_6px_0_rgba(11,12,16,0.06)] group-hover:shadow-[5px_9px_0_rgba(11,12,16,0.16),10px_15px_0_rgba(11,12,16,0.08)]';

  return (
    <div className="relative">
      <SectionHeader zone={zone} />

      <div
        className={
          compact
            ? 'mt-8 grid grid-cols-3 gap-x-3 gap-y-5'
            : '-mx-6 mt-10 flex snap-x snap-mandatory gap-x-8 overflow-x-auto px-6 pb-4 scrollbar-thin md:-mx-10 md:px-10'
        }
      >
        {items.map((entry, i) => {
          const external = Boolean(entry.link);
          const href = entry.link || `/${entry.section}/${entry.slug}/`;
          return (
            <Reveal
              delay={0.06 * i}
              key={entry.slug}
              as="article"
              className={compact ? '' : 'w-44 shrink-0 snap-start sm:w-52'}
            >
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <div
                  className={`relative aspect-3/4 overflow-hidden rounded-r-xl rounded-l-[3px] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-2 ${cardShadow}`}
                >
                  {entry.cover ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cloudinaryUrl(entry.cover, { width: compact ? 300 : 600 })}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* Type chip over real cover art — navy → greyish-blue */}
                      <span
                        className={`absolute inline-flex items-center gap-1.5 rounded-full bg-linear-to-br from-sand-deep to-sand-soft text-white shadow-md ring-1 ring-white/15 ${
                          compact ? 'left-1.5 top-1.5 px-1.5 py-0.5' : 'left-3 top-3 px-2.5 py-1'
                        }`}
                      >
                        <TypeGlyph type={entry.type} className={compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} />
                        <span
                          className={`font-rounded font-semibold tracking-wide uppercase ${
                            compact ? 'text-[0.5rem]' : 'text-[0.62rem]'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </span>
                    </>
                  ) : (
                    // No cover art: a bold navy → greyish-blue field with a big
                    // centered glyph, so the shelf still reads as a set.
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-sand-deep via-sand to-sand-soft">
                      <TypeGlyph
                        type={entry.type}
                        className={`text-white/90 drop-shadow-sm ${compact ? 'h-9 w-9' : 'h-16 w-16'}`}
                      />
                      <span
                        className={`font-rounded font-semibold tracking-[0.18em] uppercase text-white/70 ${
                          compact ? 'text-[0.55rem]' : 'text-[0.7rem]'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </div>
                  )}

                  {/* Spine */}
                  <div className={`absolute inset-y-0 left-0 bg-sand-deep ${compact ? 'w-1' : 'w-[6px]'}`} />
                  <div className={`absolute inset-y-0 w-px bg-black/15 ${compact ? 'left-1' : 'left-[6px]'}`} />

                  {/* Bookmark ribbon, tucked behind the top edge */}
                  <div
                    className={`absolute top-0 bg-sand-soft transition-transform duration-500 group-hover:-translate-y-0.5 ${
                      compact ? 'right-3 h-5 w-2.5' : 'right-5 h-8 w-4'
                    }`}
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)' }}
                  />
                </div>

                <h3
                  className={`mt-2 font-rounded font-normal leading-snug text-parchment transition-colors duration-300 group-hover:text-sand ${
                    compact ? 'line-clamp-2 text-xs' : 'mt-3 text-sm sm:text-base'
                  }`}
                >
                  {entry.title}
                </h3>
              </a>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
