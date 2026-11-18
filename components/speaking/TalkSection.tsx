import type { ReactNode } from 'react';
import type { Talk, TalkRepo } from '@/lib/speaking';
import { formatDate } from '@/lib/format';
import { Reveal } from '@/components/motion/Reveal';
import { TokenStream } from './TokenStream';
import { Asterisk, Blob, Half, Quarter } from './Shapes';

/*
 * The Speaking page as a soft poster grid: pastel tiles of different sizes,
 * flat geometric shapes (asterisks, blobs, quarter and half discs) and one
 * desaturated conference photo in an arch. Everything reads through the
 * pastel-* tokens in globals.css, which dim (not invert) in dark mode, so the
 * page stays low-contrast in both themes.
 */

const tile = 'relative overflow-hidden rounded-[1.75rem]';

/* ── Shared bits ─────────────────────────────────────────────────────────── */

function SectionHead({ n, kicker, title, children }: { n: string; kicker: string; title: string; children?: ReactNode }) {
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

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.3-1.69-1.3-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/* ── The poster ──────────────────────────────────────────────────────────── */

/**
 * The talk as a conference poster laid out on a 12-column grid:
 *
 *   ┌──────────── title ────────────┬ band ┬── date ──┐
 *   │                               │  W   ├──────────┤
 *   │                               │  e   │  photo   │
 *   ├── stage ──┬──── topics ───────┤  A   │  (arch)  │
 *   └───────────┴───────────────────┴──────┴──────────┘
 *
 * Phones get a two-column stack of the same tiles.
 */
function Poster({ talk }: { talk: Talk }) {
  const d = talk.date ? new Date(`${talk.date}T00:00:00`) : null;
  const day = d ? d.getDate() : 'TBA';
  const month = d ? d.toLocaleDateString('en-US', { month: 'long' }) : '';

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:grid-rows-[repeat(3,minmax(11rem,auto))]">
      {/* Title */}
      <div className={`${tile} order-1 col-span-2 bg-pastel-cream p-7 sm:p-10 lg:order-none lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1`}>
        <Blob className="pointer-events-none absolute -bottom-10 right-4 h-48 w-40 text-pastel-beige sm:h-60 sm:w-48" />
        <div className="relative">
          <p className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/75">
            {talk.event} · {talk.edition}
          </p>
          <h2 className="mt-5 max-w-xl font-display text-[2rem] font-medium leading-[1.06] text-pastel-ink sm:text-[2.6rem] xl:text-[3.1rem]">
            {talk.title || 'Talk title coming soon'}
          </h2>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ['Date', talk.date ? formatDate(talk.date) : 'TBA'],
              ['Time', talk.time || 'TBA'],
              ['Format', talk.format || 'Talk'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-rounded text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-pastel-ink/60">{k}</dt>
                <dd className="mt-1 font-rounded text-base font-semibold uppercase tracking-wide text-pastel-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Vertical band */}
      <div className={`${tile} order-6 col-span-2 flex items-center bg-pastel-rose px-7 lg:order-none py-6 lg:col-span-2 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:justify-center lg:px-0 lg:py-8`}>
        <p className="font-display text-4xl font-medium leading-none text-pastel-ink lg:text-[clamp(3rem,4.6vw,4.6rem)] lg:[writing-mode:vertical-rl]">
          {talk.event}
        </p>
      </div>

      {/* Date */}
      <div className={`${tile} order-2 col-span-1 flex flex-col justify-between bg-pastel-peach p-6 lg:order-none lg:col-span-3 lg:col-start-10 lg:row-start-1`}>
        <Quarter corner="tl" className="pointer-events-none absolute -bottom-6 -right-6 w-24 bg-pastel-coral" />
        <span className="relative font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">
          {d ? d.getFullYear() : 'Date'}
        </span>
        <span className="relative">
          <span className="block font-display text-6xl leading-none text-pastel-ink">{day}</span>
          <span className="mt-1 block font-rounded text-sm font-semibold uppercase tracking-[0.16em] text-pastel-ink/80">{month}</span>
        </span>
      </div>

      {/* Photo in an arch */}
      <figure className={`${tile} order-4 col-span-2 bg-pastel-sand p-4 pb-0 lg:order-none sm:p-5 sm:pb-0 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-2`}>
        <div className="relative h-56 overflow-hidden rounded-t-full sm:h-72 lg:h-full lg:min-h-[18rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/speaking/conference.jpg"
            alt="A conference audience watching a talk on a large screen"
            className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale"
          />
          {/* Pastel wash so the photo sits in the palette instead of punching through it */}
          <div aria-hidden="true" className="absolute inset-0 bg-pastel-rose mix-blend-soft-light" />
          <div aria-hidden="true" className="absolute inset-0 bg-pastel-beige/35" />
        </div>
        <figcaption className="sr-only">Photo by Kevin Gonzalez on Unsplash</figcaption>
      </figure>

      {/* Stage */}
      <div className={`${tile} order-3 col-span-1 flex flex-col justify-between bg-pastel-beige p-6 lg:order-none lg:col-span-3 lg:col-start-1 lg:row-start-3`}>
        <Asterisk className="h-14 w-14 text-pastel-peach" />
        <span>
          <span className="block font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">Where</span>
          <span className="mt-1 block font-display text-2xl text-pastel-ink">{talk.stage || 'Stage TBA'}</span>
        </span>
      </div>

      {/* Topics */}
      <div className={`${tile} order-5 col-span-2 flex items-end justify-end bg-pastel-coral lg:order-none p-6 sm:p-8 lg:col-span-4 lg:col-start-4 lg:row-start-3`}>
        <Half className="pointer-events-none absolute -left-6 bottom-0 w-36 bg-pastel-peach" />
        <ul className="relative text-right font-rounded text-sm font-semibold uppercase leading-snug tracking-[0.12em] text-pastel-ink">
          {talk.topics.slice(0, 4).map((t) => (
            <li key={t}>{t}</li>
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

function TheTalk({ talk }: { talk: Talk }) {
  return (
    <section className="pt-20 md:pt-28">
      <Reveal>
        <SectionHead n="01" kicker="The talk" title="Watch it, or read the proposal">
          The full session recording, and the proposal it started from.
        </SectionHead>
      </Reveal>

      <div className="mt-10 grid gap-3 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className={`${tile} bg-pastel-beige p-3 sm:p-4`}>
            <VideoStage talk={talk} />
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5">
          <article className={`${tile} h-full bg-pastel-cream p-7 sm:p-9`}>
            <Quarter corner="bl" className="pointer-events-none absolute -right-2 -top-2 w-24 bg-pastel-peach" />
            <p className="relative font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">The proposal</p>
            {talk.abstract ? (
              <div className="relative mt-5 space-y-4 font-body text-lg leading-relaxed text-pastel-ink/85">
                {talk.abstract.split(/\n\s*\n/).map((para) => (
                  <p key={para.slice(0, 32)}>{para.trim()}</p>
                ))}
              </div>
            ) : (
              <div className="mt-5 space-y-2" aria-label="Proposal coming soon">
                {[100, 92, 96, 70].map((w) => (
                  <span key={w} className="block h-3 rounded-full bg-pastel-rose" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}

            {talk.topics.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {talk.topics.map((t) => (
                  <li key={t}>
                    <Pill>{t}</Pill>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-pastel-ink/10 pt-5">
              {talk.sessionUrl && (
                <a href={talk.sessionUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 font-rounded text-sm font-semibold text-pastel-ink underline decoration-pastel-ink/25 underline-offset-4 hover:decoration-pastel-ink">
                  Session page <Arrow />
                </a>
              )}
              <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 font-rounded text-sm font-semibold text-pastel-ink underline decoration-pastel-ink/25 underline-offset-4 hover:decoration-pastel-ink">
                Speaker page <Arrow />
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 02 · The slides ─────────────────────────────────────────────────────── */

/** Three faux slides fanned out like a hand of cards; they spread on hover. */
function SlideFan({ title, kicker }: { title: string; kicker: string }) {
  const slide =
    'absolute inset-0 rounded-xl shadow-[0_18px_40px_-26px_rgba(52,54,94,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:shadow-none';
  return (
    <div aria-hidden="true" className="group relative mx-auto aspect-[16/10] w-full max-w-md">
      <div className={`${slide} -rotate-6 bg-pastel-beige p-5 group-hover:-translate-x-6 group-hover:-rotate-[9deg]`}>
        <div className="flex h-full items-end gap-2 pb-2">
          {[30, 55, 40, 85, 62, 95].map((h, i) => (
            <span key={i} className="flex-1 rounded-t-full bg-pastel-ink/15" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className={`${slide} rotate-3 bg-pastel-coral p-5 group-hover:translate-x-6 group-hover:rotate-[6deg]`}>
        <div className="space-y-2 font-mono text-[0.65rem] leading-none text-pastel-ink/70">
          <span className="block">useSyncExternalStore(</span>
          <span className="block pl-4">subscribe,</span>
          <span className="block pl-4">getSnapshot</span>
          <span className="block">)</span>
        </div>
      </div>
      <div className={`${slide} flex flex-col justify-between bg-pastel-cream p-6 group-hover:-translate-y-2`}>
        <span className="font-rounded text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-pastel-ink/60">{kicker}</span>
        <span className="font-display text-xl leading-tight text-pastel-ink sm:text-2xl">{title}</span>
        <Asterisk className="h-6 w-6 text-pastel-peach" />
      </div>
    </div>
  );
}

function TheSlides({ talk }: { talk: Talk }) {
  return (
    <section className="pt-20 md:pt-28">
      <Reveal>
        <div className={`${tile} grid gap-10 bg-pastel-rose p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:p-14`}>
          <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-pastel-beige/70" />
          <Quarter corner="tr" className="pointer-events-none absolute -bottom-2 -left-2 w-28 bg-pastel-peach/80" />

          <div className="relative lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pastel-cream font-rounded text-sm font-semibold text-pastel-ink">02</span>
              <span className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">The slides</span>
            </div>
            <h3 className="mt-4 font-display text-3xl font-medium text-pastel-ink md:text-4xl">The deck, in full</h3>
            <p className="mt-3 t-feature-sub text-pastel-ink/75">
              Every slide from the session, diagrams and benchmarks included.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {talk.slidesUrl ? (
                <a
                  href={talk.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-pastel-ink px-6 py-3 font-rounded text-sm font-semibold text-pastel-cream transition-opacity hover:opacity-90"
                >
                  Open the deck <Arrow />
                </a>
              ) : (
                <>
                  <span className="inline-flex cursor-not-allowed items-center rounded-full border border-dashed border-pastel-ink/30 px-6 py-3 font-rounded text-sm font-semibold text-pastel-ink/55">
                    Open the deck
                  </span>
                  <Pill soon>Uploads after the talk</Pill>
                </>
              )}
            </div>
          </div>

          <div className="relative lg:col-span-7">
            {talk.slidesEmbedUrl ? (
              <div className="aspect-[16/10] overflow-hidden rounded-xl">
                <iframe src={talk.slidesEmbedUrl} title={`${talk.title} — slides`} loading="lazy" className="h-full w-full" allowFullScreen />
              </div>
            ) : (
              <div className="px-6 py-6 sm:px-14">
                <SlideFan title={talk.title || 'Slides coming soon'} kicker={talk.event} />
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 03 · The code ───────────────────────────────────────────────────────── */

function RepoCard({ repo }: { repo: TalkRepo }) {
  const path = repo.href.replace(/^https?:\/\/github\.com\//, '');
  return (
    <a
      href={repo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${tile} group flex h-full flex-col bg-pastel-sand p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9`}
    >
      <Asterisk className="pointer-events-none absolute -right-5 -top-5 h-28 w-28 text-pastel-cream/70 transition-transform duration-700 group-hover:rotate-45" />
      <span className="relative flex items-center gap-3">
        <GitHubMark className="h-7 w-7 text-pastel-ink" />
        <span className="font-mono text-base text-pastel-ink">{path || repo.name}</span>
        <span className="text-pastel-ink/60"><Arrow /></span>
      </span>
      <p className="relative mt-4 t-card-sub text-pastel-ink/75">{repo.description}</p>
      <code className="relative mt-6 block overflow-x-auto rounded-xl bg-primary-bg/70 px-4 py-3 font-mono text-[0.8rem] text-pastel-ink/80">
        <span className="select-none text-pastel-ink/45">$ </span>git clone {repo.href}.git
      </code>
    </a>
  );
}

function DemoCard({ repo }: { repo: TalkRepo }) {
  const body = (
    <>
      <Half className="pointer-events-none absolute -bottom-1 right-8 w-32 bg-pastel-peach/70" />
      <div className="relative flex items-center justify-between gap-4">
        <p className="font-display text-2xl text-pastel-ink">{repo.name}</p>
        {!repo.href && <Pill soon>{repo.status || 'Coming soon'}</Pill>}
      </div>
      <p className="relative mt-1 t-card-sub text-pastel-ink/75">{repo.description}</p>
      <div className="relative mt-6 overflow-hidden rounded-xl bg-primary-bg/75">
        <div className="flex items-center gap-1.5 border-b border-pastel-ink/10 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pastel-peach" />
          <span className="h-2.5 w-2.5 rounded-full bg-pastel-rose" />
          <span className="h-2.5 w-2.5 rounded-full bg-pastel-sand" />
          <span className="ml-auto font-mono text-[0.7rem] text-pastel-ink/55">{repo.name.toLowerCase()} — live demo</span>
        </div>
        <div className="p-4">
          <TokenStream />
        </div>
      </div>
    </>
  );
  const cls = `${tile} block h-full bg-pastel-coral p-7 sm:p-9`;
  return repo.href ? (
    <a href={repo.href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-transform duration-300 hover:-translate-y-1`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function TheCode({ talk }: { talk: Talk }) {
  const [repo, ...demos] = talk.repos;
  return (
    <section className="pt-20 md:pt-28">
      <Reveal>
        <SectionHead n="03" kicker="The code" title="Clone it, run it, break it">
          The repository behind the talk, and the demos built for it.
        </SectionHead>
      </Reveal>
      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        {repo && (
          <Reveal>
            <RepoCard repo={repo} />
          </Reveal>
        )}
        {demos.map((d, i) => (
          <Reveal key={d.name} delay={0.08 * (i + 1)}>
            {d.href.includes('github.com') ? <RepoCard repo={d} /> : <DemoCard repo={d} />}
          </Reveal>
        ))}
      </div>
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
      <TheSlides talk={talk} />
      <TheCode talk={talk} />
    </section>
  );
}
