import { useState } from "react";
import SEOMeta from "../components/SEOMeta";
import Reveal from "../components/Reveal";
import { 
  ArrowRight, 
  Check, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ChevronDown,
  Phone
} from "lucide-react";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { buildTel } from "../utils/contactLinks";

interface RoadTransportationProps {
  onOpenQuote: () => void;
  onNavigateTo: (pageId: string) => void;
}

export default function RoadTransportation({ onOpenQuote, onNavigateTo }: RoadTransportationProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const capabilityBadges = [
    "PAN-INDIA COVERAGE",
    "PORT CONNECTIVITY",
    "FTL & LTL TRANSPORTATION",
    "ODC & HEAVY HAULAGE"
  ];

  const freightCards = [
    {
      title: "Full & Part Truckload",
      desc: "Flexible capacity for different cargo sizes, from single pallets to full trailers.",
      icon: <Truck className="h-6 w-6" />
    },
    {
      title: "Pan-India Reach",
      desc: "Deeply connected to major cities and industrial hubs across all Indian states.",
      icon: <MapPin className="h-6 w-6" />
    },
    {
      title: "Timely Dispatch",
      desc: "Rigorous scheduling and on-time movement to keep your supply chain fluid.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Secure Cargo Handling",
      desc: "Professional handling and full responsibility for high-value industrial cargo.",
      icon: <ShieldCheck className="h-6 w-6" />
    }
  ];

  const serviceCards = [
    { title: "Container Transportation", slug: "container-transportation", icon: "📦" },
    { title: "FTL & LTL Transportation", slug: "ftl-ltl-transportation", icon: "🚛" },
    { title: "ODC & Heavy Haulage", slug: "odc-heavy-haulage", icon: "🏗️" },
    { title: "Project Cargo Transportation", slug: "project-cargo", icon: "🚢" },
    { title: "Trailer & Multi-Axle Transportation", slug: "trailer-transportation", icon: "🚚" },
    { title: "Machinery & Industrial Cargo", slug: "machinery-transportation", icon: "⚙️" },
  ];

  const whyArrowline = [
    { title: "01 Route Planning", desc: "Optimized transit paths to reduce lead time and cost." },
    { title: "02 Right Vehicle Selection", desc: "Matching cargo dimensions to the ideal trailer type." },
    { title: "03 Port & Industrial Connectivity", desc: "Direct links from Mundra Port to factory gates." },
    { title: "04 Coordinated Execution", desc: "Real-time tracking and precise delivery windows." },
    { title: "05 Pan-India Transportation", desc: "Seamless movement across diverse terrains and states." },
  ];

  const processSteps = [
    { step: "01", title: "Cargo Requirement", desc: "Define cargo dimensions, weight, and destination." },
    { step: "02", title: "Route & Vehicle Planning", desc: "Selecting optimal paths and appropriate fleet." },
    { step: "03", title: "Quote & Confirmation", desc: "Transparent pricing and service agreement." },
    { step: "04", title: "Vehicle Deployment", desc: "Dispatching vetted drivers and secure trailers." },
    { step: "05", title: "Cargo Movement", desc: "Safe transit with continuous milestone updates." },
    { step: "06", title: "Delivery & Completion", desc: "Safe unloading and digital proof of delivery." },
  ];

  const transportItems = [
    "Containers", "Industrial Machinery", "Engineering Equipment", 
    "Project Cargo", "ODC Cargo", "Heavy Cargo", "Manufacturing Materials", "Commercial Freight"
  ];

  const faqs = [
    { q: "What is the difference between FTL and LTL?", a: "FTL (Full Truckload) means your cargo occupies the entire trailer. LTL (Less than Truckload) allows you to pay only for the space you use, sharing the trailer with other shippers." },
    { q: "Do you handle ODC (Over Dimensional Cargo)?", a: "Yes, we specialize in ODC and Heavy Haulage, providing multi-axle trailers and necessary permits for oversized industrial machinery." },
    { q: "How do you ensure cargo safety?", a: "We use professional lashing, secure strapping, and vetted drivers. All movements are tracked and coordinated by our central operations desk." },
  ];

  return (
    <div className="w-full overflow-hidden bg-[#F5F8FA]">
      <SEOMeta 
        title="Road Transportation Services India | Pan-India Freight | Arrowline Logistics" 
        description="Premium road transportation services across India. Specializing in FTL, LTL, ODC, and Project Cargo from Mundra Port to any destination."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#062B3A] text-white">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/road-transport-hero.jpg" 
            alt="Premium Logistics Truck" 
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-[#062B3A]/60 to-transparent" />
          <div className="absolute inset-0 bg-grid-dark opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <Reveal>
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-6">
                {capabilityBadges.map((badge) => (
                  <span key={badge} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black tracking-widest text-[#FF9A5B] uppercase backdrop-blur">
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                Reliable Road Transportation <br /> 
                <span className="text-[#FF7A00]">Services Across India</span>
              </h1>
              <p className="text-lg sm:text-lg lg:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
                Arrowline provides a high-performance road freight network anchored at Mundra Port, 
                connecting industrial hubs, factories, and cities with precision, safety, and scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onOpenQuote} className="px-8 py-4 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2">
                  Get a Free Transport Quote <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => onNavigateTo("contact")} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur transition-all cursor-pointer">
                  Talk to Our Logistics Team
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 1: Freight Requirements */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">Our Capabilities</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">Road Freight Built Around <br /> Your Delivery Requirements</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {freightCards.map((card, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group p-8 rounded-3xl border border-slate-100 bg-[#F8FAFC] transition-all hover:bg-white hover:shadow-2xl hover:border-[#FF6B1A]/30">
                  <div className="mb-5 inline-flex p-3 rounded-2xl bg-white text-[#062B3A] shadow-sm group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#062B3A] mb-3">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Two Column Content */}
      <section className="py-20 sm:py-28 bg-[#F5F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <Reveal direction="left">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-square lg:aspect-video">
                <img src="/images/road-transport-detail.jpg" alt="Road Transport" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/40 to-transparent" />
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">End-to-End Movement</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] leading-tight">Moving Cargo. Connecting Businesses. <br /> Delivering With Confidence.</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "FTL (Full Truckload)", "LTL (Less than Truckload)", 
                    "ODC (Over Dimensional Cargo)", "Heavy Haulage", 
                    "Machinery transportation", "Project cargo", 
                    "Container transportation", "Industrial cargo"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <Check className="h-4 w-4 text-[#FF6B1A]" />
                      <span className="text-sm font-bold text-[#062B3A]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3: Service Cards */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">Specialized Services</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">Our Road Transportation Services</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service, i) => (
              <Reveal key={service.slug} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:shadow-2xl hover:border-[#FF6B1A]/50">
                  <div className="p-8">
                    <div className="text-4xl mb-6">{service.icon}</div>
                    <h3 className="text-xl font-bold text-[#062B3A] mb-3">{service.title}</h3>
                    <p className="text-sm text-slate-600 mb-6">Professional transportation solutions tailored for {service.title.toLowerCase()} requirements across India.</p>
                    <button 
                      onClick={() => onNavigateTo(`services/${service.slug}`)}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF6B1A] group-hover:text-[#062B3A] transition-colors"
                    >
                      Explore Service <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Why Arrowline */}
      <section className="py-20 sm:py-28 bg-[#062B3A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF9A5B] mb-3">The Arrowline Edge</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why Choose Arrowline for Road Freight?</h2>
            </div>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {whyArrowline.map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <h3 className="text-lg font-black text-[#FF9A5B] mb-3">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Process */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">Seamless Workflow</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">How Our Road Transportation Process Works</h2>
            </div>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-6">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-center group hover:bg-white hover:shadow-xl transition-all">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FF6B1A] text-white text-xs font-black flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="mt-4 font-bold text-[#062B3A] text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: What We Transport */}
      <section className="py-20 sm:py-28 bg-[#F5F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">Expertise</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">What We Transport</h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {transportItems.map((item, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all">
                  <img 
                    src={`/images/transport/${item.toLowerCase().replace(/ /g, '-')}.jpg`} 
                    alt={item} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    onError={(e) => { e.currentTarget.src = '/images/road-transport-detail.jpg' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">{item}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Industries */}
      <section className="py-20 sm:py-28 bg-[#F5F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">Specialized Sectors</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">Industries We Serve</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["Manufacturing", "Engineering & Infrastructure", "Automotive", "FMCG & Retail", "Chemicals & Petrochemicals", "Ports & Logistics"].map((ind, i) => (
              <Reveal key={ind} delay={i * 100}>
                <div 
                  onClick={() => onNavigateTo(`industries`)}
                  className="group p-8 rounded-3xl border border-slate-200 bg-white transition-all hover:shadow-xl hover:border-[#FF6B1A]/50 cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors">{ind}</h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">Customized road freight solutions designed for the specific compliance and handling needs of the {ind} sector.</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF6B1A]">
                    Explore Industry <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">Support</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">Frequently Asked Questions</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span className="text-sm font-bold text-[#062B3A]">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-[#FF6B1A] transition-transform ${activeFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 bg-[#062B3A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-[#FF6B1A]/20 blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF9A5B] mb-4">Route Planning</p>
            <h2 className="text-4xl sm:text-6xl font-black leading-tight mb-8">Have Cargo to Move? <br /> Let's Plan the Right Route.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onOpenQuote} className="px-8 py-4 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2">
                Get a Transport Quote <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href={buildTel(COMPANY_DETAILS.phone)} 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" /> Speak With Our Logistics Team
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
