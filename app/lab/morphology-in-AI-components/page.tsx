import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { labProjectBySlug } from '@/lib/lab';
import { MorphologyBento } from '@/components/lab/morphology/MorphologyBento';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';

const project = labProjectBySlug['morphology-in-AI-components'];

const MORPHOLOGY_DESCRIPTION =
  'Morphology in AI components — a design study by Abhirupa Mitra on interface states for agentic AI. Beyond loaders and progress bars: showing an agent’s confidence, thinking, and whether text is partial or committed.';

const MORPHOLOGY_KEYWORDS = [
  'morphology in AI components',
  'agent state UI',
  'agentic UI',
  'agentic AI interfaces',
  'LLM confidence UI',
  'streaming text UI',
  'agent thinking state',
  'agent handoff',
  'beyond loaders and progress bars',
  'human-AI interaction',
];

export const metadata: Metadata = {
  title: 'Morphology in AI Components — Agent State Interfaces',
  description: MORPHOLOGY_DESCRIPTION,
  keywords: MORPHOLOGY_KEYWORDS,
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
    title: `Morphology in AI Components · ${site.name}`,
    description: MORPHOLOGY_DESCRIPTION,
    siteName: site.name,
    locale: site.locale,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Morphology in AI Components · ${site.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Morphology in AI Components · ${site.name}`,
    description: MORPHOLOGY_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

/** CreativeWork structured data so the experiment can surface as its own result. */
function MorphologyJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Morphology in AI Components',
    headline: 'Morphology in AI Components — Agent State Interfaces',
    description: MORPHOLOGY_DESCRIPTION,
    url: `${site.url}${project.href}`,
    author: { '@type': 'Person', name: site.name, url: site.url },
    keywords: MORPHOLOGY_KEYWORDS.join(', '),
    isPartOf: { '@type': 'WebSite', url: site.url, name: site.name },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function MorphologyPage() {
  return (
    <div className="lg:pl-20">
      <MorphologyJsonLd />
      <main className="zone scroll-mt-24 py-16 md:py-24">
        {/* Header */}
        <Reveal className="max-w-3xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-lg text-sand/90">Lab</span>
            <span className="label text-parchment-muted">Experiment 01</span>
          </div>
          <h1 className="mt-4 font-display text-hero font-medium leading-[1.05] text-parchment">
            Morphology in AI components
          </h1>
          <p className="mt-6 font-rounded text-xl font-light leading-relaxed text-parchment-muted">
            An agent moves through many states as it works — thinking, streaming,
            handing off, waiting. This is a study of interface <em>morphology</em>:
            components that change shape to show what the agent is actually doing,
            not just whether it is busy.
          </p>
        </Reveal>

        {/* Bento */}
        <div className="mt-14 md:mt-16">
          <MorphologyBento />
        </div>

        {/* Thesis */}
        <Reveal className="mx-auto mt-16 max-w-2xl md:mt-24">
          <div className="accent-rule mx-auto mb-8" />
          <div className="space-y-5 font-body text-lg leading-relaxed text-parchment/90">
            <p>
              An agent can pass through many states during a single stretch of
              processing — any of the states above, often several at once. Our
              current design language struggles to say which.
            </p>
            <p>
              Legacy paradigms — the loader, the progress bar — encode a{' '}
              <strong className="font-medium text-parchment">discrete</strong>{' '}
              outcome: the answer is here, or it is not. What they cannot show is
              the model&rsquo;s confidence, what state it is in, whether it is still
              thinking, or whether the text on screen is partial or committed.
            </p>
            <p>
              This experiment treats morphology — components that change shape with
              the agent&rsquo;s state — as a way out of that binary, toward interfaces
              that let a person read an agent the way they read another person mid-thought.
            </p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
