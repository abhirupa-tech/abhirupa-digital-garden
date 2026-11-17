import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { talks } from '@/lib/speaking';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/motion/Reveal';
import { TalkSection } from '@/components/speaking/TalkSection';

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

/** Each talk as an Event, so search engines can tie the session to the person. */
function SpeakingStructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': talks.map((t) => ({
      '@type': 'Event',
      '@id': `${site.url}/speaking/#${t.id}`,
      name: t.title || `${t.event} ${t.edition}`,
      description: t.abstract || undefined,
      ...(t.date ? { startDate: t.date } : {}),
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      url: t.sessionUrl || t.eventUrl,
      organizer: { '@type': 'Organization', name: t.event },
      performer: { '@type': 'Person', name: site.name, url: `${site.url}/about/` },
      ...(t.youtubeId ? { recordedIn: { '@type': 'VideoObject', embedUrl: `https://www.youtube.com/embed/${t.youtubeId}` } } : {}),
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}

/**
 * Speaking: one section per talk, newest first. Each talk is a ticket, then
 * the recording + proposal, the slide deck, and the code. Talk data lives in
 * lib/speaking.ts; empty media fields render as "coming soon" placeholders.
 */
export default function SpeakingPage() {
  return (
    <>
      <SpeakingStructuredData />
      <main className="zone relative pt-28 pb-16 md:pt-36 md:pb-24">
        <span
          aria-hidden="true"
          className="label absolute left-1 top-44 hidden [writing-mode:vertical-rl] text-parchment-faint/70 lg:block"
        >
          Speaking · Talks, decks &amp; code
        </span>

        <Reveal as="header" className="max-w-3xl lg:pl-8">
          <span className="label">Speaking</span>
          <h1 className="mt-4 font-display text-section font-medium leading-[1.05] text-parchment">
            From the page <em className="font-serif italic text-highlight">to the stage</em>
          </h1>
          <p className="mt-5 font-rounded text-lg leading-relaxed text-secondary-text md:text-xl">
            Talks on building interfaces for agents: the recordings, the decks, and
            the code you can run yourself.
          </p>
        </Reveal>

        <div className="mt-16 space-y-32 md:mt-24 lg:pl-8">
          {talks.map((t) => (
            <TalkSection key={t.id} talk={t} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
