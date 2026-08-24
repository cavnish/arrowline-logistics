export interface ServiceDetail {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  keyCapability: string;
  features: string[];
  benefits: string[];
  seoTitle: string;
  seoDesc: string;
  slug: string;
}

export interface HubDetail {
  id: string;
  name: string;
  state: string;
  type: "Port Hub" | "Inland Depot" | "Regional Office" | "Multimodal Terminal";
  coordinates: { x: number; y: number }; // Percentage coordinate on custom India SVG map
  details: string;
  connectivity: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  service: string;
  location: string;
  clientSector: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  image: string;
  badge: string;
}

export interface TeamMember {
  name: string;
  role: string;
  location: string;
  email?: string;
  image: string;
  bio: string;
}

export interface StatItem {
  number: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
}

export interface IndustryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  cargoTypes: string[];
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  readTime: string;
  date: string;
  author: string;
  category: string;
  summary: string;
  image: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  role: string;
  location: string;
  comment: string;
  rating: number;
  serviceUsed: string;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Mundra Port" | "Road Fleet" | "Rail Freight" | "ODC Cargo" | "Customs";
  image: string;
  alt: string;
  caption: string;
}

export const COMPANY_DETAILS = {
  name: "ARROWLINE LOGISTICS",
  tagline: "Moving Cargo. Connecting India.",
  secondaryTagline: "Logistics & Transportation Services Across India",
  primaryEmail: "mundra@arrowlinelogistics.in",
  secondaryEmail: "vinay@arrowlinelogistics.in",
  phone: "+91 9021179108",
  secondaryPhone: "+91 9766262612",
  whatsapp: "+919021179108",
  headOffice: "Office 204, Portview Commercial Complex, Near Adani House, Mundra Port Road, Mundra, Kutch, Gujarat - 370421, India",
  aboutShort: "ARROWLINE LOGISTICS is a premier multimodal logistics and transportation company operating across India. Centered at Mundra Port, Gujarat—the gateway of India's maritime trade—we integrate road transportation (FTL/PTL), rail freight, coastal shipping, and customs clearance to deliver reliable, optimized, and secure door-to-door supply chain solutions.",
  aboutDetailed: "Arrowline Logistics provides end-to-end logistics, material transport, and supply chain solutions designed to move industrial goods, containers, and oversized cargo efficiently across India. Grounded at Mundra Port, Gujarat, we coordinate highway transport, CONCOR rail links, coastal shipping routes, and global freight forwarding to deliver seamless pan-India connectivity for major industries."
};

// Client / Partner logos shown in the marquee strip
export const CLIENT_LOGOS = [
  { logoType: "ADANI", name: "Mundra Port Alliance" },
  { logoType: "CONCOR", name: "Rail Freight Partner" },
  { logoType: "IATA", name: "Air Cargo Licensed" },
  { logoType: "DP WORLD", name: "Terminal Operator" },
  { logoType: "MAERSK", name: "Ocean Carrier" },
  { logoType: "MSC", name: "Global Shipping" },
  { logoType: "KRIBHCO", name: "Bulk Fertilizer" },
  { logoType: "TATA STEEL", name: "Industrial Metals" },
  { logoType: "RELIANCE", name: "Petrochemicals" },
  { logoType: "ADITYA BIRLA", name: "Manufacturing Group" },
];

// Section 13: Verified Company Statistics
export const LOGISTICS_STATS: StatItem[] = [
  {
    number: "500+",
    label: "Cities / Locations Served",
    sublabel: "Pan-India connectivity covering major industrial corridors",
    iconName: "MapPin"
  },
  {
    number: "250+",
    label: "Fleet / Operational Network",
    sublabel: "GPS-enabled FTL trailers, multi-axle pullers & container trucks",
    iconName: "Truck"
  },
  {
    number: "24/7",
    label: "Operational Support",
    sublabel: "Continuous transit monitoring and dispatch assistance",
    iconName: "Clock"
  },
  {
    number: "99.4%",
    label: "On-Time Delivery",
    sublabel: "Backed by real-time route optimization and port-gate clearance",
    iconName: "ShieldCheck"
  }
];

