import type { Metadata } from 'next';
import { Silkscreen } from 'next/font/google';
import { site } from '@/lib/site';
import { labProjectBySlug } from '@/lib/lab';
import { REC_REPO_URL } from '@/lib/rec/config';
import { RecGateway } from '@/components/lab/rec/RecGateway';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';

// Pixel font for labels and numbers only; body text stays a readable sans.
const silkscreen = Silkscreen({
  subsets: ['latin'],
  variable: '--font-silkscreen',
  display: 'swap',
  weight: ['400', '700'],
});

const project = labProjectBySlug['rec'];

const REC_DESCRIPTION =
  'rec — a recorded LLM emulator by Abhirupa Mitra. Capture a streaming OpenAI response once, get a URL that replays it with its original timing. Stable tests for streaming UIs, zero tokens per run.';

const REC_KEYWORDS = [
  'mock LLM streaming',
  'record replay LLM response',
  'OpenAI streaming mock',
  'SSE replay',
  'test streaming UI',
  'LLM test fixtures',
  'frontend for AI',
];

export const metadata: Metadata = {
  title: 'rec — Record and Replay LLM Streams',
  description: REC_DESCRIPTION,
  keywords: REC_KEYWORDS,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  alternates: { canonical: project.href },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'article',
    url: `${site.url}${project.href}`,
    title: `rec — Record and Replay LLM Streams · ${site.name}`,
    description: REC_DESCRIPTION,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `rec · ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `rec — Record and Replay LLM Streams · ${site.name}`,
    description: REC_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

function RecJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'rec',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: REC_DESCRIPTION,
    url: `${site.url}${project.href}`,
    codeRepository: REC_REPO_URL,
    author: { '@type': 'Person', name: site.name, url: site.url },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isPartOf: { '@type': 'WebSite', url: site.url, name: site.name },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function RecPage() {
  return (
    <div className={`lg:pl-20 ${silkscreen.variable}`}>
      <RecJsonLd />
      <main className="zone scroll-mt-24 py-16 md:py-24">
        <Reveal className="max-w-3xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-lg text-sand/90">Lab</span>
            <span className="label text-parchment-muted">Experiment 02</span>
          </div>
          <h1 className="mt-4 flex items-center gap-4 font-display text-hero font-medium leading-[1.05] text-parchment">
            <span className="font-[family-name:var(--font-silkscreen)] tracking-tight">rec</span>
            <span aria-hidden className="inline-block h-[0.32em] w-[0.32em] bg-[#e2342b]" />
          </h1>
          <p className="mt-6 font-rounded text-xl font-light leading-relaxed text-parchment-muted">
            Press record once. Test forever. Capture a streaming LLM response, get a URL, and POST to
            it to get the same stream back with its original timing. Zero tokens per test run.
          </p>
        </Reveal>

        <div className="mt-12 md:mt-16">
          <RecGateway />
        </div>

        <Reveal className="mx-auto mt-16 max-w-2xl md:mt-24">
          <div className="accent-rule mx-auto mb-8" />
          <div className="space-y-5 font-body text-lg leading-relaxed text-parchment/90">
            <p>
              Streaming UIs get tested against live models, and live streams never repeat. Tokens,
              chunk sizes and the gaps between them change every run, so a rendering bug seen once
              can&rsquo;t be reproduced, and two renderers can&rsquo;t be compared fairly.
            </p>
            <p>
              rec treats a stream like audio on a tape. It keeps the text of each delta and the time
              before it, packs them into the URL itself, and plays them back at real speed. Nothing is
              stored on a server; your shelf lives in this browser.
            </p>
            <p className="font-rounded text-base text-parchment-muted">
              Source and replay endpoint:{' '}
              <a
                href={REC_REPO_URL}
                className="text-parchment underline decoration-hairline underline-offset-4 transition-colors hover:text-highlight"
              >
                rec-mock-llm-response-recorder
              </a>
              .
            </p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
