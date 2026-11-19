import type { ReactNode } from 'react';
import type { Talk } from '@/lib/speaking';
import { formatDate } from '@/lib/format';
import { Reveal } from '@/components/motion/Reveal';
import { Asterisk, Quarter } from './Shapes';
import { ClampToFit } from './ClampToFit';

/*
 * The Speaking page as a soft poster grid: pastel tiles of different sizes,
 * flat geometric shapes (asterisks, blobs, quarter and half discs) and one
 * desaturated conference photo in an arch. Everything reads through the
 * pastel-* tokens in globals.css, which dim (not invert) in dark mode, so the
 * page stays low-contrast in both themes.
 */

const tile = 'relative overflow-hidden rounded-[1.75rem]';

/* ── Shared bits ─────────────────────────────────────────────────────────── */

function SectionHead({ n, kicker, title, children }: { n: ReactNode; kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pastel-peach font-rounded text-sm font-semibold text-pastel-ink">
          {n}
        </span>
        <span className="label text-parchment-muted">{kicker}</span>
      </div>
      <h3 className="mt-4 font-display text-3xl font-medium text-parchment md:text-4xl">{title}</h3>
      {children && <p className="mt-3 t-feature-sub text-parchment-muted">{children}</p>}
    </div>
  );
}

/** One value on phones (below sm), another from sm up. */
function PhoneSwap({ phone, wide }: { phone: string; wide: string }) {
  return (
    <>
      <span className="sm:hidden">{phone}</span>
      <span className="hidden sm:inline">{wide}</span>
    </>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
      <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Pill({ children, soon }: { children: ReactNode; soon?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-bg/70 px-3 py-1 font-rounded text-xs font-medium text-pastel-ink">
      {soon && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e2956a] motion-reduce:animate-none" />}
      {children}
    </span>
  );
}

/* ── The poster ──────────────────────────────────────────────────────────── */

/**
 * The talk as a compact bento on a 12-column grid:
 *
 *   ┌──────── title over photo ────────┬─ date ─┬─ stage ─┐
 *   │                                  ├────────┴─────────┤
 *   │                                  │      topics      │
 *   └──────────────────────────────────┴──────────────────┘
 *
 * The conference photo sits behind the title under a dark gradient, so the
 * light text keeps its contrast whatever part of the photo it lands on.
 * Phones stack the title, then date and stage side by side, then topics.
 */
function Poster({ talk }: { talk: Talk }) {
  const d = talk.date ? new Date(`${talk.date}T00:00:00`) : null;
  const day = d ? d.getDate() : 'TBA';
  const month = d ? d.toLocaleDateString('en-US', { month: 'long' }) : '';

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:grid-rows-[repeat(2,minmax(9.5rem,auto))]">
      {/* Title over the conference photo */}
      <div className={`${tile} col-span-2 flex min-h-[19rem] flex-col justify-end bg-[#1c1714] p-6 sm:p-8 lg:col-span-8 lg:row-span-2`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/speaking/conference.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/45" />
        <div className="relative">
          <p className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
            {talk.event} · {talk.edition}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-[1.85rem] font-medium leading-[1.08] text-[#fbf6f0] sm:text-[2.3rem] xl:text-[2.6rem]">
            {talk.title || 'Talk title coming soon'}
          </h2>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['Date', talk.date ? formatDate(talk.date) : 'TBA'],
              ['Time', talk.time || 'TBA'],
              ['Format', talk.format || 'Talk'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-rounded text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/60">{k}</dt>
                <dd className="mt-1 font-rounded text-sm font-semibold uppercase tracking-wide text-[#fbf6f0]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <span className="sr-only">Background photo by Kevin Gonzalez on Unsplash</span>
      </div>

      {/* Date */}
      <div className={`${tile} flex flex-col justify-between bg-pastel-peach p-5 lg:col-span-2`}>
        <span className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">
          {d ? d.getFullYear() : 'Date'}
        </span>
        <span className="mt-4">
          <span className="block font-display text-5xl leading-none text-pastel-ink">{day}</span>
          <span className="mt-1 block font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/80">{month}</span>
        </span>
      </div>

      {/* Stage */}
      <div className={`${tile} flex flex-col justify-between bg-pastel-beige p-5 lg:col-span-2`}>
        <Asterisk className="h-8 w-8 text-pastel-coral" />
        <span className="mt-4">
          <span className="block font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">Where</span>
          <span className="mt-1 block font-display text-2xl text-pastel-ink">{talk.stage || 'Stage TBA'}</span>
        </span>
      </div>

      {/* Topics */}
      <div className={`${tile} col-span-2 flex flex-col justify-between bg-pastel-rose p-5 lg:col-span-4`}>
        <span className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">Topics</span>
        <ul className="mt-4 flex flex-wrap gap-2">
          {talk.topics.map((t) => (
            <li key={t}>
              <Pill>{t}</Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 01 · The talk ───────────────────────────────────────────────────────── */

function VideoStage({ talk }: { talk: Talk }) {
  if (talk.youtubeId) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${talk.youtubeId}`}
          title={`${talk.title} — recording`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    // A plain slate-grey to dark-brown screen, the same in both themes.
    <figure className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-[#5e4130] to-[#2e2019]">

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-pastel-cream text-pastel-ink">
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-pastel-cream/60 [animation-duration:2.8s] motion-reduce:animate-none" />
          <svg viewBox="0 0 24 24" aria-hidden="true" className="relative ml-1 h-6 w-6" fill="currentColor">
            <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
          </svg>
        </span>
        <figcaption className="px-6">
          <span className="block font-display text-xl text-[#f3ece4] sm:text-2xl">Recording coming soon</span>
          <span className="mt-1 block font-rounded text-sm text-[#f3ece4]/75">
            The talk goes up on YouTube after {talk.date ? formatDate(talk.date) : 'the conference'}.
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

/** "Session page" and "Speaker page" links: in the proposal card, or under the video on phones. */
function TalkLinks({ talk, tone = 'page' }: { talk: Talk; tone?: 'card' | 'page' }) {
  const cls = `group inline-flex items-center gap-1.5 font-rounded text-sm font-semibold underline underline-offset-4 ${
    tone === 'card'
      ? 'text-pastel-ink decoration-pastel-ink/25 hover:decoration-pastel-ink'
      : 'text-parchment decoration-parchment/25 hover:decoration-parchment'
  }`;
  return (
    <>
      {talk.sessionUrl && (
        <a href={talk.sessionUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          Session page <Arrow />
        </a>
      )}
      <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        Speaker page <Arrow />
      </a>
    </>
  );
}

function TheTalk({ talk }: { talk: Talk }) {
  return (
    <section className="pt-20 md:pt-28">
      <Reveal>
        {/* Phones hide the proposal card, so the heading only promises the video there. */}
        <SectionHead
          n={<PhoneSwap phone="02" wide="01" />}
          kicker="The talk"
          title={
            <>
              <span className="sm:hidden">Watch the talk</span>
              <span className="hidden sm:inline">Watch it, or read the proposal</span>
            </>
          }
        >
          The full session recording<span className="hidden sm:inline">, and the proposal it started from</span>.
        </SectionHead>
      </Reveal>

      <div className="mt-10 grid gap-3 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className={`${tile} bg-pastel-beige p-3 sm:p-4`}>
            <VideoStage talk={talk} />
          </div>
          {/* Phones: no proposal card, but keep its two links under the video. */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 px-1 sm:hidden">
            <TalkLinks talk={talk} />
          </div>
        </Reveal>

        {/* Hidden on phones. On lg the proposal is taken out of flow so the
            video sets the row height; the text clamps with "…" to fit. */}
        <Reveal delay={0.08} className="relative hidden sm:block lg:col-span-5">
          <article className={`${tile} flex flex-col bg-pastel-cream p-7 sm:p-9 lg:absolute lg:inset-0`}>
            <Quarter corner="bl" className="pointer-events-none absolute -right-2 -top-2 w-24 bg-pastel-peach" />
            <p className="relative font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">The proposal</p>
            {talk.abstract ? (
              <ClampToFit className="relative mt-5 flex-1" innerClassName="space-y-4 font-body text-lg leading-relaxed text-pastel-ink/85">
                {talk.abstract.split(/\n\s*\n/).map((para) => (
                  <p key={para.slice(0, 32)}>{para.trim()}</p>
                ))}
              </ClampToFit>
            ) : (
              <div className="mt-5 space-y-2" aria-label="Proposal coming soon">
                {[100, 92, 96, 70].map((w) => (
                  <span key={w} className="block h-3 rounded-full bg-pastel-rose" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}

            <div className="mt-6 flex shrink-0 flex-wrap gap-x-6 gap-y-2 border-t border-pastel-ink/10 pt-5">
              <TalkLinks talk={talk} tone="card" />
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 02 · Deck, code and demo ───────────────────────────────────────────── */

/*
 * Three object-like cards, monochrome in the page's ink so they read as
 * tools rather than decoration:
 *   row 1  demo (a terminal card)  ·  code (a folder, tabs stacked behind)
 *   row 2  slides (a deck of cards fanned behind, with a slide counter)
 * Each card is a link once its URL is set, and a quiet "coming" state before.
 */

const INK_CARD =
  'relative block rounded-2xl border-[1.5px] border-parchment/80 bg-primary-bg text-parchment transition-transform duration-300';
/** A blank card stacked behind another (same shape, no content). */
const BACK_CARD = 'absolute inset-0 rounded-2xl border-[1.5px] bg-primary-bg transition-transform duration-500';

function Prompt({ children, live }: { children: ReactNode; live: boolean }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.14em] text-parchment-muted">
      &gt; {children}{' '}
      <span aria-hidden="true" className={live ? 'animate-pulse motion-reduce:animate-none' : ''}>
        _
      </span>
    </span>
  );
}

function MaybeLink({ href, className, children }: { href?: string; className: string; children: ReactNode }) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group ${className}`}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );
}

/** Terminal-style card: a mono title and a run prompt. */
function DemoCard({ talk }: { talk: Talk }) {
  const demo = talk.repos.find((r) => r.href && r.kind === 'demo');
  const host = demo?.href.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <MaybeLink href={demo?.href} className="block h-full">
      <div className={`${INK_CARD} flex h-full min-h-52 flex-col p-6 group-hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-parchment-faint">Live demo</span>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full border border-parchment/50" />
            <span className="h-2 w-2 rounded-full border border-parchment/50" />
            <span className="h-2 w-2 rounded-full bg-parchment/70" />
          </span>
        </div>
        <p className="mt-5 font-mono text-2xl leading-tight">{demo ? demo.name : 'Demo'}</p>
        <p className="mt-2 max-w-sm font-rounded text-sm leading-relaxed text-parchment-muted">
          {demo ? demo.description : 'Goes live after the talk.'}
        </p>
        <span className="mt-auto pt-6">
          <Prompt live={!!demo}>{demo ? `Run ${host}` : 'Coming soon'}</Prompt>
        </span>
      </div>
    </MaybeLink>
  );
}

/** One outlined folder behind the front one: body plus a tab joined to it. */
function FolderOutline({ top, tabLeft, tone }: { top: string; tabLeft: string; tone: string }) {
  return (
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0" style={{ top }}>
      <span className={`absolute inset-0 rounded-2xl border-[1.5px] bg-primary-bg ${tone}`} />
      {/* the tab overlaps the body's top edge so the outline runs on unbroken */}
      <span
        className={`absolute -top-[1.375rem] h-[calc(1.375rem+1.5px)] w-28 rounded-t-xl border-[1.5px] border-b-0 bg-primary-bg ${tone}`}
        style={{ left: tabLeft }}
      />
    </span>
  );
}

/** A folder for the repo: solid ink front, outlined folders stacked behind. */
function FolderCard({ talk }: { talk: Talk }) {
  const repo = talk.repos.find((r) => r.href && r.kind !== 'demo');
  const path = repo?.href.replace(/^https?:\/\/github\.com\//, '');
  const front = 'bg-[#2b1f17] dark:bg-pastel-cream';
  return (
    <MaybeLink href={repo?.href} className="block h-full">
      <div className="relative flex h-full flex-col pt-[4.25rem]">
        <FolderOutline top="1.5rem" tabLeft="46%" tone="border-parchment/30" />
        <FolderOutline top="2.875rem" tabLeft="24%" tone="border-parchment/55" />
        {/* front folder, its tab flush with the left edge */}
        <div className={`relative flex min-h-52 flex-1 flex-col rounded-2xl rounded-tl-none p-6 text-[#f3ece4] transition-transform duration-300 group-hover:-translate-y-1 ${front}`}>
          <span aria-hidden="true" className={`absolute -top-[1.375rem] left-0 h-[calc(1.375rem+1px)] w-32 rounded-t-xl ${front}`} />
          <span className="flex items-start justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#f3ece4]/60">Source code</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3ece4] text-[#2b1f17]">
              <Asterisk className="h-4 w-4" />
            </span>
          </span>
          <p className="mt-3 font-display text-2xl leading-snug">{path || 'Repository'}</p>
          <p className="mt-2 max-w-sm font-rounded text-sm leading-relaxed text-[#f3ece4]/70">
            {repo ? repo.description : 'Goes public after the talk.'}
          </p>
          <span className="mt-auto pt-6 font-mono text-xs uppercase tracking-[0.14em] text-[#f3ece4]/60">
            {repo ? 'github.com ↗' : 'Coming soon'}
          </span>
        </div>
      </div>
    </MaybeLink>
  );
}

/** The deck: a card with two more fanned out behind it and a slide counter. */
function DeckCard({ talk }: { talk: Talk }) {
  const live = !!talk.slidesUrl;
  return (
    <MaybeLink href={talk.slidesUrl || undefined} className="block pb-4 pl-4">
      <div className="relative">
        {/* two cards stacked behind, stepped down and to the left */}
        <span aria-hidden="true" className={`${BACK_CARD} -translate-x-4 translate-y-4 border-parchment/30 shadow-[0_14px_28px_-20px_rgba(0,0,0,0.45)] group-hover:-translate-x-5 group-hover:translate-y-5`} />
        <span aria-hidden="true" className={`${BACK_CARD} -translate-x-2 translate-y-2 border-parchment/55 group-hover:-translate-x-2.5 group-hover:translate-y-2.5`} />
        <div className={`${INK_CARD} flex min-h-52 flex-col p-6 sm:p-8`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3 font-mono text-sm text-parchment-muted">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              1 / {live ? '—' : '?'}
            </span>
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-parchment/70">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4l4 4-4 4M8 4l4 4-4 4M13.5 4v8" />
              </svg>
            </span>
          </div>
          <p className="mt-6 font-mono text-2xl leading-tight sm:text-3xl">Slide deck.</p>
          <p className="mt-2 max-w-xl font-rounded text-sm leading-relaxed text-parchment-muted sm:text-base">
            Every slide from the session, diagrams and benchmarks included.
          </p>
          <span className="mt-auto pt-6">
            <Prompt live={live}>
              {live ? 'Open the deck' : `Uploads after the talk${talk.date ? `, ${formatDate(talk.date)}` : ''}`}
            </Prompt>
          </span>
        </div>
      </div>
    </MaybeLink>
  );
}

function DeckAndCode({ talk }: { talk: Talk }) {
  return (
    <section className="pt-16 md:pt-20">
      <Reveal>
        <SectionHead n={<PhoneSwap phone="01" wide="02" />} kicker="Deck, code and demo" title="Slides, source and demo" />
      </Reveal>
      <Reveal delay={0.06}>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:items-end sm:gap-4">
          <DemoCard talk={talk} />
          <FolderCard talk={talk} />
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="mt-6">
          <DeckCard talk={talk} />
        </div>
      </Reveal>
    </section>
  );
}

/* ── One talk ────────────────────────────────────────────────────────────── */

export function TalkSection({ talk }: { talk: Talk }) {
  return (
    <section id={talk.id} className="scroll-mt-24">
      <Reveal>
        <Poster talk={talk} />
      </Reveal>
      {/* Phones: slides and source first, the recording after. sm and up keep
          the talk first. Section numbers swap with the order (PhoneSwap). */}
      <div className="flex flex-col">
        <div className="order-2 sm:order-1">
          <TheTalk talk={talk} />
        </div>
        <div className="order-1 sm:order-2">
          <DeckAndCode talk={talk} />
        </div>
      </div>
    </section>
  );
}
