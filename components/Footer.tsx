import { site } from '@/lib/site';
import { sitemapLinks } from '@/lib/data';
import { Newsletter } from './Newsletter';
import { SocialIcons } from './SocialIcons';
import { Wave } from './Wave';
import { Reveal } from './motion/Reveal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="stay-updated" className="relative mt-10 scroll-mt-24">
      <Wave tone="teal" flip className="opacity-80" />

      <div className="zone pt-20 pb-14">
        {/* Coastline side-mark / visual bookmark */}
        <div className="pointer-events-none absolute left-0 top-24 hidden h-40 w-1 bg-gradient-to-b from-sand/70 to-transparent md:block" />

        <div className="grid gap-16 md:grid-cols-12">
          {/* Call to action + newsletter */}
          <Reveal className="md:col-span-6">
            <span className="label">Stay updated</span>
            <h2 className="mt-5 max-w-md font-display text-section font-medium text-parchment">
              Notes from the garden, now and then.
            </h2>
            <p className="mt-4 max-w-md font-body text-lg leading-relaxed text-parchment/80">
              Subscribe for Abhirupa’s articles, research, and quiet thoughts on
              agentic AI interfaces, design thinking, and slow living. No noise —
              only what’s worth your attention.
            </p>
            <div className="mt-8">
              <Newsletter />
            </div>
          </Reveal>

          {/* Detailed sitemap */}
          <Reveal delay={0.1} className="md:col-span-6">
            <nav aria-label="Site" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              {sitemapLinks.map((group) => (
                <div key={group.heading}>
                  <h3 className="label mb-4 text-parchment-muted">{group.heading}</h3>
                  <ul className="space-y-3">
                    {group.links.map((link) => {
                      const external = link.href.startsWith('http') || link.href.startsWith('mailto');
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target={external && link.href.startsWith('http') ? '_blank' : undefined}
                            rel={external && link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="font-body text-base text-parchment/75 transition-colors duration-300 hover:text-sand"
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

        <div className="mt-16 flex flex-col gap-6 border-t border-parchment/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg text-parchment">{site.name}</p>
            <p className="label mt-2 text-parchment-faint">
              {site.role} · Agentic AI Interfaces
            </p>
          </div>
          <SocialIcons />
          <p className="label text-parchment-faint">
            © {year} {site.name}. Tended with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
