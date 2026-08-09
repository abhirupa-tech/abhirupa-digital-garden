/**
 * The "View all →" affordance under each home-page section — a quiet link into
 * that section's dedicated landing page. Always rendered (even for sections
 * with only a few pieces) so every hub is one click away. The arrow nudges
 * right on hover; the whole control warms toward rust.
 */
export function ViewAllLink({
  href,
  count,
  label = 'View all',
}: {
  href: string;
  /** Optional total, shown in parentheses (e.g. "View all (7)"). */
  count?: number;
  label?: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 pt-1 text-sand transition-colors duration-300 hover:text-rust focus-visible:outline-hidden"
    >
      <span className="label">
        {label}
        {typeof count === 'number' ? ` (${count})` : ''}
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}