// Core Multimodal Services
export const CORE_SERVICES: ServiceDetail[] = [
  {
    id: "road-transport",
    slug: "road-transportation",
    title: "Road Transportation",
    category: "Highway Logistics",
    keyCapability: "Full Truck Load (FTL) & Container Movement",
    shortDesc: "Reliable road transportation solutions across India, including Full Truck Load (FTL) and Part Truck Load (PTL) services for industrial materials and high-volume cargo with real-time GPS tracking.",
    longDesc: "Arrowline Logistics provides comprehensive road transportation and freight services across India, specializing in Full Truck Load (FTL) and Part Truck Load (PTL) operations. Our GPS-enabled fleet delivers secure, door-to-door transit from ports and production centers to regional warehouses with customized routing, vetted drivers, and strict safety guidelines.",
    image: "/images/road-transport.jpg",
    features: [
      "Pan-India coverage & express freight movement across 500+ cities",
      "Full Truck Load (FTL) dedicated capacity & Part Truck Load (PTL) distribution",
      "Real-time live GPS tracking and automated trip milestone alerts",
      "Safe and secure cargo handling with modern heavy-duty lashings",
      "Dedicated 20-ft and 40-ft container flatbeds and high-cube closed container trucks"
    ],
    benefits: [
      "Dedicated capacity for large bulk or high-value shipments without co-loading risks",
      "Shorter transit times by avoiding intermediate hubs or consolidation delays",
      "End-to-end security control with vetted drivers and digital trip manifests",
      "Flexible dispatch schedules synchronized with manufacturing & warehouse operations"
    ],
    seoTitle: "Road Transportation Services in India | FTL Transport Company | Arrowline",
    seoDesc: "Reliable road transportation and FTL services across India from Arrowline Logistics. Dedicated GPS-enabled container fleet operating from Mundra Port."
  },
  {
    id: "coastal-shipping",
    slug: "coastal-shipping",
    title: "Shipping / Coastal Services",
    category: "Maritime Logistics",
    keyCapability: "Sea-Road Port Integration & Coastal Loops",
    shortDesc: "Cost-efficient coastal shipping and maritime solutions connecting Mundra Port to major coastal hubs with seamless sea-road interface.",
    longDesc: "Our coastal shipping solutions provide a sustainable, cost-efficient logistics alternative for appropriate cargo types and routes. By utilizing India’s vast coastline, we connect key western ports with southern and eastern destinations through a synchronized sea-road model that reduces long-haul highway wear and freight expenses.",
    image: "/images/hero-logistics.jpg",
    features: [
      "Cost-effective long-haul freight alternative for heavy bulk goods and steel",
      "Seamless sea-road interface minimizing multi-handling risks",
      "Multi-port coastal linkages connecting Gujarat, Maharashtra, Karnataka, Kerala, Tamil Nadu, and Andhra Pradesh",
      "Lower carbon footprint per ton-kilometer compared to pure road transit"
    ],
    benefits: [
      "Up to 30-40% freight cost savings on high-tonnage cargo",
      "Shielded from road toll spikes and heavy highway congestion",
      "Ideal for routine high-volume inventories and raw material movements",
      "Direct integration with regional first-and-last-mile trucking fleets"
    ],
    seoTitle: "Coastal Shipping Services India | Sea Road Logistics | Arrowline Logistics",
    seoDesc: "Cost-efficient coastal shipping and port logistics connecting Mundra Port to Chennai, Cochin, Tuticorin, and Mangalore with Arrowline Logistics."
  },
  {
    id: "rail-multimodal",
    slug: "rail-multimodal-logistics",
    title: "Rail & Multimodal Transportation",
    category: "Rail Freight",
    keyCapability: "CONCOR Coordination & Long-Haul Corridors",
    shortDesc: "Cost-optimized logistical pipelines combining rail, road, and coastal networks backed by robust coordination with Indian Railways and dry ports.",
    longDesc: "We provide integrated rail and multimodal logistics combining rail freight corridors, coastal links, and highway trucking to deliver cost-optimized bulk transportation. Backed by coordination with Indian Railways and private container train operators (CONCOR), our operations enable containerized cargo to travel smoothly from port terminals to inland container depots (ICDs).",
    image: "/images/rail-multimodal.jpg",
    features: [
      "Scheduled departure timetables via Western Dedicated Freight Corridors (WDFC)",
      "High cost efficiency for long-haul routes exceeding 500 kilometers",
      "Optimized for 20ft & 40ft containerized cargo and heavy palletized freight",
      "Integrated intermodal tracking from railhead to final warehouse dock"
    ],
    benefits: [
      "Direct seaport-to-dry-port rail connectivity bypassing road traffic",
      "Significantly reduced carbon emissions compared to long-distance road haulage",
      "Protected against highway blockades and adverse weather interruptions",
      "Bulk economies of scale for minerals, grains, steel, and manufactured goods"
    ],
    seoTitle: "Rail & Multimodal Logistics India | Container Rail Freight | Arrowline",
    seoDesc: "Reliable rail freight and multimodal logistics in India. Direct container rail integration from Mundra Port to Northern, Central, and Southern India."
  },
  {
    id: "project-logistics",
    slug: "project-logistics",
    title: "Project Logistics & ODC",
    category: "Heavy Cargo",
    keyCapability: "Over-Dimensional Cargo (ODC) & Route Feasibility",
    shortDesc: "End-to-end management of oversized cargo, heavy machinery, power plant components, and route engineering surveys across India.",
    longDesc: "Handling over-dimensional, oversized, or high-tonnage cargo? Our project logistics team executes complex engineering movements for industrial plants, power infrastructure, and heavy machinery. We conduct rigorous digital route surveys, bridge-load analysis, multi-axle trailer deployment, and state authority escort coordination.",
    image: "/images/project-cargo.jpg",
    features: [
      "Pre-shipment route feasibility surveys and physical clearance verification",
      "Hydraulic multi-axle modular trailers, drop-decks, and heavy pullers",
      "Experienced safety escorts, utility wire crews, and civil engineering support",
      "Pan-India statutory permissions and highway authority clearances"
    ],
    benefits: [
      "De-risked cargo transport for critical engineering, procurement, and construction projects",
      "Turnkey statutory approvals across multiple state boundaries",
      "Certified center-of-gravity engineering and heavy-duty lashing validation",
      "Strict schedule adherence preventing expensive project site downtime"
    ],
    seoTitle: "Project Logistics & ODC Heavy Transport India | Arrowline Logistics",
    seoDesc: "Expert over-dimensional cargo (ODC) handling, route feasibility surveys, and heavy machinery transport across India from Arrowline Logistics."
  },
  {
    id: "freight-forwarding",
    slug: "freight-forwarding",
    title: "Freight Forwarding",
    category: "Global Trade",
    keyCapability: "Ocean FCL/LCL & Air Freight Coordination",
    shortDesc: "Comprehensive ocean and air freight logistics with smooth export-import documentation, global liner coordination, and port-to-door delivery.",
    longDesc: "Our freight forwarding division coordinates international sea and air freight logistics, ensuring smooth export-import documentation, vessel booking, and consolidated cargo movements. We collaborate with international shipping lines and cargo carriers to deliver end-to-end trade solutions connecting Indian businesses with worldwide markets.",
    image: "/images/hero-trucks-city.jpg",
    features: [
      "Full Container Load (FCL) and Less than Container Load (LCL) sea freight",
      "International air freight forwarding for urgent consignments",
      "Export-Import documentation and Letter of Credit compliance checks",
      "Coordination with premier global maritime carriers and port terminals"
    ],
    benefits: [
      "Single-point-of-contact for multi-country supply chains",
      "Competitive ocean and air freight rates backed by consolidated volumes",
      "Transparent milestone updates from origin port to destination receipt",
      "Proactive clearance liaison minimizing expensive port demurrage risks"
    ],
    seoTitle: "International Freight Forwarding Services India | Arrowline Logistics",
    seoDesc: "Reliable sea and air freight forwarding services in India with seamless port coordination and customs liaison at Mundra, Kandla, and Mumbai."
  },
  {
    id: "air-cargo",
    slug: "air-cargo",
    title: "Air Cargo Logistics",
    category: "Express Freight",
    keyCapability: "Time-Critical Shipments & Priority Handling",
    shortDesc: "Fastest logistics solutions for urgent, time-sensitive, and high-value cargo with nationwide airport connectivity and priority handling.",
    longDesc: "When speed is paramount, Arrowline’s air cargo services provide fast, secure transportation for urgent, high-value, and time-critical shipments. In coordination with major domestic and international airline cargo networks, we ensure priority handling, rapid airport retrieval, and direct last-mile delivery.",
    image: "/images/road-transport.jpg",
    features: [
      "Express airport-to-door cargo handling with priority dispatch",
      "Hour-by-hour status updates and automated delivery notifications",
      "High-security handling protocols for high-value and sensitive consignments",
      "Seamless integration with regional airport express ground delivery fleets"
    ],
    benefits: [
      "Same-day and next-day express delivery across major metro corridors",
      "Minimized inventory holding costs for critical manufacturing spares",
      "Zero-damage handling protocols with strict custody audits",
      "Dedicated air cargo dispatchers at major Indian cargo airports"
    ],
    seoTitle: "Express Air Cargo Services India | Fast Air Freight | Arrowline Logistics",
    seoDesc: "Fast, reliable domestic and international air cargo services in India. Priority handling and express airport-to-door delivery from Arrowline Logistics."
  },
  {
    id: "customs-clearance",
    slug: "customs-clearance",
    title: "Customs Clearance",
    category: "Port Brokerage",
    keyCapability: "ICEGATE Documentation & Compliance Management",
    shortDesc: "Compliant custom brokerage and documentation support ensuring smooth, swift clearance of import and export shipments at Mundra Port.",
    longDesc: "We provide compliant customs clearance and brokerage coordination to facilitate smooth cross-border freight flow. From ICEGATE filing to tariff classifications, duty calculations, and port authority liaison, our experienced team manages documentation accurately to prevent costly port delays.",
    image: "/images/truck-fleet-yard.jpg",
    features: [
      "Accurate Bill of Entry (BOE) and Shipping Bill filings on ICEGATE",
      "Comprehensive guidance on customs duty tariffs and import/export regulations",
      "Active coordination with port authorities, CFS yards, and shipping lines",
      "Pre-shipment documentation audit preventing inspection delays"
    ],
    benefits: [
      "Rapid turnaround—typically cleared within 24 to 48 hours of vessel discharge",
      "Eliminates compliance penalties and expensive port demurrage charges",
      "Accurate tariff classification ensuring proper statutory benefit utilization",
      "Full transparency with digital status updates throughout the clearance lifecycle"
    ],
    seoTitle: "Customs Clearance Services Mundra Port Gujarat | Arrowline Logistics",
    seoDesc: "Professional customs clearance and brokerage coordination at Mundra Port, Kandla, and Gujarat trade gateways. Fast, compliant filing with Arrowline."
  }
];

