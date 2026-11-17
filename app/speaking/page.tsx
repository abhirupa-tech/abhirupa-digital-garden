import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { splitTalks, type Talk } from '@/lib/speaking';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { InviteCard, TalkCard } from '@/components/speaking/TalkCard';

const DESCRIPTION =
  'Talks by Abhirupa Mitra on agentic AI interfaces and frontend performance: recordings, slide decks and the code behind each session.';

export const metadata: Metadata = {
  title: 'Speaking',
  description: DESCRIPTION,
  alternates: { canonical: '/speaking/' },
  openGraph: {
    type: 'website',
    title: `Speaking · ${site.name}`,
    description: DESCRIPTION,
    url: `${site.url}/speaking/`,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Speaking · ${site.name}` }],
  },
};

function Group({ label, talks, offset, invite }: { label: string; talks: Talk[]; offset: number; invite?: boolean }) {
  return (
    <section className="mt-16 md:mt-20">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="label text-parchment-muted">{label}</span>
          <span className="font-rounded text-xs text-parchment-faint">{talks.length}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
        </div>
      </Reveal>
      <ul className="mt-6 grid gap-3 lg:grid-cols-12">
        {talks.map((t, i) => (
          <Reveal as="li" key={t.id} delay={0.06 * i} className="lg:col-span-8">
            <TalkCard talk={t} index={offset + i} />
          </Reveal>
        ))}
        {invite && (
          <Reveal as="li" delay={0.06 * talks.length} className="lg:col-span-4">
            <InviteCard />
          </Reveal>
        )}
      </ul>
    </section>
  );
}

/**
 * Speaking index: upcoming talks soonest-first, then past talks newest-first.
 * Each card opens the talk's own page (/speaking/<id>/). Add a talk by adding
 * an entry to lib/speaking.ts.
 */
export default function SpeakingPage() {
  const { upcoming, past } = splitTalks();

  return (
    <>
      <main className="zone relative pt-28 pb-16 md:pt-36 md:pb-24">
        <span
          aria-hidden="true"
          className="label absolute left-1 top-44 hidden [writing-mode:vertical-rl] text-parchment-faint/70 lg:block"
        >
          Speaking · Talks, decks &amp; code
        </span>

        <div className="lg:pl-8">
          <Reveal as="header" className="max-w-3xl">
            <span className="label">Speaking</span>
            <h1 className="mt-4 font-display text-section font-medium leading-[1.05] text-parchment">
              From the page <em className="font-serif italic text-highlight">to the stage</em>
            </h1>
            <p className="mt-5 font-rounded text-lg leading-relaxed text-secondary-text md:text-xl">
              Talks on building interfaces for agents: the recordings, the decks, and
              the code you can run yourself.
            </p>
          </Reveal>

          <Group label="Upcoming" talks={upcoming} offset={0} invite />
          {past.length > 0 && <Group label="Past talks" talks={past} offset={upcoming.length} />}
        </div>
      </main>
      <Footer />
    </>
  );
}
