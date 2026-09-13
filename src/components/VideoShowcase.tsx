import { useState } from "react";
import { Play, X, Film, Sparkles } from "lucide-react";

interface VideoShowcaseProps {
  videoUrl?: string | null;
  posterImage?: string;
  title?: string;
  subtitle?: string;
  duration?: string;
}

function getEmbedUrl(url: string): { type: "youtube" | "vimeo" | "mp4"; src: string } {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }
  return { type: "mp4", src: url };
}

export default function VideoShowcase({
  videoUrl = null,
  posterImage = "/images/video-poster.jpg",
  title = "See Arrowline in Action",
  subtitle = "Watch how we move India's supply chain — from Mundra Port to every corner of the nation.",
  duration = "2:14"
}: VideoShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embed = videoUrl ? getEmbedUrl(videoUrl) : null;

  return (
    <section className="py-16 lg:py-24 bg-white text-[#062B3A] border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-[10px] font-black text-[#062B3A] tracking-widest uppercase">
            <Film className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>OPERATIONS IN ACTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#062B3A]">
            See Arrowline <span className="text-[#FF6B1A]">in Action</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600">
            {subtitle}
          </p>
        </div>

        {/* Video Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-[#062B3A] group max-w-5xl mx-auto">
          <div className="relative aspect-video w-full">
            <img
              src={posterImage}
              alt="Arrowline Logistics fleet in motion — video preview"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/95 via-[#062B3A]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#062B3A]/70 via-transparent to-transparent" />

            <div className="absolute top-5 left-5 flex items-center gap-2 px-3.5 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white tracking-widest uppercase">
                Arrowline · Operations Reel
              </span>
            </div>

            <div className="absolute top-5 right-5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/15 rounded-xl">
              <span className="text-xs font-bold text-white">{duration}</span>
            </div>

            {/* Play Button */}
            <button
              onClick={() => videoUrl && setIsPlaying(true)}
              disabled={!videoUrl}
              className="absolute inset-0 flex items-center justify-center focus:outline-none group/play cursor-pointer"
              aria-label="Play company video"
            >
              <span className="relative">
                <span className="absolute inset-0 rounded-full bg-[#FF6B1A]/40 animate-ping" />
                <span className="absolute -inset-3 rounded-full bg-[#FF6B1A]/20 animate-pulse" />

                <span className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#FF6B1A] to-[#FF8C2A] rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,107,26,0.5)] group-hover/play:scale-110 group-active/play:scale-95 transition-transform duration-300">
                  <Play className="w-9 h-9 sm:w-11 sm:h-11 text-white fill-white translate-x-1" strokeWidth={0} />
                </span>
              </span>
            </button>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2 text-white">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight max-w-2xl">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                {subtitle}
              </p>

              {!videoUrl && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-white backdrop-blur">
                  <Sparkles className="w-3 h-3 text-[#FF7A00]" />
                  <span>Operations footage filmed on-site at Mundra Port & Western Freight Corridors</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Channels Bar (Section 31: Social / Logistics in Action) */}
        <div className="mt-10 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
          <a
            href="https://www.linkedin.com/company/arrowline-logistics"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#F5F8FA] hover:bg-[#0077B5] hover:text-white border border-slate-200 text-[#062B3A] rounded-xl flex items-center space-x-2 transition-all hover:-translate-y-0.5 shadow-sm"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>FOLLOW ON LINKEDIN</span>
          </a>

          <a
            href="https://www.instagram.com/arrowline_logistics"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#F5F8FA] hover:bg-[#E1306C] hover:text-white border border-slate-200 text-[#062B3A] rounded-xl flex items-center space-x-2 transition-all hover:-translate-y-0.5 shadow-sm"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>FOLLOW ON INSTAGRAM</span>
          </a>

          <a
            href="https://www.youtube.com/@arrowlinelogistics"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#F5F8FA] hover:bg-[#FF0000] hover:text-white border border-slate-200 text-[#062B3A] rounded-xl flex items-center space-x-2 transition-all hover:-translate-y-0.5 shadow-sm"
            aria-label="YouTube"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>WATCH ON YOUTUBE</span>
          </a>
        </div>

      </div>

      {/* Modal Player */}
      {isPlaying && videoUrl && embed && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPlaying(false)}
        >
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl flex items-center justify-center text-white transition-all z-10 cursor-pointer"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {embed.type === "mp4" ? (
              <video src={embed.src} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <iframe
                src={embed.src}
                title="Arrowline Logistics company video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
