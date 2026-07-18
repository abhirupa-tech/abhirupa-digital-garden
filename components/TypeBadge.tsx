/** A piece's `type` (Essay, Playbook, Guide, …) as a small pill — grey-to-navy gradient, smoke-white text. Shared across every homepage card. */
export function TypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={`label inline-block rounded-full bg-gradient-to-r from-[#8a8e92] to-[#33465e] px-2.5 py-1 text-[0.55rem] text-[#f4f3f0] ${className ?? ''}`}
    >
      {type}
    </span>
  );
}
