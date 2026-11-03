type LinkCardProps = {
  href: string;
  title: string;
  description?: string;
  /** Shown as the source line; defaults to the link's hostname. */
  site?: string;
};

function hostname(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

/**
 * A link preview embed: a bordered card with title, short description and
 * source, used where a Medium post would show a bookmark card. Static HTML, so
 * it costs nothing at runtime and the link stays crawlable.
 */
export function LinkCard({ href, title, description, site }: LinkCardProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      // Background sits a half-step off the canvas so the card reads as an
      // embed without a heavy fill: warm off-white on the light parchment, a
      // cool slate against the neutral greys of dark mode.
      className="group my-8 flex items-center gap-4 rounded-xs border border-parchment/15 bg-[#fdfcf8] px-5 py-4 no-underline shadow-[0_1px_2px_rgba(60,50,30,0.06)] transition-colors duration-300 hover:border-highlight/60 hover:bg-[#fffefb] sm:my-12 sm:px-6 dark:bg-[#232a33] dark:shadow-none dark:hover:bg-[#28303a]"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-lg font-medium leading-snug text-parchment transition-colors duration-300 group-hover:text-highlight sm:text-xl">
          {title}
        </span>
        {description && (
          <span className="mt-1 block font-rounded text-sm leading-relaxed text-parchment-muted sm:text-base">
            {description}
          </span>
        )}
        <span className="label mt-2 block">{site ?? hostname(href)}</span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-xl text-parchment-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-highlight"
      >
        →
      </span>
    </a>
  );
}
