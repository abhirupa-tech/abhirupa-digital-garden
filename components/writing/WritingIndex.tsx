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
 * One card style per format, in warm light tones (cream, sand, light
 * terracotta, light clay), each with a darker dark-mode twin:
 *   Essay    -> type poster: light terracotta or light clay, big title, no image
 *   Guide    -> cream or sand card, title on top, cover filling the lower half
 *   Playbook -> full-bleed cover with the title set over it
 * Essays and guides alternate between their two fills by their order in the
 * full list, so a card keeps its colour when filters change.
 */
const POSTER_TONES = [
  'bg-[#f2cfb8] text-[#3a1d12] dark:bg-[#7a3b24] dark:text-[#fbeee2]',
  'bg-[#e8d3bf] text-[#3a1d12] dark:bg-[#33241b] dark:text-[#f1e1d1]',
];
const PAPER_TONES = [
  'bg-[#fbf6ee] text-[#2b160d] dark:bg-[#211a15] dark:text-[#f1e6da]',
  'bg-[#efe2cf] text-[#2b160d] dark:bg-[#2a2019] dark:text-[#f1e6da]',
];

type Variant = 'poster' | 'paper' | 'photo';

function variantOf(item: WritingItem): Variant {
  if (item.typeSlug === 'essay') return 'poster';
  if (item.typeSlug === 'playbook' && item.cover) return 'photo';
  return item.cover ? 'paper' : 'poster';
}

/** Kicker (date) above the title, shared by every card style. */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-rounded text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
      {children}
    </span>
  );
}

/** "Essay · 5 min" on the left, the section on the right. */
function CardFooter({ item, rule }: { item: WritingItem; rule?: boolean }) {
  return (
    <footer
      className={`mt-auto flex justify-between gap-3 pt-3.5 font-rounded text-[0.8125rem] font-medium opacity-80 ${
        rule ? 'border-t border-current/15' : ''
      }`}
    >
      <span>
        {item.type} · {item.minutes} min
      </span>
      <span>{item.section}</span>
    </footer>
  );
}

const CARD =
  'group relative flex flex-col overflow-hidden rounded-[14px] px-[26px] pb-5 pt-[26px] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight';

function Card({ item, tone }: { item: WritingItem; tone: string }) {
  const variant = variantOf(item);

  if (variant === 'photo') {
    return (
      <a href={item.href} className={`${CARD} aspect-[4/5] text-white`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.cover} alt={item.coverAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,5,.62)_0%,rgba(20,10,5,.12)_45%,rgba(20,10,5,.55)_100%)]" />
        <span className="relative flex h-full flex-col">
          <Kicker>{item.dateLabel}</Kicker>
          <h2 className="mt-2.5 font-display text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.01em] [font-variation-settings:'opsz'_120,'SOFT'_50]">
            {item.title}
          </h2>
          <CardFooter item={item} />
        </span>
      </a>
    );
  }

  if (variant === 'paper') {
    return (
      <a href={item.href} className={`${CARD} aspect-[4/5] ${tone}`}>
        <Kicker>{item.dateLabel}</Kicker>
        <h2 className="mt-2.5 font-display text-[1.5625rem] font-semibold leading-[1.15] tracking-[-0.01em] [font-variation-settings:'opsz'_48,'SOFT'_50]">
          {item.title}
        </h2>
        <div className="-mx-[26px] mt-[18px] min-h-0 flex-1 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.cover} alt={item.coverAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
        <CardFooter item={item} rule />
      </a>
    );
  }

  // Poster: 4:5 from tablets up; on phones it sizes to its text.
  return (
    <a href={item.href} className={`${CARD} sm:aspect-[4/5] ${tone}`}>
      <Kicker>{item.dateLabel}</Kicker>
      <h2 className="mt-2.5 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.01em] [font-variation-settings:'opsz'_96,'SOFT'_30] sm:text-[2.125rem]">
        {item.title}
      </h2>
      {item.description && (
        <p className="mt-3.5 line-clamp-3 font-rounded text-[0.9375rem] leading-normal opacity-85">
          {item.description}
        </p>
      )}
      <div className="min-h-10 flex-1 sm:min-h-0" />
      <CardFooter item={item} />
    </a>
  );
}

/** A filter in the text row: muted, or ink with a terracotta underline when on. */
function FilterLink({
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
      className={`font-rounded text-[0.9375rem] font-medium underline-offset-[6px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${
        active
          ? 'text-parchment underline decoration-highlight decoration-2'
          : 'text-parchment-muted hover:text-parchment'
      }`}
    >
      {children}
    </button>
  );
}

const ROW_LABEL = 'font-rounded text-xs font-semibold uppercase tracking-[0.14em] text-parchment-muted';

type Facet = { slug: string; label: string; count: number };

// The URL query is the single source of truth for the filters, read through
// useSyncExternalStore: the server snapshot is "no filters" (static export has
// no request), and the client re-reads it after hydration and on every change.
const FILTER_EVENT = 'writing-filters';

// Topics shown before the 'All N topics' toggle.
const TOPIC_LIMIT = 6;

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
  const toneOf = useMemo(() => {
    const counts = { poster: 0, paper: 0 };
    return new Map(
      items.map((item) => {
        const v = variantOf(item);
        if (v === 'photo') return [item.href, ''];
        const n = counts[v]++;
        return [item.href, (v === 'poster' ? POSTER_TONES : PAPER_TONES)[n % 2]];
      }),
    );
  }, [items]);

  return (
    <div>
      <nav
        aria-label="Filter writing"
        className="flex flex-wrap items-baseline gap-x-[18px] gap-y-2 border-y border-parchment/12 py-4"
      >
        <span className={ROW_LABEL}>Format</span>
        <FilterLink active={!type} onClick={() => update('', topic)}>
          All
        </FilterLink>
        {types.map((t) => (
          <FilterLink key={t.slug} active={type === t.slug} onClick={() => update(type === t.slug ? '' : t.slug, topic)}>
            {t.label} {t.count}
          </FilterLink>
        ))}
        <span aria-hidden="true" className="mx-1.5 hidden h-4 w-px self-center bg-parchment/15 sm:block" />
        <span className={ROW_LABEL}>Topic</span>
        {visibleTopics.map((t) => (
          <FilterLink key={t.slug} active={topic === t.slug} onClick={() => update(type, topic === t.slug ? '' : t.slug)}>
            {t.label}
          </FilterLink>
        ))}
        {topics.length > TOPIC_LIMIT && (
          <FilterLink active={false} onClick={() => setExpanded(!allTopics)}>
            {allTopics ? 'Fewer' : `+${topics.length - TOPIC_LIMIT} more`}
          </FilterLink>
        )}
      </nav>

      {(type || topic) && (
        <p className="mt-5 font-rounded text-sm text-parchment-muted" aria-live="polite">
          {shown.length} of {items.length} pieces ·{' '}
          <button
            type="button"
            onClick={() => update('', '')}
            className="text-rust underline decoration-rust/40 underline-offset-4"
          >
            Clear filters
          </button>
        </p>
      )}

      <ol className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <li key={item.href} className="flex">
            <div className="flex w-full [&>a]:w-full">
              <Card item={item} tone={toneOf.get(item.href) ?? ''} />
            </div>
          </li>
        ))}
      </ol>
      {shown.length === 0 && (
        <p className="mt-10 font-rounded text-parchment-muted">Nothing matches both filters yet.</p>
      )}
    </div>
  );
}
