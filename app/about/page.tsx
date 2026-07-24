import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { AboutIntro } from '@/components/about/AboutIntro';
import { CareerTimeline } from '@/components/about/CareerTimeline';
import { Portrait } from '@/components/about/Portrait';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';

const ABOUT_DESCRIPTION =
  'Abhirupa Mitra — senior frontend engineer at Slack designing agentic AI interfaces. Her path from Microsoft (Copilot, Office voice) to Slackforce Intelligence, and the practice behind the work.';

export const metadata: Metadata = {
  title: 'About',
  description: ABOUT_DESCRIPTION,
  keywords: [...site.keywords],
  alternates: { canonical: '/about/' },
  openGraph: {
    type: 'profile',
    firstName: 'Abhirupa',
    lastName: 'Mitra',
    title: `About · ${site.name}`,
    description: ABOUT_DESCRIPTION,
    url: `${site.url}/about/`,
    siteName: `${site.name} — Digital Garden`,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `About ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `About · ${site.name}`,
    description: ABOUT_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

/**
 * AboutPage + Breadcrumb structured data, both pointing (by @id) at the
 * Person/WebSite nodes declared once in the root layout — so this page
 * reinforces the single authoritative identity for "who is Abhirupa Mitra".
 */
function AboutStructuredData() {
  const url = `${site.url}/about/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${url}#aboutpage`,
        url,
        name: `About · ${site.name}`,
        description: ABOUT_DESCRIPTION,
        about: { '@id': `${site.url}/#person` },
        isPartOf: { '@id': `${site.url}/#website` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutStructuredData />
      <main className="zone relative pt-28 pb-8 md:pt-36 md:pb-16">
        {/* Vertical rotated marker — a quiet design accent down the left edge */}
        <span
          aria-hidden="true"
          className="label absolute left-1 top-44 hidden [writing-mode:vertical-rl] text-parchment-faint/70 lg:block"
        >
          About · The person behind the practice
        </span>

        <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12 lg:items-start">
          {/* Intro text — top of the scrolling column */}
          <div className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:pl-8">
            <AboutIntro />
          </div>

          {/* Portrait — sticky sidebar that stays in view while the timeline scrolls.
              self-stretch is essential: it makes this column fill its two-row grid
              area (rather than shrinking to the portrait), giving `sticky` room to travel. */}
          <div className="order-2 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-stretch">
            <div className="lg:sticky lg:top-28">
              <Portrait />
            </div>
          </div>

          {/* Career timeline — continues the scrolling column beneath the intro */}
          <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:pl-8">
            <section id="path" className="scroll-mt-24 pt-6 md:pt-10">
              <Reveal className="max-w-xl">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-lg text-sand/90">05</span>
                  <span className="label text-parchment-muted">The path here</span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-medium text-parchment md:text-4xl">
                  My career snapshot and contributions that mattered
                </h2>
                <p className="mt-3 font-rounded text-lg font-light leading-tight tracking-tight text-parchment-muted">
                  From voice and Office at Microsoft to Copilot, and now agentic
                  interfaces at Slack — the roles that shaped how I build.
                </p>
              </Reveal>

              <CareerTimeline />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
