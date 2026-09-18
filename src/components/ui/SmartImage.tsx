import { useState } from "react";

export const FALLBACK_IMAGE =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg";

interface SmartImageProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  srcSet?: string;
  sizes?: string;
  width?: number | string;
  height?: number | string;
  onError?: () => void;
}

// Gracefully handles broken/expired image URLs (e.g. corrupt Cloudinary
// public_ids or relocated Supabase-storage assets) without ever showing the
// browser's broken-image icon. Falls back to `fallback`, then to a branded
// placeholder.
export default function SmartImage({
  src,
  alt = "",
  fallback = FALLBACK_IMAGE,
  className,
  style,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  srcSet,
  sizes,
  width,
  height,
  onError,
}: SmartImageProps) {
  const [stage, setStage] = useState(0);

  let resolved: string;
  if (stage === 0) resolved = src || fallback;
  else if (stage === 1) resolved = fallback;
  else resolved = FALLBACK_IMAGE;

  return (
    <img
      src={resolved}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      onError={() => {
        setStage((s) => Math.min(s + 1, 2));
        if (stage >= 2 && onError) onError();
      }}
      className={className}
      style={style}
    />
  );
}