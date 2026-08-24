import { CORE_SERVICES } from "../data/logisticsData";
import { ArrowRight, ChevronRight } from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (slug: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section id="services-section" className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden">
      {/* Background Decorative Pattern & Directional Arrows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
            <span>OUR SERVICES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
            Complete Multimodal <span className="text-[#FF6B1A]">Logistics Solutions</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From single container highway dispatches to multimodal rail rakes and complex heavy-lift engineering movements, we provide end-to-end supply chain integration.
          </p>
        </div>

        {/* 3-Column Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CORE_SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service.slug)}
              className="group bg-white border border-slate-200 hover:border-[#FF6B1A]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                <span className="absolute top-3.5 left-3.5 bg-[#062B3A]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                  {service.category}
                </span>

                {/* Floating Orange Icon Disc */}
                <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#FF7A00] transition-all">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Key Capability Tag */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#062B3A] bg-[#EAF3F6] px-2.5 py-1 rounded-lg">
                    {service.keyCapability}
                  </span>

                  <span className="text-xs font-black uppercase text-[#FF6B1A] group-hover:text-[#FF7A00] flex items-center space-x-1">
                    <span>EXPLORE</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
