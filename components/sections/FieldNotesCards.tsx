import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { Reveal } from '../motion/Reveal';
import { CoverImage } from '../CoverImage';
import { SectionHeader, WanderLink } from './SectionHeader';

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
              href={`#${zone.id}`}
              className="group flex gap-5 rounded-2xl p-3 transition-colors duration-500 hover:bg-navy-muted"
            >
              <div className="w-24 shrink-0 sm:w-28">
                <CoverImage src={entry.cover} alt={entry.title} ratio="square" shape="squircle" />
              </div>
              <div className="flex-1 py-1">
                <span className="label text-sand/70">{entry.type}</span>
                <h3 className="mt-1 font-display text-lg leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
                  {entry.title}
                </h3>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-parchment/65">
                  {entry.description}
                </p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <WanderLink zone={zone} />
    </div>
  );
}
