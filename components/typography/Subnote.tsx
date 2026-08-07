import type { ReactNode } from 'react';
import { Annotation } from './Annotation';

/**
 * Marks `children` with a leading round "i" info badge and a dotted underline;
 * hovering (or tapping) reveals `note` as a navy, rounded aside.
 */
export function Subnote({ children, note }: { children: ReactNode; note: ReactNode }) {
  return (
    <Annotation
      trigger={children}
      note={note}
      icon
      triggerClassName="border-b border-dotted border-sand/60 text-sand hover:text-sand-soft"
      noteClassName="font-rounded text-base text-sand"
    />
  );
}
