import Link from 'next/link';
import { site } from '@/lib/site';
import { sitemapLinks } from '@/lib/data';
import { featureFlags } from '@/lib/featureflag';
import { Newsletter } from './Newsletter';
import { Reveal } from './motion/Reveal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="stay-updated"
      className="relative mt-20 scroll-mt-24 bg-linear-to-b from-[#6b5744] to-[#040404] md:mt-28"
    >
      {/* Seamless wavy top edge: the footer's own crest rises into the canvas
          above. Filled with the footer's top gradient color (#6b5744) and
          pulled up flush against the footer, so there's no gap or seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 w-full -translate-y-full overflow-hidden text-[#6b5744]"
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="h-14 w-full md:h-24"
        >
          <path
            d="M0 46 C 240 96, 480 4, 720 34 S 1200 76, 1440 40 L1440 100 L0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="zone pt-20 pb-12">
        {/* Coastline side-mark / visual bookmark */}
        <div className="pointer-events-none absolute left-0 top-24 hidden h-40 w-1 bg-linear-to-b from-[#e8c9a0]/60 to-transparent md:block" />

        {featureFlags.showNewsletterSection && (
          <Reveal className="mb-16 max-w-md">
            <span className="label text-white/55">Stay updated</span>
            <h2 className="mt-5 font-display text-section font-medium text-white">
              Notes from the garden, now and then.
            </h2>
            <p className="mt-4 font-body text-lg leading-relaxed text-white/75">
              Subscribe for Abhirupa’s articles, research, and quiet thoughts on
              agentic AI interfaces, design thinking, and slow living. No noise —
              only what’s worth your attention.
            </p>
            <div className="mt-8">
              <Newsletter />
            </div>
          </Reveal>
        )}

        {/* Brand + sitemap, balanced across the row so the footer reads as one
            composed block rather than a stray column of links. */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-4">
            <p className="font-display text-2xl leading-none text-white">{site.name}</p>
            <p className="mt-4 max-w-xs font-body text-base leading-relaxed text-white/60">
              {site.role} designing agentic AI interfaces — the surfaces where
              agents reason, and thrive.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-8">
            <nav aria-label="Site" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {sitemapLinks.map((group) => (
                <div key={group.heading}>
                  <h3 className="label mb-4 text-white/45">{group.heading}</h3>
                  <ul className="space-y-3">
                    {group.links.map((link) => {
                      const external = link.href.startsWith('http') || link.href.startsWith('mailto');
                      const className =
                        'font-body text-base text-white/70 transition-colors duration-300 hover:text-[#e8c9a0]';
                      return (
                        <li key={link.label}>
                          {external ? (
                            <a
                              href={link.href}
                              target={link.href.startsWith('http') ? '_blank' : undefined}
                              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className={className}
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href} className={className}>
                              {link.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-white/45">
            © {year} {site.name}
          </p>
          <p className="label text-white/45">Built with ❤️ in the garden</p>
        </div>
      </div>
    </footer>
  );
}
