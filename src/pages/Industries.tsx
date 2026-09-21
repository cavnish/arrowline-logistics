import { useState } from "react";
import SEOMeta from "../components/SEOMeta";
import ContactForm from "../components/ContactForm";
import Reveal from "../components/Reveal";
import { INDUSTRIES_SERVED, COMPANY_DETAILS } from "../data/logisticsData";
import {
  Car, ShoppingBag, Cog, ShieldAlert, FlaskConical, HardHat, Sun, Layers,
  CheckCircle2, ArrowRight, ShieldCheck, Phone
} from "lucide-react";
import { buildTel } from "../utils/contactLinks";

interface IndustriesProps {
  onOpenQuote: () => void;
  onFormSuccess: (data: any) => void;
}

export default function Industries({ onOpenQuote, onFormSuccess }: IndustriesProps) {
  const [selectedIndustryId, setSelectedIndustryId] = useState(INDUSTRIES_SERVED[0].id);
  const activeIndustry = INDUSTRIES_SERVED.find(i => i.id === selectedIndustryId) || INDUSTRIES_SERVED[0];

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case "Car": return <Car className="w-5 h-5 text-[#FF6B1A]" />;
      case "ShoppingBag": return <ShoppingBag className="w-5 h-5 text-[#FF6B1A]" />;
      case "Cog": return <Cog className="w-5 h-5 text-[#FF6B1A]" />;
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-[#FF6B1A]" />;
      case "FlaskConical": return <FlaskConical className="w-5 h-5 text-[#FF6B1A]" />;
      case "HardHat": return <HardHat className="w-5 h-5 text-[#FF6B1A]" />;
      case "Sun": return <Sun className="w-5 h-5 text-[#FF6B1A]" />;
      case "Layers": return <Layers className="w-5 h-5 text-[#FF6B1A]" />;
      default: return <Cog className="w-5 h-5 text-[#FF6B1A]" />;
    }
  };

  const industryDetailsMap: Record<string, {
    overview: string;
    challenges: string[];
    solutions: string[];
    recommendedServices: string[];
  }> = {
    "automotive": {
      overview: "Our automotive logistics operations deliver high-precision Just-In-Time (JIT) linehaul for Tier-1/Tier-2 automotive component makers and OEM assembly plants across Gujarat, Maharashtra, Haryana, and Tamil Nadu.",
      challenges: ["Zero-buffer production line schedules requiring pinpoint transit accuracy", "Delicate finished parts susceptible to transit vibration damage", "Multi-tier supplier coordination across disparate industrial states"],
      solutions: ["Dedicated GPS-tracked closed container trailers with air-suspension options", "Scheduled daily express shuttle corridors connecting manufacturing clusters", "Electronic trip manifests and automated gate-arrival notifications"],
      recommendedServices: ["Road Transportation (FTL)", "Rail & Multimodal Logistics", "Customs Clearance"]
    },
    "fmcg-retail": {
      overview: "High-velocity primary and secondary distribution logistics connecting manufacturing hubs with regional distribution centers (RDC) and retail fulfillment warehouses nationwide.",
      challenges: ["High volume freight seasonal peaks and sudden demand surges", "Multi-drop regional deliveries with strict dock appointment windows", "Packaging protection against moisture and rough handling"],
      solutions: ["Scalable FTL container fleet operating 24/7 with immediate dispatch capability", "Synchronized port-to-warehouse loops reducing intermediate handling", "Full transit insurance coverage and certified loading security"],
      recommendedServices: ["Road Transportation (FTL)", "Shipping & Coastal Services", "Rail Freight"]
    },
    "manufacturing-engineering": {
      overview: "End-to-end transportation of industrial equipment, raw steel coils, structural assemblies, precision machinery, and foundry castings from port gates and plants to industrial project sites.",
      challenges: ["High-tonnage heavy cargo exceeding standard highway limits", "Specialized mechanical lashing requirements for asymmetrical equipment", "Interstate permits and statutory highway safety compliances"],
      solutions: ["Multi-axle modular hydraulic trailers and heavy-duty flatbed pullers", "Physical route feasibility surveys mapping bridge ratings and overhead clearances", "Single-point project coordinator managing permits and utility escorts"],
      recommendedServices: ["Project Logistics & ODC", "Road Transportation (FTL)", "Rail Multimodal"]
    },
    "pharmaceutical": {
      overview: "Time-critical and compliant transportation for Active Pharmaceutical Ingredients (APIs), medical products, and laboratory equipment adhering to strict QA criteria.",
      challenges: ["Temperature-sensitive chemical stability requiring uninterrupted transit", "Stringent documentation audits and tamper-evident custody verification", "Tight dispatch windows connecting Gujarat pharma belts with international airports"],
      solutions: ["GPS-monitored sealed container trucks with real-time temperature telemetry", "Priority airport cargo terminal dispatches with 12 to 24-hour turnaround", "Dedicated customs brokerage team handling ICEGATE duty filings"],
      recommendedServices: ["Express Air Cargo", "Road Transportation (FTL)", "Customs Clearance"]
    },
    "chemical": {
      overview: "Compliant containerized logistics for industrial polymers, specialty chemicals, liquid ISO tanks, and raw resins imported through Mundra and Kandla ports.",
      challenges: ["Strict regulatory compliance with hazardous materials guidelines", "Accurate tariff classifications on ICEGATE preventing custom holds", "Specialized chassis handling for liquid tank containers"],
      solutions: ["Certified drivers trained in industrial chemical transport safety", "Pre-verified customs documentation minimizing port demurrage", "Dedicated container flatbeds with certified twist-locks and lashings"],
      recommendedServices: ["Customs Clearance", "Shipping & Coastal Services", "Road Transportation"]
    },
    "infrastructure-steel": {
      overview: "High-tonnage movement of steel coils, TMT rebars, structural girders, pipes, cement, and heavy construction equipment across national infrastructure corridors.",
      challenges: ["Severe highway toll and fuel price volatility over long distances", "Heavy point-loading risks on standard trailers", "Remote project site access with unpaved last-mile approaches"],
      solutions: ["Cost-optimized multimodal combinations utilizing coastal shipping & rail", "Heavy-duty 40ft high-cube flatbeds with reinforced bolster beams", "Synchronized local tractor units for tricky destination delivery"],
      recommendedServices: ["Shipping & Coastal Services", "Rail & Multimodal Logistics", "Project Logistics"]
    },
    "solar-energy": {
      overview: "Specialized logistics and rapid port clearance for solar PV modules, central inverters, mounting structures, and high-voltage power transformers.",
      challenges: ["High-volume vessel shipments (100-300 TEUs) requiring rapid clearance to avoid detention", "Fragile glass PV panels prone to micro-cracking if handled roughly", "Remote solar park sites in Rajasthan, Gujarat, and Southern India"],
      solutions: ["Direct vessel-to-rail loading at Mundra port with dedicated container rakes", "Shock-absorbing container transport with certified lashing inspections", "On-site crane offloading and temporary laydown yard management"],
      recommendedServices: ["Rail & Multimodal Logistics", "Project Logistics & ODC", "Customs Clearance"]
    },
    "ecommerce-electronics": {
      overview: "High-speed linehaul transportation between maritime trade gateways, assembly hubs, and major metro fulfillment centers across India.",
      challenges: ["Time-definite delivery SLAs with severe financial penalties for delays", "High-value cargo security requiring strict seal verification", "Cross-dock coordination during festive peak shopping seasons"],
      solutions: ["GPS-tracked sealed container fleets with continuous control room tracking", "Multi-driver relay systems ensuring non-stop highway movement", "Direct integration with regional express hub networks"],
      recommendedServices: ["Road Transportation (FTL)", "Express Air Cargo", "Rail Freight"]
    }
  };

  const currentDetails = industryDetailsMap[selectedIndustryId] || industryDetailsMap["automotive"];

  return (
    <div className="w-full bg-[#F5F8FA] min-h-screen">
      <SEOMeta
        title="Industries We Serve | Specialized Cargo Logistics from Mundra Port & Pan-India | Arrowline"
        description="Tailored multimodal logistics and industrial material transportation from Mundra Port for Automotive, Solar & Clean Energy, Steel, Chemicals, and Manufacturing across India."
        keywords="FMCG logistics India, Automotive logistics India, Manufacturing logistics India, Solar equipment logistics Mundra, Steel transport India, Material transportation India, Pan-India industrial transport"
        canonicalUrl="https://arrowlinelogistics.in/industries"
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-16 lg:pt-14 lg:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        <Reveal className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#EAF3F6] border border-[#062B3A]/20 rounded-full text-xs font-bold text-[#062B3A] tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF6B1A] animate-pulse" />
            <span>INDUSTRY-SPECIFIC LOGISTICS SOLUTIONS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#062B3A] tracking-tight leading-[1.1]">
            Specialized Supply Chain & <br />
            <span className="text-[#FF6B1A]">Industrial Material Transportation Across India</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Every industry has distinct regulatory requirements, handling protocols, and transit timelines. Arrowline Logistics configures dedicated road fleets, coastal shipping loops, CONCOR rail rakes, and port-gate customs clearance tailored to your sector's demands. From heavy steel coils and industrial machinery to solar modules and chemical consignments, we move industrial materials safely across India.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onOpenQuote}
              className="px-7 py-3.5 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              REQUEST INDUSTRY TARIFF QUOTE
            </button>
            <a
              href={buildTel(COMPANY_DETAILS.phone)}
              className="px-6 py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 text-[#FF6B1A]" />
              <span>Talk to Sector Specialist</span>
            </a>
          </div>
        </Reveal>
      </div>
      </section>

      {/* Main Interactive Industry Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Industry Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2.5 no-scrollbar mb-10">
          {INDUSTRIES_SERVED.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustryId(ind.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all flex-shrink-0 cursor-pointer border ${selectedIndustryId === ind.id
                  ? "bg-[#062B3A] text-white border-[#062B3A] shadow-md scale-[1.02]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#FF6B1A]/50 hover:bg-white"
                }`}
            >
              <div className={`p-1.5 rounded-lg ${selectedIndustryId === ind.id ? "bg-white/10" : "bg-[#F5F8FA]"}`}>
                {getIndustryIcon(ind.icon)}
              </div>
              <span>{ind.title.split(" &")[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Industry Deep-Dive Card */}
        <Reveal duration={500}>
        <div key={selectedIndustryId} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-in fade-in duration-300">

          {/* Left Column: Image & Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-slate-900 border border-slate-200">
              <img
                src={activeIndustry.image}
                alt={activeIndustry.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-[#062B3A]/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00] block">
                  Dedicated Fleet Allocation
                </span>
                <h3 className="text-xl font-bold">{activeIndustry.title}</h3>
              </div>
            </div>

            <div className="p-5 bg-[#F5F8FA] rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-[#062B3A] tracking-wider block">
                Typical Cargo & Materials Handled:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeIndustry.cargoTypes.map((cargo, i) => (
                  <span key={i} className="text-xs bg-white text-[#062B3A] border border-slate-200 font-semibold px-2.5 py-1 rounded-lg">
                    {cargo}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#EAF3F6] rounded-2xl border border-[#062B3A]/10 space-y-1 text-xs">
              <span className="font-bold text-[#062B3A] block">Recommended Logistics Modes:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentDetails.recommendedServices.map((srv, idx) => (
                  <span key={idx} className="bg-white text-[#062B3A] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-[#FF6B1A]" />
                    <span>{srv}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Challenges & Tailored Solutions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#062B3A]">
                {activeIndustry.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentDetails.overview}
              </p>
            </div>

            {/* Challenges */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Key Supply Chain & Transportation Challenges:
              </h3>
              <div className="space-y-2.5">
                {currentDetails.challenges.map((chal, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      !
                    </span>
                    <span>{chal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrowline Solutions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase text-[#FF6B1A] tracking-wider">
                The Arrowline Engineering Solution:
              </h3>
              <div className="space-y-2.5">
                {currentDetails.solutions.map((sol, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{sol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenQuote}
                className="px-6 py-3.5 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>BOOK FREIGHT FOR {activeIndustry.title.split(" ")[0].toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        </Reveal>
      </section>

      {/* Quote Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] rounded-full text-xs font-bold text-[#062B3A]">
                <ShieldCheck className="w-4 h-4 text-[#FF6B1A]" />
                <span>DIRECT COMMERCIAL CONSULTATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#062B3A] leading-tight">
                Get a Customized Freight Rate Sheet for Your Industry
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Send your material weight, monthly tonnage, pickup locations, and destination hubs. Our planners formulate an optimized multi-modal tariff schedule.
              </p>
              <div className="p-4 bg-[#F5F8FA] rounded-xl border border-slate-200 space-y-1 text-xs text-slate-600">
                <span className="font-bold text-[#062B3A] block">2-Hour SLA Response:</span>
                <p>Mundra Port clearance rates, national highway FTL pricing, and CONCOR rail bookings.</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm onSuccess={onFormSuccess} />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
