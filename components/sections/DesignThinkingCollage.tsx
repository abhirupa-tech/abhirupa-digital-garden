import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { Reveal } from '../motion/Reveal';
import { TypeGlyph } from '../TypeGlyph';
import { SectionHeader } from './SectionHeader';

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
   * spines. `compact` is a tidy grid of just the covers — rounded image tiles
   * that reveal a "View on Google" overlay on hover — used when the shelf sits
   * in a column of a shared row.
   */
  layout = 'shelf',
}: {
  zone: Zone;
  entries: ContentEntry[];
  layout?: 'shelf' | 'compact';
}) {
  // A tidy grid of covers only — no titles, spines, or ribbons underneath, so
  // the column reads as a clean wall of book jackets. Each tile rounds its
  // corners and, on hover, dims under a translucent "View on Google" overlay.
  if (layout === 'compact') {
    const items = entries.slice(0, 6);
    return (
      <div className="relative">
        <SectionHeader zone={zone} />
        <div className="mt-8 grid grid-cols-3 gap-x-5 gap-y-6 sm:gap-x-6 sm:gap-y-7">
          {items.map((entry, i) => {
            const external = Boolean(entry.link);
            const href = entry.link || `/${entry.section}/${entry.slug}/`;
            return (
              <Reveal delay={0.05 * i} key={entry.slug} as="article">
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group relative block aspect-3/4 overflow-hidden rounded-2xl shadow-[0_6px_18px_-8px_rgba(11,12,16,0.4)] ring-1 ring-black/5 transition-transform duration-500 ease-out hover:-translate-y-1"
                >
                  {entry.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cloudinaryUrl(entry.cover, { width: 400 })}
                      alt={entry.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    // No cover art: a bold navy → greyish-blue field with a
                    // centered glyph and the title, so the tile still reads.
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-sand-deep via-sand to-sand-soft p-3 text-center">
                      <TypeGlyph type={entry.type} className="h-9 w-9 text-white/90 drop-shadow-sm" />
                      <span className="line-clamp-3 font-rounded text-[0.62rem] font-semibold leading-snug tracking-wide text-white/80">
                        {entry.title}
                      </span>
                    </div>
                  )}

                  {/* Hover: translucent black overlay with a call to the source */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-2 text-center opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 font-rounded text-xs font-medium text-white">
                      {external ? 'View on Google' : 'Read'}
                      <span aria-hidden="true">{external ? '↗' : '→'}</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    );
  }

  const items = entries.slice(0, 8);

  return (
    <div className="relative">
      <SectionHeader zone={zone} />

      <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-x-8 overflow-x-auto px-6 pb-4 scrollbar-thin md:-mx-10 md:px-10">
        {items.map((entry, i) => {
          const external = Boolean(entry.link);
          const href = entry.link || `/${entry.section}/${entry.slug}/`;
          return (
            <Reveal delay={0.06 * i} key={entry.slug} as="article" className="w-44 shrink-0 snap-start sm:w-52">
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <div className="relative aspect-3/4 overflow-hidden rounded-r-xl rounded-l-[3px] shadow-[3px_3px_0_rgba(11,12,16,0.12),6px_6px_0_rgba(11,12,16,0.06)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-2 group-hover:shadow-[5px_9px_0_rgba(11,12,16,0.16),10px_15px_0_rgba(11,12,16,0.08)]">
                  {entry.cover ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cloudinaryUrl(entry.cover, { width: 600 })}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* Type chip over real cover art — navy → greyish-blue */}
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-linear-to-br from-sand-deep to-sand-soft px-2.5 py-1 text-white shadow-md ring-1 ring-white/15">
                        <TypeGlyph type={entry.type} className="h-3.5 w-3.5" />
                        <span className="font-rounded text-[0.62rem] font-semibold tracking-wide uppercase">
                          {entry.type}
                        </span>
                      </span>
                    </>
                  ) : (
                    // No cover art: a bold navy → greyish-blue field with a big
                    // centered glyph, so the shelf still reads as a set.
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linear-to-br from-sand-deep via-sand to-sand-soft">
                      <TypeGlyph type={entry.type} className="h-16 w-16 text-white/90 drop-shadow-sm" />
                      <span className="font-rounded text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-white/70">
                        {entry.type}
                      </span>
                    </div>
                  )}

                  {/* Spine */}
                  <div className="absolute inset-y-0 left-0 w-[6px] bg-sand-deep" />
                  <div className="absolute inset-y-0 left-[6px] w-px bg-black/15" />

                  {/* Bookmark ribbon, tucked behind the top edge */}
                  <div
                    className="absolute right-5 top-0 h-8 w-4 bg-sand-soft transition-transform duration-500 group-hover:-translate-y-0.5"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)' }}
                  />
                </div>

                <h3 className="mt-3 t-card-title text-parchment transition-colors duration-300 group-hover:text-highlight">
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
