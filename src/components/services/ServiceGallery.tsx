import { useState, useCallback } from "react";
import { GalleryMediaItem } from "../../data/servicesData";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import SmartImage from "../ui/SmartImage";

interface ServiceGalleryProps {
  serviceName: string;
  items: GalleryMediaItem[];
  heading?: string;
  description?: string;
}

function getOptimizedUrl(url: string, width: number) {
  if (!url) return url;
  if (url.includes("res.cloudinary.com")) {
    return url.replace(/\/upload\/(v\d+\/)/, `/upload/w_${width},f_auto,q_auto/$1`);
  }
  return url;
}

export default function ServiceGallery({ serviceName, items, heading, description }: ServiceGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const openLightbox = useCallback((index: number) => setSelectedIdx(index), []);
  const closeLightbox = useCallback(() => setSelectedIdx(null), []);
  const nextImage = useCallback(() => {
    if (selectedIdx !== null) setSelectedIdx((selectedIdx + 1) % items.length);
  }, [selectedIdx, items.length]);
  const prevImage = useCallback(() => {
    if (selectedIdx !== null) setSelectedIdx((selectedIdx - 1 + items.length) % items.length);
  }, [selectedIdx, items.length]);

  const row1 = items.slice(0, Math.ceil(items.length / 2));
  const row2 = items.slice(Math.ceil(items.length / 2));

  const renderRow = (rowItems: GalleryMediaItem[], reverse: boolean) => {
    const doubled = [...rowItems, ...rowItems];
    const direction = reverse ? "right" : "left";
    return (
      <div className={`flex ${reverse ? "flex-row-reverse" : "flex-row"} gap-4 overflow-hidden`}>
        <div
          className={`flex gap-4 ${reverse ? "flex-row-reverse" : "flex-row"} ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
          style={{ width: "max-content" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = "running";
          }}
        >
          {doubled.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="shrink-0 w-[280px] sm:w-[340px] lg:w-[400px] aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer bg-slate-100"
              onClick={() => openLightbox(idx % items.length)}
            >
              <SmartImage
                src={getOptimizedUrl(item.url, 400)}
                alt={item.title || `${serviceName} showcase`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-10 lg:py-14 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 lg:mb-8">
          <div>
            <h3 className="text-lg lg:text-xl font-black text-[#062B3A]">
              {heading || `${serviceName} in Action`}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>

        <style>{`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-left {
            animation: marquee-left 25s linear infinite;
          }
          .animate-marquee-right {
            animation: marquee-right 25s linear infinite;
          }
        `}</style>

        <div className="space-y-4">
          {row1.length > 0 && renderRow(row1, false)}
          {row2.length > 0 && renderRow(row2, true)}
        </div>
      </div>

      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#03212D]/95 backdrop-blur-md p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/20 transition-all z-50 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3.5 rounded-full border border-white/20 transition-all z-50 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3.5 rounded-full border border-white/20 transition-all z-50 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <SmartImage
              src={items[selectedIdx].url}
              alt={items[selectedIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/15"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <h3 className="text-base font-bold text-white">{items[selectedIdx].title}</h3>
              {items[selectedIdx].caption && (
                <p className="text-xs text-slate-300 mt-1">{items[selectedIdx].caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
