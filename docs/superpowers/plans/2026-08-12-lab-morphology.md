# Lab section + Morphology Bento Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a homepage **Lab** section (bento of preview tiles) plus a `/lab/` hub and a static `/lab/morphology-in-AI-components/` bento page showcasing five hand-crafted agent-state components, all in the site's editorial aesthetic, and fully wired into nav, SEO, and the sitemap.

**Architecture:** A typed registry (`lib/lab.ts`) is the single source of truth for lab projects, consumed by a homepage section, a `/lab/` hub, and the sitemap. A new `lab` zone reuses the existing `SectionHeader`/scroll-spy framing. The morphology page composes five presentational, static state components (each its own file, so they can be animated later) into an asymmetric bento closed by a thesis. No new runtime deps; no tests framework introduced (this repo has none).

**Tech Stack:** Next.js 16 (app router, `output: 'export'`, `trailingSlash: true`), React 19, Tailwind v4 (semantic tokens in `app/globals.css`), framer-motion (`Reveal`).

**Verification model:** This repo has no unit-test framework and the deliverables are static/presentational, so each task is verified with `npm run lint`, `npm run build` (static export must succeed), and a browser-preview visual check on `npm run dev` (port 4000) — the same loop used across this site. Commit after each task.

---

## File Structure

**Create:**
- `lib/lab.ts` — lab project registry (data only)
- `components/lab/LabPreviewTile.tsx` — one project preview (video/poster/gradient + caption)
- `components/sections/LabBento.tsx` — homepage Lab row (header + tiles + view-all)
- `app/lab/page.tsx` — Lab hub page + metadata
- `app/lab/morphology-in-AI-components/page.tsx` — morphology bento page + metadata + thesis
- `components/lab/morphology/MorphologyBento.tsx` — asymmetric grid composition
- `components/lab/morphology/StreamingRender.tsx` — partial text-to-speech state
- `components/lab/morphology/ChatComposer.tsx` — AI chat composer
- `components/lab/morphology/LoadingButton.tsx` — button frozen mid-load
- `components/lab/morphology/AgentThinking.tsx` — reasoning/thinking state
- `components/lab/morphology/AgentHandoff.tsx` — agent-to-agent reconnecting state
- `components/lab/morphology/TileFrame.tsx` — shared bento tile chrome (label + hairline card)

**Modify:**
- `lib/data.ts` — add `lab` zone + `sitemapLinks` "Lab" entry
- `app/page.tsx` — render `LabBento` as Row C
- `components/SideNav.tsx` — add `flask` icon + `lab` nav item
- `app/sitemap.ts` — add `/lab/` and each lab project URL

---

## Task 1: Lab data registry + zone + footer link

**Files:**
- Create: `lib/lab.ts`
- Modify: `lib/data.ts` (add `lab` zone to `zones`; add Lab link to `sitemapLinks`)

- [ ] **Step 1: Create `lib/lab.ts`**

```ts
/**
 * Registry of Lab projects — live, interactive experiments in agentic-interface
 * design. Single source of truth for the homepage Lab section, the /lab hub, and
 * the sitemap. Preview assets are optional: a tile shows a looping `video` when
 * present, else a `poster` image, else a warm gradient fallback.
 */
export type LabStatus = 'live' | 'wip';

export type LabProject = {
  slug: string;
  title: string;
  /** The minimalist one-line caption shown on the preview tile. */
  caption: string;
  tags: string[];
  status: LabStatus;
  /** Canonical, trailing-slash route to the project page. */
  href: string;
  /** Optional Cloudinary public id or /public path for a still preview. */
  poster?: string;
  /** Optional /public path to a looping preview video (autoplay, muted). */
  video?: string;
};

export const labProjects: LabProject[] = [
  {
    slug: 'morphology-in-AI-components',
    title: 'Morphology in AI components',
    caption: 'Interface states that show what an agent is actually doing.',
    tags: ['Agentic UI', 'Interaction design', 'Prototype'],
    status: 'live',
    href: '/lab/morphology-in-AI-components/',
    // No video yet — falls back to the gradient preview.
  },
];

export const labProjectBySlug = Object.fromEntries(
  labProjects.map((p) => [p.slug, p]),
) as Record<string, LabProject>;
```

