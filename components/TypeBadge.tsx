/** A piece's `type` (Essay, Playbook, Guide, …) as a small pill — grey-to-navy gradient, smoke-white text. Shared across every homepage card. */
export function TypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={`label inline-block rounded-full bg-linear-to-r from-[#8a8e92] to-[#33465e] px-2 py-0.5 text-[0.48rem] text-[#f4f3f0] sm:px-2 sm:py-0.5 sm:text-[0.5rem] ${className ?? ''}`}
    >
      {type}
    </span>
  );
}
