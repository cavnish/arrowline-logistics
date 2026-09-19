import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { contentService } from "../services/contentService";
import { getAllMainServices } from "../data/servicesData";
import { getOptimizedImageUrl, buildImageAlt, getGhostImageUrl } from "../utils/imageUrl";
import SmartImage from "./ui/SmartImage";
import Reveal from "./Reveal";

// Ghosted logistics visuals — modern monochrome, navy-tinted derivatives
// processed via Cloudinary (see getGhostImageUrl) and faded behind the grid.
const GHOST_PORT =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg";
const GHOST_TRAIN =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg";
const GHOST_TRUCK =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg";
const GHOST_CONTAINERS =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg";
const GHOST_WAREHOUSE =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg";
const GHOST_FLEET =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg";

interface ServicesSectionProps {
  onSelectService: (slug: string) => void;
}

interface DisplayService {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  image: string;
  imageAlt: string;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [services, setServices] = useState<DisplayService[]>(() => {
    // Default to the 4 approved main services
    return getAllMainServices().map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      shortDesc: s.shortDesc,
      image: s.heroImage || s.aboutImage || "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
      imageAlt: s.imageAlt || buildImageAlt(s.title),
    }));
  });

  useEffect(() => {
    let mounted = true;

    async function fetchDynamicServices() {
      try {
        const dbServices = await contentService.getServices();
        if (mounted && dbServices && dbServices.length > 0) {
          const mapped: DisplayService[] = dbServices.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            shortDesc: item.short_description || "",
            image: item.hero_image || item.about_image || "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
            imageAlt: item.image_alt || buildImageAlt(item.title),
          }));
          setServices(mapped);
        }
      } catch (err) {
        console.warn("[ServicesSection] Dynamic fetch fallback to static dataset:", err);
      }
    }

    fetchDynamicServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="services-section" className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden">
      {/* Ghosted logistics imagery — deep monochrome visuals behind the grid */}
      <div aria-hidden="true" className="ghost-logistics-layer hidden md:block">
        <img
          src={getGhostImageUrl(GHOST_PORT)}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="gm-tl w-[42vw] h-[34vh] top-[-12%] left-[-4%] opacity-[0.07]"
        />
        <img
          src={getGhostImageUrl(GHOST_TRAIN)}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="gm-tr w-[44vw] h-[30vh] top-[-6%] right-[-8%] opacity-[0.06]"
        />
        <img
          src={getGhostImageUrl(GHOST_TRUCK)}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="gm-l w-[36vw] h-[26vh] top-[34%] left-[-14%] opacity-[0.08]"
        />
        <img
          src={getGhostImageUrl(GHOST_CONTAINERS)}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="gm-r w-[34vw] h-[26vh] top-[38%] right-[-10%] opacity-[0.07]"
        />
        <img
          src={getGhostImageUrl(GHOST_WAREHOUSE)}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="gm-bl w-[38vw] h-[34vh] bottom-[-12%] left-[-6%] opacity-[0.07]"
        />
        <img
          src={getGhostImageUrl(GHOST_FLEET)}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="gm-br w-[40vw] h-[32vh] bottom-[-8%] right-[-10%] opacity-[0.06]"
        />
      </div>

      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

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
        <div className="grid grid-cols-1 md:grid-cols-2 min-[1200px]:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {services.map((service, index) => (
            <Reveal key={service.id || service.slug} delay={index * 80} duration={500} className="h-full">
            <a
              href={`/services/${service.slug}`}
              onClick={(event) => {
                event.preventDefault();
                onSelectService(service.slug);
              }}
              aria-label={`Explore ${service.title}`}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <article className="flex h-full flex-col overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#FF6B1A]/50 group-hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">

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