import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { Reveal } from '../motion/Reveal';
import { TypeBadge } from '../TypeBadge';
import { SectionHeader } from './SectionHeader';
import { ViewAllLink } from './ViewAllLink';

/**
 * Field Notes as a column of split cards: one piece per row, the cover image
 * filling the left half and the type · date · title · summary the right half.
 * The tall 50/50 rows give the column enough height to stand level with The
 * Practice list it shares a row with, so neither side dangles short.
 */
export function FieldNotesCards({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  // Entries arrive newest-first (getSectionEntries), so the latest post leads.
  const items = entries.slice(0, 6);
  return (
    <div>
      <SectionHeader zone={zone} from="right" />

      <div className="mt-9 space-y-5">
        {items.map((entry, i) => (
          <Reveal from="right" delay={0.08 * i} key={entry.slug} as="article">
            <a
              href={`/${entry.section}/${entry.slug}/`}
              // Minimalist row: a thin hairline frame with the cover flush to the
              // edge — no inner padding on the image, so it reads as one clean tile.
              // Border warms to rust on hover.
              className="group flex items-stretch overflow-hidden rounded-xl border border-black/[0.12] transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/60 hover:bg-white/70 hover:shadow-sm dark:border-white/[0.08] dark:hover:border-highlight/60 dark:hover:bg-white/[0.06]"
            >
              {/* Left — the cover image, flush to the card edge */}
              <div className="aspect-4/3 w-2/5 shrink-0 overflow-hidden md:aspect-2/1">
                {entry.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cloudinaryUrl(entry.cover, { width: 800 })}
                    alt={entry.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-sand-deep via-sand to-sand-soft" />
                )}
              </div>

              {/* Right — the writing */}
              <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2 sm:px-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TypeBadge type={entry.type} />
                  {entry.date && (
                    <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
                  )}
                </div>
                <h3 className="mt-1.5 line-clamp-3 font-rounded text-base leading-snug text-parchment transition-colors duration-300 group-hover:text-highlight sm:text-lg md:line-clamp-2">
                  {entry.title}
                </h3>
                {entry.description && (
                  <p className="mt-1.5 line-clamp-2 font-rounded text-sm leading-relaxed text-parchment/80 sm:line-clamp-3 md:line-clamp-2 md:text-[0.9375rem]">
                    {entry.description}
                  </p>
                )}
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal from="right" delay={0.2} className="mt-6">
        <ViewAllLink href={`/${zone.id}/`} count={entries.length} />
      </Reveal>
    </div>
  );
}
