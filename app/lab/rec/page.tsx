import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { labProjectBySlug } from '@/lib/lab';
import { REC_REPO_URL } from '@/lib/rec/config';
import { RecGateway } from '@/components/lab/rec/RecGateway';
import { jetbrainsMono, silkscreen, spaceGrotesk } from '@/components/lab/rec/fonts';
import '@/components/lab/rec/rec.css';

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
    <div className={`rec-app ${silkscreen.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <RecJsonLd />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <a href={project.href} className="flex items-center gap-2.5" aria-label="rec home">
          <span className="font-[family-name:var(--font-silkscreen)] text-xl text-(--rec-fg)">rec</span>
          <span aria-hidden className="inline-block h-2 w-2 bg-[#ff3b5c]" />
          <span className="ml-1 rounded border border-(--rec-line) px-1.5 py-0.5 font-[family-name:var(--font-silkscreen)] text-[0.6rem] text-(--rec-violet)">
            v0
          </span>
        </a>
        <a
          href={REC_REPO_URL}
          className="font-[family-name:var(--font-silkscreen)] text-xs text-(--rec-muted) transition-colors hover:text-(--rec-hot)"
        >
          Source
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
        <h1 className="rec-display max-w-3xl text-4xl leading-[1.05] text-(--rec-fg) md:text-6xl">
          Press record once.{' '}
          <span className="bg-linear-to-r from-[#6f8dff] via-(--rec-violet) to-[#b08cff] bg-clip-text text-transparent">
            Test forever.
          </span>
        </h1>

        <div className="mt-10 md:mt-14">
          <RecGateway />
        </div>
      </main>

      <footer className="border-t border-(--rec-line)">
        <p className="mx-auto max-w-6xl px-4 py-6 text-center font-[family-name:var(--font-rec-mono)] text-xs text-(--rec-faint) md:px-8">
          built with &lt;3 by{' '}
          <a href={site.url} className="text-(--rec-muted) transition-colors hover:text-(--rec-hot)">
            Abhirupa Mitra
          </a>
        </p>
      </footer>
    </div>
  );
}
