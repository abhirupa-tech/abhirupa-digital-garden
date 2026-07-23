import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { formatDate } from '@/lib/format';
import { Reveal } from '../motion/Reveal';
import { SectionHeader } from './SectionHeader';

/** A little shelf of cover colors, cycled by index so no two neighbors match. */
const spines = [
  { spine: '#b98a58', cover: 'from-[#e2bd94] to-[#b98a58]' },
  { spine: '#8a4a2e', cover: 'from-[#c9704f] to-[#8a4a2e]' },
  { spine: '#3f6f66', cover: 'from-[#6fa89c] to-[#3f6f66]' },
  { spine: '#7a4a5c', cover: 'from-[#c47b90] to-[#7a4a5c]' },
];

/**
 * Format: a scrollable shelf of books, not a grid of cards. Portrait
 * proportions, a spine down the left edge, a stacked drop-shadow-sm for page
 * depth, and a bookmark ribbon peeking out the top. The title lives below
 * the cover — legible, not squeezed onto it — and the shelf scrolls
 * horizontally so it can hold more than a fixed row would.
 */
export function DesignThinkingCollage({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const items = entries.slice(0, 8);
  return (
    <div className="relative">
      <SectionHeader zone={zone} />

      <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-x-8 overflow-x-auto px-6 pb-4 scrollbar-thin md:-mx-10 md:px-10">
        {items.map((entry, i) => {
          const { spine, cover } = spines[i % spines.length];
          return (
            <Reveal delay={0.06 * i} key={entry.slug} as="article" className="w-44 shrink-0 snap-start sm:w-52">
              <a href={`/${entry.section}/${entry.slug}`} className="group block">
                <div className="relative aspect-3/4 overflow-hidden rounded-r-xl rounded-l-[3px] shadow-[3px_3px_0_rgba(11,12,16,0.12),6px_6px_0_rgba(11,12,16,0.06)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-2 group-hover:shadow-[5px_9px_0_rgba(11,12,16,0.16),10px_15px_0_rgba(11,12,16,0.08)]">
                  {/* Cover art or, lacking one, a flat color field */}
                  {entry.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cloudinaryUrl(entry.cover, { width: 600 })}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-linear-to-br ${cover}`} />
                  )}

                  {/* Spine */}
                  <div className="absolute inset-y-0 left-0 w-[6px]" style={{ backgroundColor: spine }} />
                  <div className="absolute inset-y-0 left-[6px] w-px bg-black/15" />

                  {/* Bookmark ribbon, tucked behind the top edge */}
                  <div
                    className="absolute right-5 top-0 h-8 w-4 transition-transform duration-500 group-hover:-translate-y-0.5"
                    style={{
                      backgroundColor: spine,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)',
                    }}
                  />
                </div>

                <h3 className="mt-3 font-display text-base font-medium leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
                  {entry.title}
                </h3>
                {entry.date && (
                  <time className="label mt-1 block text-parchment-faint">{formatDate(entry.date)}</time>
                )}
              </a>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
