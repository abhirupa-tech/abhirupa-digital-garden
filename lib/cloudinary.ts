const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

type CloudinaryOptions = {
  /** Target display width in px. Cloudinary scales + serves the nearest fit. */
  width?: number;
};

/**
 * Turns a Cloudinary public ID (e.g. "field-notes/dag-cover") into an
 * optimized delivery URL — automatic format (avif/webp/etc.) and quality
 * chosen per-browser by Cloudinary. Anything already a full URL (http/https)
 * — including non-Cloudinary images — passes through untouched, so existing
 * MDX content with plain image links keeps working.
 */
export function cloudinaryUrl(src: string, { width }: CloudinaryOptions = {}): string {
  if (!src || /^https?:\/\//.test(src)) return src;
  if (!CLOUD_NAME) return src;

  const transforms = ['f_auto', 'q_auto', width && `w_${width}`].filter(Boolean).join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${src}`;
}
