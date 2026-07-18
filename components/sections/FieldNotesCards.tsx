import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
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
              className="group flex items-center gap-5 rounded-2xl bg-transparent p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f5efe0] hover:shadow-md"
            >
              <div className="w-24 shrink-0 overflow-hidden rounded-[28%] sm:w-28">
                <CoverImage
                  src={entry.cover}
                  alt={entry.title}
                  ratio="square"
                  shape="squircle"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <TypeBadge type={entry.type} />
                <h3 className="mt-1 font-display text-lg leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
                  {entry.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 font-rounded text-sm leading-relaxed text-parchment/85">
                  {entry.description}
                </p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
