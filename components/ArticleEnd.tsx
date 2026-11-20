import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The close of a piece, while the reader's intent is highest: a short author
 * card (who wrote this, where to read more) and a thin "buy me a coffee" card.
 * Sits inside the article's reading column, right after the last paragraph.
 */
export function ArticleEnd() {
  return (
    <div className="mt-14 sm:mt-20">
      <div className="flex items-start gap-4 border-t border-parchment/12 pt-8 sm:gap-5 sm:pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.avatar}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full border border-parchment/10 object-cover sm:h-16 sm:w-16"
        />
        <div className="min-w-0">
          <p className="label text-parchment-faint">Written by</p>
          <Link
            href="/about/"
            className="mt-1 inline-block font-display text-xl leading-tight text-parchment transition-colors duration-300 hover:text-rust-deep dark:hover:text-rust-soft"
          >
            {site.name}
          </Link>
          <p className="mt-2 font-rounded text-base leading-relaxed text-parchment-muted">
            {site.role}, writing about agentic AI interfaces, design thinking and
            slow living.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-rounded text-sm">
            <Link href="/about/" className="text-sand underline decoration-sand/30 underline-offset-4 hover:text-highlight">
              More about me
            </Link>
            <Link href="/writing/" className="text-sand underline decoration-sand/30 underline-offset-4 hover:text-highlight">
              All writing
            </Link>
            <a href="/feed.xml" className="text-sand underline decoration-sand/30 underline-offset-4 hover:text-highlight">
              Subscribe via RSS
            </a>
          </div>
        </div>
      </div>

      <a
        href={site.coffee}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 flex items-center gap-3 rounded-full border border-parchment/15 px-5 py-3 transition-colors duration-300 hover:border-rust-soft"
      >
        <span aria-hidden="true" className="text-xl leading-none">☕</span>
        <span className="font-rounded text-base text-parchment-muted">
          Love what you read?{' '}
          <span className="whitespace-nowrap text-parchment underline decoration-parchment/30 underline-offset-4 transition-colors duration-300 group-hover:text-rust-soft group-hover:decoration-rust-soft/60">
            Buy me a coffee
          </span>
        </span>
        <span aria-hidden="true" className="ml-auto text-parchment-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-rust-soft">→</span>
      </a>
    </div>
  );
}
