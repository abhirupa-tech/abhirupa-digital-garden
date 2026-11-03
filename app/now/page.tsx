import type { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getNowEntries } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { site } from '@/lib/site';
import { Footer } from '@/components/Footer';
import { typographyComponents } from '@/components/typography';

const DESCRIPTION =
  'What Abhirupa Mitra is working on, writing and thinking about right now: a short, dated log, updated every month or two.';

export const metadata: Metadata = {
  title: 'Now',
  description: DESCRIPTION,
  alternates: { canonical: '/now/' },
  openGraph: {
    type: 'website',
    title: `Now · ${site.name}`,
    description: DESCRIPTION,
    url: `${site.url}/now/`,
    siteName: site.name,
    locale: site.locale,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Now · ${site.name}` }],
  },
};

/**
 * A "now" page: newest update in full at the top, older ones below it as a
 * dated log. Each update is a Markdown file in content/_now.
 */
export default async function NowPage() {
  const entries = await Promise.all(
    getNowEntries().map(async (e) => ({
      ...e,
      content: (
        await compileMDX({ source: e.body, components: typographyComponents })
      ).content,
    })),
  );

  return (
    <>
      <main className="zone max-w-3xl pt-28 pb-16 md:pt-36 md:pb-24">
        <header>
          <span className="label">Now</span>
          <h1 className="mt-4 font-display text-section font-medium leading-[1.05] text-parchment">
            What I&rsquo;m doing now
          </h1>
          <p className="mt-5 font-rounded text-lg leading-relaxed text-secondary-text md:text-xl">
            A short, dated log of what I&rsquo;m working on, writing and thinking about,
            updated every month or two.
          </p>
        </header>

        <ol className="mt-12">
          {entries.map((e, i) => (
            <li key={e.slug} className="border-t border-parchment/10 py-10">
              <h2 className="font-display text-2xl text-parchment">{e.title}</h2>
              {e.date && (
                <p className="label mt-2">
                  {i === 0 ? 'Latest · ' : ''}Updated {formatDate(e.date)}
                </p>
              )}
              <div className="mt-6">{e.content}</div>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
