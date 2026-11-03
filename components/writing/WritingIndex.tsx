'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';

export type WritingItem = {
  href: string;
  title: string;
  description: string;
  type: string;
  typeSlug: string;
  date: string;
  dateLabel: string;
  year: string;
  minutes: number;
  section: string;
  /** Topic slugs, for filtering. */
  tags: string[];
  /** Topic display names, for the card. */
  tagNames: string[];
  /** Ready-to-use cover URL, or '' when the piece has none. */
  cover: string;
  coverAlt: string;
};

/**
 * Card fills, beige through to rust: light tones in light mode, deep browns in
 * dark mode. Each card keeps its tone across filters (it's picked by the
 * piece's place in the full list, not the filtered one).
 */
const TONES = [
  'bg-[#f4ece0] dark:bg-[#2a241e]',
  'bg-[#efdcc6] dark:bg-[#33281e]',
  'bg-[#f3d6bd] dark:bg-[#3c2b1f]',
  'bg-[#ecc7a9] dark:bg-[#452f21]',
  'bg-[#f7e6d6] dark:bg-[#30261f]',
];

/** "Read the essay" / "Read the guide" from the piece's format. */
function ctaLabel(type: string): string {
  const t = type.trim().toLowerCase();
  return t ? `Read the ${t}` : 'Read the piece';
}

type Facet = { slug: string; label: string; count: number };

// The URL query is the single source of truth for the filters, read through
// useSyncExternalStore: the server snapshot is "no filters" (static export has
// no request), and the client re-reads it after hydration and on every change.
const FILTER_EVENT = 'writing-filters';

// Topics shown before the 'All N topics' toggle.
const TOPIC_LIMIT = 16;

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

function writeParams(type: string, topic: string) {
  const p = new URLSearchParams();
  if (type) p.set('type', type);
  if (topic) p.set('topic', topic);
  const qs = p.toString();
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  window.dispatchEvent(new Event(FILTER_EVENT));
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 font-rounded text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${
        active
          ? 'border-highlight bg-highlight/10 text-parchment'
          : 'border-parchment/15 text-parchment-muted hover:border-parchment/35 hover:text-parchment'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Every published piece in one list, filterable by format and topic. The full
 * list is in the server-rendered HTML, so it reads and indexes without
 * JavaScript; filters only narrow it, and mirror into the URL
 * (`?type=essay&topic=llm`) so a filtered view can be linked.
 */
export function WritingIndex({
  items,
  types,
  topics,
}: {
  items: WritingItem[];
  types: Facet[];
  topics: Facet[];
}) {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  );
  const params = new URLSearchParams(search);
  const type = params.get('type') ?? '';
  const topic = params.get('topic') ?? '';
  const [expanded, setExpanded] = useState(false);
  // A linked topic outside the first TOPIC_LIMIT opens the full list so it shows as active.
  const allTopics = expanded || (!!topic && !topics.slice(0, TOPIC_LIMIT).some((t) => t.slug === topic));

  const update = (nextType: string, nextTopic: string) => writeParams(nextType, nextTopic);

  const shown = useMemo(
    () =>
      items.filter(
        (i) => (!type || i.typeSlug === type) && (!topic || i.tags.includes(topic)),
      ),
    [items, type, topic],
  );

  const visibleTopics = allTopics ? topics : topics.slice(0, TOPIC_LIMIT);
  const toneOf = useMemo(() => new Map(items.map((item, i) => [item.href, TONES[i % TONES.length]])), [items]);

  return (
    <div>
      <div className="space-y-4 border-y border-parchment/10 py-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by format">
          <span className="label mr-2 w-16">Format</span>
          <Chip active={!type} onClick={() => update('', topic)}>
            All
          </Chip>
          {types.map((t) => (
            <Chip key={t.slug} active={type === t.slug} onClick={() => update(type === t.slug ? '' : t.slug, topic)}>
              {t.label} <span className="text-parchment-faint">{t.count}</span>
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by topic">
          <span className="label mr-2 w-16">Topic</span>
          {visibleTopics.map((t) => (
            <Chip key={t.slug} active={topic === t.slug} onClick={() => update(type, topic === t.slug ? '' : t.slug)}>
              {t.label}
            </Chip>
          ))}
          {topics.length > TOPIC_LIMIT && (
            <button
              type="button"
              onClick={() => setExpanded(!allTopics)}
              className="font-rounded text-sm text-rust underline decoration-rust/40 underline-offset-4"
            >
              {allTopics ? 'Fewer topics' : `All ${topics.length} topics`}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 font-rounded text-sm text-parchment-muted" aria-live="polite">
        {shown.length === items.length
          ? `${items.length} pieces, newest first`
          : `${shown.length} of ${items.length} pieces`}
        {(type || topic) && (
          <>
            {' · '}
            <button
              type="button"
              onClick={() => update('', '')}
              className="text-rust underline decoration-rust/40 underline-offset-4"
            >
              Clear filters
            </button>
          </>
        )}
      </p>

      {/* Masonry: three balanced columns (two on tablets, one on phones).
          Each card has its own warm fill, a rounded-rectangle cover, and
          text that sets the card's height. */}
      <ol className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {shown.map((item) => (
          <li key={item.href} className="mb-5 break-inside-avoid">
            <a
              href={item.href}
              className={`group block rounded-[2rem] p-4 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${toneOf.get(item.href)}`}
            >
              {item.cover && (
                <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cover}
                    alt={item.coverAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              )}
              <div className="px-2 pb-2 pt-5">
                <p className="label flex flex-wrap gap-x-3 gap-y-1 text-parchment-muted">
                  <span>{item.type}</span>
                  <span>{item.dateLabel}</span>
                  <span className="normal-case tracking-normal">{item.minutes} min read</span>
                </p>
                <h2 className="mt-2 font-display text-xl leading-snug text-parchment">{item.title}</h2>
                {item.description && (
                  <p className="mt-2 font-rounded text-base leading-relaxed text-secondary-text">
                    {item.description}
                  </p>
                )}
                {item.tagNames.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-rounded text-sm text-rust-deep dark:text-rust-soft">
                    {item.tagNames.slice(0, 3).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-parchment/40 px-4 py-1.5 font-rounded text-sm text-parchment transition-colors duration-300 group-hover:border-parchment group-hover:bg-parchment group-hover:text-primary-bg">
                  {ctaLabel(item.type)}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ol>
      {shown.length === 0 && (
        <p className="mt-10 font-rounded text-parchment-muted">Nothing matches both filters yet.</p>
      )}
    </div>
  );
}