// Logistics Process Steps
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Requirement",
    subtitle: "Cargo Analysis & Consultation",
    description: "We analyze your material dimensions, weight, origin, destination, timeline requirements, and commercial considerations.",
    icon: "FileSearch",
    image: "/images/business-handshake.jpg"
  },
  {
    step: "02",
    title: "Planning",
    subtitle: "Multimodal Route Optimization",
    description: "Our logistics planners design the optimal multimodal route combining road, rail, or coastal shipping for best cost & speed.",
    icon: "Route",
    image: "/images/hero-logistics.jpg"
  },
  {
    step: "03",
    title: "Pickup",
    subtitle: "Safe Loading & Inspection",
    description: "GPS-enabled fleet arrives for on-schedule cargo pickup with certified heavy lashing, seal verification, and digital manifest.",
    icon: "PackageCheck",
    image: "/images/truck-fleet-yard.jpg"
  },
  {
    step: "04",
    title: "Transportation",
    subtitle: "Dedicated Transit Execution",
    description: "Your consignment moves smoothly across national expressways, freight rail corridors, or coastal shipping lines.",
    icon: "Truck",
    image: "/images/road-transport.jpg"
  },
  {
    step: "05",
    title: "Tracking",
    subtitle: "Real-Time 24/7 Visibility",
    description: "Live GPS tracking and milestone updates keep your supply chain team informed of location, ETA, and progress.",
    icon: "Activity",
    image: "/images/rail-multimodal.jpg"
  },
  {
    step: "06",
    title: "Delivery",
    subtitle: "On-Time Doorstep Handover",
    description: "Safe final-mile unloading, electronic Proof of Delivery (e-POD) sign-off, and seamless consignment closure.",
    icon: "CheckCircle",
    image: "/images/hero-trucks-city.jpg"
  }
];

