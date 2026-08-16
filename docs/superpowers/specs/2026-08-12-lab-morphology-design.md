# Lab section + `/lab/morphology-in-AI-components` — Design

**Date:** 2026-08-12
**Status:** Approved design → implementation planning

## Purpose

Add a **Lab** to the digital garden: a place for live, interactive experiments in
agentic-interface design. The first experiment, **Morphology in AI components**,
argues that today's legacy paradigms (loaders, progress bars) encode a *discrete*
result — answer / no answer — and cannot express what a model is actually doing:
its confidence, whether it is thinking, whether text is partial or committed.
Morphology is proposed as a design language that can.

Two deliverables:

- **A) Homepage "Lab" section** — a bento of auto-playing preview tiles (video when
  available, poster/gradient otherwise) with minimalist captions, linking to each
  live lab project. Matches the existing editorial sections.
- **B) `/lab/` hub + `/lab/morphology-in-AI-components/`** — a hub listing lab
  projects, and the morphology bento page itself: five hand-crafted, static
  agent-state components arranged in an asymmetric bento, closed by the thesis.

Aesthetic: **editorial garden** — reuse the site's semantic palette, serif display
type, `font-rounded` UI text, hairline borders, and sand/rust accents. Components
are **static** (one representative frozen state each); animation comes later,
iteratively.

## Architecture

### Shared data model — `lib/lab.ts`

Single source of truth (mirrors `lib/data.ts` zone framing), consumed by the
homepage section, the `/lab/` hub, and the sitemap.

```ts
export type LabStatus = 'live' | 'wip';

export type LabProject = {
  slug: string;            // 'morphology-in-AI-components'
  title: string;
  caption: string;         // the minimalist one-liner
  tags: string[];
  status: LabStatus;
  href: string;            // '/lab/morphology-in-AI-components/'
  poster?: string;         // optional preview image (Cloudinary id or /public path)
  video?: string;          // optional looping preview (/public path); omitted for now
};

export const labProjects: LabProject[] = [ /* morphology entry */ ];
```

A `lab` zone entry is added to `lib/data.ts` `zones` (`index: '05'`, `kicker: 'Lab'`,
SEO-weighted title + blurb) so the section reuses `SectionHeader` and the scroll-spy.

### A) Homepage Lab section

- New full-width row (**Row C**) in `app/page.tsx`, after Design Thinking, before
  `Footer`. `id="lab"`, `scroll-mt-24`, `zone` grid consistent with other rows.
- New component `components/sections/LabBento.tsx`:
  - `SectionHeader` (editorial framing).
  - Bento grid of `LabPreviewTile`s (asymmetric, not uniform).
  - `ViewAllLink` → `/lab/`.
- New component `components/lab/LabPreviewTile.tsx` (shared by section + hub):
  - Renders `<video autoplay muted loop playsInline poster>` when `project.video`
    exists; else the `poster` image; else the sand→rust gradient fallback used by
    `FieldNotesCards`.
  - Hairline frame, `hover:-translate-y-0.5`, rust-warm border/hover, caption + tags,
    links to `project.href`. Respects `prefers-reduced-motion` (no autoplay churn).
- Wire-up:
  - `components/SideNav.tsx` — add `{ id: 'lab', label: 'Lab', icon: 'flask' }` with a
    new line-art beaker icon; it joins scroll-spy automatically via `iconItems`.
  - `lib/data.ts` `sitemapLinks` "The Garden" group — add `{ label: 'Lab', href: '/lab/' }`.

### B) `/lab/` hub + morphology page

- `app/lab/page.tsx` — hub listing `labProjects` via `LabPreviewTile` (same tile,
  larger layout). Editorial header. `generateMetadata`.
- `app/lab/morphology-in-AI-components/page.tsx` — the bento page. Path kept exactly
  as requested (uppercase `AI`). Static export + `trailingSlash: true` already handle
  directory URLs.

### The morphology bento page

Structure:

1. **Header** — kicker "Lab", serif title, a short thesis lede (1–2 sentences).
2. **Asymmetric bento** of five presentational components, each in one frozen state,
   each in its own file under `components/lab/morphology/` so they can be iterated
   (and animated) independently:
   - `StreamingRender.tsx` — partial text-to-speech: a speech waveform with a
     transcript where **committed** words are solid and trailing **partial** words
     fade to faint.
   - `ChatComposer.tsx` — an AI chat composer (input, attach, model pill, send).
   - `LoadingButton.tsx` — a button frozen mid-load.
   - `AgentThinking.tsx` — a reasoning / shimmer "thinking" indicator.
   - `AgentHandoff.tsx` — agent-to-agent handoff: "connection dropped, reconnecting…"
     waiting state between two agents.
   - `MorphologyBento.tsx` composes the five into the bento grid layout.
3. **Thesis subtext** — editorial prose below the bento: an agent passes through many
   states while processing; legacy loaders/progress bars encode only a discrete
   result and cannot express confidence, thinking, or partial-vs-committed text —
   morphology is proposed as the language that can.

All components are presentational (no client state required for the static pass;
`'use client'` only where a component genuinely needs it — none expected initially).

### SEO

- `generateMetadata` on `app/lab/page.tsx` and the morphology page: keyword-rich
  titles/descriptions (*agentic UI*, *agent state*, *morphology*, *beyond loaders and
  progress bars*, *human–AI interaction*), canonical URLs, OpenGraph/Twitter reusing
  `/og-image.png` for now.
- `app/sitemap.ts` — add `/lab/` (priority ~0.8) and each `labProjects` entry
  (`/lab/<slug>/`, priority ~0.7), trailing slashes to match canonical + export.
- Optionally a `CreativeWork`/`WebPage` JSON-LD block on the morphology page
  (nice-to-have; kept minimal).

## Components & responsibilities

| Unit | Responsibility | Depends on |
|---|---|---|
| `lib/lab.ts` | Lab project registry (data only) | — |
| `LabPreviewTile` | Render one project preview (video/poster/gradient) + caption | `lib/lab.ts`, `lib/cloudinary` |
| `LabBento` (section) | Homepage Lab row: header + tiles + view-all | `LabPreviewTile`, `SectionHeader` |
| `app/lab/page.tsx` | Lab hub listing + metadata | `lib/lab.ts`, `LabPreviewTile` |
| morphology page | Header + `MorphologyBento` + thesis + metadata | bento components |
| `MorphologyBento` | Asymmetric grid composition | the five state components |
| five state components | One frozen agent-state each (presentational) | tokens only |

## Non-goals (YAGNI, for now)

- No animation / live state transitions in the five components (later, on instruction).
- No real video assets yet — morphology tile uses poster/gradient.
- No MDX/content-folder integration — lab projects are coded routes via the registry.
- No live embedded mini-collage inside preview tiles.

## Success criteria

- `/lab/morphology-in-AI-components/` renders the five-component bento + thesis in the
  editorial aesthetic, light and dark, responsive, no console/build errors.
- Homepage shows a Lab section consistent with other sections; SideNav, footer links,
  and scroll-spy include it.
- `/lab/` hub lists the project; both routes appear in the sitemap; metadata is present.
- `next build` (static export) succeeds.
