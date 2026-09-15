import { ApplicationItem } from "../../data/servicesData";
import Reveal from "../Reveal";
import SmartImage from "../ui/SmartImage";
import { Package } from "lucide-react";

interface ServiceApplicationsProps {
  serviceName: string;
  applications: ApplicationItem[];
  heading?: string;
  description?: string;
}

export default function ServiceApplications({ serviceName, applications, heading, description }: ServiceApplicationsProps) {
  if (!applications || applications.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <Package className="w-3.5 h-3.5" />
              <span>CARGO & APPLICATIONS</span>
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

        {/* Cargo Image Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {applications.map((app, index) => (
            <Reveal key={index} delay={index * 60}>
              <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <SmartImage
                    src={app.image}
                    alt={app.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-[#FF9A5B] bg-[#062B3A]/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    Cargo Profile
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#062B3A] mb-1.5 group-hover:text-[#FF6B1A] transition-colors leading-snug">
                      {app.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {app.desc}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
