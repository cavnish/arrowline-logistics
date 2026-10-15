import imageUrlBuilder from "@sanity/image-url";

import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export interface SanityImageValue {
  _type?: string;
  asset?: { _ref?: string; url?: string } | null;
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
}

/** Build an optimized, resizable Sanity CDN URL from an image reference. */
export function urlFor(source: SanityImageValue) {
  // imageUrlBuilder accepts the raw Sanity image object; the cast keeps the
  // call site free of the `sanity` package's stricter source type.
  return builder.image(source as never);
}
