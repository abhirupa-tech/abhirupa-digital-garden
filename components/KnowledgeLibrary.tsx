'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Zone } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Reveal } from './motion/Reveal';
import { WanderLink } from './sections/SectionHeader';

// Type badges pick up a whisper of colour; unknown types fall back to neutral.
const typeAccent: Record<string, string> = {
  'Research Paper': 'text-teal-whisper border-teal-whisper/40',
  Blog: 'text-sand border-sand/40',
  Book: 'text-blush-whisper border-blush-whisper/40',
  Art: 'text-parchment-muted border-parchment/30',
};

function LibraryCard({
  item,
  expanded,
  onToggle,
}: {
  item: ContentEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const accent = typeAccent[item.type] ?? 'text-parchment-muted border-parchment/30';
  return (
    <motion.article
      layout={!reduce}
      className="mb-6 break-inside-avoid rounded-sm border border-parchment/10 bg-ink-700/30 p-3 backdrop-blur-[2px] transition-colors duration-500 hover:border-sand/30"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="block w-full text-left focus-visible:outline-none"
      >
        <ImagePlaceholder label={item.type} ratio={item.aspect === 'tall' ? 'portrait' : item.aspect === 'wide' ? 'landscape' : 'square'} />
        <div className="px-1 pt-4">
          <span className={`label inline-block rounded-full border px-3 py-1 text-[0.6rem] ${accent}`}>
            {item.type}
          </span>
          <h3 className="mt-3 font-display text-xl font-medium text-parchment">{item.title}</h3>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="detail"
                initial={reduce ? undefined : { height: 0, opacity: 0 }}
                animate={reduce ? undefined : { height: 'auto', opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="pt-3 font-body text-base leading-relaxed text-parchment/80">
                  {item.description}
                </p>
                <ul className="flex flex-wrap gap-2 pt-4">
                  {item.tags.map((t) => (
                    <li key={t} className="label text-[0.6rem] text-parchment-faint">
                      #{t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="label mt-4 inline-block text-[0.6rem] text-sand/70">
            {expanded ? '— close' : 'open —'}
          </span>
        </div>
      </button>
    </motion.article>
  );
}

export function KnowledgeLibrary({ zone, entries }: { zone: Zone; entries: ContentEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <Reveal className="max-w-xl">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-lg text-sand/70">{zone.index}</span>
          <span className="label">{zone.kicker}</span>
        </div>
        <h2 className="mt-4 font-display text-section font-medium text-parchment">{zone.title}</h2>
        <p className="mt-3 font-rounded text-lg font-light not-italic leading-tight tracking-tight text-parchment-muted">
          {zone.blurb}
        </p>
      </Reveal>

      {/* Discovery masonry — asymmetric columns, a place for finding */}
      <Reveal delay={0.1} className="mt-12">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {entries.map((item) => (
            <LibraryCard
              key={item.slug}
              item={item}
              expanded={openId === item.slug}
              onToggle={() => setOpenId((cur) => (cur === item.slug ? null : item.slug))}
            />
          ))}
        </div>
      </Reveal>

      <WanderLink zone={zone} />
    </div>
  );
}
