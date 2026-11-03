import type { ReactNode } from 'react';
import { Annotation } from './Annotation';

/**
 * A definition or aside attached to a phrase. Renders two ways and lets CSS
 * pick (see `.article-body` in globals.css):
 *
 * - Margin note: on wide screens inside an article, the phrase gets a small
 *   number and the note sits in the right margin beside it, always visible.
 * - Tooltip: everywhere else (phones, callouts, the Toolkit page), the phrase
 *   carries an "i" badge and the note opens on hover, focus or tap.
 */
export function Subnote({ children, note }: { children: ReactNode; note: ReactNode }) {
  return (
    <>
      <span className="sn-tip">
        <Annotation
          trigger={children}
          note={note}
          icon
          triggerClassName="border-b border-dotted border-sand/60 text-sand hover:text-highlight"
          noteClassName="font-rounded text-base text-sand"
        />
      </span>
      <span className="sn-ref">{children}</span>
      <span className="sn-margin" role="note">
        {note}
      </span>
    </>
  );
}
