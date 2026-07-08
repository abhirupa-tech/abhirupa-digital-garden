import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { Reveal } from '../motion/Reveal';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { SectionHeader, WanderLink } from './SectionHeader';

/**
 * Format: a quiet journal. Two loosely-stacked, slightly-rotated photos on one
 * side; a date-stamped list of entries on the other. Unhurried and personal.
 */
export function SlowLivingJournal({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const items = entries.slice(0, 4);
  return (
    <div className="grid items-center gap-14 md:grid-cols-12">
      {/* Overlapping, gently-rotated photo stack */}
      <Reveal from="left" className="relative md:col-span-5">
        <div className="mx-auto max-w-xs">
          <div className="rotate-[-3deg] transition-transform duration-700 hover:rotate-0">
            <ImagePlaceholder ratio="portrait" label="A quiet morning" />
          </div>
          <div className="absolute -bottom-10 right-0 w-2/3 rotate-[4deg] transition-transform duration-700 hover:rotate-0">
            <ImagePlaceholder ratio="square" label="Coastline" />
          </div>
        </div>
      </Reveal>

      <div className="md:col-span-7">
        <SectionHeader zone={zone} from="right" />

        <Reveal from="right" delay={0.1} as="ol" className="mt-9 space-y-1">
          {items.map((entry) => (
            <li key={entry.slug}>
              <a
                href={`#${zone.id}`}
                className="group flex items-baseline gap-5 border-b border-parchment/10 py-4"
              >
                <time className="label w-24 shrink-0 text-parchment-faint">{entry.date}</time>
                <span className="flex-1 font-serif text-xl font-light italic text-parchment transition-colors duration-300 group-hover:text-sand">
                  {entry.title}
                </span>
                <span className="text-parchment-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-sand">
                  →
                </span>
              </a>
            </li>
          ))}
        </Reveal>

        <WanderLink zone={zone} />
      </div>
    </div>
  );
}
