import { useState } from "react";
import { Play, Video as VideoIcon } from "lucide-react";
import Reveal from "../Reveal";

interface ServiceVideoProps {
  serviceName: string;
  videoUrl?: string;
  posterImage?: string;
}

export default function ServiceVideo({ serviceName, videoUrl, posterImage }: ServiceVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl) return null;

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <VideoIcon className="w-3.5 h-3.5" />
              <span>OPERATIONS VIDEO</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">
              Watch {serviceName} Logistics
            </h2>
          </Reveal>
        </div>

        {/* Video Player Card */}
        <Reveal delay={120}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#062B3A] aspect-video max-w-4xl mx-auto">
            {isPlaying ? (
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={posterImage}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src={posterImage || "/images/hero-logistics.jpg"}
                  alt={`${serviceName} video cover`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#062B3A]/60 flex items-center justify-center transition-colors group-hover:bg-[#062B3A]/40">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white text-center sm:text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#FF9A5B]">
                    Arrowline Field Footage
                  </p>
                  <p className="text-lg font-bold text-white mt-1">
                    Click to stream operational movement
                  </p>
                </div>
              </div>
            )}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
