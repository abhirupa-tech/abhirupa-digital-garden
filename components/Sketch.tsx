type SketchProps = {
  name: 'coastline' | 'wave-line';
  className?: string;
};

/**
 * Raw hand-drawn line art scattered between sections. No chrome, no fills —
 * just organic strokes. Purely decorative.
 */
export function Sketch({ name, className }: SketchProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    opacity: 0.7,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`h-20 w-20 text-sand ${className ?? ''}`}
    >
      {name === 'coastline' && (
        <>
          <path {...common} d="M8 74 C 30 60, 40 84, 62 70 S 96 56, 112 72" />
          <path {...common} opacity={0.4} d="M8 86 C 34 74, 46 96, 70 82 S 100 70, 114 84" />
          <path {...common} opacity={0.25} d="M14 60 C 32 50, 44 66, 66 56" />
        </>
      )}
      {name === 'wave-line' && (
        <path {...common} d="M6 60 C 24 40, 36 80, 60 60 S 96 40, 114 60" />
      )}
    </svg>
  );
}