// Industries We Serve (8 Core Categories)
export const INDUSTRIES_SERVED: IndustryItem[] = [
  {
    id: "automotive",
    title: "Automotive & Auto Components",
    description: "Just-in-time FTL movement of auto parts, engine blocks, and assembly components across manufacturing belts.",
    icon: "Car",
    cargoTypes: ["Engine components", "Chassis parts", "Finished vehicles", "Tires & batteries"],
    image: "/images/road-transport.jpg"
  },
  {
    id: "fmcg-retail",
    title: "FMCG, Food & Retail",
    description: "High-frequency nationwide distribution connecting manufacturing units with regional warehousing hubs.",
    icon: "ShoppingBag",
    cargoTypes: ["Packaged foods", "Beverages", "Consumer goods", "Personal care"],
    image: "/images/hero-trucks-city.jpg"
  },
  {
    id: "manufacturing-engineering",
    title: "Manufacturing & Heavy Engineering",
    description: "Industrial equipment, precision machinery, casting units, and structural fabrication transport.",
    icon: "Cog",
    cargoTypes: ["Heavy machinery", "Castings & forgings", "Pumps & turbines", "Industrial assemblies"],
    image: "/images/project-cargo.jpg"
  },
  {
    id: "pharmaceutical",
    title: "Pharmaceuticals & Healthcare",
    description: "Secure, time-critical logistics for active pharmaceutical ingredients (API) and medical products.",
    icon: "ShieldAlert",
    cargoTypes: ["APIs & bulk chemicals", "Medical equipment", "Packaging materials", "Formulations"],
    image: "/images/truck-fleet-yard.jpg"
  },
  {
    id: "chemical",
    title: "Chemicals & Petrochemicals",
    description: "Compliant containerized transportation for specialty chemicals, industrial polymers, and raw resins.",
    icon: "FlaskConical",
    cargoTypes: ["Polymers & resins", "Specialty chemicals", "Bulk liquid containers", "Fertilizers"],
    image: "/images/hero-logistics.jpg"
  },
  {
    id: "infrastructure-steel",
    title: "Infrastructure, Steel & Metals",
    description: "Heavy-haul flatbed and rail transportation for steel coils, pipes, TMT bars, and construction equipment.",
    icon: "HardHat",
    cargoTypes: ["Steel coils & sheets", "TMT bars & pipes", "Cement & gypsum", "Earthmoving machines"],
    image: "/images/project-cargo.jpg"
  },
  {
    id: "solar-energy",
    title: "Solar, Renewable & Energy",
    description: "Specialized handling for solar panels, inverters, transformers, wind turbine components, and substations.",
    icon: "Sun",
    cargoTypes: ["Solar PV modules", "Inverter skids", "Power transformers", "Wind turbine parts"],
    image: "/images/rail-multimodal.jpg"
  },
  {
    id: "ecommerce-electronics",
    title: "E-Commerce & Electronics",
    description: "High-velocity linehaul trucking and express freight connectivity between port hubs and fulfillment centers.",
    icon: "Layers",
    cargoTypes: ["Consumer electronics", "Telecom equipment", "Apparel & textiles", "Bulk parcel linehaul"],
    image: "/images/hero-trucks-city.jpg"
  }
];

