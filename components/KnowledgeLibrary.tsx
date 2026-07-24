'use client';

import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { CoverImage } from './CoverImage';
import { TypeBadge } from './TypeBadge';
import { Reveal } from './motion/Reveal';
import { HoverLink, AnimatedTitle, HoverDivider } from './motion/HoverLink';
import { SectionHeader } from './sections/SectionHeader';

const AUTHOR_MARK_URL =
  'https://res.cloudinary.com/ra5tg986/image/upload/v1784392260/Gemini_Generated_Image_k6ew92k6ew92k6ew_wfy2kp.png';

/** The one featured piece — image, and up to five lines of subtext. */
function HeroCard({ item }: { item: ContentEntry }) {
  return (
    <Reveal from="left">
      <HoverLink
        href={`/${item.section}/${item.slug}`}
        className="group block rounded-xl border border-parchment/10 bg-[#f9f6e9] p-3 backdrop-blur-[2px]"
      >
        <div className="overflow-hidden rounded-lg">
          <CoverImage
            src={item.cover}
            alt={item.title}
            ratio="cinematic"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="px-0.5 pt-4">
          <div className="flex items-center gap-2">
            <TypeBadge type={item.type} />
            {item.date && (
              <time className="label text-parchment-faint">{formatDate(item.date)}</time>
            )}
          </div>
          <h3 className="mt-3">
            <AnimatedTitle className="font-rounded text-xl font-medium leading-snug">
              {item.title}
            </AnimatedTitle>
          </h3>
          <p className="mt-3 line-clamp-4 font-rounded text-base leading-relaxed text-parchment/80">
            {item.description}
          </p>
        </div>
      </HoverLink>
    </Reveal>
  );
}

/** A text-only row — no image, two lines of subtext at most. */
function EntryRow({ item, delay }: { item: ContentEntry; delay: number }) {
  return (
    <Reveal from="right" delay={delay}>
      <HoverLink
        href={`/${item.section}/${item.slug}`}
        className="relative -mx-3 flex items-start gap-4 rounded-xl px-3 py-4"
      >
        <div className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sand/25 bg-sand/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AUTHOR_MARK_URL} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-rounded text-xl font-medium leading-snug">
            <AnimatedTitle className="font-rounded text-xl font-medium leading-snug">
              {item.title}
            </AnimatedTitle>{' '}
            <TypeBadge type={item.type} className="ml-1 align-middle" />
          </h4>
          {item.date && (
            <time className="label mt-1 block text-parchment-faint">{formatDate(item.date)}</time>
          )}
          <p className="mt-1.5 line-clamp-2 font-rounded text-sm leading-relaxed text-parchment/70">
            {item.description}
          </p>
        </div>
        <HoverDivider />
      </HoverLink>
    </Reveal>
  );
}

export function KnowledgeLibrary({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const [hero, ...rest] = entries;
  const rows = rest.slice(0, 4);

  return (
    <div>
      {!hero && <SectionHeader zone={zone} />}

      {hero && (
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-start">
          {/* Left column: the section heading sits directly above the hero
              card, so the right column's row list — which starts at the
              same grid row — begins level with the heading, not the card. */}
          <div className="lg:col-span-6">
            <SectionHeader zone={zone} />
            <div className="mt-8">
              <HeroCard item={hero} />
            </div>
          </div>

          {rows.length > 0 && (
            <div className="lg:col-span-6">
              {rows.map((item, i) => (
                <EntryRow key={item.slug} item={item} delay={0.08 * i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
