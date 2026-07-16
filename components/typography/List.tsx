import type { ReactNode } from 'react';

/**
 * Maps markdown's `ul` / `ol` / `li`. Tuned to sit beside the body Paragraph:
 * same serif face and smoke-white tone, with quiet sand markers. Keep list
 * items *tight* in the source (no blank lines between them) so MDX doesn't
 * wrap each item in a Paragraph — the `[&>p]` overrides below are a safety net
 * for loose lists, collapsing the oversized body-paragraph look back down.
 */

const listItemText =
  'font-serif text-2xl font-light leading-relaxed text-[#eef0f2]/90 marker:text-sand/70 [&>p]:mb-0 [&>p]:font-serif [&>p]:text-2xl [&>p]:font-light [&>p]:leading-relaxed [&>p]:text-[#eef0f2]/90';

/** Maps markdown's `ul`. */
export function UnorderedList({ children }: { children: ReactNode }) {
  return <ul className="my-9 list-disc space-y-4 pl-6">{children}</ul>;
}

/** Maps markdown's `ol`. */
export function OrderedList({ children }: { children: ReactNode }) {
  return <ol className="my-9 list-decimal space-y-4 pl-6">{children}</ol>;
}

/** Maps markdown's `li`. */
export function ListItem({ children }: { children: ReactNode }) {
  return <li className={`pl-1.5 ${listItemText}`}>{children}</li>;
}