// India Coverage & Regional Hubs
export const REGIONAL_HUBS: HubDetail[] = [
  {
    id: "hub-mundra",
    name: "Mundra Port (HQ)",
    state: "Gujarat",
    type: "Port Hub",
    coordinates: { x: 23, y: 52 },
    details: "Our primary operational, customs clearance, and heavy-haul road fleet base. Strategically positioned next to India's largest private commercial port to coordinate pan-India dispatches.",
    connectivity: "Direct National Highway connectivity, CONCOR rail terminal access, coastal shipping line berths."
  },
  {
    id: "hub-ahmedabad",
    name: "Ahmedabad Hub",
    state: "Gujarat",
    type: "Regional Office",
    coordinates: { x: 30, y: 54 },
    details: "Western India freight consolidation and industrial dispatch center linking Gujarat manufacturing belts with national expressways.",
    connectivity: "Direct express highway connection to Mundra Port, Mumbai, and Delhi."
  },
  {
    id: "hub-mumbai",
    name: "Mumbai & JNPT",
    state: "Maharashtra",
    type: "Port Hub",
    coordinates: { x: 32, y: 66 },
    details: "Coordinating ocean freight operations, customs brokerage, and high-frequency coastal shipping loops with Mundra Port.",
    connectivity: "Direct link to JNPT marine lanes, Mumbai-Pune expressway, and western rail corridors."
  },
  {
    id: "hub-delhi",
    name: "Delhi NCR Hub",
    state: "Delhi / Haryana",
    type: "Inland Depot",
    coordinates: { x: 42, y: 35 },
    details: "Major consumer-market distribution hub handling containerized rail freights, customs-bonded movements, and express retail logistics.",
    connectivity: "Connected to Western Dedicated Freight Corridor (WDFC) and NH-48."
  },
  {
    id: "hub-jaipur",
    name: "Jaipur Depot",
    state: "Rajasthan",
    type: "Inland Depot",
    coordinates: { x: 38, y: 44 },
    details: "Key inland terminal facilitating dry-port container flow from Mundra Port into northern industrial sectors.",
    connectivity: "Linked directly to the WDFC rail network and NH-48."
  },
  {
    id: "hub-indore",
    name: "Indore Junction",
    state: "Madhya Pradesh",
    type: "Regional Office",
    coordinates: { x: 44, y: 58 },
    details: "Central India logistics center coordinating agricultural supply chains, pharma logistics, and industrial machinery distribution.",
    connectivity: "Express highway access connecting central manufacturing belts with western trade ports."
  },
  {
    id: "hub-bangalore",
    name: "Bengaluru Logistics Center",
    state: "Karnataka",
    type: "Multimodal Terminal",
    coordinates: { x: 47, y: 84 },
    details: "Southern high-tech distribution center specializing in electronics warehousing, air cargo integrations, and express FTL dispatch.",
    connectivity: "Proximity to Kempegowda Cargo Terminal and central Southern national highways."
  },
  {
    id: "hub-chennai",
    name: "Chennai Port Branch",
    state: "Tamil Nadu",
    type: "Port Hub",
    coordinates: { x: 55, y: 83 },
    details: "East coast gateway managing coastal shipping loops, automotive parts, and ocean freight forwarding connections.",
    connectivity: "Direct coastal shipping lane connection to Mundra, Mumbai, and Vizag ports."
  },
  {
    id: "hub-hyderabad",
    name: "Hyderabad Hub",
    state: "Telangana",
    type: "Regional Office",
    coordinates: { x: 49, y: 69 },
    details: "South-Central distribution hub supporting pharmaceutical cold-chain dispatches, solar projects, and heavy industrial cargo.",
    connectivity: "Direct intersection of North-South and East-West national transit corridors."
  },
  {
    id: "hub-kolkata",
    name: "Kolkata Gateway",
    state: "West Bengal",
    type: "Port Hub",
    coordinates: { x: 74, y: 52 },
    details: "Eastern India trade node coordinating mining machinery, steel transportation, and multimodal rail movements.",
    connectivity: "Direct rail freight connectivity to western ports and Kolkata/Haldia docks."
  }
];

