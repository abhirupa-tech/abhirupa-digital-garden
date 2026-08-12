import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { labProjects } from '@/lib/lab';
import { LabPreviewTile } from '@/components/lab/LabPreviewTile';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';

const LAB_DESCRIPTION =
  'The Lab — live, interactive experiments in agentic AI interface design by Abhirupa Mitra. Prototypes exploring how an interface can reveal an agent’s state, confidence, and thinking, beyond loaders and progress bars.';

export const metadata: Metadata = {
  title: 'Lab — Agentic Interface Experiments',
  description: LAB_DESCRIPTION,
  keywords: [
    'agentic UI',
    'agentic AI interfaces',
    'agent state UI',
    'interface morphology',
    'human-AI interaction',
    'frontend for AI',
    'AI interaction design',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'technology',
  alternates: { canonical: '/lab/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    url: `${site.url}/lab/`,
    title: `Lab — Agentic Interface Experiments · ${site.name}`,
    description: LAB_DESCRIPTION,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `The Lab · ${site.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Lab — Agentic Interface Experiments · ${site.name}`,
    description: LAB_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function LabHub() {
  return (
    <div className="lg:pl-20">
      <main className="zone scroll-mt-24 py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-lg text-sand/90">05</span>
            <span className="label text-parchment-muted">Lab</span>
          </div>
          <h1 className="mt-4 font-display text-section font-medium text-parchment">
            Live experiments in agentic interface morphology
          </h1>
          <p className="mt-4 font-rounded text-lg font-light leading-relaxed text-parchment-muted">
            Working prototypes for agentic AI — interfaces that reveal an agent&rsquo;s
            state, confidence, and thinking, beyond loaders and progress bars.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {labProjects.map((project, i) => (
            <Reveal key={project.slug} delay={0.06 * i}>
              <LabPreviewTile project={project} feature />
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
