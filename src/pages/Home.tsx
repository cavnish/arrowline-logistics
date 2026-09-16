import SEOMeta from "../components/SEOMeta";
import HeroSection from "../components/HeroSection";
import TrustStrip from "../components/TrustStrip";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import ProcessSection from "../components/ProcessSection";
import IndustriesPreviewBar from "../components/IndustriesPreviewBar";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import TrackTraceBar from "../components/TrackTraceBar";
import ArrowlineLogo from "../components/ArrowlineLogo";
import Reveal from "../components/Reveal";
import { Sparkles } from "lucide-react";

interface HomeProps {
  onOpenQuote: () => void;
  onSelectService: (slug: string) => void;
  onNavigateTo: (pageId: string) => void;
  onFormSuccess: (data: any) => void;
}

export default function Home({
  onOpenQuote,
  onSelectService,
  onNavigateTo,
}: HomeProps) {
  return (
    <div className="w-full overflow-hidden bg-[#F5F8FA]">
      <SEOMeta
        title="Arrowline Logistics | Logistics Company in India | Transportation Services"
        description="Arrowline Logistics is a premier logistics and transportation company in India providing road transportation (FTL/PTL), multimodal logistics, container transport, rail freight and custom clearance centered at Mundra Port, Gujarat."
        keywords="Logistics Company in India, Logistics Services in India, Transportation Services in India, Freight Transportation Services, Road Transportation Services India, FTL Transportation, PTL Transportation, Multimodal Logistics India, Container Transportation India, Project Cargo India, Supply Chain Logistics India"
      />

      {/* 1. Hero */}
      <HeroSection
        onOpenQuote={onOpenQuote}
        onExploreServices={() => {
          const el = document.getElementById("services-section");

          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
            });
          }
        }}
      />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. About */}
      <AboutSection
        onNavigateToAbout={() => onNavigateTo("about")}
      />

      {/* 4. Services */}
      <ServicesSection
        onSelectService={onSelectService}
      />

      {/* 5. Why Choose Arrowline */}
      <WhyChooseUsSection />

      {/* 6. Process */}
      <ProcessSection />

      {/* 7. Industries */}
      <IndustriesPreviewBar
        onNavigateToIndustries={() =>
          onNavigateTo("industries")
        }
      />

      {/* 8. Testimonials */}
      <TestimonialsSection />

      {/* 10. FAQ */}
      <FAQSection />

      {/* 11. Track & Trace */}
      <TrackTraceBar />

      {/* 12. Final CTA */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#03212D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal duration={600}>
          <div className="relative bg-gradient-to-r from-[#062B3A] via-[#0C4A60] to-[#062B3A] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 lg:p-14 border border-white/15">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,26,0.3),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Content */}
              <div className="lg:col-span-8 space-y-4">

                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] sm:text-[10px] font-black text-[#FF7A00] tracking-widest uppercase backdrop-blur">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>READY TO MOVE YOUR FREIGHT?</span>
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  Let our multimodal fleet drive your{" "}
                  <br className="hidden sm:block" />

                  <span className="text-[#FF7A00]">
                    supply chain forward across India.
                  </span>
                </h2>

                <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                  Get customized tariffs from Mundra Port to any destination
                  across India. Our logistics coordinators respond within
                  2 hours.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">

                  <button
                    onClick={onOpenQuote}
                    className="px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    REQUEST FREE QUOTE →
                  </button>

                  <button
                    onClick={() => onNavigateTo("contact")}
                    className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur transition-all cursor-pointer"
                  >
                    CONTACT CLEARANCE DESK
                  </button>

                </div>
              </div>

              {/* Logo */}
              <div className="hidden lg:flex lg:col-span-4 items-center justify-center">

                <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-white/20">
                  <ArrowlineLogo
                    size="lg"
                    showTagline
                  />
                </div>

              </div>

            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}