// Case Studies
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-01",
    title: "Transporting 85-Ton Over-Dimensional Boilers from Mundra to Salem",
    service: "Project Logistics & ODC",
    location: "Mundra Port, Gujarat to Salem, Tamil Nadu",
    clientSector: "Heavy Engineering & Power",
    summary: "Moved 3 over-dimensional industrial boilers weighing 85 metric tons each across 1,900 kilometers with zero clearance delays.",
    challenge: "The shipment measured 5.8m width and 6.2m height, encountering low bridges, overhead power lines, and multi-state permit requirements across 5 states.",
    solution: "Arrowline performed comprehensive route feasibility surveys, deployed hydraulic modular multi-axle trailers, and coordinated with state utility teams for real-time overhead line lifting.",
    result: "Delivered safely in 18 days (3 days ahead of schedule), saving the client ₹12 Lakhs in port demurrage and site delay penalties.",
    image: "/images/project-cargo.jpg",
    badge: "ODC Heavy Lift"
  },
  {
    id: "case-02",
    title: "Optimized Coastal-Road Multimodal Loop for Bulk Gypsum Cargo",
    service: "Shipping & Coastal Services",
    location: "Mundra Port to Chennai & Coimbatore Hubs",
    clientSector: "Cement & Construction Materials",
    summary: "Restructured a monthly 8,000-ton bulk gypsum supply chain by switching from pure road trucking to a maritime-road multimodal route.",
    challenge: "Long-haul highway trucking was facing rising diesel costs, toll charges, and erratic delivery timelines due to highway congestion.",
    solution: "We engineered a coastal shipping route from Mundra Port to Chennai Port, with synchronized local FTL road trailers for last-mile delivery to factories.",
    result: "Logistics costs were reduced by 32%, carbon footprint dropped by ~45%, and supply schedule reliability reached 100%.",
    image: "/images/hero-logistics.jpg",
    badge: "Cost Reduction 32%"
  },
  {
    id: "case-03",
    title: "Time-Critical Pharma Express Cargo from Gujarat to Delhi Airport",
    service: "Road Transport & Air Cargo",
    location: "Ahmedabad / Mundra to Delhi International Cargo Terminal",
    clientSector: "Life Sciences & Pharmaceuticals",
    summary: "Executed temperature-controlled express transportation for sensitive active pharmaceutical ingredients (API) within a 14-hour airside window.",
    challenge: "Strict 2°C to 8°C thermal constraints with strict zero-tolerance QA criteria and tight flight boarding schedules.",
    solution: "Deployed specialized temperature-controlled GPS-monitored container trucks with dual refrigeration backups and live temperature telemetry.",
    result: "Delivered in 12.5 hours directly to the airport cargo terminal with 100% temperature compliance and zero transit deviations.",
    image: "/images/road-transport.jpg",
    badge: "Express 12.5h Transit"
  },
  {
    id: "case-04",
    title: "Containerized Rail Freight Corridor for Solar EPC Equipment",
    service: "Rail & Multimodal Transportation",
    location: "Mundra Port to Jodhpur Solar Park, Rajasthan",
    clientSector: "Solar & Renewable Energy",
    summary: "Coordinated rail movement of 220 TEU solar module containers from port directly to inland rail terminal with seamless trailer transfer.",
    challenge: "High vessel volume arriving in tight sequence required rapid port clearance to prevent port detention charges.",
    solution: "Arrowline coordinated direct vessel-to-rail loading at Mundra port, routing dedicated container rakes straight to Rajasthan dry-port.",
    result: "100% of 220 containers cleared and dispatched within 72 hours, saving over ₹18 Lakhs in potential container detention.",
    image: "/images/rail-multimodal.jpg",
    badge: "220 TEUs Cleared"
  }
];

