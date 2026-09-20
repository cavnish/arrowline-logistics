import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import SmartImage from "./ui/SmartImage";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import { SectionHeading, ScrollReveal, ImageReveal, StaggerGroup, StaggerItem } from "./motion/primitives";

interface AboutPositioningProps {
  onNavigateToAbout: () => void;
}

const BENEFITS = [
  "Multimodal connectivity — road, rail & coastal",
  "Pan-India reach across 500+ cities",
  "Real-time GPS visibility on every vehicle",
  "FTL, PTL, ODC and project cargo handling",
  "Port clearance coordinated from Mundra",
];

export default function AboutPositioning({ onNavigateToAbout }: AboutPositioningProps) {
  const content = useSiteContent();
  const aboutImg = content(
    "about_image",
    "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg"
  );

  return (
    <section className="relative overflow-hidden bg-[#F5F7F8] py-20 lg:py-28" id="about-section">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image — large, asymmetric, editorial */}
          <div className="lg:col-span-6">
            <ImageReveal parallax={24} className="rounded-2xl">
              <SmartImage
                src={getOptimizedImageUrl(aboutImg, { width: 1100 })}
                alt="Arrowline Logistics GPS-enabled container fleet on an Indian expressway corridor"
                loading="lazy"
                width={1100}
                height={780}
                className="aspect-[4/3] w-full object-cover"
              />
            </ImageReveal>

            <ScrollReveal delay={0.2} className="relative z-10 -mt-14 ml-auto w-[62%] pr-2 sm:-mt-20 sm:w-[52%]">
              <div className="overflow-hidden rounded-xl border-4 border-white shadow-2xl">
                <SmartImage
                  src={getOptimizedImageUrl(
                    "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
                    { width: 640 }
                  )}
                  alt="Arrowline industrial warehouse operations near Mundra Port"
                  loading="lazy"
                  width={640}
                  height={440}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Copy */}
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Who We Are"
              title={
                <>
                  We move more than cargo.
                  <span className="block text-[#FF6B1A]">We move business forward.</span>
                </>
              }
              description="Arrowline Logistics connects ports, highways, rail corridors and businesses through dependable freight movement designed for modern supply chains."
            />

            <ScrollReveal delay={0.15}>
              <p className="mt-6 border-l-2 border-[#FF6B1A] pl-4 text-[15px] font-bold leading-relaxed text-[#062B3A] sm:text-base">
                One network. Multiple modes. One accountable partner.
              </p>
            </ScrollReveal>

            <StaggerGroup className="mt-8 space-y-3">
              {BENEFITS.map((item) => (
                <StaggerItem key={item}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#FF6B1A]" strokeWidth={2.2} />
                    <span className="text-sm font-semibold text-[#071820]">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <ScrollReveal delay={0.2} className="mt-9">
              <button
                type="button"
                onClick={onNavigateToAbout}
                className="group inline-flex h-[52px] items-center gap-3 rounded-xl bg-[#062B3A] px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#03212D] hover:shadow-xl focus-visible:outline-none active:translate-y-0"
              >
                About Arrowline
                <ArrowRight className="h-4 w-4 text-[#FF8A3D] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
