# SEO Evaluation & Action Plan

**Audited:** 2026-07-19 · **Re-scored:** 2026-07-19 (post duplicate-content fix)
**Scope:** Entire Next.js static-export site (`abhirupamitra.com`)
**Stated goal:** Rank at the top for "Frontend," "AI," "Software Engineering," and "System Design."

## Overall rating: 6.5 / 10 (up from 5.5)

**What changed since the first pass:** the two duplicate-content pairs are gone. `content/the-practice/piece-03.mdx` ("Anthropic Proved AI Thinks…") and `content/design-thinking/piece-01.mdx` (the DAG orchestration piece) were deleted; `content/field-notes/piece-02.md` and `content/field-notes/piece-01.md` are now the sole, canonical homes for that content respectively. `lib/covers.json` was cleaned of the now-dead keys. No other code changes were needed — `KnowledgeLibrary`'s hero card picks the first entry by filename automatically, so `design-thinking/piece-02.mdx` ("How Goodhart's Law Ate Your AI Strategy") is now the hero without touching any component. The site's total indexable article count went from 11 URLs (9 unique + 2 duplicates) to **9 URLs, all unique** — the highest-impact fix from the original audit is done.

The presentation gap flagged in the first pass — `field-notes/piece-01` being plain markdown instead of the richer MDX formatting its siblings use — is also fixed: it's now `piece-01.mdx` with `<Figure>`, `<Quote>`, `<Highlight>`, `<Subnote>`, and `<Citation>` restored, matching what `design-thinking/piece-01.mdx` used to look like before it was removed.

The remaining ceiling on this score is unchanged from the first audit: still 9 unique pieces, still zero content on "system design," still an empty Knowledge Library section. Those are the next fixes, and you've indicated you'll take those on yourself over time — this re-score reflects the codebase as it stands today, not that future work.

Also worth repeating: **ranking #1 for single generic terms like "AI" or "software engineering" is not a realistic target for any site**, regardless of how well-optimized it is. Those terms are dominated by MDN, freeCodeCamp, LeetCode, Wikipedia, and companies with decades of domain authority and backlinks. The achievable version of this goal is ranking well for specific, ownable, long-tail phrases this site can actually own — e.g. "agentic AI frontend engineer," "frontend for AI interfaces," "MCP servers explained," "system design for AI products." The plan below is written around that realistic target.

---

## Scorecard by pillar

| Pillar | Score | Change | Notes |
|---|---|---|---|
| Technical SEO infra (sitemap, robots, metadata, structured data) | 8.5/10 | — | Genuinely well-built — see "What's already working" below |
| Per-article content quality (when real) | 8/10 | — | Well-written, good length, good heading structure |
| Content volume & topical coverage vs. stated goal | 3/10 | — | 9 unique articles; zero "system design" coverage; one empty section |
| Content integrity | 8/10 | ▲ from 3/10 | Duplicate pairs removed; no other duplicates found in a follow-up pass |
| Site architecture / internal structure | 5/10 | — | No section hub pages; homepage previews cap out and hide older pieces |
| Image/media SEO | 6/10 | — | A few meaningful images have empty `alt` text |
| Off-page / authority signals | Unscored | — | No Search Console verification, no analytics — can't even measure this yet |

---

## What's already working (don't break these)

- **`app/sitemap.ts`** — a real, static, auto-generated sitemap that correctly excludes `draft: true` pieces and sets sensible priorities/change frequencies.
- **`app/robots.ts`** — clean, points at the sitemap, allows all crawlers.
- **`app/layout.tsx`** — root-level `Person` + `WebSite` + `ProfilePage` JSON-LD, a proper `title` template (`%s · Abhirupa Mitra`), full OpenGraph/Twitter card defaults, `metadataBase` set correctly.
- **`app/[section]/[slug]/page.tsx`** — per-article `BlogPosting` + `BreadcrumbList` structured data, canonical tags, per-article OG images, and `robots: { index: false }` on drafts (thin placeholder content is correctly kept out of the index).
- **Static export config** (`next.config.mjs`) — `output: 'export'` with `trailingSlash: true` is coherent and matches the canonical URLs used everywhere.
- **Internal cross-linking** (`components/ArticleFooter.tsx`) — "More in {section}," "From elsewhere in the garden," and "Explore the garden" already spread link equity across the site.

---

## Drawbacks, ranked by impact

### Resolved since the first audit

- ~~Two live duplicate-content pairs~~ — **Fixed.** `content/the-practice/piece-03.mdx` and `content/design-thinking/piece-01.mdx` were deleted; `content/field-notes/piece-01.md` and `content/field-notes/piece-02.md` are now the sole canonical homes for that content. `lib/covers.json` cleaned of the dead keys. A follow-up scan (`grep` across all `.md`/`.mdx` bodies) found no other duplicate or near-duplicate pairs.

### Critical — actively hurting rankings right now

1. **Zero content targeting "system design."** Across all 9 unique published pieces, none address system design (scalability, distributed systems, architecture trade-offs, databases, caching, load balancing). Given it's one of your four named target areas, this is a hard gap, not a tuning problem.

2. **"Knowledge Library" section has no real content.** All 5 files in `content/knowledge-library/` are `draft: true` placeholder text from the scaffold script. It's a prominent homepage section and nav item that resolves to nothing indexable — a dead end for both users and crawlers.

### High — meaningfully limiting reach

3. **No section index/hub pages.** There's no `app/[section]/page.tsx`, so `/field-notes/`, `/the-practice/`, etc. don't resolve. Search engines can't crawl a topical hub for each section, and the homepage previews cap at 3–8 items per section — as you publish more, older pieces become invisible in the UI (still technically crawlable via the sitemap, but with no internal links pointing at them beyond that, they get little PageRank flow).

