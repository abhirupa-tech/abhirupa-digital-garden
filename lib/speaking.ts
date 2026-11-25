/**
 * Talks, one entry per appearance. The Speaking page renders each as its own
 * section: the talk (recording + proposal), the slide deck, and the code.
 *
 * Every media field is optional. Leave it empty and the page shows a styled
 * "coming soon" placeholder in its place; fill it in and the real thing
 * renders — no component changes needed.
 */

export type TalkRepo = {
  name: string;
  href: string;
  description: string;
  /** Short status chip, e.g. "Live" or "Coming soon". */
  status?: string;
  /** 'demo' for a hosted, runnable demo; omitted for a source repository. */
  kind?: 'demo';
};

export type Talk = {
  /** URL slug: the talk lives at /speaking/<id>/ */
  id: string;
  event: string;
  edition: string;
  /** Talk title. Empty while it's still being finalised. */
  title: string;
  /** Abstract / proposal; separate paragraphs with a blank line. Empty shows a placeholder. */
  abstract: string;
  /** ISO date of the session, or empty if not announced. */
  date: string;
  /** Session time slot as printed on the agenda, e.g. "10:00 – 10:30". */
  time: string;
  /** Stage or room. */
  stage: string;
  /** Session format, e.g. "Talk" or "Keynote". */
  format: string;
  /** Topic chips from the conference agenda. */
  topics: string[];
  /** The speaker page on the conference site. */
  eventUrl: string;
  /** The session's own page on the agenda. */
  sessionUrl: string;
  /** YouTube video id (the part after `v=`), once the recording is up. */
  youtubeId: string;
  /** Public link to the slide deck (PDF, Google Slides, Speaker Deck…). */
  slidesUrl: string;
  /**
   * Slide images for the on-page deck viewer: `count` files named 01.webp,
   * 02.webp… under `dir`. Omit to show only a link to `slidesUrl`.
   */
  slideImages?: { dir: string; count: number };
  /** ISO instant before which the deck stays locked (view + download), e.g. the talk's start. */
  slidesAvailableAt?: string;
  repos: TalkRepo[];
};

export const talks: Talk[] = [
  {
    id: 'wearedevelopers-2026',
    event: 'WeAreDevelopers',
    edition: 'Conference India 2026',
    title: 'React Under Fire: Rendering Performance for Streaming Agent UIs',
    abstract: [
      'A single streamed agent response can trigger dozens of React state updates a second. This talk takes apart the rendering and state problems unique to agentic UIs, drawing on production work and a public benchmark of rendering strategies under agent event streams.',
      'State architecture: why partial and final text are different shapes, and why classic Redux patterns buckle under token streams.',
      'Implementation tradeoffs: a streaming library versus a custom buffering layer, and where useSyncExternalStore fits, live-coded with real measurements.',
      'Standards: what the AG-UI protocol pins down for agent-to-UI communication, and what it leaves to you.',
    ].join('\n\n'),
    date: '2026-11-26',
    time: '10:00 – 10:30',
    stage: 'Stage 4',
    format: 'Talk',
    topics: ['Agentic AI', 'React', 'Web Performance', 'AI Standards', 'UI/UX'],
    eventUrl: 'https://www.wearedevelopers.com/conference-india/speakers/abhirupa-mitra',
    sessionUrl:
      'https://www.wearedevelopers.com/conference-india/agenda/sessions/react-under-fire-rendering-performance-for-streaming-agent-uis-1288492',
    youtubeId: '',
    slidesUrl: '/speaking/wearedevelopers-2026/React-Under-Fire.pdf',
    slideImages: { dir: '/speaking/wearedevelopers-2026/slides', count: 33 },
    repos: [
      {
        name: 'we-are-developers',
        href: 'https://github.com/abhirupa-tech/we-are-developers',
        description: 'Everything from the talk: the code samples, demos and notes.',
        status: 'Repo',
      },
      {
        name: 'MockGPT',
        href: 'https://abhirupa-tech.github.io/we-are-developers/',
        kind: 'demo',
        description: 'Replay a recorded LLM stream through three React state strategies, with a live render profiler.',
        status: 'Live demo',
      },
    ],
  },
];

/** True once the deck exists and its release time (if any) has passed. */
export function slidesReady(talk: Talk, now = Date.now()): boolean {
  if (!talk.slidesUrl) return false;
  return !talk.slidesAvailableAt || now >= Date.parse(talk.slidesAvailableAt);
}

export function getTalk(id: string): Talk | undefined {
  return talks.find((t) => t.id === id);
}

/** Upcoming talks soonest-first, then past talks newest-first. Undated talks count as upcoming. */
export function splitTalks(today = new Date().toISOString().slice(0, 10)) {
  const upcoming = talks
    .filter((t) => !t.date || t.date >= today)
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
  const past = talks.filter((t) => t.date && t.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
