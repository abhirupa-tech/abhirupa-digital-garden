type ImagePlaceholderProps = {
  label?: string;
  ratio?: 'portrait' | 'landscape' | 'square';
  /** 'card' = subtle radius; 'squircle' = soft superellipse-style corners. */
  shape?: 'card' | 'squircle';
  className?: string;
};

const ratios: Record<NonNullable<ImagePlaceholderProps['ratio']>, string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
};

const shapes: Record<NonNullable<ImagePlaceholderProps['shape']>, string> = {
  card: 'rounded-sm',
  squircle: 'rounded-[28%]',
};

/**
 * A calm, unobtrusive stand-in for imagery Abhirupa will provide later.
 * Carries a subtle coastline texture so empty slots still feel intentional.
 */
export function ImagePlaceholder({
  label = 'Image',
  ratio = 'landscape',
  shape = 'card',
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`group relative overflow-hidden border border-parchment/10 bg-ink-700/40 ${shapes[shape]} ${ratios[ratio]} ${className ?? ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ink-600/30 via-transparent to-sand/5" />
      <svg
        aria-hidden="true"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-1/2 w-full text-sand opacity-[0.14]"
      >
        <path
          d="M0 80 C 40 60, 60 96, 100 78 S 160 56, 200 76 L200 120 L0 120 Z"
          fill="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="label text-parchment-faint/70">{label}</span>
      </div>
    </div>
  );
}
