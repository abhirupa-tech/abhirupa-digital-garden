import type { ContentEntry } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { CoverImage } from '../CoverImage';
import { TypeBadge } from '../TypeBadge';
import { Reveal } from '../motion/Reveal';
import { HoverLink, AnimatedTitle } from '../motion/HoverLink';

/**
 * The hero of a section landing page: the most recently published piece, shown
 * large as a "latest" preview. A wide cover on the left, the story's framing on
 * the right — the one place on the page where a single piece gets full billing
 * before the archive fans out below it.
 */
export function SectionFeature({ entry }: { entry: ContentEntry }) {
  return (
    <Reveal className="mt-8 md:mt-10">
      <HoverLink
        href={`/${entry.section}/${entry.slug}/`}
        className="group grid items-start gap-6 md:grid-cols-2 md:gap-10"
      >
        <div className="overflow-hidden rounded-2xl border border-parchment/10 shadow-sm">
          <CoverImage
            src={entry.cover}
            alt={entry.title}
            ratio="landscape"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="label rounded-full bg-rust/10 px-3 py-1 text-rust">Latest</span>
            <TypeBadge type={entry.type} />
            {entry.date && (
              <time className="label text-parchment-faint">{formatDate(entry.date)}</time>
            )}
          </div>

          <h2 className="mt-4">
            <AnimatedTitle className="font-display text-2xl font-medium leading-snug md:text-3xl">
              {entry.title}
            </AnimatedTitle>
          </h2>

          {entry.description && (
            <p className="mt-3 max-w-xl font-rounded text-lg leading-relaxed text-parchment/80">
              {entry.description}
            </p>
          )}

          <span className="label mt-6 inline-flex items-center gap-2 text-sand transition-colors duration-300 group-hover:text-rust">
            Read the latest
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </HoverLink>
    </Reveal>
  );
}
