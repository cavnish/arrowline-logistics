import { MapPin, ArrowRight, ShieldCheck, Truck, Anchor } from "lucide-react";
import Reveal from "../Reveal";

interface RouteCorridor {
  origin: string;
  destination: string;
  stateOrRegion: string;
  transitMode: string;
  transitHighlights: string;
  cargoTypes: string;
  popularServices: Array<{ label: string; url: string }>;
}

interface ServiceCorridorsProps {
  currentServiceSlug?: string;
  onNavigateToService?: (serviceSlug: string, subSlug?: string) => void;
}

const PRIMARY_CORRIDORS: RouteCorridor[] = [
  {
    origin: "Mundra Port, Gujarat",
    destination: "Delhi / Delhi-NCR",
    stateOrRegion: "Northern Capital Region (Haryana / UP / Delhi)",
    transitMode: "Highway NH-48 & WDFC Dedicated Rail",
    transitHighlights: "High-speed Western Dedicated Freight Corridor rail rakes and express highway trucking directly to Tughlakabad, Dadri, and Khatuwas ICD dry ports.",
    cargoTypes: "20ft/40ft ISO containers, FMCG, electronics, capital machinery, industrial raw materials",
    popularServices: [
      { label: "Container Transport", url: "/services/road-transportation/container-transportation" },
      { label: "Container Rail Freight", url: "/services/rail-transportation/container-rail-transportation" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Jaipur & Rajasthan",
    stateOrRegion: "Rajasthan Industrial & Solar Belts",
    transitMode: "NH-48 Corridor & Multimodal Rail",
    transitHighlights: "Direct corridor linking Mundra maritime terminals to Jaipur, Jodhpur, and Udaipur industrial zones, solar parks, and inland dry ports.",
    cargoTypes: "Solar modules & transformers, marble/stone machinery, textiles, minerals, containerized import inputs",
    popularServices: [
      { label: "Container Haulage", url: "/services/road-transportation/container-transportation" },
      { label: "Project Cargo", url: "/services/project-cargo-transportation" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Ahmedabad & Gujarat",
    stateOrRegion: "Gujarat Manufacturing Corridor (Sanand, Changodar, Vadodara)",
    transitMode: "State Express Highway & Dedicated Shuttles",
    transitHighlights: "High-frequency local port shuttles and scheduled FTL trailers connecting Mundra Port directly to GIDC industrial manufacturing clusters.",
    cargoTypes: "Chemical drums, automotive assemblies, polymer granules, engineering components, heavy steel",
    popularServices: [
      { label: "FTL Road Freight", url: "/services/road-transportation/ftl-ltl-transportation" },
      { label: "Warehousing near Mundra", url: "/services/warehousing-storage" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Mumbai & Pune",
    stateOrRegion: "Maharashtra Industrial & Automotive Belts",
    transitMode: "National Expressways & Coastal Maritime Loops",
    transitHighlights: "Dedicated commercial trucking and multi-axle freight connecting Mundra Port to JNPT trade gateway, Bhiwandi warehousing, and Chakan auto hubs.",
    cargoTypes: "Automotive components, industrial machinery, export-sealed containers, retail inventories",
    popularServices: [
      { label: "Container Transport", url: "/services/road-transportation/container-transportation" },
      { label: "ODC Heavy Haulage", url: "/services/road-transportation/odc-heavy-haulage" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Indore & Bhopal",
    stateOrRegion: "Madhya Pradesh & Central India",
    transitMode: "National Highway Trunk Corridors",
    transitHighlights: "Central India distribution corridor connecting western seaport imports directly with Pithampur automotive and Mandideep industrial zones.",
    cargoTypes: "Pharmaceutical active ingredients, heavy foundry equipment, agri-machinery, solar inverters",
    popularServices: [
      { label: "FTL Transportation", url: "/services/road-transportation/ftl-ltl-transportation" },
      { label: "Machinery Transport", url: "/services/road-transportation/machinery-industrial-cargo-transportation" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Bengaluru & Karnataka",
    stateOrRegion: "Southern High-Tech & Industrial Belt",
    transitMode: "Golden Quadrilateral Highways & Multimodal Rail",
    transitHighlights: "Reliable long-haul linehaul connecting Mundra maritime terminals to Peenya, Hosur, and Greater Bengaluru electronics and engineering clusters.",
    cargoTypes: "High-tech equipment, precision CNC machinery, telecommunication infrastructure, automotive spares",
    popularServices: [
      { label: "Multi-Axle Trailers", url: "/services/road-transportation/trailer-multi-axle-transportation" },
      { label: "Project Cargo", url: "/services/project-cargo-transportation" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Hyderabad & Telangana",
    stateOrRegion: "South-Central Pharma & Solar Hubs",
    transitMode: "National Highway Intersect Corridors",
    transitHighlights: "High-security road freight and specialized trailer convoys delivering from Mundra Port to Hyderabad pharmaceutical clusters and renewable parks.",
    cargoTypes: "Specialty chemicals, solar EPC structures, power transformers, heavy industrial spares",
    popularServices: [
      { label: "Container Transport", url: "/services/road-transportation/container-transportation" },
      { label: "ODC Heavy Haulage", url: "/services/road-transportation/odc-heavy-haulage" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Chennai & Tamil Nadu",
    stateOrRegion: "Tamil Nadu Automotive & Port Gateway",
    transitMode: "Multimodal Coastal Loops & Interstate Highways",
    transitHighlights: "Integrated coastal shipping loops and heavy road transport connecting western Mundra terminals with Sriperumbudur and Oragadam auto corridors.",
    cargoTypes: "Heavy industrial boilers, power equipment, bulk gypsum, automotive stampings, export containers",
    popularServices: [
      { label: "Heavy ODC Cargo", url: "/services/project-cargo-transportation/heavy-odc-cargo" },
      { label: "Road Transportation", url: "/services/road-transportation" },
    ],
  },
  {
    origin: "Mundra Port, Gujarat",
    destination: "Kolkata & Eastern India",
    stateOrRegion: "West Bengal & Eastern Industrial Gateway",
    transitMode: "National Rail Corridors & Interstate Highway Freight",
    transitHighlights: "Long-haul rail freight rakes and heavy road flatbed movements moving heavy engineering and metallurgical freight across to Eastern trade gateways.",
    cargoTypes: "Mining machinery, structural steel plates, industrial process equipment, heavy project cargo",
    popularServices: [
      { label: "Rail Freight Transportation", url: "/services/rail-transportation/rail-freight-transportation" },
      { label: "Breakbulk Cargo", url: "/services/project-cargo-transportation/breakbulk-cargo" },
    ],
  },
];

const INTERSTATE_CORRIDORS = [
  {
    title: "Gujarat → Rajasthan Transportation",
    description: "High-frequency containerized and bulk freight linking Mundra, Kandla, and Ahmedabad with Jaipur, Jodhpur, Kota, and Bhiwadi industrial hubs.",
  },
  {
    title: "Gujarat → Delhi-NCR Transportation",
    description: "Dedicated Western Corridor road linehaul and WDFC double-stack rail freight delivering within 24 to 36 hours from port gate to dry port ICDs.",
  },
  {
    title: "Gujarat → Maharashtra Transportation",
    description: "Continuous commercial transport connecting Gujarat ports and chemical belts to Mumbai, Navi Mumbai (JNPT), Thane, Pune, and Nashik.",
  },
  {
    title: "Mundra Port → Pan-India Coverage",
    description: "Full-fleet reach servicing 500+ destination cities across 28 states and Union Territories with verified drivers, GPS telemetry, and e-POD confirmation.",
  },
];

export default function ServiceCorridors({
  onNavigateToService,
}: ServiceCorridorsProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigateToService) {
      e.preventDefault();
      const parts = path.replace(/^\/services\/?/, "").split("/").filter(Boolean);
      if (parts.length === 2) {
        onNavigateToService(parts[0], parts[1]);
      } else if (parts.length === 1) {
        onNavigateToService(parts[0]);
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#EAF3F6] border border-[#062B3A]/20 rounded-full text-xs font-bold text-[#062B3A] tracking-wider uppercase mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>PRIMARY PORT-TO-DESTINATION &amp; PAN-INDIA CORRIDORS</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              High-Frequency Routes From <span className="text-[#FF6B1A]">Mundra Port</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Operating directly at India&apos;s largest commercial maritime gateway, Arrowline Logistics provides verified highway linehaul, dedicated 20ft/40ft container chassis, rail rakes, and heavy-haul trailers connecting Mundra Port to key industrial destinations across India.
            </p>
          </Reveal>
        </div>

        {/* Primary Corridors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PRIMARY_CORRIDORS.map((corridor, idx) => (
            <Reveal key={corridor.destination} delay={idx * 60}>
              <div className="bg-[#F5F8FA] border border-slate-200 hover:border-[#FF6B1A]/40 rounded-2xl p-5 sm:p-6 space-y-4 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between group">
                <div className="space-y-3">
                  {/* Origin to Destination */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#062B3A]">
                      <Anchor className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <span>{corridor.origin}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#FF6B1A]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <span>{corridor.destination}</span>
                    </div>
                  </div>

                  {/* Region & Mode */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {corridor.stateOrRegion}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#062B3A] mt-0.5">
                      <Truck className="w-3 h-3 text-[#FF6B1A]" />
                      <span>{corridor.transitMode}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {corridor.transitHighlights}
                  </p>

                  {/* Cargo Types */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Typical Cargo Profiles:
                    </span>
                    <span className="text-[11px] text-slate-700 font-medium line-clamp-2">
                      {corridor.cargoTypes}
                    </span>
                  </div>
                </div>

                {/* Popular Services Links */}
                <div className="pt-3 border-t border-slate-200/70 flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Solutions:
                  </span>
                  {corridor.popularServices.map((service) => (
                    <a
                      key={service.label}
                      href={service.url}
                      onClick={(e) => handleLinkClick(e, service.url)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#062B3A] hover:text-[#FF6B1A] bg-white px-2 py-1 rounded-md border border-slate-200 hover:border-[#FF6B1A]/40 transition-colors cursor-pointer"
                    >
                      <span>{service.label}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-[#FF6B1A]" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Interstate Corridors Strip */}
        <Reveal delay={200}>
          <div className="bg-[#062B3A] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-[#FF6B1A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block mb-1">
                    Pan-India Highway &amp; Freight Corridors
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Inter-State Transportation &amp; High-Velocity Freight Lines
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>24/7 GPS Tracking &amp; Port Desk</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {INTERSTATE_CORRIDORS.map((item) => (
                  <div key={item.title} className="space-y-1.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-[#FF7A00]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
