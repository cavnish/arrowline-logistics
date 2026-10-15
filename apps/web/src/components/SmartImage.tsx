import NextImage from "next/image";

import { urlFor, type SanityImageValue } from "@/lib/sanity/image";

interface SmartImageProps {
  value?: SanityImageValue | null;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Sanity-backed responsive image with a graceful empty state. */
export default function SmartImage({
  value,
  width = 1200,
  height = 800,
  className,
  sizes = "100vw",
  priority = false,
}: SmartImageProps) {
  if (!value?.asset) return null;

  const src = urlFor(value).width(width).height(height).fit("crop").auto("format").url();

  return (
    <NextImage
      src={src}
      alt={value.alt || ""}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
