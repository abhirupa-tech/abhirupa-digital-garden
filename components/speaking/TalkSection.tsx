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
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pastel-peach font-rounded text-sm font-semibold text-pastel-ink dark:bg-[#f0e4da]/20">
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
      <div className={`${tile} col-span-2 flex min-h-[19rem] flex-col justify-end bg-[#f3ece2] p-6 sm:p-8 lg:col-span-8 lg:row-span-2 dark:bg-[#1c1714]`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/speaking/conference.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#f6efe4] via-[#f6efe4]/85 to-[#f6efe4]/45 dark:from-black/90 dark:via-black/70 dark:to-black/45" />
        <div className="relative">
          <p className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-[#3a2a20]/75 dark:text-white/75">
            {talk.event} · {talk.edition}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-[1.85rem] font-medium leading-[1.08] text-[#2b1f17] sm:text-[2.3rem] xl:text-[2.6rem] dark:text-[#fbf6f0]">
            {talk.title || 'Talk title coming soon'}
          </h2>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['Date', talk.date ? formatDate(talk.date) : 'TBA'],
              ['Time', talk.time || 'TBA'],
              ['Format', talk.format || 'Talk'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-rounded text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#3a2a20]/60 dark:text-white/60">{k}</dt>
                <dd className="mt-1 font-rounded text-sm font-semibold uppercase tracking-wide text-[#2b1f17] dark:text-[#fbf6f0]">{v}</dd>
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
        <Asterisk className="h-8 w-8 text-pastel-coral dark:text-[#f2bba5]" />
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
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-pastel-cream text-pastel-ink dark:bg-[#f0e4da]/25">
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-pastel-cream/60 [animation-duration:2.8s] motion-reduce:animate-none dark:bg-[#f0e4da]/15" />
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
            <Quarter corner="bl" className="pointer-events-none absolute -right-2 -top-2 w-24 bg-pastel-peach dark:bg-[#f0e4da]/15" />
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
                  <span key={w} className="block h-3 rounded-full bg-pastel-rose dark:bg-[#f0e4da]/15" style={{ width: `${w}%` }} />
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
 * Spot-icon rows: a soft tinted pill, a small flat illustration hanging off
 * its left edge, title and subtext, and a round arrow button. Demo and code
 * share a row; the deck sits below. A link once its URL is set, otherwise a
 * quiet "soon" chip in place of the arrow.
 */

function DemoSpot() {
  return (
    <svg viewBox="0 0 72 64" aria-hidden="true" className="h-full w-full">
      <rect x="10" y="14" width="54" height="40" rx="7" fill="#1f1611" />
      <rect x="6" y="10" width="54" height="40" rx="7" fill="#3a2a20" />
      <circle cx="14" cy="18" r="2" fill="#f2bba5" />
      <circle cx="20" cy="18" r="2" fill="#f4d4bc" />
      <circle cx="26" cy="18" r="2" fill="#e8e2d3" />
      <path d="M28 27v14l12-7-12-7Z" fill="#f4d4bc" />
    </svg>
  );
}

function CodeSpot() {
  return (
    <svg viewBox="0 0 72 64" aria-hidden="true" className="h-full w-full">
      <path d="M8 16a5 5 0 0 1 5-5h12l5 5h24a5 5 0 0 1 5 5v4H8v-9Z" fill="#a85f3a" />
      <rect x="10" y="22" width="54" height="34" rx="6" fill="#7d4129" />
      <rect x="6" y="20" width="54" height="34" rx="6" fill="#c77a4e" />
      <path d="M27 31l-6 6 6 6M39 31l6 6-6 6" fill="none" stroke="#fbeee2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeckSpot() {
  return (
    <svg viewBox="0 0 72 64" aria-hidden="true" className="h-full w-full">
      <rect x="16" y="6" width="48" height="34" rx="5" fill="#d9c2a3" transform="rotate(8 40 23)" />
      <rect x="10" y="16" width="50" height="36" rx="5" fill="#8c6a4a" />
      <rect x="6" y="13" width="50" height="36" rx="5" fill="#f3e3cc" />
      <rect x="14" y="34" width="6" height="9" rx="1.5" fill="#d9774f" />
      <rect x="24" y="28" width="6" height="15" rx="1.5" fill="#d9774f" />
      <rect x="34" y="22" width="6" height="21" rx="1.5" fill="#d9774f" />
      <rect x="44" y="20" width="4" height="3" rx="1.5" fill="#3a2a20" />
    </svg>
  );
}

function SpotCard({
  href,
  icon,
  title,
  subtitle,
  tone,
  soon,
}: {
  href?: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  tone: string;
  soon?: string;
}) {
  const body = (
    <>
      <span className="pointer-events-none absolute -left-5 top-1/2 h-16 w-[4.5rem] -translate-y-1/2 transition-transform duration-300 group-hover:-rotate-6 sm:h-[4.5rem] sm:w-20">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-rounded text-base font-bold leading-snug text-pastel-ink sm:text-lg">{title}</span>
        <span className="mt-0.5 block font-rounded text-sm leading-snug text-pastel-ink/65">{subtitle}</span>
      </span>
      {href ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-bg text-pastel-ink transition-transform duration-300 group-hover:translate-x-0.5 dark:bg-[#f0e4da]/15">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      ) : (
        <span className="shrink-0 rounded-full border border-dashed border-pastel-ink/30 px-3 py-1 font-rounded text-xs font-medium text-pastel-ink/70">
          <span className="sm:hidden">Soon</span>
          <span className="hidden sm:inline">{soon || 'Soon'}</span>
        </span>
      )}
    </>
  );
  const cls = `group relative ml-5 flex min-h-24 items-center gap-4 rounded-[1.75rem] py-5 pl-[4.25rem] pr-5 sm:pl-20 ${tone}`;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function DeckAndCode({ talk }: { talk: Talk }) {
  const repo = talk.repos.find((r) => r.href && r.kind !== 'demo');
  const demo = talk.repos.find((r) => r.href && r.kind === 'demo');
  return (
    <section className="pt-16 md:pt-20">
      <Reveal>
        <SectionHead n={<PhoneSwap phone="01" wide="02" />} kicker="Deck, code and demo" title="Slides, source and demo" />
      </Reveal>
      <Reveal delay={0.06}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <SpotCard
            href={demo?.href}
            icon={<DemoSpot />}
            title={demo ? `${demo.name} live demo` : 'Live demo'}
            subtitle={demo ? 'Replay an LLM stream, three ways' : 'Goes live after the talk'}
            tone="bg-pastel-beige"
            soon="After the talk"
          />
          <SpotCard
            href={repo?.href}
            icon={<CodeSpot />}
            title="Source on GitHub"
            subtitle={repo ? repo.href.replace(/^https?:\/\/github\.com\//, '') : 'Goes public after the talk'}
            tone="bg-pastel-rose"
            soon="After the talk"
          />
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="mt-4">
          <SpotCard
            href={talk.slidesUrl || undefined}
            icon={<DeckSpot />}
            title="Slide deck"
            subtitle="Every slide, diagrams and benchmarks included"
            tone="bg-pastel-peach"
            soon={talk.date ? `Uploads ${formatDate(talk.date)}` : 'After the talk'}
          />
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
