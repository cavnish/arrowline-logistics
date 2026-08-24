import { CLIENT_LOGOS } from "../data/logisticsData";
import { Anchor, ShieldAlert, Award } from "lucide-react";

export default function ClientMarquee() {
  const repeatedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <div className="bg-white py-10 border-y border-slate-200 overflow-hidden relative select-none">
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#FF7A00] uppercase tracking-widest block">
            Approved Multimodal Alliances
          </span>
          <h4 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-tight">
            Trusted by Leaders & Major Port Operators
          </h4>
        </div>
        <div className="flex items-center space-x-4 text-slate-500 text-[11px]">
          <span className="flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Mundra Port Registered</span>
          </span>
          <span>·</span>
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>IATA & CONCOR Licensed</span>
          </span>
        </div>
      </div>

      <div className="flex w-full overflow-hidden mt-4">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slide-infinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-marquee-slide {
            animation: slide-infinite 28s linear infinite;
          }
          .animate-marquee-slide:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="flex space-x-8 md:space-x-12 whitespace-nowrap animate-marquee-slide">
          {repeatedLogos.map((client, index) => (
            <div
              key={`logo-${client.logoType}-${index}`}
              className="flex items-center space-x-2.5 bg-[#FEF9F0] hover:bg-white border border-slate-200 hover:border-[#FF7A00]/40 px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                <Anchor className="w-4 h-4 text-[#FF7A00]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-[#1E3A8A] tracking-wide uppercase">
                  {client.logoType}
                </span>
                <span className="text-[9px] text-slate-500 leading-none">
                  {client.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
