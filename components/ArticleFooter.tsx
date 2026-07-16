import type { Zone } from '@/lib/data';
import { zones } from '@/lib/data';
import type { ContentEntry } from '@/lib/content';
import { site } from '@/lib/site';

/**
 * The end-of-article block. It does three SEO jobs at once:
 *  1. "More in this section" — internal links to sibling articles, spreading
 *     link equity across the site and keeping readers in the garden.
 *  2. An author card — a keyword-rich bio that links back to the homepage and
 *     the topic hubs (agentic AI, frontend for AI, design thinking).
 *  3. "Elsewhere" — outbound rel="me" profile links that tie this site to
 *     Abhirupa's identity across the web (LinkedIn, Medium).
 */
export function ArticleFooter({
  zone,
  siblings,
}: {
  zone: Zone;
  siblings: ContentEntry[];
}) {
  return (
    <footer className="zone mx-auto mt-24 max-w-4xl border-t border-parchment/12 pt-12">
      {siblings.length > 0 && (
        <section aria-labelledby="more-heading" className="mb-16">
          <h2 id="more-heading" className="label text-sand/70">
            More in {zone.kicker}
          </h2>
          <ul className="mt-5 space-y-3">
            {siblings.map((entry) => (
              <li key={entry.slug}>
                <a
                  href={`/${entry.section}/${entry.slug}/`}
                  className="group flex items-baseline gap-3 font-serif text-xl font-light text-parchment transition-colors duration-300 hover:text-sand"
                >
                  <span className="flex-1">{entry.title}</span>
                  <span className="text-parchment-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sand">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Author card — a quiet callout, not body copy. Keyword-rich links kept for SEO. */}
      <section aria-labelledby="author-heading" className="mb-14">
        <div className="flex flex-col gap-5 rounded-2xl border border-gray-300/25 bg-gray-400/[0.14] p-7 sm:flex-row sm:items-start sm:gap-6 md:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[28%] border border-sand/25 bg-sand/10">
            <span className="font-display text-base text-sand">
              {site.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </span>
          </div>
          <div>
            <h2 id="author-heading" className="label text-sand/70">
              About the author
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-parchment/85">
              <a href="/" className="text-parchment underline decoration-sand/40 underline-offset-4 hover:text-sand">
                {site.name}
              </a>{' '}
              is a {site.role} designing{' '}
              <a href="/#the-practice" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft">
                agentic AI interfaces
              </a>{' '}
              — the frontend for AI where agents reason alongside people. She writes on{' '}
              <a href="/#field-notes" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft">
                human–AI interaction
              </a>
              ,{' '}
              <a href="/#design-thinking" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft">
                design thinking for intelligent systems
              </a>
              , and the craft of{' '}
              <a href="/#knowledge-library" className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft">
                frontend engineering
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Explore the garden — internal links to every topic hub. */}
      <nav aria-label="Explore the garden" className="mb-12">
        <h2 className="label text-sand/70">Explore the garden</h2>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {zones.map((z) => (
            <li key={z.id}>
              <a
                href={`/#${z.id}`}
                className="font-display text-parchment/80 transition-colors duration-300 hover:text-sand"
              >
                {z.kicker}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Outbound identity links — rel="me" for cross-web authority. */}
      <nav aria-label="Elsewhere on the web">
        <h2 className="label text-sand/70">Elsewhere</h2>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <a
              href={site.social.linkedin}
              rel="me noreferrer"
              target="_blank"
              className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={site.social.medium}
              rel="me noreferrer"
              target="_blank"
              className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft"
            >
              Medium
            </a>
          </li>
          <li>
            <a
              href={site.social.email}
              className="text-sand underline decoration-sand/40 underline-offset-4 hover:text-sand-soft"
            >
              Email
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
