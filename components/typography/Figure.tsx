import { ImagePlaceholder } from '../ImagePlaceholder';
import { cloudinaryUrl } from '@/lib/cloudinary';

type FigureProps = {
  /** A full image URL, or a Cloudinary public ID (e.g. "field-notes/dag-cover"). */
  src?: string;
  alt?: string;
  caption?: string;
  ratio?: 'portrait' | 'landscape' | 'square';
};

/** Image with a caption underneath. No `src` yet? Falls back to the site's placeholder look. */
export function Figure({ src, alt = '', caption, ratio = 'landscape' }: FigureProps) {
  return (
    <figure className="my-14">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cloudinaryUrl(src, { width: 1600 })}
          alt={alt}
          className="w-full rounded-xs border border-parchment/10"
        />
      ) : (
        <ImagePlaceholder label={alt || 'Image'} ratio={ratio} />
      )}
      {caption && (
        <figcaption className="label mt-3 text-center text-parchment-faint">{caption}</figcaption>
      )}
    </figure>
  );
}
