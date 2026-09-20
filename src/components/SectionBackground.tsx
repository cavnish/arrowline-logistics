import type { CSSProperties } from "react";
import { getSectionBackgroundUrl } from "../utils/imageUrl";

interface SectionBackgroundProps {
  image?: string;
  overlayOpacity?: number;
}

/**
 * Shared premium backdrop for the Arrowline visual system — used on the
 * Home page and every Service page section (about, services grid,
 * applications, related, FAQ…).
 *
 * Layers a softened, photorealistic logistics photograph (blurred +
 * slightly desaturated via Cloudinary), an 88–94% light white translucent
 * wash, and a subtle navy depth gradient on top. Content sits above it and
 * the containing section keeps its own fallback background colour if the
 * image is missing or fails. `background-attachment: fixed` (parallax) is
 * handled in CSS and confined to fine-pointer desktop viewports so it never
 * hurts mobile performance. The image URL is injected through the CSS
 * custom property `--section-bg` (see .section-bg in src/index.css).
 */
export default function SectionBackground({
  image,
  overlayOpacity = 0.9,
}: SectionBackgroundProps) {
  const backgroundUrl = image ? getSectionBackgroundUrl(image) : "";
  const backgroundStyle = backgroundUrl
    ? ({ "--section-bg": `url(${backgroundUrl})` } as CSSProperties)
    : undefined;

  return (
    <>
      {backgroundUrl && (
        <div
          aria-hidden="true"
          className="section-bg pointer-events-none absolute inset-0"
          style={backgroundStyle}
        />
      )}

      {/* Strong light translucent wash keeps the backdrop understated */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: `rgba(245, 248, 250, ${overlayOpacity})` }}
      />

      {/* Subtle navy depth gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#062B3A]/[0.06] via-transparent to-[#062B3A]/[0.10]"
      />
    </>
  );
}