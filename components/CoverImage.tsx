import { cloudinaryUrl } from '@/lib/cloudinary';
import { ImagePlaceholder } from './ImagePlaceholder';

type CoverImageProps = {
  src?: string;
  alt: string;
  ratio?: 'portrait' | 'landscape' | 'square';
  shape?: 'card' | 'squircle';
  className?: string;
};

const ratios: Record<NonNullable<CoverImageProps['ratio']>, string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
};

const shapes: Record<NonNullable<CoverImageProps['shape']>, string> = {
  card: 'rounded-sm',
  squircle: 'rounded-[28%]',
};

/** A blog's cover thumbnail for homepage cards — falls back to ImagePlaceholder when unset. */
export function CoverImage({ src, alt, ratio = 'landscape', shape = 'card', className }: CoverImageProps) {
  if (!src) return <ImagePlaceholder label={alt} ratio={ratio} shape={shape} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cloudinaryUrl(src, { width: 800 })}
      alt={alt}
      className={`w-full border border-parchment/10 object-cover ${shapes[shape]} ${ratios[ratio]} ${className ?? ''}`}
    />
  );
}
