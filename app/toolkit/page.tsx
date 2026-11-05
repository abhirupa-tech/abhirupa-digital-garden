import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
import { Footer } from '@/components/Footer';
import {
  Callout,
  CodeBlock,
  Figure,
  LinkCard,
  Quote,
  Stat,
  StatRow,
  Subnote,
  Citation,
} from '@/components/typography';

const DESCRIPTION =
  'The UI components every essay, guide and playbook by Abhirupa Mitra is written with: callouts, hover notes, link cards, stat rows, figures and more, each shown live with its MDX.';

export const metadata: Metadata = {
  title: 'Toolkit',
  description: DESCRIPTION,
  alternates: { canonical: '/toolkit/' },
  openGraph: {
    type: 'website',
    title: `Toolkit · ${site.name}`,
    description: DESCRIPTION,
    url: `${site.url}/toolkit/`,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Toolkit · ${site.name}` }],
  },
};

type Tool = { name: string; tag: string; purpose: string; demo: ReactNode; mdx: string };

const TOOLS: Tool[] = [
  {
    name: 'Subnote',
    tag: '<Subnote note="…">',
    purpose: 'A definition or aside that opens on hover, focus or tap.',
    demo: (
      <p className="font-rounded text-[1.08rem] leading-[1.6] text-parchment sm:text-[1.22rem]">
        Agents are tested by turning their findings into{' '}
        <Subnote note="Tests that lock in behaviour that already works, so a later change that breaks it fails the build.">
          regression tests
        </Subnote>
        .
      </p>
    ),
    mdx: `<Subnote note="Tests that lock in behaviour that already works.">regression tests</Subnote>`,
  },
  {
    name: 'Callout',
    tag: '<Callout variant>',
    purpose: 'Sets a passage apart: a note, a key takeaway, or an aside.',
    demo: (
      <Callout variant="takeaway">
        We&rsquo;re getting very good at making agents do things. The next step is rethinking how we
        work alongside them.
      </Callout>
    ),
    mdx: `<Callout variant="takeaway">
  We're getting very good at making agents do things.
</Callout>`,
  },
  {
    name: 'StatRow',
    tag: '<StatRow> + <Stat>',
    purpose: 'Two or three numbers that make the argument on their own.',
    demo: (
      <StatRow>
        <Stat value="+152%" label="more pull requests" />
        <Stat value="+27%" label="more deliverables" />
      </StatRow>
    ),
    mdx: `<StatRow>
  <Stat value="+152%" label="more pull requests" />
  <Stat value="+27%" label="more deliverables" />
</StatRow>`,
  },
  {
    name: 'LinkCard',
    tag: '<LinkCard>',
    purpose: 'A quiet link preview for a source worth leaving the page for.',
    demo: (
      <LinkCard
        href="https://arxiv.org/abs/2404.18196"
        title="Towards Intent-based User Interfaces"
        description="Charting the design space of intent-AI interactions across task types."
        site="arXiv"
      />
    ),
    mdx: `<LinkCard
  href="https://arxiv.org/abs/2404.18196"
  title="Towards Intent-based User Interfaces"
  site="arXiv"
/>`,
  },
  {
    name: 'Quote',
    tag: '<Quote>',
    purpose: 'A pull quote that slows the reader down.',
    demo: <Quote>Writing code is cheap now. Deciding what to build is the real work.</Quote>,
    mdx: `<Quote>Writing code is cheap now.</Quote>`,
  },
  {
    name: 'Citation',
    tag: '<Citation n source href>',
    purpose: 'A numbered source marker that reveals the reference on hover or tap.',
    demo: (
      <p className="font-rounded text-[1.08rem] leading-[1.6] text-parchment sm:text-[1.22rem]">
        Self-speculation decodes about four times faster on the same hardware.
        <Citation n={1} source="NVIDIA, Nemotron-Labs Diffusion" />
      </p>
    ),
    mdx: `<Citation n={1} source="NVIDIA, Nemotron-Labs Diffusion" href="…" />`,
  },
  {
    name: 'Figure',
    tag: '<Figure>',
    purpose: 'An image with a caption. Without a src it holds the space with a placeholder.',
    demo: <Figure alt="Diagram placeholder" caption="A slot waiting for its diagram" ratio="landscape" />,
    mdx: `<Figure src="…" alt="…" caption="…" ratio="landscape" />`,
  },
];

/** Shows an MDX snippet in the site's own code window. */
function Snippet({ code }: { code: string }) {
  return (
    <CodeBlock>
      <code>{code}</code>
    </CodeBlock>
  );
}

export default function ToolkitPage() {
  return (
    <>
      <main className="zone max-w-5xl pt-28 pb-16 md:pt-36 md:pb-24">
        <header className="max-w-3xl">
          <span className="label">Toolkit · {TOOLS.length} components</span>
          <h1 className="mt-4 font-display text-section font-medium leading-[1.05] text-parchment">
            The components I write with
          </h1>
          <p className="mt-5 font-rounded text-lg leading-relaxed text-secondary-text md:text-xl">
            Every piece here is MDX, written with a small set of React components. These are the
            real ones, rendered live, with the line of MDX that produces each.
          </p>
        </header>

        <ul className="mt-14">
          {TOOLS.map((t) => (
            <li
              key={t.name}
              id={t.name.toLowerCase()}
              className="grid scroll-mt-24 gap-x-12 gap-y-4 border-t border-parchment/10 py-10 md:grid-cols-[14rem_1fr]"
            >
              <div>
                <h2 className="font-display text-2xl text-parchment">{t.name}</h2>
                <p className="mt-1 font-mono text-sm text-parchment-faint">{t.tag}</p>
                <p className="mt-3 font-rounded text-base leading-relaxed text-parchment-muted">
                  {t.purpose}
                </p>
              </div>
              <div className="min-w-0">
                <div className="[&>figure]:my-0 [&>aside]:my-0 [&>a]:my-0 [&>blockquote]:my-0">{t.demo}</div>
                <div className="mt-2">
                  <Snippet code={t.mdx} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
