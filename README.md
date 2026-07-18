# Abhirupa — Digital Garden

> A peek into my mind — its thoughts, notes, half-finished ideas, and research.

A personal knowledge ecosystem (not a résumé) for **Abhirupa Mitra**, frontend
engineer at Slack working at the intersection of **agentic AI interfaces**,
**design thinking**, and **slow living**. Editorial, minimalist, immersive —
inspired by connected-thinking portfolios.

## Stack

- **Node 26** (see `.nvmrc`) · **npm ≥ 10**
- **Next.js 15** (App Router, React 19) — SSR for maximum SEO
- **webpack** for bundling (Turbopack is not used; see the `webpack` hook in `next.config.mjs`)
- **TypeScript**
- **Tailwind CSS** — custom dark-slate → deep-blue gradient system
- **Framer Motion** — gentle, deliberate scroll reveals
- **gray-matter** — front-matter parsing for the file-based content
- Serif type hierarchy: Playfair Display · Cormorant Garamond · EB Garamond

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Structure

```
app/
  layout.tsx      Metadata, fonts, JSON-LD structured data (SEO core)
  page.tsx        Assembles hero + 4 zones + footer
  globals.css     Gradient canvas + type base
  sitemap.ts      /sitemap.xml
  robots.ts       /robots.txt
  manifest.ts     PWA manifest
components/
  sections/       One component per section — each a DIFFERENT display format
  Hero, KnowledgeLibrary, Footer, Wave, Sketch, ImagePlaceholder…
lib/
  site.ts         Single source of truth: identity, SEO keywords, socials
  data.ts         Zone framing (kicker, title, 1–2 line blurb)
  content.ts      Reads /content folders at build time (server-only)
content/          Static content — one folder per section
  the-practice/       piece-01.md … piece-05.md
  field-notes/        piece-01.md … piece-05.md
  design-thinking/    …
  knowledge-library/  …
scripts/
  scaffold-content.mjs   Regenerates content folders (idempotent — never clobbers)
```

## Content model

Each section is a **static folder** under `content/` with 5 Markdown entries
(front matter + body). The homepage reads them at build time via
[`lib/content.ts`](lib/content.ts) and each section **previews 3–4 entries in
its own distinct format**:

| Section | Display format |
|---|---|
| The Practice | Vertical numbered index list (no imagery) |
| Field Notes | Horizontal thumbnail cards *(shares a row with The Practice)* |
| Design Thinking | Staggered collage — mixed image / big-number tiles |
| Knowledge Library | Discovery masonry, click-to-expand |

Add or edit entries by dropping `.md` files into the right folder — no code
changes needed. Run `npm run scaffold` to top up any missing placeholders.

## The four zones

1. **The Practice** — building agentic interfaces at Slack
2. **Field Notes** — essays on human–AI interaction
3. **Design Thinking** — a human-centered method
4. **Knowledge Library** — a discovery model (papers, blogs, books, art)

## SEO

Built to rank for: *senior/staff software engineer, agentic UI, frontend for AI
interfaces, UI/UX research, Slack, women in technology*, and related phrases.

- Rich `metadata` (title templates, OpenGraph, Twitter, canonical, robots)
- **JSON-LD** `Person` + `WebSite` + `ProfilePage` structured data
- Semantic HTML with a strict h1→h4 heading hierarchy
- `sitemap.xml`, `robots.txt`, web manifest
- Descriptive `alt` text on every image slot

Update the SEO surface and identity in [`lib/site.ts`](lib/site.ts).

## Placeholders to replace

- **Imagery** — every `ImagePlaceholder` slot (zones + library)
- `/public/og-image.png` — 1200×630 social card
- Final hero copy, library items → [`lib/data.ts`](lib/data.ts)
- Social URLs + email, production domain → [`lib/site.ts`](lib/site.ts)
- Newsletter `onSubmit` → wire to a provider in [`components/Newsletter.tsx`](components/Newsletter.tsx)

## Roadmap

Dedicated pages per zone (each becomes its own route) in a later iteration.
