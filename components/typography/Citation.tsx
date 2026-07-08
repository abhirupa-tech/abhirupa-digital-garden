import type { ReactNode } from 'react';
import { Annotation } from './Annotation';

type CitationProps = {
  /** Manually numbered — kept simple rather than auto-counted across the page. */
  n: number;
  source: ReactNode;
  href?: string;
};

/** A superscript reference marker; hovering reveals the source. */
export function Citation({ n, source, href }: CitationProps) {
  const note = href ? (
    <>
      <span>{source}</span>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-1 block truncate text-sand underline"
      >
        {href}
      </a>
    </>
  ) : (
    source
  );

  return (
    <Annotation
      trigger={<sup className="text-xs text-sand">[{n}]</sup>}
      note={note}
      triggerClassName="text-sand"
    />
  );
}
