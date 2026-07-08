import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getEntries, getEntry } from '@/lib/content';
import { zoneById, zones } from '@/lib/data';
import { SideNav } from '@/components/SideNav';
import { Footer } from '@/components/Footer';
import { Heading, Subtitle, TagList, typographyComponents } from '@/components/typography';

type PageParams = { section: string; slug: string };

/**
 * A Medium-style article page for a single /content piece. The body is
 * authored as MDX and rendered through the typography component set, so
 * standard markdown and explicit component tags both work in the source file.
 */
export function generateStaticParams() {
  return zones.flatMap((zone) =>
    getEntries(zone.id).map((entry) => ({ section: zone.id, slug: entry.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const entry = getEntry(section, slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function PiecePage({ params }: { params: Promise<PageParams> }) {
  const { section, slug } = await params;
  const zone = zoneById[section];
  const entry = zone ? getEntry(section, slug) : null;
  if (!zone || !entry) notFound();

  const { content } = await compileMDX({
    source: entry.body,
    components: typographyComponents,
    // Content is authored locally by the site owner, not remote/untrusted —
    // safe to allow JS expressions in JSX props (e.g. `<Citation n={1} />`),
    // which next-mdx-remote strips by default as an XSS precaution.
    options: { blockJS: false },
  });

  return (
    <>
      <SideNav />
      <div className="lg:pl-20">
        <main>
          <article className="zone max-w-3xl pb-20 pt-16 md:pt-24">
            <a
              href={`/#${zone.id}`}
              className="label inline-flex items-center gap-2 text-sand/80 transition-colors duration-300 hover:text-sand"
            >
              ← {zone.kicker}
            </a>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-display text-lg text-sand/70">{zone.index}</span>
              <span className="label">{entry.type}</span>
              {entry.date && <span className="label text-parchment-faint">{entry.date}</span>}
            </div>

            <Heading level={1} className="mt-4">
              {entry.title}
            </Heading>
            {entry.description && <Subtitle>{entry.description}</Subtitle>}
            <TagList tags={entry.tags} />

            <div className="mt-10">{content}</div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
