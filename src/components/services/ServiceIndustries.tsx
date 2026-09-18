import { ArrowRight, Factory } from "lucide-react";
import Reveal from "../Reveal";

interface ServiceIndustriesProps {
  serviceName: string;
  industries: string[];
  onNavigateToIndustries?: () => void;
}

export default function ServiceIndustries({
  serviceName,
  industries,
  onNavigateToIndustries,
}: ServiceIndustriesProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <Factory className="w-3.5 h-3.5" />
              <span>SECTOR INTEGRATION</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              Industries We Serve
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Customized {serviceName.toLowerCase()} solutions tailored to the statutory compliance and handling demands of major industrial sectors.
            </p>
          </Reveal>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, index) => (
            <Reveal key={index} delay={index * 60}>
              <div
                onClick={() => {
                  if (onNavigateToIndustries) onNavigateToIndustries();
                  else window.location.pathname = "/industries";
                }}
                className="group p-7 rounded-3xl border border-slate-200 bg-[#F8FAFC] hover:bg-white hover:border-[#FF6B1A]/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full hover:-translate-y-1"
                role="button"
                tabIndex={0}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:bg-[#FF6B1A] group-hover:text-white group-hover:border-[#FF6B1A] text-[#062B3A] flex items-center justify-center mb-4 transition-colors shadow-xs">
                    <Factory className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors mb-2">
                    {ind}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Customized {serviceName.toLowerCase()} solutions meeting the specific turnaround, lashing, and regulatory needs of the {ind} sector.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-black uppercase text-[#FF6B1A] tracking-wider">
                  <span>Explore Sector</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
