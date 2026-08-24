# Homepage: intro-hero spark divider + featured blog

Date: 2026-08-24 · Status: approved (validated interactively via visual companion)

## Goal

The homepage reads as "a lot of text, not much to show." Two additions fix that
without a redesign:

1. **A living accent in the intro hero** — a sleek blue "spark" ball on a
   horizontal divider under the subheading, springing to rest on first scroll.
2. **A featured blog** — the globally-latest piece, given full billing right
   after the intro and before the section lists, with top-notch SEO.

Both share one **blue** accent (the site's only cool note against a warm
rust/sand palette, so it genuinely pops) tied together across the two features.

## Feature 1 — Hero spark divider

**Where:** `components/Hero.tsx`, a new divider placed **after** the H2
subheading ("Frontend engineering for agentic AI interfaces…") and **before**
the social/scroll row.

**Behavior:** a hairline divider spanning the content column. A blue ball rests
at the **left**. On the **first gentle scroll-down** (once per load; never on
reload/mount), it sweeps left→right drawing a soft blue trail, then **springs to
rest at the right end** — underdamped: overshoot (~+6px) → pull-back (~−4px) →
settle — with a small squash for weight. The blue trail then relaxes into the
normal hairline, leaving the blue ball as a resting "full stop."

**Component:** new client component `components/motion/HeroSparkDivider.tsx`.
Uses the Web Animations API inside an effect (faithful to the approved spring),
a one-shot scroll listener (`scrollY > 6`, then unbinds). Honors
`prefers-reduced-motion`: renders the ball settled at rest, no animation.

**Color:** new theme token `--c-spark` (blue) in `app/globals.css`, exposed as
Tailwind `--color-spark`, defined for light and dark.

## Feature 2 — Featured blog (Editorial Spotlight)

**Where:** new `components/FeaturedBlog.tsx`, rendered in `app/page.tsx`
immediately after `<Hero />`, before `<main>`'s section rows, inside a `.zone`.

**Data:** `getLatestEntry()` — the newest published, page-backed entry across
**all** sections (currently `the-practice/ai-assisted-coding-setup-guide`,
2026-08-19). To avoid showing it twice, it is **filtered out of its owning
section list** on the homepage.

**Layout (Editorial Spotlight, 2-col):**
- **Left column:** the cover image (`CoverImage`, hover zoom) with a
  **glassmorphism tag marquee directly below it** — the piece's tags as
  translucent, blurred, bordered pills scrolling horizontally (CSS marquee,
  pause on hover, masked edges). Reduced-motion: marquee static, wraps.
- **Right column (vertically centered):** a pulsing-blue **"Latest"** pill,
  the `TypeBadge` (Guide), `date · N min read`, the **title** (reuses
  `HoverLink` + `AnimatedTitle`), the description, and a **"Read the guide →"**
  CTA that widens its gap on hover.
- **Mobile:** stacks cover → marquee → text.

**Entrance:** staggered via the existing `Reveal` component.

**Read-time:** new `readingTime(body)` in `lib/format.ts` — word count / 220
wpm, min 1, rounded — rendered as `~N min read`.

## SEO (Feature 2)

- A `BlogPosting` JSON-LD block for the featured piece, injected by
  `FeaturedBlog`: `headline`, `description`, `datePublished`, `author`
  (Person → site), `image`, `keywords` (tags), `articleSection`,
  `mainEntityOfPage` = the piece's canonical URL, `wordCount`.
- Semantic markup: the block is an `<article>`; the title is a real `<h2>`
  linking to the canonical `/{section}/{slug}/`; the cover `<img>` has
  descriptive `alt`; the internal link keeps homepage → piece equity flowing.

## New/changed files

- `app/globals.css` — add `--c-spark` (+ `--color-spark`), light & dark.
- `lib/format.ts` — add `readingTime()`.
- `lib/content.ts` — add `getLatestEntry()`.
- `components/motion/HeroSparkDivider.tsx` — new.
- `components/FeaturedBlog.tsx` — new.
- `components/Hero.tsx` — insert the spark divider.
- `app/page.tsx` — render `FeaturedBlog`, filter the featured piece from its
  owning section list.

## Out of scope

No changes to section landing pages, article pages, nav, or content files.
