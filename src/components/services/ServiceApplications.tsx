import { useState } from "react";
import { ApplicationItem } from "../../data/servicesData";
import Reveal from "../Reveal";
import SmartImage from "../ui/SmartImage";
import { Package } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageUrl";
import { cn } from "../../utils/cn";

interface ServiceApplicationsProps {
  serviceName: string;
  applications: ApplicationItem[];
  heading?: string;
  description?: string;
}

const DURATION_SECONDS = 45;

function CargoCard({ app }: { app: ApplicationItem }) {
  return (
    <article className="group relative w-[290px] sm:w-[330px] lg:w-[360px] shrink-0 h-full rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <SmartImage
          src={getOptimizedImageUrl(app.image, { width: 720 })}
          alt={app.title}
          fallback="https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-center bg-white">
        <h3 className="text-base sm:text-lg font-bold text-[#062B3A] mb-1.5 group-hover:text-[#FF6B1A] transition-colors leading-snug">
          {app.title}
        </h3>
        <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">
          {app.desc}
        </p>
      </div>
    </article>
  );
}

export default function ServiceApplications({ serviceName, applications, heading, description }: ServiceApplicationsProps) {
  const [paused, setPaused] = useState(false);

  if (!applications || applications.length === 0) return null;

  // Two identical halves make the -50% translateX loop seamless.
  const doubled = [...applications, ...applications];

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <Package className="w-3.5 h-3.5" />
              <span>CARGO &amp; APPLICATIONS</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              {heading || "What We Transport & Handle"}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {description || `Specialized handling protocols configured specifically for ${serviceName.toLowerCase()} cargo profiles.`}
            </p>
          </Reveal>
        </div>
      </div>

      {/* One-row seamless marquee: RIGHT → LEFT */}
      <div
        className="cargo-marquee relative mx-auto max-w-[100vw] overflow-hidden py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-[#F5F8FA] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-[#F5F8FA] to-transparent" />

        <div
          className={cn(
            "cargo-marquee__track flex w-max items-stretch gap-5 sm:gap-6",
            paused && "is-paused"
          )}
          style={{ "--cargo-duration": `${DURATION_SECONDS}s` } as React.CSSProperties}
          aria-label={`${serviceName} cargo applications`}
        >
          {doubled.map((app, index) => (
            <div
              key={`${app.title}-${index}`}
              className="shrink-0"
              aria-hidden={index >= applications.length}
            >
              <CargoCard app={app} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}