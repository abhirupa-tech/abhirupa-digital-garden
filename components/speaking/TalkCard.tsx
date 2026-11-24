import Link from 'next/link';
import { slidesReady, type Talk } from '@/lib/speaking';
import { site } from '@/lib/site';
import { Asterisk, Blob, Half, Quarter } from './Shapes';

/** Each card takes the next pastel pair, so a long list stays varied. */
const PALETTES = [
  { card: 'bg-pastel-cream', date: 'bg-pastel-peach', shape: 'text-pastel-beige' },
  { card: 'bg-pastel-beige', date: 'bg-pastel-rose', shape: 'text-pastel-cream' },
  { card: 'bg-pastel-coral', date: 'bg-pastel-sand', shape: 'text-pastel-peach' },
  { card: 'bg-pastel-sand', date: 'bg-pastel-cream', shape: 'text-pastel-rose' },
];

function Status({ ready, children }: { ready: boolean; children: string }) {
  return (
    <li
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-rounded text-xs font-medium text-pastel-ink ${
        ready ? 'bg-primary-bg/80' : 'border border-dashed border-pastel-ink/25 text-pastel-ink/60'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ready ? 'bg-[#d9774f]' : 'bg-pastel-ink/25'}`} />
      {children}
    </li>
  );
}

/**
 * A talk on the Speaking index: a date block, the event and title, and which
 * materials are up yet. The whole card links to the talk's own page.
 */
export function TalkCard({ talk, index }: { talk: Talk; index: number }) {
  const p = PALETTES[index % PALETTES.length];
  const d = talk.date ? new Date(`${talk.date}T00:00:00`) : null;

  return (
    <Link
      href={`/speaking/${talk.id}/`}
      className={`group relative grid h-full overflow-hidden rounded-[1.75rem] ${p.card} p-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 sm:grid-cols-[9rem_1fr]`}
    >
      <Blob className={`pointer-events-none absolute -bottom-12 -right-6 h-44 w-36 ${p.shape} transition-transform duration-700 group-hover:rotate-12 dark:text-[#f0e4da]/20`} />

      {/* Date block */}
      <div className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-[1.25rem] ${p.date} p-5 sm:flex-col sm:items-start sm:justify-between`}>
        <Quarter corner="tl" className="pointer-events-none absolute -bottom-4 -right-4 w-16 bg-primary-bg/40 dark:bg-[#f0e4da]/20" />
        <span className="relative font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">
          {d ? d.getFullYear() : 'Date TBA'}
        </span>
        <span className="relative text-right sm:text-left">
          <span className="block font-display text-5xl leading-none text-pastel-ink">{d ? d.getDate() : '—'}</span>
          <span className="mt-1 block font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/80">
            {d ? d.toLocaleDateString('en-US', { month: 'short' }) : ''}
          </span>
        </span>
      </div>

      {/* Talk */}
      <div className="relative flex flex-col p-5 sm:p-7">
        <p className="font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-pastel-ink/70">
          {talk.event} · {talk.edition}
        </p>
        <h3 className="mt-3 max-w-xl font-display text-2xl font-medium leading-snug text-pastel-ink sm:text-[1.75rem]">
          {talk.title || 'Talk title coming soon'}
        </h3>
        {(talk.stage || talk.time) && (
          <p className="mt-2 font-rounded text-sm text-pastel-ink/70">
            {[talk.stage, talk.time].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2" aria-label="Materials">
            <Status ready={!!talk.youtubeId}>Recording</Status>
            <Status ready={slidesReady(talk)}>Slides</Status>
            <Status ready={talk.repos.some((r) => r.href)}>Code</Status>
          </ul>
          <span className="inline-flex items-center gap-1.5 font-rounded text-sm font-semibold text-pastel-ink">
            View talk
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** The always-last tile: an open invitation for the next stage. */
export function InviteCard() {
  return (
    <a
      href={`mailto:${site.email}?subject=Speaking%20invitation`}
      className="group relative flex h-full min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-pastel-rose p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
    >
      <Half className="pointer-events-none absolute -bottom-1 right-6 w-32 bg-pastel-peach/80 dark:bg-[#f0e4da]/20" />
      <Asterisk className="h-12 w-12 text-pastel-cream transition-transform duration-700 group-hover:rotate-90 dark:text-[#f0e4da]/70" />
      <div className="relative">
        <p className="font-display text-2xl text-pastel-ink">Your stage next?</p>
        <p className="mt-2 max-w-xs font-rounded text-sm leading-relaxed text-pastel-ink/75">
          I speak on agentic interfaces, frontend performance and designing for AI.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-rounded text-sm font-semibold text-pastel-ink underline decoration-pastel-ink/30 underline-offset-4 group-hover:decoration-pastel-ink">
          Invite me to speak
        </span>
      </div>
    </a>
  );
}
