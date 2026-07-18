import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { site } from '@/lib/site';
import { CoverImage } from './CoverImage';
import { Reveal } from './motion/Reveal';
import { SectionHeader, WanderLink } from './sections/SectionHeader';

const authorInitials = site.name
  .split(' ')
  .map((word) => word[0])
  .join('');

// Type badges pick up a whisper of colour; unknown types fall back to neutral.
const typeAccent: Record<string, string> = {
  'Research Paper': 'text-teal-whisper border-teal-whisper/40',
  Blog: 'text-sand border-sand/40',
  Book: 'text-blush-whisper border-blush-whisper/40',
  Art: 'text-parchment-muted border-parchment/30',
};

function TypeBadge({ type, className }: { type: string; className?: string }) {
  const accent = typeAccent[type] ?? 'text-parchment-muted border-parchment/30';
  return (
    <span className={`label inline-block rounded-full border px-2 py-0.5 text-[0.55rem] ${accent} ${className ?? ''}`}>
      {type}
    </span>
  );
}

/** The one featured piece — image, and up to five lines of subtext. */
function HeroCard({ item }: { item: ContentEntry }) {
  return (
    <Reveal from="left" className="lg:col-span-6">
      <a
        href={`/${item.section}/${item.slug}`}
        className="group block rounded-sm border border-parchment/10 bg-ink-700/30 p-3 backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-1 hover:border-sand/40 hover:shadow-lg"
      >
        <div className="overflow-hidden rounded-sm">
          <CoverImage
            src={item.cover}
            alt={item.title}
            ratio={item.aspect === 'tall' ? 'portrait' : item.aspect === 'wide' ? 'landscape' : 'square'}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="px-0.5 pt-4">
          <TypeBadge type={item.type} />
          <h3 className="mt-3 font-display text-2xl font-medium leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
            {item.title}
          </h3>
          <p className="mt-3 line-clamp-5 font-rounded text-base leading-relaxed text-parchment/80">
            {item.description}
          </p>
        </div>
      </a>
    </Reveal>
  );
}

/** A text-only row — no image, two lines of subtext at most. */
function EntryRow({ item, delay }: { item: ContentEntry; delay: number }) {
  return (
    <Reveal from="right" delay={delay}>
      <a
        href={`/${item.section}/${item.slug}`}
        className="group -mx-3 flex items-start gap-4 overflow-hidden rounded-xl border border-transparent bg-transparent px-3 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-rust hover:bg-white/40"
      >
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand/25 bg-sand/10">
          <span className="font-display text-xs text-sand">{authorInitials}</span>
        </div>
        <div className="min-w-0 flex-1 transition-transform duration-300 group-hover:translate-x-1">
          <h4 className="font-display text-lg font-medium leading-snug text-parchment transition-colors duration-300 group-hover:text-sand">
            {item.title}{' '}
            <TypeBadge type={item.type} className="ml-1 align-middle" />
          </h4>
          <p className="mt-1.5 line-clamp-2 font-rounded text-sm leading-relaxed text-parchment/70">
            {item.description}
          </p>
        </div>
      </a>
    </Reveal>
  );
}

export function KnowledgeLibrary({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const [hero, ...rest] = entries;
  const rows = rest.slice(0, 4);

  return (
    <div>
      <SectionHeader zone={zone} />

      {hero && (
        <div className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-start">
          <HeroCard item={hero} />

          {rows.length > 0 && (
            <div className="divide-y divide-parchment/12 lg:col-span-6">
              {rows.map((item, i) => (
                <EntryRow key={item.slug} item={item} delay={0.08 * i} />
              ))}
            </div>
          )}
        </div>
      )}

      <WanderLink zone={zone} />
    </div>
  );
}
