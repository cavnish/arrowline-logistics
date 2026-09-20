import {
  Anchor,
  Satellite,
  MapPin,
  Container,
  GitBranch,
  Headset,
  ArrowRight,
} from "lucide-react";
import { SectionHeading, StaggerGroup, StaggerItem } from "./motion/primitives";

const CAPABILITIES = [
  {
    icon: Anchor,
    title: "Port Connectivity",
    text: "Strong origin access through Mundra Port — India's largest private commercial gateway.",
  },
  {
    icon: Satellite,
    title: "GPS Visibility",
    text: "Vehicle movement visibility across the network with automated milestone alerts.",
  },
  {
    icon: MapPin,
    title: "Pan-India Coverage",
    text: "Reach across 500+ cities, industrial belts and consumption centres.",
  },
  {
    icon: Container,
    title: "Specialized Fleet",
    text: "12-axle, 100T and 32m ODC capabilities alongside dedicated container trailers.",
  },
  {
    icon: GitBranch,
    title: "Multimodal Options",
    text: "Road, rail and coastal solutions engineered around cargo economics.",
  },
  {
    icon: Headset,
    title: "Responsive Operations",
    text: "Human coordination backed by technology — a dispatch desk that answers.",
  },
];

export default function WhyArrowlineSection() {
  return (
    <section className="relative overflow-hidden bg-[#062B3A] py-20 lg:py-28" id="why-arrowline">
      {/* Dark grid + glow */}
      <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FF6B1A]/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              dark
              eyebrow="Why Arrowline"
              title={
                <>
                  Built for businesses that
                  <span className="block text-[#FF8A3D]">cannot afford uncertainty.</span>
                </>
              }
              description="Freight failure is expensive. Arrowline removes the variables: predictable equipment, visible movement and one accountable operations desk."
            />
          </div>

          <StaggerGroup className="lg:col-span-7" stagger={0.08}>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <StaggerItem key={cap.title}>
                    <div className="group relative h-full bg-[#062B3A] p-6 transition-colors duration-300 hover:bg-[#08374A] sm:p-7">
                      <div className="flex items-start justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF6B1A]/12 text-[#FF8A3D] transition-all duration-300 group-hover:bg-[#FF6B1A] group-hover:text-white">
                          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-extrabold tracking-[0.14em] text-white/20">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-5 text-base font-extrabold tracking-tight text-white">
                        {cap.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                        {cap.text}
                      </p>
                      <ArrowRight
                        className="mt-4 h-4 w-4 -translate-x-2 text-[#FF6B1A] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerGroup>
        </div>
      </div>

      {/* Motion safety: static layout, no animation dependence */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #why-arrowline * { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
