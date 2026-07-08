import type { ReactNode } from 'react';
import { Annotation } from './Annotation';

/** Wraps `children` with a dotted underline; hovering reveals `note` as an aside. */
export function Subnote({ children, note }: { children: ReactNode; note: ReactNode }) {
  return (
    <Annotation
      trigger={children}
      note={note}
      triggerClassName="border-b border-dotted border-sand/50 text-parchment hover:text-sand"
    />
  );
}
