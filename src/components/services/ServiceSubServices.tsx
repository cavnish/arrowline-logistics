import { ChevronRight, Check } from "lucide-react";
import Reveal from "../Reveal";
import SmartImage from "../ui/SmartImage";
import { SubServiceData } from "../../data/servicesData";
import { getOptimizedImageUrl, buildImageAlt } from "../../utils/imageUrl";

interface ServiceSubServicesProps {
  isSubServicePage?: boolean;
  parentSlug?: string;
  subServices?: SubServiceData[];
  capabilities?: Array<{ title: string; desc: string }>;
  sectionTitle?: string;
  sectionSubtitle?: string;
  onNavigateToSubService?: (subSlug: string) => void;
}

export default function ServiceSubServices({
  isSubServicePage = false,
  parentSlug = "",
  subServices = [],
  capabilities = [],
  sectionTitle,
  sectionSubtitle,
  onNavigateToSubService,
}: ServiceSubServicesProps) {
  // ── For Sub-Service Page: Display Detailed Capabilities ──
  if (isSubServicePage && capabilities.length > 0) {
    return (
      <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
            <Reveal>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
                <span>KEY CAPABILITIES</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
                {sectionTitle || "Specialized Service Capabilities"}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {sectionSubtitle || "Engineered operational scope designed for safety, schedule adherence, and maximum efficiency."}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, index) => (
              <Reveal key={index} delay={index * 80}>
                <div className="group h-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#FF6B1A]/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF3F6] group-hover:bg-[#FF6B1A] text-[#062B3A] group-hover:text-white flex items-center justify-center mb-5 transition-colors shadow-xs">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#062B3A] mb-2 leading-snug group-hover:text-[#FF6B1A] transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-black uppercase text-[#FF6B1A]">
                    <span>OPERATIONAL SCOPE</span>
                    <span className="text-slate-400 font-bold">0{index + 1}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── For Main Service Page: Display Clickable Sub-Service Cards ──
  if (!subServices || subServices.length === 0) return null;

  return (
    <section id="sub-services" className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <span>SPECIALIZED SERVICES</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              {sectionTitle || "Explore Our Sub-Services"}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {sectionSubtitle || "Every sub-service is backed by dedicated specialized fleet, verified operations processes, and pan-India coordination."}
            </p>
          </Reveal>
        </div>

        {/* Sub-Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {subServices.map((sub, index) => {
            const targetUrl = `/services/${parentSlug || sub.parentSlug}/${sub.slug}`;
            return (
              <Reveal key={sub.id || sub.slug} delay={index * 70}>
                <a
                  href={targetUrl}
                  onClick={(e) => {
                    if (onNavigateToSubService) {
                      e.preventDefault();
                      onNavigateToSubService(sub.slug);
                    }
                  }}
                  className="group flex flex-col h-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#FF6B1A]/40 transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <SmartImage
                      src={getOptimizedImageUrl(sub.heroImage || sub.aboutImage || "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", { width: 800 })}
                      alt={sub.imageAlt || buildImageAlt(sub.title, sub.parentName)}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/60 via-transparent to-transparent" />
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug">
                        {sub.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {sub.shortDesc}
                      </p>
                    </div>

                    {/* Explore CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <span className="text-xs font-black uppercase text-[#FF6B1A] group-hover:text-[#FF7A00] flex items-center space-x-1">
                        <span>EXPLORE SERVICE</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
