import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { Reveal } from '../motion/Reveal';
import { CoverImage } from '../CoverImage';
import { TypeBadge } from '../TypeBadge';
import { SectionHeader } from './SectionHeader';

/**
 * Format: stacked horizontal cards — a small square thumbnail beside a title
 * and a one-line snippet. Reads like a newspaper's column of briefs.
 */
export function FieldNotesCards({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const items = entries.slice(0, 3);
  return (
    <div>
      <SectionHeader zone={zone} from="right" />

      <div className="mt-9 space-y-4">
        {items.map((entry, i) => (
          <Reveal from="right" delay={0.08 * i} key={entry.slug} as="article">
            <a
              href={`/${entry.section}/${entry.slug}`}
              className="group block rounded-2xl border border-black/10 bg-[#f9f8f4] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f5efe0] hover:shadow-md md:border-transparent md:bg-transparent"
            >
              {/* Mobile only: image + heading share a row (same height), description breaks to its own full-width row below */}
              <div className="flex items-center gap-4 md:hidden">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[28%]">
                  <CoverImage
                    src={entry.cover}
                    alt={entry.title}
                    ratio="square"
                    shape="squircle"
                    className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <TypeBadge type={entry.type} />
                    {entry.date && (
                      <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
                    )}
                  </div>
                  <h3 className="mt-1 line-clamp-3 font-display text-xl leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
                    {entry.title}
                  </h3>
                </div>
              </div>
              <p className="mt-2 line-clamp-3 font-rounded text-sm leading-relaxed text-parchment/85 md:hidden">
                {entry.description}
              </p>

              {/* Tablet/desktop: original single-row layout, unchanged */}
              <div className="hidden items-center gap-5 md:flex">
                <div className="w-28 shrink-0 overflow-hidden rounded-[28%] md:w-32">
                  <CoverImage
                    src={entry.cover}
                    alt={entry.title}
                    ratio="square"
                    shape="squircle"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <TypeBadge type={entry.type} />
                    {entry.date && (
                      <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
                    )}
                  </div>
                  <h3 className="mt-1 font-display text-xl leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
                    {entry.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 font-rounded text-sm leading-relaxed text-parchment/85">
                    {entry.description}
                  </p>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
