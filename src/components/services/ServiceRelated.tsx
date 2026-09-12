import { ArrowRight, ChevronRight, Layers } from "lucide-react";
import { MainServiceData, SubServiceData } from "../../data/servicesData";
import Reveal from "../Reveal";

interface ServiceRelatedProps {
  currentSlug: string;
  isSubService?: boolean;
  parentService?: MainServiceData;
  siblingSubServices?: SubServiceData[];
  otherMainServices?: MainServiceData[];
  onNavigateToService?: (serviceSlug: string, subSlug?: string) => void;
}

export default function ServiceRelated({
  currentSlug,
  isSubService = false,
  parentService,
  siblingSubServices = [],
  otherMainServices = [],
  onNavigateToService,
}: ServiceRelatedProps) {
  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <Layers className="w-3.5 h-3.5" />
              <span>EXPLORE MORE CAPABILITIES</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              Related Logistics Services
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Complementary transportation, warehousing, and project solutions for complete supply chain integration.
            </p>
          </Reveal>
        </div>

        {/* ── Sub-service Page View: Sibling sub-services first, then other main services ── */}
        {isSubService && (
          <div className="space-y-12">
            {/* Sibling Sub-Services */}
            {siblingSubServices.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[#062B3A] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
                  <span>Other {parentService?.title || "Specialized"} Services:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {siblingSubServices.slice(0, 3).map((sub, index) => {
                    const targetUrl = `#/services/${sub.parentSlug}/${sub.slug}`;
                    return (
                      <Reveal key={sub.slug} delay={index * 70}>
                        <a
                          href={targetUrl}
                          onClick={(e) => {
                            if (onNavigateToService) {
                              e.preventDefault();
                              onNavigateToService(sub.parentSlug, sub.slug);
                            }
                          }}
                          className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#FF6B1A]/40 transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1"
                        >
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B1A] mb-1.5 block">
                              {sub.parentName}
                            </span>
                            <h4 className="text-lg font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors mb-2">
                              {sub.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {sub.shortDesc}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase text-[#FF6B1A]">
                            <span>Explore Sub-Service</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </a>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Main Services */}
            <div>
              <h3 className="text-lg font-bold text-[#062B3A] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
                <span>Core Multimodal Verticals:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherMainServices.map((main, index) => {
                  const targetUrl = `#/services/${main.slug}`;
                  return (
                    <Reveal key={main.slug} delay={index * 70}>
                      <a
                        href={targetUrl}
                        onClick={(e) => {
                          if (onNavigateToService) {
                            e.preventDefault();
                            onNavigateToService(main.slug);
                          }
                        }}
                        className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          <img
                            src={main.heroImage || "/images/hero-logistics.jpg"}
                            alt={main.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/70 via-transparent to-transparent" />
                          <span className="absolute bottom-3 left-3 text-xs font-black text-white">
                            {main.title}
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {main.shortDesc}
                          </p>
                          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase text-[#FF6B1A]">
                            <span>View Full Vertical</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </a>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Service Page View: Display the other 3 main services ── */}
        {!isSubService && otherMainServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherMainServices.map((main, index) => {
              const targetUrl = `#/services/${main.slug}`;
              return (
                <Reveal key={main.slug} delay={index * 80}>
                  <a
                    href={targetUrl}
                    onClick={(e) => {
                      if (onNavigateToService) {
                        e.preventDefault();
                        onNavigateToService(main.slug);
                      }
                    }}
                    className="group flex flex-col h-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#FF6B1A]/40 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={main.heroImage || "/images/hero-logistics.jpg"}
                        alt={main.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/70 via-transparent to-transparent" />
                      <span className="absolute top-3.5 left-3.5 bg-[#062B3A]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                        Main Vertical
                      </span>
                      <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-[#FF6B1A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#FF7A00] transition-all">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug">
                          {main.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {main.shortDesc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#062B3A] bg-[#EAF3F6] px-2.5 py-1 rounded-lg">
                          {main.subServices?.length || 0} Sub-Services
                        </span>
                        <span className="text-xs font-black uppercase text-[#FF6B1A] group-hover:text-[#FF7A00] flex items-center space-x-1">
                          <span>EXPLORE</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
