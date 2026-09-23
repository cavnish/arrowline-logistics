import { useState, type CSSProperties } from "react";

interface HeroVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
}

/* Full-bleed autoplay background video for hero sections. Muted + looping +
   playsInline so it autoplays on every browser (including iOS). Falls back to
   the poster/image behind it whenever the video is missing or fails to load —
   it renders nothing until the browser can actually play the clip. */
export default function HeroVideo({ src, poster, className, style }: HeroVideoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <video
      className={className}
      style={style}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      onError={() => setFailed(true)}
    >
      <source src={src} type="video/mp4" />
      <source src={src} />
    </video>
  );
}