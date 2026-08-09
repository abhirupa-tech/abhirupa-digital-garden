'use client';

import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { CoverImage } from './CoverImage';
import { TypeBadge } from './TypeBadge';
import { Reveal } from './motion/Reveal';
import { HoverLink, AnimatedTitle, HoverDivider } from './motion/HoverLink';
import { SectionHeader } from './sections/SectionHeader';
import { ViewAllLink } from './sections/ViewAllLink';

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
            <AnimatedTitle className="font-rounded text-[calc(1.25rem_-_2pt)] leading-snug sm:text-[1.25rem]">
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
          <div className="flex items-center gap-2">
            <TypeBadge type={item.type} />
            {item.date && (
              <time className="label text-parchment-faint">{formatDate(item.date)}</time>
            )}
          </div>
          <h4 className="mt-1.5">
            <AnimatedTitle className="font-rounded text-[calc(1.25rem_-_2pt)] leading-snug sm:text-[1.25rem]">
              {item.title}
            </AnimatedTitle>
          </h4>
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
  // Hero + up to seven rows = eight pieces at most on the home page.
  const rows = rest.slice(0, 7);

  return (
    <div>
      {!hero && <SectionHeader zone={zone} href={`/${zone.id}`} />}

      {hero && (
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-start">
          {/* Left column: the section heading sits directly above the hero
              card, so the right column's row list — which starts at the
              same grid row — begins level with the heading, not the card. */}
          <div className="lg:col-span-6">
            <SectionHeader zone={zone} href={`/${zone.id}`} />
            <div className="mt-8">
              <HeroCard item={hero} />
            </div>
          </div>

          {rows.length > 0 && (
            <div className="lg:col-span-6">
              {rows.map((item, i) => (
                <EntryRow key={item.slug} item={item} delay={0.08 * i} />
              ))}
              <Reveal from="right" delay={0.08 * rows.length} className="mt-6 px-3">
                <ViewAllLink href={`/${zone.id}`} count={entries.length} />
              </Reveal>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
