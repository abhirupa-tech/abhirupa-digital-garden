import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { Reveal } from '../motion/Reveal';
import { SectionHeader, WanderLink } from './SectionHeader';

/**
 * Format: a vertical index list — a table-of-contents feel, no imagery.
 * Proves that not every section needs a picture to have presence.
 */
export function PracticeList({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const items = entries.slice(0, 4);
  return (
    <div>
      <SectionHeader zone={zone} from="left" />

      <Reveal from="left" delay={0.1} as="ol" className="mt-9 border-t border-parchment/12">
        {items.map((entry, i) => (
          <li key={entry.slug} className="border-b border-parchment/12">
            <a
              href={`#${zone.id}`}
              className="group flex items-baseline gap-5 py-5 transition-colors"
            >
              <span className="w-8 shrink-0 font-display text-sm text-sand/50 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">
                <span className="block font-display text-xl leading-tight text-parchment transition-colors duration-300 group-hover:text-sand">
                  {entry.title}
                </span>
                <span className="label mt-1 block text-parchment-faint">{entry.type}</span>
              </span>
              <span className="translate-y-[2px] text-parchment-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-sand">
                →
              </span>
            </a>
          </li>
        ))}
      </Reveal>

      <WanderLink zone={zone} />
    </div>
  );
}
