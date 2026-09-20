import { GALLERY_ITEMS } from "../data/logisticsData";
import SmartImage from "./ui/SmartImage";
import { getOptimizedImageUrl, buildImageSrcSet } from "../utils/imageUrl";
import { SectionHeading, StaggerGroup, StaggerItem } from "./motion/primitives";
import { cn } from "../utils/cn";

interface GalleryShowcaseProps {
  onNavigateToGallery?: () => void;
}

/**
 * VisualShowcase — premium editorial gallery.
 * Masonry-style grid with hover zoom + category/title overlay.
 */
export default function GalleryShowcase({ onNavigateToGallery }: GalleryShowcaseProps) {
  return (
    <section className="relative bg-white py-20 lg:py-28" id="visual-showcase">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Visual Showcase"
            title={
              <>
                Container transportation
                <span className="block text-[#FF6B1A]">in action.</span>
              </>
            }
            description="Ports, containers, highways, yards and drivers — a working view of freight movement across the Arrowline network."
          />
          {onNavigateToGallery && (
            <button
              type="button"
              onClick={onNavigateToGallery}
              className="group inline-flex shrink-0 items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#062B3A] transition-colors hover:text-[#FF6B1A]"
            >
              View Full Gallery
              <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" aria-hidden="true" />
            </button>
          )}
        </div>

        <StaggerGroup
          className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4 lg:gap-4"
          stagger={0.06}
        >
          {GALLERY_ITEMS.map((item, i) => (
            <StaggerItem
              key={item.id}
              className={cn(
                i === 0 && "col-span-2 row-span-2",
                i === 3 && "max-lg:col-span-2"
              )}
            >
              <figure className="group relative h-full w-full overflow-hidden rounded-xl border border-[#062B3A]/10">
                <SmartImage
                  src={getOptimizedImageUrl(item.image, { width: 900 })}
                  srcSet={buildImageSrcSet(item.image, [480, 720, 900])}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  alt={item.alt}
                  loading="lazy"
                  width={900}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03212D]/85 via-[#03212D]/15 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 p-4 transition-transform duration-300 group-hover:translate-y-0 sm:p-5">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#FFB27D]">
                    {item.category}
                  </span>
                  <span className="mt-1 block text-[13px] font-bold leading-snug tracking-tight text-white sm:text-sm">
                    {item.title}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
