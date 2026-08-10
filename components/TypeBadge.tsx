import { TypeGlyph } from './TypeGlyph';

/** A piece's `type` (Essay, Playbook, Guide, …) as a small pill — a matching
 * glyph beside the label, grey-to-warm gradient, smoke-white text. Shared
 * across every homepage card so each kind of piece carries its own mark. */
export function TypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={`label inline-flex items-center gap-1 rounded-full border border-[#cabab4] bg-linear-to-r from-[#f9f6ef] to-[#fbe1cf] px-2 py-0.5 text-[0.48rem] font-medium text-[#625b58] sm:text-[0.5rem] dark:border-[#7a3a12] dark:from-[#57270b] dark:to-[#6b3410] dark:text-[#e8c9a0] ${className ?? ''}`}
    >
      <TypeGlyph type={type} className="h-2.5 w-2.5 opacity-70" />
      {type}
    </span>
  );
}
