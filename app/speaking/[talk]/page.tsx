import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { getTalk, talks, type Talk } from '@/lib/speaking';
import { Footer } from '@/components/Footer';
import { TalkSection } from '@/components/speaking/TalkSection';

type Params = { talk: string };

export function generateStaticParams(): Params[] {
  return talks.map((t) => ({ talk: t.id }));
}

function describe(t: Talk) {
  return `${t.title || 'A talk'} by ${site.name} at ${t.event} ${t.edition}: the recording, slide deck and code.`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const t = getTalk((await params).talk);
  if (!t) return {};
  const title = t.title || `${t.event} ${t.edition}`;
  const url = `/speaking/${t.id}/`;
  return {
    title,
    description: describe(t),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${title} · ${site.name}`,
      description: describe(t),
      url: `${site.url}${url}`,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
  };
}

/** The talk as a schema.org Event, plus a breadcrumb back to Speaking. */
function TalkStructuredData({ t }: { t: Talk }) {
  const url = `${site.url}/speaking/${t.id}/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        '@id': `${url}#event`,
        name: t.title || `${t.event} ${t.edition}`,
        description: t.abstract || undefined,
        ...(t.date ? { startDate: t.date } : {}),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        url: t.sessionUrl || t.eventUrl,
        organizer: { '@type': 'Organization', name: t.event },
        performer: { '@type': 'Person', name: site.name, url: `${site.url}/about/` },
        ...(t.youtubeId
          ? { recordedIn: { '@type': 'VideoObject', embedUrl: `https://www.youtube.com/embed/${t.youtubeId}` } }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Speaking', item: `${site.url}/speaking/` },
          { '@type': 'ListItem', position: 3, name: t.title || t.event, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}

/** One talk's own page: poster, recording + proposal, slides, code. */
export default async function TalkPage({ params }: { params: Promise<Params> }) {
  const t = getTalk((await params).talk);
  if (!t) notFound();

  return (
    <>
      <TalkStructuredData t={t} />
      <main className="zone relative pt-28 pb-16 md:pt-36 md:pb-24">
        <nav aria-label="Breadcrumb" className="mb-8 lg:pl-8">
          <Link
            href="/speaking/"
            className="group inline-flex items-center gap-2 font-rounded text-sm font-medium text-parchment-muted transition-colors hover:text-highlight"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            All talks
          </Link>
        </nav>
        <div className="lg:pl-8">
          <TalkSection talk={t} />
        </div>
      </main>
      <Footer />
    </>
  );
}
