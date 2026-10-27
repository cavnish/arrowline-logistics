import { ArrowRight } from "lucide-react";
import { getAllSubServices } from "../data/servicesData";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import SmartImage from "./ui/SmartImage";
import Reveal from "./Reveal";
import SectionBackground from "./SectionBackground";

// Flagship wide logistics photograph used as the single premium backdrop
// for the services grid (highway freight, containers, industrial scenery).
const SERVICES_BACKGROUND =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg";

interface ServicesSectionProps {
  onSelectService: (slug: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  // Static build-time data replaces runtime API fetch
  const allServices = getAllSubServices();
  const services = allServices.slice(0, 6).map((s) => ({
    id: s.id,
    slug: s.slug,
    parentSlug: s.parentSlug,
    title: s.title,
    shortDesc:
      s.slug === "container-transportation"
        ? "Dedicated 20ft and 40ft container chassis transport from Mundra Port and major terminals to industrial destinations across India."
        : s.slug === "ftl-ltl-transportation"
          ? "Full Truckload (FTL) and Less-than-Truckload (LTL) road freight solutions tailored for commercial, industrial, and scheduled distribution."
          : s.shortDesc,
    image: s.heroImage || s.aboutImage || "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    imageAlt: s.imageAlt || s.shortDesc,
  }));

  return (
    <section id="services-section" className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden">
      {/* Premium logistics backdrop — one wide photograph behind the grid */}
      <SectionBackground image={SERVICES_BACKGROUND} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">

        {/* Section Header */}
        <Reveal className="text-center max-w-3xl mx-auto space-y-3 mb-10 lg:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
            Complete Multimodal <span className="text-[#FF6B1A]">Logistics Solutions</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From single container highway dispatches to multimodal rail rakes, specialized heavy-lift engineering, and modern industrial warehousing, we provide end-to-end supply chain integration.
          </p>
        </Reveal>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {services.map((service, index) => (
            <Reveal key={service.id || service.slug} delay={index * 80} duration={500} className="h-full">
            <a
              href={`/services/${service.parentSlug}/${service.slug}`}
              onClick={(event) => {
                event.preventDefault();
                onSelectService(`${service.parentSlug}/${service.slug}`);
              }}
              aria-label={`Explore ${service.title}`}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <article className="flex h-full flex-col overflow-hidden bg-white/90 backdrop-blur-xl border border-white/70 rounded-lg shadow-lg shadow-[#062B3A]/5 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#FF6B1A]/50 group-hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">

                {/* Image Frame */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <SmartImage
                    src={getOptimizedImageUrl(service.image, { width: 800 })}
                    alt={service.imageAlt || `Arrowline ${service.title}`}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transform-none"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base sm:text-lg font-bold leading-snug text-[#062B3A] transition-colors duration-200 group-hover:text-[#FF6B1A]">
                    {service.title}
                  </h3>

                  <p className="mt-2 flex-1 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                    {service.shortDesc}
                  </p>

                  {/* Explore CTA */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <span className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#FF6B1A]">
                      <span>Explore Service</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </a>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
