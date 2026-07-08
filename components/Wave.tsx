import type { CSSProperties } from 'react';

type WaveProps = {
  /** Softens or emphasizes the coastline. */
  tone?: 'sand' | 'teal' | 'faint';
  className?: string;
  flip?: boolean;
};

const tones: Record<NonNullable<WaveProps['tone']>, string> = {
  sand: '#d4a574',
  teal: '#7fb3ab',
  faint: '#b9b4ac',
};

/**
 * Gentle coastline motif — layered tide lines that drift almost
 * imperceptibly. Used as a section divider and background texture,
 * representing the meeting of AI/tech and human experience.
 */
export function Wave({ tone = 'faint', className, flip }: WaveProps) {
  const color = tones[tone];
  const style: CSSProperties | undefined = flip
    ? { transform: 'scaleY(-1)' }
    : undefined;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden ${className ?? ''}`}
      style={style}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-16 w-full md:h-24"
      >
        <path
          className="animate-drift"
          d="M0 60 C 180 20, 320 100, 520 62 S 900 20, 1120 60 1440 52 1440 52 L1440 120 L0 120 Z"
          fill={color}
          opacity="0.05"
        />
        <path
          className="animate-drift"
          style={{ animationDelay: '-6s' }}
          d="M0 74 C 220 44, 380 104, 600 72 S 980 40, 1200 76 1440 70 1440 70"
          fill="none"
          stroke={color}
          strokeWidth="1.25"
          opacity="0.28"
        />
        <path
          className="animate-drift"
          style={{ animationDelay: '-11s' }}
          d="M0 88 C 260 66, 420 112, 660 86 S 1020 60, 1260 90 1440 86 1440 86"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.16"
        />
      </svg>
    </div>
  );
}
