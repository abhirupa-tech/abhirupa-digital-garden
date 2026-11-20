import Link from 'next/link';
import { site } from '@/lib/site';

const linkClass =
  'text-sand underline decoration-sand/30 underline-offset-4 transition-colors duration-300 hover:text-highlight';

/**
 * The close of a piece, while the reader's intent is highest: one frosted-glass
 * card with who wrote it, where to read more, and a "buy me a coffee" pill.
 * Sits inside the article's reading column, right after the last paragraph.
 */
export function ArticleEnd() {
  return (
    <aside
      aria-label="About the author"
      className="relative mt-12 overflow-hidden rounded-3xl border border-white/60 bg-linear-to-br from-white/70 via-[#fbf3ea]/45 to-[#efdccb]/40 p-5 shadow-[0_10px_40px_-18px_rgba(59,42,32,0.35),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl sm:mt-16 sm:p-7 dark:border-white/10 dark:from-white/[0.07] dark:via-white/[0.03] dark:to-[#b4501a]/[0.08] dark:shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      {/* Warm glow behind the glass: mocha into dark orange. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-linear-to-br from-[#b4501a]/25 to-[#3b2a20]/10 blur-3xl dark:from-[#d2621f]/20 dark:to-transparent"
      />

      <div className="relative flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.avatar}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/70 dark:ring-white/10"
        />
        <div className="min-w-0">
          <p className="font-rounded text-[0.7rem] uppercase tracking-label text-parchment-faint">Written by</p>
          <Link
            href="/about/"
            className="font-display text-lg leading-tight text-parchment transition-colors duration-300 hover:text-rust-deep dark:hover:text-rust-soft"
          >
            {site.name}
          </Link>
        </div>
      </div>

      <p className="relative mt-3 font-rounded text-[0.95rem] leading-relaxed text-parchment-muted">
        {site.role}, writing about agentic AI interfaces, design thinking and slow living.
      </p>
      <div className="relative mt-2 flex flex-wrap gap-x-4 gap-y-1 font-rounded text-sm">
        <Link href="/about/" className={linkClass}>
          More about me
        </Link>
        <Link href="/writing/" className={linkClass}>
          All writing
        </Link>
        <a href="/feed.xml" className={linkClass}>
          RSS
        </a>
      </div>

      <a
        href={site.coffee}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-5 flex items-center gap-2.5 rounded-full bg-linear-to-r from-[#3b2a20] to-[#b4501a] px-4 py-2.5 text-white shadow-md shadow-[#3b2a20]/20 transition-shadow duration-300 hover:shadow-lg hover:shadow-[#b4501a]/30 sm:inline-flex sm:pr-5 dark:from-[#7a5a45] dark:to-[#d2621f]"
      >
        <span aria-hidden="true" className="text-lg leading-none">☕</span>
        <span className="font-rounded text-[0.95rem]">
          Love what you read? <span className="whitespace-nowrap font-medium">Buy me a coffee</span>
        </span>
        <span aria-hidden="true" className="ml-auto pl-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </aside>
  );
}
