const CLOUDINARY_PATH_RE = /^(https?:\/\/[^/]+\/image\/upload\/)(?:v\d+\/)?(.+)$/;

export interface ImageOptions {
  width?: number;
  quality?: "auto" | number;
}

/**
 * Returns a Cloudinary delivery URL with on-the-fly transformations
 * (f_auto, q_auto and a responsive width) when the source is a Cloudinary
 * URL, otherwise returns the URL untouched (local /images assets, Supabase
 * storage URLs, etc.).
 */
export function getOptimizedImageUrl(url: string, options: ImageOptions = {}): string {
  if (!url) return url;
  const match = url.match(CLOUDINARY_PATH_RE);
  if (!match) return url;

  // SVG originals are returned untouched: f_auto would rasterize the vector
  // and hurt crispness of brand logos.
  if (match[2].toLowerCase().includes(".svg")) return url;

  const transforms: string[] = ["f_auto", "q_auto"];
  if (options.width) transforms.push(`w_${options.width}`);
  if (typeof options.quality === "number") {
    transforms[transforms.length - 1] = `q_${options.quality}`;
  }

  return `${match[1]}${transforms.join(",")}/${match[2]}`;
}

/**
 * Human-readable alt text for a service/sub-service image. Stored CMS alt
 * text (image_alt) wins when present; this is only the fallback used when
 * no alt text has been configured.
 */
export function buildImageAlt(title: string, parentName?: string): string {
  if (parentName) {
    return `Arrowline Logistics ${title} - ${parentName} service in India`;
  }
  return `Arrowline Logistics ${title} service in India`;
}