// AEO Master Question Cluster & Search FAQs
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Services",
    question: "What logistics and transportation services does Arrowline provide?",
    answer: "Arrowline Logistics provides comprehensive multimodal logistics and transportation services across India, including Full Truck Load (FTL) and Part Truck Load (PTL) road transportation, coastal shipping, rail freight via Indian Railways / CONCOR networks, project cargo & over-dimensional cargo (ODC), international freight forwarding, express air cargo, and customs clearance brokerage."
  },
  {
    id: "faq-2",
    category: "Operations",
    question: "How does transportation from Mundra Port work with Arrowline?",
    answer: "Operating on-site at Mundra Port, Gujarat, Arrowline manages direct container loading from vessel berths and CFS yards. We coordinate customs clearance, allocate GPS-enabled road trailers or rail rakes, and transport cargo directly to manufacturing units, warehouses, and inland dry ports across Northern, Central, and Southern India."
  },
  {
    id: "faq-3",
    category: "Road Transport",
    question: "What is FTL transportation and what is the difference between FTL and PTL?",
    answer: "FTL (Full Truck Load) means your shipment occupies a dedicated truck exclusively, ensuring direct point-to-point transit without co-loading. PTL (Part Truck Load) allows smaller consignments to share trailer space. Arrowline provides dedicated FTL container flatbeds, high-cube closed trucks, and specialized trailers tailored to cargo volume and urgency."
  },
  {
    id: "faq-4",
    category: "Multimodal",
    question: "What is multimodal transportation and how does it optimize logistics costs?",
    answer: "Multimodal logistics combines multiple modes of transport—such as coastal shipping, freight rail corridors, and highway trucking—under a single unified management contract. By utilizing coastal shipping or rail corridors for long-haul transit and trucks for first/last-mile delivery, businesses typically save 20% to 40% on overall freight costs."
  },
  {
    id: "faq-5",
    category: "Project Cargo",
    question: "What is material transportation and how are heavy industrial materials moved?",
    answer: "Material transportation involves moving raw materials (steel coils, polymers, ores) and finished industrial goods. For heavy machinery or over-dimensional cargo (ODC), Arrowline conducts route feasibility surveys, secures state road clearances, and deploys multi-axle hydraulic pullers with certified safety escorts."
  },
  {
    id: "faq-6",
    category: "Pricing",
    question: "How are freight transportation charges and transport quotes calculated?",
    answer: "Freight charges are calculated based on origin-destination distance, total cargo weight/volume (TEU or metric tons), required transit speed, specialized handling (such as ODC or temperature control), and chosen transport mode (road, rail, or coastal). You can request an instant quote via our online calculator or by contacting our Mundra desk."
  },
  {
    id: "faq-7",
    category: "Tracking",
    question: "How can I track my shipment in real-time?",
    answer: "Every vehicle in our operational fleet is equipped with live GPS tracking. Our clients receive automated milestone alerts at dispatch, major transit checkpoints, port clearances, and delivery, supported by our 24/7 operations monitoring desk."
  },
  {
    id: "faq-8",
    category: "Coverage",
    question: "Does Arrowline provide transportation across all major cities and states in India?",
    answer: "Yes. Arrowline operates a pan-India logistics network serving over 500 cities and industrial hubs across Gujarat, Maharashtra, Rajasthan, Delhi NCR, Haryana, Punjab, Madhya Pradesh, Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, West Bengal, and beyond."
  }
];

// Logistics Insights / Blog Articles
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "How FTL Transportation Works in India: Efficiency & Route Guide",
    slug: "how-ftl-transportation-works-india",
    readTime: "5 min read",
    date: "Aug 2026",
    author: "Operations Desk",
    category: "Road Transport",
    summary: "Discover how Full Truck Load (FTL) logistics provides dedicated vehicle space, reduces transit delays, and optimizes supply chains from Mundra Port to industrial centers.",
    image: "/images/road-transport.jpg"
  },
  {
    id: "blog-2",
    title: "Mundra Port Logistics Guide: Gateway to Pan-India Commercial Trade",
    slug: "mundra-port-logistics-guide",
    readTime: "7 min read",
    date: "Aug 2026",
    author: "Maritime Team",
    category: "Port Logistics",
    summary: "An in-depth analysis of Mundra Port’s maritime infrastructure, customs clearance workflows, and how multimodal connectivity links western maritime trade with northern inland depots.",
    image: "/images/hero-logistics.jpg"
  },
  {
    id: "blog-3",
    title: "Rail vs Road Transportation: Optimizing Freight Costs for Long Hauls",
    slug: "rail-vs-road-transportation-costs",
    readTime: "6 min read",
    date: "Jul 2026",
    author: "Supply Chain Team",
    category: "Multimodal Strategy",
    summary: "Comparing the economics of dedicated freight rail corridors versus express highway trucking for bulk, containerized, and industrial cargo across India.",
    image: "/images/rail-multimodal.jpg"
  }
];

// Testimonials
export const CLIENT_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Rajeev Singhania",
    company: "Apex Heavy Engineering Ltd.",
    role: "VP Supply Chain",
    location: "Ahmedabad, Gujarat",
    comment: "Arrowline Logistics managed our 85-ton transformer movement from Mundra Port with exceptional professionalism. The route survey and multi-axle execution were flawless.",
    rating: 5,
    serviceUsed: "Project Logistics & ODC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop"
  },
  {
    id: "test-2",
    clientName: "Priya Sundaram",
    company: "Continental Ceramics & Minerals",
    role: "Head of Logistics",
    location: "Chennai, Tamil Nadu",
    comment: "Transitioning our raw material transport to Arrowline’s coastal shipping and road route saved us 32% in freight costs while maintaining consistent weekly factory supply.",
    rating: 5,
    serviceUsed: "Coastal Shipping & Road FTL",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop"
  },
  {
    id: "test-3",
    clientName: "Vikram Mehra",
    company: "North Star Renewables",
    role: "Project Director",
    location: "Jaipur, Rajasthan",
    comment: "Handling 220 TEUs of imported solar components through Mundra Port without a single demurrage charge was outstanding. Arrowline’s rail coordination is top notch.",
    rating: 5,
    serviceUsed: "Rail & Multimodal Logistics",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop"
  }
];

