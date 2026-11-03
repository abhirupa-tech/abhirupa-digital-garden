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
      className="group my-8 flex items-center gap-4 rounded-xs border border-parchment/15 px-5 py-4 no-underline transition-colors duration-300 hover:border-highlight/60 hover:bg-sand/5 sm:my-12 sm:px-6"
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
