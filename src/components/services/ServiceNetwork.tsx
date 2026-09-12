import Reveal from "../Reveal";
import InteractiveMap from "../InteractiveMap";
import { Globe } from "lucide-react";

interface ServiceNetworkProps {
  networkDescription?: string;
}

export default function ServiceNetwork({ networkDescription }: ServiceNetworkProps) {
  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 lg:mb-14">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              <span>PAN-INDIA CORRIDORS</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              Pan-India Logistics & Transit Network
            </h2>
          </Reveal>

          {networkDescription && (
            <Reveal delay={140}>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {networkDescription}
              </p>
            </Reveal>
          )}
        </div>

        {/* Existing Interactive Map Component */}
        <Reveal direction="scale">
          <InteractiveMap />
        </Reveal>

      </div>
    </section>
  );
}