export const CORE_VALUES = [
  {
    title: "Safe & Secure Cargo",
    desc: "Every truck is GPS-tracked, every container lash is certified, and cargo handlers undergo rigorous vetting. Your freight is protected throughout transit.",
    icon: "ShieldCheck"
  },
  {
    title: "Optimized Cost & Routes",
    desc: "By combining sea, road, rail, and air, we build hyper-efficient logistics loops that resist disruption and optimize transportation budgets.",
    icon: "TrendingDown"
  },
  {
    title: "Transparent Live Tracking",
    desc: "No more tracking blind spots. From electronic booking to dynamic live status reports and single-window billing, we make logistics transparent.",
    icon: "Activity"
  },
  {
    title: "End-to-End Coordination",
    desc: "Located on-site at Mundra, Gujarat, we coordinate directly with port authorities, custom houses, rail terminals, and destination teams.",
    icon: "Workflow"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Vinay Kumar",
    role: "Director & Head of Multimodal Operations",
    location: "Mundra Operations Base",
    email: "vinay@arrowlinelogistics.in",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop",
    bio: "Over 18 years of logistics expertise in the Kutch maritime belt. Vinay coordinates direct relationships with port authorities, custom houses, and shipping line alliances at Mundra and Kandla."
  },
  {
    name: "K. R. Nair",
    role: "Head of Project Logistics & ODC Operations",
    location: "Pan-India Route Survey Division",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop",
    bio: "A veteran heavy lift logistics planner. K.R. Nair manages route surveys, bridges, multi-axle trailer allocations, and coordinates state approvals for complex infrastructural moves."
  },
  {
    name: "Rajesh Joshi",
    role: "Senior Customs Brokerage & CHA Lead",
    location: "Mundra Port Customs Office",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&fit=crop",
    bio: "An expert on custom tariffs, ICEGATE, and trade dispute resolution. Rajesh ensures smooth import-export approvals and minimizes demurrage exposures."
  },
  {
    name: "Ananya Sharma",
    role: "Client Relations & Supply Chain Strategist",
    location: "Corporate Office",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
    bio: "Ananya designs customized supply chain frameworks for large automotive and FMCG brands, focusing on multimodal conversions that optimize delivery costs."
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Mundra Port Container Berth Operations",
    category: "Mundra Port",
    image: "/images/hero-logistics.jpg",
    alt: "Mundra port shipping container crane unloading cargo at Gujarat terminal",
    caption: "Direct vessel-to-trailer loading of 40-foot containers at Adani Mundra Port."
  },
  {
    id: "g2",
    title: "FTL Heavy Fleet on Expressway Corridor",
    category: "Road Fleet",
    image: "/images/road-transport.jpg",
    alt: "Modern heavy cargo truck moving down expressway in India at sunset",
    caption: "GPS-enabled FTL high-cube container trucks navigating national express transport corridors."
  },
  {
    id: "g3",
    title: "85-Ton ODC Cargo Transport",
    category: "ODC Cargo",
    image: "/images/project-cargo.jpg",
    alt: "Large industrial power transformer on multi-axle hydraulic modular trailer",
    caption: "Executing synchronized project cargo logistics using heavy modular multi-axle pullers with safety escorts."
  },
  {
    id: "g4",
    title: "Multimodal Rail Freight Terminal Loading",
    category: "Rail Freight",
    image: "/images/rail-multimodal.jpg",
    alt: "Double stack container train loaded at inland dry port in India",
    caption: "Direct rail-to-road loading operations in coordination with Indian Railways and CONCOR private freight rail links."
  },
  {
    id: "g5",
    title: "Customs Inspection & Port Gate Dispatch",
    category: "Customs",
    image: "/images/truck-fleet-yard.jpg",
    alt: "Customs inspection and cargo lashing validation at port warehouse",
    caption: "Pre-shipment custom document checks and container seal verifications performed by Arrowline CHA agents."
  }
];

// Helper to generate SEO structured data (JSON-LD)
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": COMPANY_DETAILS.name,
    "alternateName": "Arrowline Multimodal Logistics",
    "url": "https://www.arrowlinelogistics.in",
    "logo": "https://www.arrowlinelogistics.in/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": COMPANY_DETAILS.phone,
      "contactType": "customer service",
      "email": COMPANY_DETAILS.primaryEmail,
      "areaServed": "IN",
      "availableLanguage": ["en", "hi", "gu"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/arrowline-logistics",
      "https://www.instagram.com/arrowline_logistics"
    ]
  };
};

export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": COMPANY_DETAILS.name,
    "image": "https://www.arrowlinelogistics.in/images/hero-logistics.jpg",
    "@id": "https://www.arrowlinelogistics.in/#localbusiness",
    "url": "https://www.arrowlinelogistics.in",
    "telephone": COMPANY_DETAILS.phone,
    "email": COMPANY_DETAILS.primaryEmail,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office 204, Portview Commercial Complex, Near Adani House, Mundra Port Road",
      "addressLocality": "Mundra, Kutch",
      "addressRegion": "Gujarat",
      "postalCode": "370421",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.8429,
      "longitude": 69.7214
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    }
  };
};
