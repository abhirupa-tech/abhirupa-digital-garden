type SketchProps = {
  name: 'coastline' | 'cursor' | 'leaf' | 'orbit' | 'cup' | 'wave-line';
  className?: string;
};

const stroke = '#d4a574';

/**
 * Raw hand-drawn line art scattered between sections. No chrome, no fills —
 * just organic strokes. Purely decorative.
 */
export function Sketch({ name, className }: SketchProps) {
  const common = {
    fill: 'none',
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    opacity: 0.7,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`h-20 w-20 ${className ?? ''}`}
    >
      {name === 'coastline' && (
        <>
          <path {...common} d="M8 74 C 30 60, 40 84, 62 70 S 96 56, 112 72" />
          <path {...common} opacity={0.4} d="M8 86 C 34 74, 46 96, 70 82 S 100 70, 114 84" />
          <path {...common} opacity={0.25} d="M14 60 C 32 50, 44 66, 66 56" />
        </>
      )}
      {name === 'cursor' && (
        <>
          <path {...common} d="M40 30 L40 84 L54 70 L64 92 L72 88 L62 66 L82 66 Z" />
          <path {...common} opacity={0.35} d="M92 34 C 100 40, 100 52, 92 58" />
        </>
      )}
      {name === 'leaf' && (
        <>
          <path {...common} d="M60 20 C 30 40, 30 82, 60 100 C 90 82, 90 40, 60 20 Z" />
          <path {...common} opacity={0.5} d="M60 30 L60 92" />
          <path {...common} opacity={0.4} d="M60 50 L44 62 M60 62 L76 74 M60 40 L74 50" />
        </>
      )}
      {name === 'orbit' && (
        <>
          <circle {...common} cx="60" cy="60" r="12" />
          <ellipse {...common} opacity={0.5} cx="60" cy="60" rx="44" ry="20" />
          <ellipse {...common} opacity={0.35} cx="60" cy="60" rx="20" ry="44" />
          <circle {...common} cx="104" cy="60" r="3" />
        </>
      )}
      {name === 'cup' && (
        <>
          <path {...common} d="M34 52 L86 52 L82 92 C 80 98, 74 100, 68 100 L52 100 C 46 100, 40 98, 38 92 Z" />
          <path {...common} opacity={0.5} d="M86 58 C 100 58, 100 78, 86 78" />
          <path {...common} opacity={0.4} d="M48 40 C 44 44, 52 48, 48 44 M60 36 C 56 42, 64 46, 60 40 M72 40 C 68 44, 76 48, 72 44" />
        </>
      )}
      {name === 'wave-line' && (
        <path {...common} d="M6 60 C 24 40, 36 80, 60 60 S 96 40, 114 60" />
      )}
    </svg>
  );
}