4. **`site.keywords` (`lib/site.ts`) doesn't include "system design" or the exact phrase "software engineering."** It has "senior software engineer" / "staff software engineer" but not the broader phrase. Keywords meta tags carry limited direct ranking weight today, but this list also seeds the per-article `keywords` array in `generateMetadata`, so the gap compounds across every page.

5. **No Search Console / analytics wired up.** `verification: {}` in `app/layout.tsx` is empty, and there's no GA4/Plausible/similar anywhere in the codebase. You currently have no way to see what Google thinks of the site, what's indexed, what's ranking, or what queries are already bringing people in. This has to happen before you can measure whether anything else in this plan works.

### Medium — worth fixing, lower urgency

6. **Empty `alt` text on meaningful (non-decorative) images.** `components/sections/DesignThinkingCollage.tsx` sets `alt=""` on each book's cover art — that's real content, not decoration, and should describe the piece. (The `alt=""` on the circular author mark in `components/KnowledgeLibrary.tsx` is correctly decorative and fine as-is.)

7. **Breadcrumb structured data points at homepage anchors, not real pages.** The `BreadcrumbList` in `app/[section]/[slug]/page.tsx` uses `${site.url}/#${zone.id}` for the middle crumb — once section hub pages exist (fix #3), this should point at the real `/section/` URL instead.

8. **Four separate Google Font families** (Playfair, Cormorant, Garamond, Quicksand) load on every page. `next/font` with `display: swap` mitigates the worst of it, but this is still more font weight than most sites ship, and page speed is a ranking factor (Core Web Vitals).

9. **Heavy client-side JS via `framer-motion`.** Nearly every section is wrapped in a `'use client'` `Reveal` component for scroll animation. Tasteful, but it means a large fraction of the page requires hydration — worth profiling against Core Web Vitals (particularly INP) once real traffic exists.

---

## Action plan

### Phase 1 — Stop the bleeding (do this week)

- [x] Remove the duplicate sources (`content/the-practice/piece-03.mdx`, `content/design-thinking/piece-01.mdx`) so `content/field-notes/piece-01.md` and `piece-02.md` are each the sole canonical copy. *Done 2026-07-19.*
- [x] Verify no other pairs of pieces share substantial text. *Done 2026-07-19 — none found.*
- [x] Bring `field-notes/piece-01` up to the same MDX formatting as its siblings. *Done 2026-07-19 — converted to `piece-01.mdx` with `<Figure>`/`<Quote>`/`<Highlight>`/`<Subnote>`/`<Citation>` restored.*
- [ ] Register the site in Google Search Console and Bing Webmaster Tools; submit `sitemap.xml`; fill in `verification` in `app/layout.tsx`.
- [ ] Add an analytics tool (GA4 or a privacy-friendly alternative like Plausible/Fathom) so every later step in this plan is measurable.
- [ ] Add `"system design"` and `"software engineering"` (exact phrase) to `site.keywords` in `lib/site.ts`, and to `site.description` if it can be worked in naturally.

### Phase 2 — Close the structural gaps (this month)

- [ ] Build `app/[section]/page.tsx` — a real archive page per zone listing every non-draft piece in that section, with its own `generateMetadata` (title, description, canonical). This turns each section into an actual topical hub instead of a homepage anchor.
- [ ] Once those exist, update the `BreadcrumbList` structured data in `app/[section]/[slug]/page.tsx` to point at the real section URL instead of `/#zone-id`.
- [ ] Write and publish **at least 2–3 pieces explicitly on system design** — the single biggest content gap relative to your stated goal. Concrete angles that fit this site's existing voice: "System design for AI products" (distributed inference, caching LLM responses, rate-limiting agents), "What system design interviews get wrong about AI systems," or a case study of how a specific agentic feature was architected end to end.
- [ ] Give Knowledge Library real content — even 2–3 genuine "papers/books/tools I keep coming back to" pieces would take it from a dead section to a working one. If it's not a priority, consider removing it from the nav/homepage until it has content, rather than leaving a placeholder-only section publicly discoverable.
- [ ] Fix the empty `alt` text on book cover art in `components/sections/DesignThinkingCollage.tsx`.

### Phase 3 — Build authority (ongoing)

- [ ] Publish on a consistent cadence — search engines and readers both reward regular new content more than sporadic bursts. Even 2 pieces/month sustained beats 10 pieces once.
- [ ] Since content is cross-posted to Medium (per the `medium` frontmatter field added to `lib/content.ts`), make sure Medium always links back to the canonical piece on this domain — that backlink is worth more to you than the Medium traffic itself.
- [ ] Pursue a handful of real external backlinks: guest posts, being listed on frontend/AI newsletter roundups, HN/Reddit shares of standout pieces, cross-links from your LinkedIn posts. On-page SEO has a ceiling; off-page authority is what breaks through it for competitive terms.
- [ ] Revisit `site.keywords` and each zone's `blurb` (`lib/data.ts`) quarterly as the content library grows, so the target phrases always reflect what's actually been published, not just aspiration.
- [ ] Once Search Console has a few weeks of data, check the *Queries* report for terms you're already appearing for but not ranking well on — those are usually the fastest wins, since you already have some relevance signal.

---

## A note on the target keywords

"Frontend" and "AI" together is where this site already has a genuine, credible angle — agentic AI interfaces, MCP servers, LLM UX — and that's the wedge to push hardest on, because it's specific enough to be winnable and broad enough to matter. "Software engineering" is served incidentally through the frontend/AI-tooling content but isn't a distinct pillar yet. "System design" currently has no content at all. Treat this less as "optimize for 4 keywords" and more as "this site currently has 2 of its 4 claimed pillars represented — build out the other 2 before expecting to be found for them."