- [ ] **Step 2: Add the `lab` zone in `lib/data.ts`**

In the `zones` array (in `lib/data.ts`), add this entry after the `knowledge-library` object:

```ts
  {
    id: 'lab',
    index: '05',
    kicker: 'Lab',
    title: 'Live experiments in agentic interface morphology',
    blurb:
      'Working prototypes for agentic AI — interfaces that reveal an agent’s state, confidence, and thinking, beyond loaders and progress bars.',
  },
```

- [ ] **Step 3: Add the Lab link to `sitemapLinks` in `lib/data.ts`**

In `lib/data.ts`, inside `sitemapLinks`, in the `'The Garden'` group's `links` array, add after the `Design Thinking` link:

```ts
      { label: 'Lab', href: '/lab/' },
```

- [ ] **Step 4: Verify types + lint**

Run:
```bash
npm run lint
```
Expected: no errors referencing `lib/lab.ts` or `lib/data.ts`.

Note: `lab` is intentionally NOT added to `visibleZones` gating (that filter only excludes `knowledge-library`), so `lab` will now be included in `visibleZones`. This is fine for the SideNav/section, but `app/sitemap.ts` derives section-hub URLs from `visibleZones` filtered by `getSectionEntries(zone.id).length > 0`. `getSectionEntries('lab')` returns `[]` (no `/content/lab` folder), so no bogus `/lab/` hub is emitted there — we add `/lab/` explicitly in Task 9. No action needed here; just be aware.

- [ ] **Step 5: Commit**

```bash
git add lib/lab.ts lib/data.ts
git commit -m "feat(lab): add lab project registry, lab zone, footer link

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 2: `LabPreviewTile` component

**Files:**
- Create: `components/lab/LabPreviewTile.tsx`

- [ ] **Step 1: Create the tile**

```tsx
import type { LabProject } from '@/lib/lab';
import { cloudinaryUrl } from '@/lib/cloudinary';

/**
 * One Lab project preview: a looping muted video when the project has one, else
 * a poster image, else a warm sand->rust gradient (matching the FieldNotesCards
 * fallback). Minimalist caption + tags below, hairline frame, rust-warm hover.
 * The whole tile links to the project page.
 *
 * `feature` gives the tile a taller media area for hero placement in a bento.
 */
