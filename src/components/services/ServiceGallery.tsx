import { useState } from "react";
import { GalleryMediaItem } from "../../data/servicesData";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn } from "lucide-react";
import Reveal from "../Reveal";

interface ServiceGalleryProps {
  serviceName: string;
  items: GalleryMediaItem[];
}

export default function ServiceGallery({ serviceName, items }: ServiceGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const openLightbox = (index: number) => setSelectedIdx(index);
  const closeLightbox = () => setSelectedIdx(null);
  const nextImage = () => {
    if (selectedIdx !== null) setSelectedIdx((selectedIdx + 1) % items.length);
  };
  const prevImage = () => {
    if (selectedIdx !== null) setSelectedIdx((selectedIdx - 1 + items.length) % items.length);
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>VISUAL SHOWCASE</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              {serviceName} in Action
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Real-world fleet operations, port handling, terminal staging, and heavy transport execution.
            </p>
          </Reveal>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Reveal key={item.id || index} delay={index * 80}>
              <div
                onClick={() => openLightbox(index)}
                className="group relative rounded-3xl overflow-hidden aspect-[16/11] bg-slate-100 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openLightbox(index);
                }}
              >
                <img
                  src={item.url}
                  alt={item.title || `${serviceName} gallery image`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/85 via-[#062B3A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      {item.caption && (
                        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.caption}</p>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FF6B1A] flex items-center justify-center text-white shrink-0">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03212D]/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
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

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
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
