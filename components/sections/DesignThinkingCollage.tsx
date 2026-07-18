import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { Reveal } from '../motion/Reveal';
import { CoverImage } from '../CoverImage';
import { SectionHeader, WanderLink } from './SectionHeader';

/**
 * Format: an even row of equal-height cards. Every entry sits on the same
 * baseline; some carry a square image, others a big numbered tile, but all
 * share one height. Clean and aligned rather than scattered.
 */
export function DesignThinkingCollage({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const items = entries.slice(0, 4);
  return (
    <div className="relative">
      <SectionHeader zone={zone} />

      <div className="mt-10 grid grid-cols-2 items-stretch gap-5 md:grid-cols-4 md:gap-7">
        {items.map((entry, i) => {
          const withImage = i % 2 === 0;
          return (
            <Reveal delay={0.08 * i} key={entry.slug} as="article" className="h-full">
              <a
                href={`/${entry.section}/${entry.slug}`}
                className="group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1"
              >
                {withImage ? (
                  <div className="overflow-hidden rounded-sm">
                    <CoverImage
                      src={entry.cover}
                      alt={entry.title}
                      ratio="square"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-sm border border-sand/25 bg-ink-700/20 transition-colors duration-300 group-hover:border-sand/50 group-hover:bg-sand/5">
                    <span className="font-display text-5xl text-sand/70 transition-transform duration-300 group-hover:scale-105">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
                <span className="label mt-3 block text-sand/70">{entry.type}</span>
                <h3 className="mt-1 font-display text-lg leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
                  {entry.title}
                </h3>
              </a>
            </Reveal>
          );
        })}
      </div>

      <WanderLink zone={zone} />
    </div>
  );
}