export function LabPreviewTile({
  project,
  feature = false,
}: {
  project: LabProject;
  feature?: boolean;
}) {
  const mediaAspect = feature ? 'aspect-[16/10]' : 'aspect-[4/3]';

  return (
    <a
      href={project.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.12] bg-secondary-bg/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/60 hover:bg-white/70 hover:shadow-sm dark:border-white/[0.08] dark:hover:border-highlight/60 dark:hover:bg-white/[0.06]"
    >
      <div className={`relative w-full overflow-hidden ${mediaAspect}`}>
        {project.video ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            src={project.video}
            poster={project.poster ? cloudinaryUrl(project.poster, { width: 1000 }) : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : project.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cloudinaryUrl(project.poster, { width: 1000 })}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-sand-deep via-sand to-rust">
            <span className="flex h-full w-full items-center justify-center font-display text-2xl text-white/85">
              {project.title}
            </span>
          </div>
        )}
        {project.status === 'wip' && (
          <span className="label absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-white/90">
            In progress
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <h3 className="font-display text-xl font-medium text-parchment transition-colors duration-300 group-hover:text-highlight md:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 font-rounded text-sm leading-relaxed text-parchment/80">
          {project.caption}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="label rounded-full border border-hairline px-2 py-0.5 text-parchment-faint"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: Lint**

Run:
```bash
npm run lint
```
Expected: no errors in `components/lab/LabPreviewTile.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/lab/LabPreviewTile.tsx
git commit -m "feat(lab): add LabPreviewTile (video/poster/gradient preview)

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 3: `LabBento` homepage section + Row C wiring

**Files:**
- Create: `components/sections/LabBento.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/sections/LabBento.tsx`**

```tsx
import type { Zone } from '@/lib/data';
import type { LabProject } from '@/lib/lab';
import { Reveal } from '../motion/Reveal';
import { SectionHeader } from './SectionHeader';
import { ViewAllLink } from './ViewAllLink';
import { LabPreviewTile } from '../lab/LabPreviewTile';

/**
 * Homepage Lab row: the editorial section header, then a bento of project
 * preview tiles. The first project is featured (wider, taller media); the rest
 * fill a compact grid beside it. Reads projects from the lab registry.
 */
export function LabBento({ zone, projects }: { zone: Zone; projects: LabProject[] }) {
  const [lead, ...rest] = projects;
  if (!lead) return null;

  return (
    <div>
      <SectionHeader zone={zone} from="up" />

      <div className="mt-9 grid gap-5 md:grid-cols-12">
        <Reveal className="md:col-span-7" delay={0.04}>
          <LabPreviewTile project={lead} feature />
        </Reveal>

        <div className="grid gap-5 md:col-span-5">
          {rest.slice(0, 2).map((project, i) => (
            <Reveal key={project.slug} delay={0.08 * (i + 1)}>
              <LabPreviewTile project={project} />
            </Reveal>
          ))}
          {rest.length === 0 && (
            <Reveal delay={0.08} className="flex">
              <div className="flex flex-1 items-center rounded-2xl border border-dashed border-hairline px-6 py-8">
                <p className="font-rounded text-sm leading-relaxed text-parchment-faint">
                  More experiments are in the workshop. New agentic-interface
                  prototypes land here as they come to life.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <Reveal delay={0.16} className="mt-6">
        <ViewAllLink href="/lab/" label="Enter the lab" count={projects.length} />
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 2: Wire Row C into `app/page.tsx`**

Add the import near the other section imports:

```tsx
import { LabBento } from '@/components/sections/LabBento';
import { labProjects } from '@/lib/lab';
```

Then, inside `<main>`, after the Design Thinking `</section>` (the Row B block) and before `</main>`, insert:

```tsx
        <div className="zone flex justify-center py-1">
          <Sketch name="wave-line" className="h-10 w-36 opacity-40" />
        </div>

        {/* Row C — Lab: a full-width bento of live agentic-interface experiments */}
        <section id="lab" className="zone scroll-mt-24 pb-8 md:pb-16">
          <LabBento zone={zoneById['lab']} projects={labProjects} />
        </section>
```

(`zoneById` and `Sketch` are already imported in `app/page.tsx`.)

- [ ] **Step 3: Build + visual check**

Run:
```bash
npm run build
```
Expected: build + static export succeed, no type errors.

Then start dev and view the homepage Lab section:
```bash
npm run dev
```
Open `http://localhost:4000/#lab` in the browser preview. Expected: a "Lab" section header (05 / Lab / title / blurb), a featured gradient tile reading "Morphology in AI components", a dashed "more experiments" placeholder beside it, and an "Enter the lab →" link. Confirm in both light and dark.

- [ ] **Step 4: Commit**

```bash
git add components/sections/LabBento.tsx app/page.tsx
git commit -m "feat(lab): homepage Lab section (Row C) with preview bento

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 4: SideNav — flask icon + `lab` nav item

**Files:**
- Modify: `components/SideNav.tsx`

- [ ] **Step 1: Add a `flask` icon to the `icons` object**

In `components/SideNav.tsx`, inside the `icons` object, add after the `book` entry:

```tsx
  flask: (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path {...S} d="M10 3h4" />
      <path {...S} d="M10 3v6l-4.5 8a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" />
      <path {...S} d="M7.5 15h9" />
    </svg>
  ),
```

- [ ] **Step 2: Add the `lab` item to `iconItems`**

In the `iconItems` array in `components/SideNav.tsx`, add after the `design-thinking` item (and before the `knowledge-library` conditional / `stay-updated`):

```tsx
  { id: 'lab', label: 'Lab', icon: 'flask' },
```

- [ ] **Step 3: Build + visual check**

Run:
```bash
npm run build
```
Expected: success.

With `npm run dev` running, open `http://localhost:4000/`. Expected: the left nav shows a beaker icon; scrolling to the Lab section highlights it (scroll-spy). Its tooltip reads "Lab". Check the mobile hamburger panel too (resize to mobile).

- [ ] **Step 4: Commit**

```bash
git add components/SideNav.tsx
git commit -m "feat(lab): add Lab beaker icon + scroll-spy nav item

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 5: `/lab/` hub page

**Files:**
- Create: `app/lab/page.tsx`

- [ ] **Step 1: Create the hub page**

```tsx
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { labProjects } from '@/lib/lab';
import { LabPreviewTile } from '@/components/lab/LabPreviewTile';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';

const LAB_DESCRIPTION =
  'The Lab — live, interactive experiments in agentic AI interface design by Abhirupa Mitra. Prototypes exploring how an interface can reveal an agent’s state, confidence, and thinking, beyond loaders and progress bars.';

export const metadata: Metadata = {
  title: 'Lab — Agentic Interface Experiments',
  description: LAB_DESCRIPTION,
  keywords: [
    'agentic UI',
    'agentic AI interfaces',
    'agent state UI',
    'interface morphology',
    'human-AI interaction',
    'frontend for AI',
    'AI interaction design',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  alternates: { canonical: '/lab/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    url: `${site.url}/lab/`,
    title: `Lab — Agentic Interface Experiments · ${site.name}`,
    description: LAB_DESCRIPTION,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `The Lab · ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Lab — Agentic Interface Experiments · ${site.name}`,
    description: LAB_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function LabHub() {
  return (
    <div className="lg:pl-20">
      <main className="zone scroll-mt-24 py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-lg text-sand/90">05</span>
            <span className="label text-parchment-muted">Lab</span>
          </div>
          <h1 className="mt-4 font-display text-section font-medium text-parchment">
            Live experiments in agentic interface morphology
          </h1>
          <p className="mt-4 font-rounded text-lg font-light leading-relaxed text-parchment-muted">
            Working prototypes for agentic AI — interfaces that reveal an agent&rsquo;s
            state, confidence, and thinking, beyond loaders and progress bars.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {labProjects.map((project, i) => (
            <Reveal key={project.slug} delay={0.06 * i}>
              <LabPreviewTile project={project} feature />
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Build + visual check**

Run:
```bash
npm run build
```
Expected: success; `out/lab/index.html` is emitted.

With `npm run dev`, open `http://localhost:4000/lab/`. Expected: hub header + one morphology tile linking to the project. Check light/dark + mobile.

- [ ] **Step 3: Commit**

```bash
git add app/lab/page.tsx
git commit -m "feat(lab): /lab hub page listing experiments + SEO metadata

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 6: Morphology state components (five tiles + shared frame)

**Files:**
- Create: `components/lab/morphology/TileFrame.tsx`
- Create: `components/lab/morphology/StreamingRender.tsx`
- Create: `components/lab/morphology/ChatComposer.tsx`
- Create: `components/lab/morphology/LoadingButton.tsx`
- Create: `components/lab/morphology/AgentThinking.tsx`
- Create: `components/lab/morphology/AgentHandoff.tsx`

All are presentational and static (no `'use client'`, no state). They rely only on semantic tokens.

- [ ] **Step 1: Create `TileFrame.tsx` (shared bento tile chrome)**

```tsx
import type { ReactNode } from 'react';

/**
 * Shared chrome for a morphology bento tile: a hairline card carrying a small
 * eyebrow label + one-line descriptor at the top, and the component demo below.
 * `className` lets the composition set grid spans. Purely presentational.
 */
export function TileFrame({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-black/[0.12] bg-secondary-bg/40 p-5 dark:border-white/[0.08] md:p-6 ${className}`}
    >
      <div className="mb-4">
        <span className="label text-parchment-faint">{label}</span>
        <p className="mt-1 font-rounded text-sm leading-snug text-parchment-muted">{hint}</p>
      </div>
      <div className="flex flex-1 items-center">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create `StreamingRender.tsx` (partial text-to-speech)**

```tsx
import { TileFrame } from './TileFrame';

/**
 * Partial text-to-speech render. A speech waveform sits above a transcript in
 * which committed words are solid and the trailing, still-being-spoken words
 * fade to faint — the visible difference between committed and partial output.
 * Static bar heights (deterministic, no randomness) keep the export stable.
 */
const BARS = [
  8, 14, 22, 30, 24, 16, 10, 18, 28, 34, 26, 20, 12, 22, 32, 38, 30, 24, 16, 10,
  14, 24, 30, 22, 14, 9, 16, 26, 20, 12,
];

export function StreamingRender() {
  // The first N bars are "spoken" (committed); the rest are ahead of the cursor.
  const spoken = 19;
  return (
    <TileFrame
      label="Streaming render · TTS"
      hint="Committed speech is solid; the trailing edge is still forming."
      className="min-h-[15rem]"
    >
      <div className="w-full">
        <div className="flex h-16 items-end gap-[3px]" aria-hidden="true">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`w-1.5 flex-1 rounded-full ${i < spoken ? 'bg-highlight' : 'bg-hairline'}`}
              style={{ height: `${h + 6}px` }}
            />
          ))}
        </div>
        <p className="mt-5 font-rounded text-base leading-relaxed">
          <span className="text-parchment">Here is the summary you asked for, drawn from the three most recent</span>{' '}
          <span className="text-parchment/45">reports before I move on to the open questions&hellip;</span>
        </p>
      </div>
    </TileFrame>
  );
}
```

- [ ] **Step 3: Create `ChatComposer.tsx`**

```tsx
import { TileFrame } from './TileFrame';

/**
 * AI chat composer at rest: a text field with an attach affordance, a model
 * pill, and a send button. Presentational only.
 */
export function ChatComposer() {
  return (
    <TileFrame
      label="Composer"
      hint="Where the human hands intent to the agent."
      className="min-h-[15rem]"
    >
      <div className="w-full rounded-2xl border border-hairline bg-primary-bg/70 p-3 shadow-sm">
        <p className="min-h-[3.5rem] font-rounded text-base leading-relaxed text-parchment/70">
          Summarize this thread and draft a reply<span className="ml-0.5 inline-block h-5 w-px translate-y-1 bg-highlight align-middle" />
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Attach"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-parchment-muted"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9 17.3" />
              </svg>
            </button>
            <span className="label rounded-full border border-hairline px-2.5 py-1 text-parchment-muted">
              Claude Opus
            </span>
          </div>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full bg-highlight px-4 font-rounded text-sm font-medium text-white"
          >
            Send
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </TileFrame>
  );
}
```

- [ ] **Step 4: Create `LoadingButton.tsx`**

```tsx
import { TileFrame } from './TileFrame';

/**
 * A button frozen mid-load — the legacy paradigm the page critiques: a single
 * spinner that says "working" but nothing about state, confidence, or progress.
 * The spin is paused (static) so the export renders a stable frame.
 */
export function LoadingButton() {
  return (
    <TileFrame
      label="Loading button"
      hint="The legacy signal: busy, but silent about state."
    >
      <div className="flex w-full flex-col items-center gap-4">
        <button
          type="button"
          disabled
          className="flex h-11 items-center gap-2.5 rounded-full bg-sand px-6 font-rounded text-sm font-medium text-white opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 [animation-play-state:paused] motion-safe:animate-spin" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
          Generating&hellip;
        </button>
        <p className="label text-parchment-faint">answer / no answer</p>
      </div>
    </TileFrame>
  );
}
```

- [ ] **Step 5: Create `AgentThinking.tsx`**

```tsx
import { TileFrame } from './TileFrame';

/**
 * Agent "thinking" state — a reasoning trace with a shimmer line, showing the
 * agent is mid-thought rather than merely "busy". Static frame.
 */
export function AgentThinking() {
  return (
    <TileFrame
      label="Thinking"
      hint="Reasoning in the open, not a black box."
      className="min-h-[15rem]"
    >
      <div className="w-full">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-highlight/90" />
            <span className="h-2 w-2 rounded-full bg-highlight/60" />
            <span className="h-2 w-2 rounded-full bg-highlight/30" />
          </span>
          <span className="font-rounded text-sm font-medium text-parchment">Thinking</span>
        </div>
        <div className="mt-4 space-y-2.5">
          <p className="font-rounded text-sm leading-relaxed text-parchment/80">
            Checking the three linked reports for conflicting dates&hellip;
          </p>
          <div className="h-3 w-4/5 rounded-full bg-linear-to-r from-hairline via-sand/40 to-hairline" />
          <div className="h-3 w-3/5 rounded-full bg-hairline" />
        </div>
      </div>
    </TileFrame>
  );
}
```

- [ ] **Step 6: Create `AgentHandoff.tsx`**

```tsx
import { TileFrame } from './TileFrame';

/**
 * Agent-to-agent handoff that has stalled: the connection between two agents
 * dropped, and the interface is waiting for it to come back. Two agent nodes
 * with a broken link between them and a "reconnecting" status. Static frame.
 */
export function AgentHandoff() {
  return (
    <TileFrame
      label="Agent handoff"
      hint="The link between two agents dropped — waiting to reconnect."
      className="min-h-[15rem]"
    >
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <AgentNode name="Planner" state="done" />
          <div className="flex flex-1 items-center" aria-hidden="true">
            <span className="h-px flex-1 bg-hairline" />
            <span className="mx-1 border-t border-dashed border-highlight/70 px-2 text-highlight">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <span className="h-px flex-1 bg-hairline" />
          </div>
          <AgentNode name="Executor" state="waiting" />
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-highlight/30 bg-highlight/[0.06] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-highlight motion-safe:animate-pulse" aria-hidden="true" />
          <p className="font-rounded text-sm text-parchment-muted">
            Connection lost — reconnecting to Executor&hellip;
          </p>
        </div>
      </div>
    </TileFrame>
  );
}

function AgentNode({ name, state }: { name: string; state: 'done' | 'waiting' }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm ${
          state === 'done'
            ? 'border-sand/50 bg-sand/10 text-sand'
            : 'border-highlight/50 bg-highlight/10 text-highlight'
        }`}
      >
        {name[0]}
      </span>
      <span className="label text-parchment-faint">{name}</span>
    </div>
  );
}
```

- [ ] **Step 7: Lint**

Run:
```bash
npm run lint
```
Expected: no errors in `components/lab/morphology/*`.

- [ ] **Step 8: Commit**

```bash
git add components/lab/morphology/TileFrame.tsx components/lab/morphology/StreamingRender.tsx components/lab/morphology/ChatComposer.tsx components/lab/morphology/LoadingButton.tsx components/lab/morphology/AgentThinking.tsx components/lab/morphology/AgentHandoff.tsx
git commit -m "feat(lab): five static morphology state components + tile frame

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 7: `MorphologyBento` composition

**Files:**
- Create: `components/lab/morphology/MorphologyBento.tsx`

- [ ] **Step 1: Create the bento grid**

```tsx
import { Reveal } from '../../motion/Reveal';
import { StreamingRender } from './StreamingRender';
import { ChatComposer } from './ChatComposer';
import { LoadingButton } from './LoadingButton';
import { AgentThinking } from './AgentThinking';
import { AgentHandoff } from './AgentHandoff';

/**
 * Asymmetric bento of the five agent-state components. A 6-column grid on md+
 * gives an intentionally uneven rhythm: a wide streaming tile leads, the
 * composer and thinking states balance the second row, and the loading button
 * (narrow) sits beside the wider handoff tile. Single column on mobile.
 */
export function MorphologyBento() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
      <Reveal className="md:col-span-4" delay={0.04}>
        <StreamingRender />
      </Reveal>
      <Reveal className="md:col-span-2" delay={0.08}>
        <AgentThinking />
      </Reveal>
      <Reveal className="md:col-span-3" delay={0.12}>
        <ChatComposer />
      </Reveal>
      <Reveal className="md:col-span-3" delay={0.16}>
        <AgentHandoff />
      </Reveal>
      <Reveal className="md:col-span-6" delay={0.2}>
        <LoadingButton />
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 2: Lint**

Run:
```bash
npm run lint
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/lab/morphology/MorphologyBento.tsx
git commit -m "feat(lab): compose morphology components into asymmetric bento

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 8: Morphology page (header + bento + thesis + metadata)

**Files:**
- Create: `app/lab/morphology-in-AI-components/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { labProjectBySlug } from '@/lib/lab';
import { MorphologyBento } from '@/components/lab/morphology/MorphologyBento';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';

const project = labProjectBySlug['morphology-in-AI-components'];

const MORPHOLOGY_DESCRIPTION =
  'Morphology in AI components — a design study by Abhirupa Mitra on interface states for agentic AI. Beyond loaders and progress bars: showing an agent’s confidence, thinking, and whether text is partial or committed.';

export const metadata: Metadata = {
  title: 'Morphology in AI Components — Agent State Interfaces',
  description: MORPHOLOGY_DESCRIPTION,
  keywords: [
    'morphology in AI components',
    'agent state UI',
    'agentic UI',
    'agentic AI interfaces',
    'LLM confidence UI',
    'streaming text UI',
    'agent thinking state',
    'agent handoff',
    'beyond loaders and progress bars',
    'human-AI interaction',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  alternates: { canonical: `${project.href}` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'article',
    url: `${site.url}${project.href}`,
    title: `Morphology in AI Components · ${site.name}`,
    description: MORPHOLOGY_DESCRIPTION,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Morphology in AI Components · ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Morphology in AI Components · ${site.name}`,
    description: MORPHOLOGY_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

/** CreativeWork structured data so the experiment can surface as its own result. */
function MorphologyJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Morphology in AI Components',
    headline: 'Morphology in AI Components — Agent State Interfaces',
    description: MORPHOLOGY_DESCRIPTION,
    url: `${site.url}${project.href}`,
    author: { '@type': 'Person', name: site.name, url: site.url },
    keywords: (metadata.keywords as string[]).join(', '),
    isPartOf: { '@type': 'WebSite', url: site.url, name: site.name },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function MorphologyPage() {
  return (
    <div className="lg:pl-20">
      <MorphologyJsonLd />
      <main className="zone scroll-mt-24 py-16 md:py-24">
        {/* Header */}
        <Reveal className="max-w-3xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-lg text-sand/90">Lab</span>
            <span className="label text-parchment-muted">Experiment 01</span>
          </div>
          <h1 className="mt-4 font-display text-hero font-medium leading-[1.05] text-parchment">
            Morphology in AI components
          </h1>
          <p className="mt-6 font-rounded text-xl font-light leading-relaxed text-parchment-muted">
            An agent moves through many states as it works — thinking, streaming,
            handing off, waiting. This is a study of interface <em>morphology</em>:
            components that change shape to show what the agent is actually doing,
            not just whether it is busy.
          </p>
        </Reveal>

        {/* Bento */}
        <div className="mt-14 md:mt-16">
          <MorphologyBento />
        </div>

        {/* Thesis */}
        <Reveal className="mx-auto mt-16 max-w-2xl md:mt-24">
          <div className="accent-rule mx-auto mb-8" />
          <div className="space-y-5 font-body text-lg leading-relaxed text-parchment/90">
            <p>
              An agent can pass through many states during a single stretch of
              processing — any of the states above, often several at once. Our
              current design language struggles to say which.
            </p>
            <p>
              Legacy paradigms — the loader, the progress bar — encode a{' '}
              <strong className="font-medium text-parchment">discrete</strong>{' '}
              outcome: the answer is here, or it is not. What they cannot show is
              the model&rsquo;s confidence, what state it is in, whether it is still
              thinking, or whether the text on screen is partial or committed.
            </p>
            <p>
              This experiment treats morphology — components that change shape with
              the agent&rsquo;s state — as a way out of that binary, toward interfaces
              that let a person read an agent the way they read another person mid-thought.
            </p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Build + visual check**

Run:
```bash
npm run build
```
Expected: success; `out/lab/morphology-in-AI-components/index.html` emitted.

With `npm run dev`, open `http://localhost:4000/lab/morphology-in-AI-components/`. Expected: hero header, the five-tile asymmetric bento (streaming waveform with committed/partial transcript, thinking dots, composer, handoff "reconnecting", loading button), then the thesis prose. Verify:
- Light + dark mode (toggle) both read well.
- Mobile width: tiles stack to one column, nothing overflows.
- No console errors (`read_console_messages`).

- [ ] **Step 3: Commit**

```bash
git add app/lab/morphology-in-AI-components/page.tsx
git commit -m "feat(lab): morphology bento page — header, bento, thesis, SEO + JSON-LD

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 9: Sitemap entries for `/lab/` and each project

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Import the lab registry**

At the top of `app/sitemap.ts`, add:

```ts
import { labProjects } from '@/lib/lab';
```

- [ ] **Step 2: Build the lab entries**

Inside the `sitemap()` function, after the `about` const, add:

```ts
  const lab: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/lab/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...labProjects.map((p) => ({
      url: `${site.url}${p.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
```

- [ ] **Step 3: Include them in the returned array**

Change the final `return` line from:

```ts
  return [home, about, ...sections, ...collections, ...articles];
```

to:

```ts
  return [home, about, ...lab, ...sections, ...collections, ...articles];
```

- [ ] **Step 4: Build + verify sitemap**

Run:
```bash
npm run build
```
Expected: success. Confirm the emitted sitemap contains the lab URLs:
```bash
grep -o 'lab[^<]*' out/sitemap.xml
```
Expected: lines for `.../lab/` and `.../lab/morphology-in-AI-components/`.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(lab): add /lab hub + project URLs to sitemap

Co-Authored-By: Claude <svc-devxp-claude@slack-corp.com>"
```

---

## Task 10: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint + build clean**

Run:
```bash
npm run lint && npm run build
```
Expected: both succeed with no errors/warnings introduced by this work.

- [ ] **Step 2: Browser sweep (dev)**

With `npm run dev`, verify in the browser preview:
- `/` — Lab section (Row C) renders; SideNav beaker icon scroll-spies; footer has a "Lab" link that navigates to `/lab/`.
- `/lab/` — hub lists the morphology tile; the tile links to the project.
- `/lab/morphology-in-AI-components/` — bento + thesis; light/dark; mobile stack; no console errors.

- [ ] **Step 3: Confirm no stray files / clean status**

Run:
```bash
git status
```
Expected: clean tree (the pre-existing unrelated `ArticleFooter.tsx` / `next-env.d.ts` changes are out of scope — do not stage them).

---

## Self-Review

**Spec coverage:**
- Lab registry (`lib/lab.ts`) → Task 1 ✓
- `lab` zone + footer link → Task 1 ✓
- `LabPreviewTile` (video/poster/gradient) → Task 2 ✓
- Homepage Lab section / Row C → Task 3 ✓
- SideNav beaker icon + scroll-spy → Task 4 ✓
- `/lab/` hub + metadata → Task 5 ✓
- Five static morphology components → Task 6 ✓
- Bento composition → Task 7 ✓
- Morphology page: header + bento + thesis + SEO + JSON-LD → Task 8 ✓
- Sitemap entries → Task 9 ✓
- Editorial aesthetic (tokens, serif, hairline, rust/sand) → applied throughout ✓
- Static (no state transitions), animation later → components are presentational ✓
- Non-goals honored (no video assets, no MDX, no tests framework) ✓

**Placeholder scan:** No TBD/TODO; every code step contains complete code; every command has an expected result.

**Type/name consistency:** `LabProject`, `labProjects`, `labProjectBySlug`, `LabPreviewTile({project, feature})`, `TileFrame({label, hint, className, children})`, `zoneById['lab']`, `project.href`/`poster`/`video` used consistently across tasks.

**Note on scroll-spy:** `SideNav` observes `iconItems` ids; adding `{ id: 'lab' }` and the `id="lab"` section (Task 3) makes spy work with no extra wiring.
