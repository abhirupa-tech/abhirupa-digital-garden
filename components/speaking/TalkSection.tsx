import type { ReactNode } from 'react';
import type { Talk, TalkRepo } from '@/lib/speaking';
import { formatDate } from '@/lib/format';
import { Reveal } from '@/components/motion/Reveal';
import { TokenStream } from './TokenStream';

/* ── Shared bits ─────────────────────────────────────────────────────────── */

function SectionHead({ n, kicker, title, children }: { n: string; kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-lg text-sunset/80">{n}</span>
        <span className="label text-parchment-muted">{kicker}</span>
      </div>
      <h3 className="mt-3 font-display text-3xl font-medium text-parchment md:text-4xl">{title}</h3>
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

function Pill({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'soon' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-rounded text-xs font-medium ${
        tone === 'soon' ? 'bg-highlight/10 text-highlight' : 'bg-tertiary-bg text-parchment-muted'
      }`}
    >
      {tone === 'soon' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-highlight motion-reduce:animate-none" />}
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

/* ── The ticket ──────────────────────────────────────────────────────────── */

/**
 * The talk as an admission ticket: the session on the left, a perforated stub
 * on the right with the day in large type. Tilts a hair off-axis and settles
 * flat on hover.
 */
function Ticket({ talk }: { talk: Talk }) {
  const d = talk.date ? new Date(`${talk.date}T00:00:00`) : null;
  const day = d ? d.getDate() : '—';
  const month = d ? d.toLocaleDateString('en-US', { month: 'short' }) : 'TBA';

  return (
    <div className="group relative mx-auto max-w-5xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:-rotate-1 lg:hover:rotate-0">
      <div className="relative grid overflow-hidden rounded-2xl border border-parchment/12 bg-secondary-bg shadow-[0_24px_60px_-30px_rgba(60,40,20,0.35)] md:grid-cols-[1fr_auto] dark:shadow-none">
        {/* Warm corner glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-highlight/15 blur-3xl" />

        <div className="relative p-6 sm:p-10">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-highlight">{talk.event}</span>
            <span aria-hidden="true">·</span>
            <span>{talk.edition}</span>
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[2rem] font-medium leading-[1.08] text-parchment sm:text-[2.6rem] md:text-[3rem]">
            {talk.title || 'Talk title coming soon'}
          </h2>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-dashed border-parchment/20 pt-6 sm:grid-cols-4">
            {[
              ['Date', talk.date ? formatDate(talk.date) : 'TBA'],
              ['Time', talk.time || 'TBA'],
              ['Stage', talk.stage || 'TBA'],
              ['Format', talk.format || 'Talk'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="mt-1 font-rounded text-base font-medium text-parchment">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Stub */}
        <div className="relative flex items-center justify-between gap-6 border-t-2 border-dashed border-parchment/20 bg-tertiary-bg/60 px-6 py-5 md:flex-col md:justify-center md:border-l-2 md:border-t-0 md:px-10 md:py-10">
          {/* Punched notches where the stub tears off */}
          <span aria-hidden="true" className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-primary-bg md:-left-3 md:-top-3" />
          <span aria-hidden="true" className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-primary-bg md:block" />
          <span aria-hidden="true" className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-primary-bg md:hidden" />

          <div className="text-center">
            <p className="font-display text-6xl leading-none text-highlight md:text-7xl">{day}</p>
            <p className="label mt-2 text-parchment-muted">{month}</p>
          </div>
          <p className="label text-parchment-muted md:mt-6 md:[writing-mode:vertical-rl]">Admit one · Speaker</p>
        </div>
      </div>
    </div>
  );
}

/* ── 01 · The talk ───────────────────────────────────────────────────────── */

function VideoStage({ talk }: { talk: Talk }) {
  if (talk.youtubeId) {
    return (
      <div className="aspect-video overflow-hidden rounded-xl border border-parchment/12 bg-black">
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
    <figure className="relative aspect-video overflow-hidden rounded-xl bg-[#14171c]">
      {/* Stage spotlight */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_0%,rgba(255,196,130,0.28),transparent_70%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      {/* Stage floor line */}
      <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[22%] h-px bg-white/15" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 text-white/80">
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-[#f0a35e]/40 [animation-duration:2.6s] motion-reduce:animate-none" />
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-6 w-6" fill="currentColor">
            <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
          </svg>
        </span>
        <figcaption className="px-6">
          <span className="block font-display text-xl text-white/90 sm:text-2xl">Recording coming soon</span>
          <span className="mt-1 block font-rounded text-sm text-white/55">
            The talk goes up on YouTube after {talk.date ? formatDate(talk.date) : 'the conference'}.
          </span>
        </figcaption>
      </div>

      <span className="label absolute left-4 top-4 text-white/45">{talk.stage || 'Main stage'}</span>
      <span className="label absolute right-4 top-4 flex items-center gap-1.5 text-white/45">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e0561a]" /> Rec
      </span>
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

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-7">
          <VideoStage talk={talk} />
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5">
          <article className="relative rounded-xl border border-parchment/12 bg-secondary-bg p-6 sm:p-8">
            <span aria-hidden="true" className="absolute -top-5 left-6 font-display text-7xl leading-none text-highlight/30">
              &ldquo;
            </span>
            <p className="label">The proposal</p>
            {talk.abstract ? (
              <p className="mt-4 font-body text-lg leading-relaxed text-parchment-muted">{talk.abstract}</p>
            ) : (
              <div className="mt-4 space-y-2" aria-label="Proposal coming soon">
                {[100, 92, 96, 70].map((w) => (
                  <span key={w} className="block h-3 rounded-full bg-tertiary-bg" style={{ width: `${w}%` }} />
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

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-parchment/10 pt-5">
              {talk.sessionUrl && (
                <a href={talk.sessionUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 font-rounded text-sm font-medium text-sand hover:text-highlight">
                  Session page <Arrow />
                </a>
              )}
              <a href={talk.eventUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 font-rounded text-sm font-medium text-sand hover:text-highlight">
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
  const slide = 'absolute inset-0 rounded-lg border border-parchment/12 shadow-[0_18px_40px_-24px_rgba(40,30,20,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:shadow-none';
  return (
    <div aria-hidden="true" className="group relative mx-auto aspect-[16/10] w-full max-w-md">
      {/* Back: a chart slide */}
      <div className={`${slide} -rotate-6 bg-secondary-bg p-5 group-hover:-translate-x-6 group-hover:-rotate-[9deg]`}>
        <div className="flex h-full items-end gap-2 pb-2">
          {[30, 55, 40, 85, 62, 95].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-sand/25" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      {/* Middle: a code slide */}
      <div className={`${slide} rotate-3 bg-[#1b1f26] p-5 group-hover:translate-x-6 group-hover:rotate-[6deg]`}>
        <div className="space-y-2 font-mono text-[0.65rem] leading-none">
          <span className="block w-3/4 text-[#7fc4a8]">useSyncExternalStore(</span>
          <span className="block pl-4 text-[#e9e4d8]/70">subscribe,</span>
          <span className="block pl-4 text-[#e9e4d8]/70">getSnapshot</span>
          <span className="block text-[#7fc4a8]">)</span>
        </div>
      </div>
      {/* Front: the title slide */}
      <div className={`${slide} flex flex-col justify-between bg-primary-bg p-6 group-hover:-translate-y-2`}>
        <span className="label text-highlight">{kicker}</span>
        <span className="font-display text-xl leading-tight text-parchment sm:text-2xl">{title}</span>
        <span className="h-1 w-12 rounded-full bg-highlight" />
      </div>
    </div>
  );
}

function TheSlides({ talk }: { talk: Talk }) {
  return (
    <section className="pt-20 md:pt-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-5">
          <SectionHead n="02" kicker="The slides" title="The deck, in full">
            Every slide from the session, diagrams and benchmarks included.
          </SectionHead>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {talk.slidesUrl ? (
              <a
                href={talk.slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-highlight px-6 py-3 font-rounded text-sm font-medium text-white transition-colors hover:bg-highlight-strong"
              >
                Open the deck <Arrow />
              </a>
            ) : (
              <>
                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-parchment/25 px-6 py-3 font-rounded text-sm font-medium text-parchment-faint">
                  Open the deck
                </span>
                <Pill tone="soon">Uploads after the talk</Pill>
              </>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          {talk.slidesEmbedUrl ? (
            <div className="aspect-[16/10] overflow-hidden rounded-xl border border-parchment/12">
              <iframe src={talk.slidesEmbedUrl} title={`${talk.title} — slides`} loading="lazy" className="h-full w-full" allowFullScreen />
            </div>
          ) : (
            <div className="px-8 py-6 sm:px-14">
              <SlideFan title={talk.title || 'Slides coming soon'} kicker={talk.event} />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 03 · The code ───────────────────────────────────────────────────────── */

function RepoCard({ repo }: { repo: TalkRepo }) {
  const path = repo.href.replace(/^https?:\/\/github\.com\//, '');
  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="flex items-center gap-3">
          <GitHubMark className="h-7 w-7 text-parchment" />
          <span className="font-mono text-base text-parchment">{path || repo.name}</span>
        </span>
        {repo.href && <span className="text-parchment-faint transition-colors group-hover:text-highlight"><Arrow /></span>}
      </div>
      <p className="mt-4 t-card-sub text-parchment-muted">{repo.description}</p>
      <code className="mt-6 block overflow-x-auto rounded-lg bg-tertiary-bg px-4 py-3 font-mono text-[0.8rem] text-parchment-muted">
        <span className="select-none text-highlight">$ </span>git clone {repo.href}.git
      </code>
    </>
  );
  return (
    <a
      href={repo.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full rounded-xl border border-parchment/12 bg-secondary-bg p-6 transition-colors duration-300 hover:border-highlight/50 sm:p-8"
    >
      {inner}
    </a>
  );
}

function DemoCard({ repo }: { repo: TalkRepo }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0561a]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb020]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#7fc4a8]/70" />
        </span>
        <span className="font-mono text-xs text-[#9aa3ad]">{repo.name.toLowerCase()} — live demo</span>
        {!repo.href && <span className="font-rounded text-xs font-medium text-[#f0a35e]">{repo.status || 'Coming soon'}</span>}
      </div>
      <div className="p-5 sm:p-6">
        <p className="font-display text-2xl text-white">{repo.name}</p>
        <p className="mt-1 mb-5 font-rounded text-sm text-[#c8c2b6]">{repo.description}</p>
        <TokenStream />
      </div>
    </>
  );
  const cls = 'block h-full overflow-hidden rounded-xl bg-[#14171c] ring-1 ring-black/5 dark:ring-white/10';
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
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
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
        <Ticket talk={talk} />
      </Reveal>
      <TheTalk talk={talk} />
      <TheSlides talk={talk} />
      <TheCode talk={talk} />
    </section>
  );
}
