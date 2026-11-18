import type { ReactNode } from 'react';
import type { Talk } from '@/lib/speaking';
import { formatDate } from '@/lib/format';
import { Reveal } from '@/components/motion/Reveal';
import { LinkCard } from '@/components/typography/LinkCard';
import { Asterisk, Half, Quarter } from './Shapes';
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

function SectionHead({ n, kicker, title, children }: { n: string; kicker: string; title: ReactNode; children?: ReactNode }) {
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
    <figure className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-pastel-rose to-pastel-beige">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_65%_at_50%_0%,rgba(255,255,255,0.55),transparent_70%)] dark:bg-[radial-gradient(ellipse_50%_65%_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]" />
      <Half className="pointer-events-none absolute -bottom-1 left-[8%] w-28 bg-pastel-peach/80 sm:w-36" />
      <Asterisk className="pointer-events-none absolute right-[8%] top-[14%] h-10 w-10 text-pastel-cream sm:h-14 sm:w-14" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-pastel-cream text-pastel-ink">
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-pastel-cream/60 [animation-duration:2.8s] motion-reduce:animate-none" />
          <svg viewBox="0 0 24 24" aria-hidden="true" className="relative ml-1 h-6 w-6" fill="currentColor">
            <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
          </svg>
        </span>
        <figcaption className="px-6">
          <span className="block font-display text-xl text-pastel-ink sm:text-2xl">Recording coming soon</span>
          <span className="mt-1 block font-rounded text-sm text-pastel-ink/70">
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
          n="01"
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

/* ── 02 · Deck and code ─────────────────────────────────────────────────── */

/** Same footprint as a LinkCard, for a link that isn't live yet. */
function PendingCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full items-center gap-4 rounded-lg border border-dashed border-parchment/20 px-5 py-4 sm:px-6">
      <span className="min-w-0 flex-1">
        <span className="block font-rounded text-base font-bold leading-snug text-parchment-muted sm:text-lg">{title}</span>
        <span className="mt-1 block font-rounded text-sm leading-relaxed text-parchment-faint sm:text-base">{description}</span>
      </span>
    </div>
  );
}

function DeckAndCode({ talk }: { talk: Talk }) {
  const repo = talk.repos.find((r) => r.href);
  return (
    <section className="pt-16 md:pt-20">
      <Reveal>
        <SectionHead n="02" kicker="Deck and code" title="Slides and source" />
      </Reveal>
      <Reveal delay={0.06}>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {talk.slidesUrl ? (
            <LinkCard warm className="h-full" href={talk.slidesUrl} title="Slide deck" description="Every slide from the session, diagrams and benchmarks included." />
          ) : (
            <PendingCard title="Slide deck" description={`Uploads after the talk${talk.date ? ` on ${formatDate(talk.date)}` : ''}.`} />
          )}
          {repo ? (
            <LinkCard warm className="h-full" href={repo.href} title={repo.href.replace(/^https?:\/\/github\.com\//, '')} description={repo.description} site="github.com" />
          ) : (
            <PendingCard title="Source code" description="Goes public after the talk." />
          )}
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
      <TheTalk talk={talk} />
      <DeckAndCode talk={talk} />
    </section>
  );
}
