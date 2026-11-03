import type { ReactNode } from 'react';

type CalloutVariant = 'note' | 'takeaway' | 'aside';

type CalloutProps = {
  children: ReactNode;
  /** Sets the accent and the default label. */
  variant?: CalloutVariant;
  /** Overrides the small uppercase label above the body. */
  label?: string;
  /** Optional bold lead line under the label. */
  title?: string;
};

const LABELS: Record<CalloutVariant, string> = {
  note: 'Note',
  takeaway: 'Key takeaway',
  aside: 'Aside',
};

const ACCENTS: Record<CalloutVariant, string> = {
  note: 'border-sand/60 bg-sand/10',
  takeaway: 'border-highlight bg-highlight/10',
  aside: 'border-parchment/25 bg-ink-700/30',
};

/**
 * A boxed block that sets a passage apart from the running text: a side note,
 * a takeaway the reader should leave with, or a personal aside. Markdown inside
 * renders through the normal typography map, so paragraphs and lists work.
 */
export function Callout({ children, variant = 'note', label, title }: CalloutProps) {
  return (
    <aside
      className={`my-8 rounded-xs border-l-2 px-5 py-4 sm:my-12 sm:px-7 sm:py-6 ${ACCENTS[variant]} [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-2`}
    >
      <p className="label mb-2! text-parchment-faint">{label ?? LABELS[variant]}</p>
      {title && (
        <p className="mb-3! font-serif text-xl font-medium leading-snug text-parchment sm:text-2xl">
          {title}
        </p>
      )}
      {children}
    </aside>
  );
}
