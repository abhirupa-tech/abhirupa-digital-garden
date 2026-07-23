import { site } from '@/lib/site';
import { sitemapLinks } from '@/lib/data';
import { featureFlags } from '@/lib/featureflag';
import { Newsletter } from './Newsletter';
import { SocialIcons } from './SocialIcons';
import { Reveal } from './motion/Reveal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="stay-updated"
      className="relative scroll-mt-24 bg-linear-to-b from-[#6b5744] to-[#040404]"
    >
      <div className="zone pt-20 pb-14">
        {/* Coastline side-mark / visual bookmark */}
        <div className="pointer-events-none absolute left-0 top-24 hidden h-40 w-1 bg-linear-to-b from-[#e8c9a0]/60 to-transparent md:block" />

        <div className="grid gap-16 md:grid-cols-12">
          {/* Call to action + newsletter */}
          {featureFlags.showNewsletterSection && (
            <Reveal className="md:col-span-6">
              <span className="label text-white/55">Stay updated</span>
              <h2 className="mt-5 max-w-md font-display text-section font-medium text-white">
                Notes from the garden, now and then.
              </h2>
              <p className="mt-4 max-w-md font-body text-lg leading-relaxed text-white/75">
                Subscribe for Abhirupa’s articles, research, and quiet thoughts on
                agentic AI interfaces, design thinking, and slow living. No noise —
                only what’s worth your attention.
              </p>
              <div className="mt-8">
                <Newsletter />
              </div>
            </Reveal>
          )}

          {/* Detailed sitemap */}
          <Reveal delay={0.1} className={featureFlags.showNewsletterSection ? 'md:col-span-6' : 'md:col-span-12'}>
            <nav aria-label="Site" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {sitemapLinks.map((group) => (
                <div key={group.heading}>
                  <h3 className="label mb-4 text-white/55">{group.heading}</h3>
                  <ul className="space-y-3">
                    {group.links.map((link) => {
                      const external = link.href.startsWith('http') || link.href.startsWith('mailto');
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target={external && link.href.startsWith('http') ? '_blank' : undefined}
                            rel={external && link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="font-body text-base text-white/70 transition-colors duration-300 hover:text-[#e8c9a0]"
                          >
                            {link.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg text-white">{site.name}</p>
            <p className="label mt-2 text-white/55">
              {site.role} · Agentic AI Interfaces
            </p>
          </div>
          <SocialIcons tone="light" />
          <p className="label text-white/55">
            © {year} {site.name}. Tended with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
