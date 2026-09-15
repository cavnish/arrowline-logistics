export interface ProcessStepItem {
  step: string;
  title: string;
  desc: string;
  icon?: string;
}

export interface AdvantageItem {
  number: string;
  title: string;
  desc: string;
}

export interface FAQItemData {
  q: string;
  a: string;
}

export interface ApplicationItem {
  title: string;
  desc: string;
  image: string;
}

export interface GalleryMediaItem {
  id: string;
  url: string;
  title: string;
  caption?: string;
  alt_text?: string;
}

export interface CargoSectionMeta {
  heading?: string;
  description?: string;
}

export interface SubServiceData {
  id: string;
  slug: string;
  parentSlug: string;
  parentName: string;
  title: string;
  shortDesc: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  heroImage: string;
  heroVideo?: string;
  heroFallbackImage?: string;
  imageAlt?: string;
  aboutBadge: string;
  aboutHeading: string;
  aboutDescription: string;
  aboutBulletPoints: string[];
  aboutImage: string;
  capabilities: Array<{ title: string; desc: string }>;
  whyArrowline: AdvantageItem[];
  processSteps: ProcessStepItem[];
  applications: ApplicationItem[];
  industries: string[];
  faqs: FAQItemData[];
  gallery: GalleryMediaItem[];
  showcaseHeading?: string;
  showcaseDescription?: string;
  cargoHeading?: string;
  cargoDescription?: string;
  videoUrl?: string;
  videoPoster?: string;
  ctaHeadline: string;
  seoTitle: string;
  seoDesc: string;
  canonicalUrl?: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface MainServiceData {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  category: string;
  keyCapability: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  heroImage: string;
  heroVideo?: string;
  heroFallbackImage?: string;
  imageAlt?: string;
  highlights: string[];
  aboutBadge: string;
  aboutHeading: string;
  aboutDescription: string;
  aboutBulletPoints: string[];
  aboutImage: string;
  whyArrowline: AdvantageItem[];
  processSteps: ProcessStepItem[];
  applications: ApplicationItem[];
  industries: string[];
  networkDescription: string;
  faqs: FAQItemData[];
  gallery: GalleryMediaItem[];
  showcaseHeading?: string;
  showcaseDescription?: string;
  cargoHeading?: string;
  cargoDescription?: string;
  videoUrl?: string;
  videoPoster?: string;
  ctaHeadline: string;
  seoTitle: string;
  seoDesc: string;
  canonicalUrl?: string;
  isPublished: boolean;
  displayOrder: number;
  subServices: SubServiceData[];
}

// =========================================================================
// 1. ROAD TRANSPORTATION
// =========================================================================

const roadSubServices: SubServiceData[] = [
  {
    id: "road-sub-1",
    slug: "container-transportation",
    parentSlug: "road-transportation",
    parentName: "Road Transportation",
    title: "Container Transportation",
    shortDesc: "Dedicated 20ft and 40ft container chassis transport from Mundra Port and major terminals to industrial destinations across India.",
    heroHeadline: "Reliable Container Transportation for Efficient Cargo Movement",
    heroSubheadline: "Port-to-factory containerized haulage with real-time GPS tracking, guaranteed chassis availability, and rapid port-gate turnaround.",
    heroBadge: "ROAD TRANSPORTATION • CONTAINER HAULAGE",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg",
    aboutBadge: "CONTAINER TRANSPORTATION",
    aboutHeading: "Connecting Sea Ports Directly to Factory Floors & Dry Ports.",
    aboutDescription: "Arrowline Logistics delivers specialized container transportation services designed for import, export, and domestic containerized movements. Operating directly out of Mundra Port and inland container depots (ICDs), our fleet of dedicated container trailers ensures timely pickup, secure twist-lock chassis transit, and seamless dock delivery without handling risk.",
    aboutBulletPoints: [
      "Dedicated 20-ft and 40-ft high-cube flatbed and skeletal container chassis",
      "Direct Mundra Port gate-in and gate-out coordination with electronic port passes",
      "Factory de-stuffing & round-trip empty container return to shipping line yards",
      "Live GPS tracking with automated geofenced trip milestone alerts",
      "Experienced container drivers compliant with maritime and customs safety standards",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    capabilities: [
      { title: "Standard & High-Cube Trailers", desc: "Equipped with certified twist-locks to secure ISO standard 20ft and 40ft containers under full payload." },
      { title: "Mundra Port Clearance Sync", desc: "Synchronized with customs clearance desk for zero container dwell time and demurrage avoidance." },
      { title: "Factory Direct Delivery", desc: "Scheduled drop-offs tailored to manufacturing unloading windows and crane schedules." },
      { title: "Empty Return Management", desc: "Prompt return of empty containers to shipping line depots to eliminate detention charges." },
    ],
    whyArrowline: [
      { number: "01", title: "Port Connectivity", desc: "Anchored directly at Mundra Port for immediate container pickup upon vessel discharge." },
      { number: "02", title: "Route Planning", desc: "Pre-cleared national highway corridors optimized for safe transit and speed." },
      { number: "03", title: "Coordinated Movement", desc: "End-to-end telemetry and digital proof of delivery at destination warehouses." },
      { number: "04", title: "Cargo Handling", desc: "Strict adherence to ISO container lashing, weight distribution, and safety guidelines." },
      { number: "05", title: "Delivery Coordination", desc: "24/7 central dispatch desk ensuring synchronized arrival and unloading at site." },
    ],
    processSteps: [
      { step: "01", title: "Container Release", desc: "Verification of Delivery Order (DO) and port gate pass clearance." },
      { step: "02", title: "Chassis Placement", desc: "Deployment of certified trailer to terminal container stack." },
      { step: "03", title: "Port Outgate", desc: "Digital gate-out scan, seal verification, and GPS tracking activation." },
      { step: "04", title: "Highway Transit", desc: "Monitored highway movement across dedicated freight corridors." },
      { step: "05", title: "Factory Unloading", desc: "Safe placement at consignee unloading dock for de-stuffing." },
      { step: "06", title: "Empty Return", desc: "Return of empty container to designated shipping line yard with receipt." },
    ],
    applications: [
      { title: "Import Cargo Containers", desc: "Raw materials, machinery parts, and chemicals from international origins.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Export Finished Goods", desc: "Factory packed containers moved under customs seal to Mundra port terminals.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Reefer & Specialized Containers", desc: "Temperature-sensitive pharmaceuticals, food products, and perishables.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Domestic Containerized Freight", desc: "Inter-state commercial goods moved securely in closed standard boxes.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
    ],
    industries: ["Manufacturing & Automotive", "Chemicals & Petrochemicals", "Textiles & Retail", "FMCG & Consumer Goods", "Solar & Renewable Energy", "Import/Export Traders"],
    faqs: [
      { q: "What types of containers can Arrowline transport?", a: "We transport all standard ISO containers including 20-foot, 40-foot standard, 40-foot High Cube (HC), flat-rack, open-top, and specialized temperature-controlled reefer containers." },
      { q: "How quickly can trailers be deployed at Mundra Port?", a: "With our primary operational desk at Mundra Port, we can deploy dedicated container chassis within 2 to 4 hours of container clearance and terminal release." },
      { q: "Do you handle empty container return to shipping line yards?", a: "Yes. Our container transportation service includes round-trip coordination: delivering the laden container to your factory dock and promptly returning the empty box to the designated shipping line depot to prevent detention fees." },
      { q: "How is cargo tracked during container road transit?", a: "Every vehicle is equipped with GPS telemetry integrated into our central logistics dashboard, providing real-time location updates, estimated arrival times (ETA), and trip milestone notifications." },
      { q: "Can Arrowline handle heavy payload containers?", a: "Yes. We maintain heavy-duty multi-axle trailers and comply with NHAI gross vehicle weight regulations to safely haul maximum payload containers across state borders." },
    ],
    gallery: [
      { id: "c1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Container Flatbed Fleet", caption: "High-cube container movement across Gujarat highway" },
      { id: "c2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Port Gate Integration", caption: "Mundra terminal gate-out and dispatch" },
      { id: "c3", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "Terminal Loading", caption: "Container crane loading onto Arrowline chassis" },
    ],
    ctaHeadline: "Move Your Containers With Speed & Precision",
    seoTitle: "Container Transportation Services India | Port to Factory Haulage | Arrowline",
    seoDesc: "Professional container transportation across India from Mundra Port. Dedicated 20ft/40ft chassis fleet with live GPS tracking and round-trip empty management.",
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: "road-sub-2",
    slug: "ftl-ltl-transportation",
    parentSlug: "road-transportation",
    parentName: "Road Transportation",
    title: "FTL & LTL Transportation",
    shortDesc: "Full Truckload (FTL) and Less-than-Truckload (LTL) road freight solutions tailored for commercial, industrial, and scheduled distribution.",
    heroHeadline: "Scalable FTL & LTL Road Transportation Across India",
    heroSubheadline: "Dedicated full truck capacity and cost-efficient partial load consolidation backed by scheduled departures and nationwide coverage.",
    heroBadge: "ROAD TRANSPORTATION • FTL & LTL",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
    aboutBadge: "FTL & LTL FREIGHT",
    aboutHeading: "Flexible Truckload Solutions Tailored to Your Supply Chain Volume.",
    aboutDescription: "Arrowline Logistics provides comprehensive Full Truckload (FTL) and Less-than-Truckload (LTL) services connecting production facilities, distribution centers, and industrial corridors. Whether you require dedicated multi-ton vehicle capacity for urgent point-to-point shipments or cost-effective consolidated freight movement, our road network ensures optimal space utilization and strict schedule adherence.",
    aboutBulletPoints: [
      "Dedicated Full Truckload (FTL) vehicles ranging from 9 MT to 40 MT capacity",
      "Consolidated Less-than-Truckload (LTL) services with zero co-loading damage risk",
      "Point-to-point direct routing eliminating intermediate transshipment delays",
      "Temperature and weatherproof enclosed container bodies and open flatbeds",
      "Standardized electronic e-Way bill compliance and digital Proof of Delivery (e-POD)",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    capabilities: [
      { title: "Dedicated Fleet Allocation", desc: "Guaranteed single-shipper trucks for high-value or time-sensitive industrial freight." },
      { title: "Smart Consolidation (LTL)", desc: "Optimized route grouping for smaller batches to drastically reduce per-ton shipping costs." },
      { title: "Multi-Axle & High Capacity", desc: "Trailers capable of carrying high volumetric or high-density payloads securely." },
      { title: "Direct Hub-to-Hub Transit", desc: "Express lanes connecting major industrial clusters like Mundra, Ahmedabad, Pune, Delhi NCR, and Chennai." },
    ],
    whyArrowline: [
      { number: "01", title: "Capacity Assurance", desc: "Ready fleet of vetted trucks ensuring continuous availability even during peak seasons." },
      { number: "02", title: "Direct Dispatch", desc: "No unnecessary depot stops for FTL movements, maximizing speed of delivery." },
      { number: "03", title: "Cost Optimization", desc: "Transparent per-kilometer and per-ton tariff structures with zero hidden surcharges." },
      { number: "04", title: "Cargo Security", desc: "Vetted commercial drivers, continuous telemetry, and tamper-evident sealing protocols." },
      { number: "05", title: "Pan-India Reach", desc: "Coverage extending across tier-1 manufacturing hubs and remote project destinations." },
    ],
    processSteps: [
      { step: "01", title: "Load Assessment", desc: "Analyzing cargo weight, cubic volume, packing type, and required delivery window." },
      { step: "02", title: "Vehicle Matching", desc: "Assigning the optimal truck type (open bed, closed container, or multi-axle)." },
      { step: "03", title: "Loading & Lashing", desc: "Supervised loading with industrial strapping to prevent in-transit movement." },
      { step: "04", title: "Highway Dispatch", desc: "Express transit via toll-optimized national highways with continuous monitoring." },
      { step: "05", title: "Milestone Alerts", desc: "Automated status updates at critical checkpoints and border state crossings." },
      { step: "06", title: "POD Confirmation", desc: "Digital sign-off on consignee delivery with instant invoice clearance documentation." },
    ],
    applications: [
      { title: "Industrial Raw Materials", desc: "Steel coils, chemical drums, plastic resins, and packaging materials.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Finished Commercial Goods", desc: "Consumer appliances, retail inventories, and FMCG carton dispatches.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Automotive Parts & Assemblies", desc: "JIT supply chain components delivered direct to assembly plant lines.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Heavy Machinery Spares", desc: "Replacement tooling, pumps, motors, and hydraulic engineering units.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Automotive & Ancillaries", "FMCG & Packaged Foods", "Engineering & Heavy Industry", "Chemicals & Minerals", "Pharmaceuticals", "Retail & Distribution"],
    faqs: [
      { q: "What is the key difference between FTL and LTL transportation?", a: "FTL (Full Truckload) dedicates an entire vehicle exclusively to your shipment, providing direct point-to-point transit without intermediate stops. LTL (Less-than-Truckload) consolidates multiple smaller shipments into a single truck, allowing you to pay only for the volume and weight you utilize." },
      { q: "What truck capacities are available for FTL shipments?", a: "We provide vehicles ranging from 19-foot closed container trucks (7-9 MT), 24-foot/32-foot single-axle & multi-axle trucks (15-25 MT), to 40-foot flatbed trailers (30-40 MT)." },
      { q: "How do you handle e-Way bill compliance and state tax checkpoints?", a: "Our operations desk verifies all statutory documentation including e-Way bills, invoices, and packing lists before dispatch, ensuring smooth passage at all state transport borders." },
      { q: "Can we request scheduled daily or weekly dispatches?", a: "Yes. We offer contractual dedicated fleet arrangements with guaranteed vehicle placement SLAs for high-volume manufacturing clients." },
      { q: "Are goods insured during road transit?", a: "While shippers typically maintain primary marine cargo insurance, Arrowline ensures comprehensive carrier liability coverage and enforces strict cargo security and driver vetting protocols." },
    ],
    gallery: [
      { id: "f1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "FTL Fleet in Transit", caption: "High-speed road freight on Western corridor" },
      { id: "f2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Warehouse Loading", caption: "Safe loading and weight distribution check" },
    ],
    ctaHeadline: "Optimize Your Freight Costs with Arrowline FTL & LTL",
    seoTitle: "FTL & LTL Transportation Services India | Full Truckload Freight | Arrowline",
    seoDesc: "Dependable Full Truckload (FTL) and Part Truckload (LTL) road transportation across India. Flexible fleet capacity, GPS tracking, and pan-India reach.",
    isPublished: true,
    displayOrder: 2,
  },
  {
    id: "road-sub-3",
    slug: "odc-heavy-haulage",
    parentSlug: "road-transportation",
    parentName: "Road Transportation",
    title: "ODC & Heavy Haulage",
    shortDesc: "Engineered transportation for Over Dimensional Cargo (ODC), heavy machinery, and structural loads requiring specialized trailers and civil permissions.",
    heroHeadline: "Specialized ODC & Heavy Haulage Transportation",
    heroSubheadline: "Heavy-lift road freight engineering, route feasibility surveys, multi-axle hydraulic pullers, and turnkey transit coordination across India.",
    heroBadge: "ROAD TRANSPORTATION • ODC & HEAVY HAULAGE",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377043/arrowline/general/project-road.jpg",
    aboutBadge: "ODC & HEAVY HAULAGE",
    aboutHeading: "Safely Moving Oversized & Super-Heavy Cargo Across Complex Corridors.",
    aboutDescription: "Over Dimensional Cargo (ODC) requires specialized engineering, meticulous route planning, and robust heavy-haulage equipment. Arrowline Logistics specializes in transporting oversized industrial equipment, boilers, transformers, and structural components that exceed standard highway dimensions and weight limits. We manage everything from civil bridge surveys and statutory permits to multi-axle trailer deployment and escort coordination.",
    aboutBulletPoints: [
      "Hydraulic multi-axle trailers, low-bed, semi-low bed, and modular puller units",
      "Route feasibility surveys checking overhead bridge clearances, turns, and toll lanes",
      "Statutory MoRTH and NHAI permissions for over-dimensional road movement",
      "Civil reinforcement and escort vehicle arrangements for critical transit legs",
      "Heavy lashing and dynamic load calculation by experienced logistics engineers",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Hydraulic Modular Axles", desc: "Configurable multi-axle trailer combinations to distribute multi-hundred-ton payloads safely." },
      { title: "Low-Bed & Drop-Deck Trailers", desc: "Low ground clearance trailers designed specifically for extra-height industrial equipment." },
      { title: "Engineering Route Surveys", desc: "Physical route verification of turning radiuses, overhead wires, and load-bearing bridges." },
      { title: "Escort & Pilot Vehicle Support", desc: "Dedicated safety escort teams managing traffic and road clearance ahead of the convoy." },
    ],
    whyArrowline: [
      { number: "01", title: "Engineering Expertise", desc: "In-house technical assessment of center of gravity, load distribution, and trailer configuration." },
      { number: "02", title: "Route Clearances", desc: "Established protocols for securing NHAI, state police, and electricity board clearances." },
      { number: "03", title: "Fleet Capability", desc: "Extensive range of hydraulic pullers, modular axles, and specialized heavy-haul chassis." },
      { number: "04", title: "On-Site Supervision", desc: "Technical engineers present on-site during loading, transit, and unloading at destination." },
      { number: "05", title: "Zero-Incident Record", desc: "Uncompromising safety standards adhering to international heavy-haulage best practices." },
    ],
    processSteps: [
      { step: "01", title: "Technical Drawing Review", desc: "Analyzing cargo dimensions (Length, Width, Height, Weight) and lifting points." },
      { step: "02", title: "Route Survey", desc: "Conducting physical road survey to identify obstacles, pinch points, and bypasses." },
      { step: "03", title: "Permit Acquisition", desc: "Securing national highway ODC permits and state administrative approvals." },
      { step: "04", title: "Trailer Configuration", desc: "Assembling the exact number of hydraulic axles and puller power required." },
      { step: "05", title: "Controlled Transit", desc: "Safe convoy movement with pilot vehicles, telemetry, and bridge crossings." },
      { step: "06", title: "Site Foundation Placement", desc: "Coordination with crane contractors for precise placement onto plant foundation." },
    ],
    applications: [
      { title: "Power Transformers & Turbines", desc: "Heavy electrical generation equipment for power plants and sub-stations.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Industrial Boilers & Pressure Vessels", desc: "Oversized autoclaves, reactors, and distillation columns for process plants.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Wind Turbine Components", desc: "Tower sections, heavy nacelles, and extra-long blades transported to wind farms.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Heavy Earthmoving Equipment", desc: "Excavators, piling rigs, and mining machinery moved between infrastructure sites.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["Power Generation & Transmission", "Oil, Gas & Petrochemicals", "Heavy Engineering & Fabrication", "Renewable Energy (Wind & Solar)", "Infrastructure & Bridge Construction", "Mining & Minerals"],
    faqs: [
      { q: "What qualifies as Over Dimensional Cargo (ODC)?", a: "In India, cargo exceeding standard dimensions (Length > 12m, Width > 2.6m, Height > 3.8m, or Gross Weight > 40-49 MT depending on axle count) is classified as ODC and requires specialized trailers and statutory NHAI permissions." },
      { q: "How long does route survey and permit approval take for ODC?", a: "A standard route feasibility survey takes 3 to 7 days depending on the distance, while statutory NHAI online permits generally take 5 to 10 working days." },
      { q: "What types of trailers are used for heavy haulage?", a: "We utilize hydraulic multi-axle modular trailers (Goldhofer/Scheuerle types), semi-low beds, ultra-low beds, drop-deck trailers, and extendable telescopic trailers." },
      { q: "How do you navigate low bridges and overhead high-tension wires?", a: "During the route survey, our engineers identify all overhead obstacles and coordinate temporary power shutdowns or bypass routes with local electricity boards and highway authorities." },
      { q: "Can Arrowline handle heavy-lift crane loading and unloading at site?", a: "Yes. We provide complete turnkey heavy logistics including tandem crane lifting, hydraulic skidding, and placement onto foundations." },
    ],
    gallery: [
      { id: "o1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Multi-Axle Heavy Movement", caption: "Heavy turbine transit on hydraulic modular trailer" },
      { id: "o2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "Port Crane Tandem Lift", caption: "Heavy ODC cargo offloading at Mundra Port" },
    ],
    ctaHeadline: "Plan Your ODC & Heavy Haulage Movement With Arrowline",
    seoTitle: "ODC & Heavy Haulage Transportation India | Oversized Cargo Logistics | Arrowline",
    seoDesc: "Specialized ODC and Heavy Haulage transportation services in India. Hydraulic multi-axles, low-bed trailers, route surveys, and NHAI permissions.",
    isPublished: true,
    displayOrder: 3,
  },
  {
    id: "road-sub-4",
    slug: "project-cargo-transportation",
    parentSlug: "road-transportation",
    parentName: "Road Transportation",
    title: "Project Cargo Transportation",
    shortDesc: "End-to-end highway logistics for industrial projects, refinery expansions, and turnkey plant setups from port gate to erection site.",
    heroHeadline: "Turnkey Project Cargo Road Transportation",
    heroSubheadline: "Coordinated heavy road freight for EPC contractors, industrial plants, energy projects, and infrastructure developments across India.",
    heroBadge: "ROAD TRANSPORTATION • PROJECT CARGO",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    aboutBadge: "PROJECT LOGISTICS",
    aboutHeading: "Managing Complex Industrial Shipments From Port of Entry to Remote Project Sites.",
    aboutDescription: "Project cargo transportation demands multi-stage synchronization across heavy machinery, containerized spares, fabricated structures, and sensitive electrical instruments. Arrowline Logistics manages the entire road movement lifecycle for major EPC and industrial engineering projects. Anchored at Mundra Port, we consolidate dispatches, schedule heavy convoys, and ensure zero-delay site deliveries.",
    aboutBulletPoints: [
      "Single-point logistics management for multi-package industrial project consignments",
      "Synchronized dispatch matching EPC construction schedules and site crane availability",
      "Staging and marshalling yard management near Mundra Port for batch dispatches",
      "Comprehensive insurance, civil engineering support, and transit safety protocols",
      "Dedicated on-site project coordinators stationed at origin and destination site gates",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Project Staging & Yard Management", desc: "Short-term storage and grouping of import project packages at Mundra prior to scheduled road dispatch." },
      { title: "Synchronized Convoy Dispatch", desc: "Batch movements organized to deliver complementary installation components on the exact same day." },
      { title: "Specialized Equipment Sourcing", desc: "Deploying the exact mix of flatbed, low-bed, semi-low bed, and container trailers required." },
      { title: "Turnkey Site Delivery", desc: "Delivery direct to the project laydown area with digital inventory reconciliation." },
    ],
    whyArrowline: [
      { number: "01", title: "Project Experience", desc: "Proven track record executing logistics for power plants, solar parks, refineries, and steel mills." },
      { number: "02", title: "Staging Facilities", desc: "Secure laydown yards near Mundra Port to buffer cargo between vessel discharge and road transit." },
      { number: "03", title: "Dedicated Team", desc: "Single point of contact project manager managing planning, customs coordination, and trucking." },
      { number: "04", title: "Safety Adherence", desc: "Zero-compromise HSE standards compliant with major multinational EPC contractor audits." },
      { number: "05", title: "Budget Control", desc: "Accurate freight modeling preventing unexpected demurrage, detention, and crane idle costs." },
    ],
    processSteps: [
      { step: "01", title: "Project Scoping", desc: "Reviewing bill of quantities, package lists, shipment weights, and installation schedules." },
      { step: "02", title: "Port Reception", desc: "Receiving vessel cargo at Mundra Port and transferring to designated project staging yard." },
      { step: "03", title: "Consolidation & Sorting", desc: "Grouping packages by installation priority and trailer configuration requirements." },
      { step: "04", title: "Phased Highway Dispatch", desc: "Dispatching sequenced convoys with continuous telemetry and status reports." },
      { step: "05", title: "Site Gate Arrival", desc: "Coordination with site engineering team for immediate gate entry and positioning." },
      { step: "06", title: "Final Reconciliation", desc: "Digital verification of all delivered packages against original bill of materials." },
    ],
    applications: [
      { title: "Solar & Renewable Farms", desc: "Transformers, inverters, tracker structures, and containerized PV modules.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Refinery & Petrochemical Units", desc: "High-pressure reactors, heat exchangers, pipes, and modular skids.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Cement & Steel Plants", desc: "Kiln sections, grinding mills, structural steel frames, and conveyor belts.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Metro & Infrastructure Projects", desc: "Tunnel boring machine (TBM) parts, pre-cast girder carriers, and bridge components.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["EPC & Infrastructure Contractors", "Power & Renewable Energy", "Oil, Gas & Petrochemicals", "Steel & Metallurgical Plants", "Cement & Building Materials", "Mining & Heavy Processing"],
    faqs: [
      { q: "What does project cargo road logistics encompass?", a: "Project cargo logistics encompasses the comprehensive planning, coordination, and transportation of all equipment, structures, machinery, and materials required for a specific industrial construction project from port or manufacturing plant to the job site." },
      { q: "Can Arrowline manage staging of project cargo at Mundra Port?", a: "Yes. We provide secure open and covered staging yards near Mundra Port where import shipments can be safely inspected, grouped, and stored until the project site is ready for receipt." },
      { q: "How do you coordinate with on-site crane contractors?", a: "Our project logistics coordinator aligns the truck transit ETA with the on-site heavy crane schedule, ensuring trailers arrive directly under the hook to eliminate crane waiting penalties." },
      { q: "Do you handle multimodal project cargo combinations?", a: "Yes. For super long-haul routes, we can integrate coastal shipping or rail rakes with first-mile and last-mile road transportation." },
      { q: "How are urgent replacement parts expedited during plant commissioning?", a: "We maintain dedicated express hot-shot trucks for emergency replacement spares and tools to prevent costly project commissioning delays." },
    ],
    gallery: [
      { id: "p1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Project Convoy", caption: "Industrial project equipment transit across Gujarat" },
      { id: "p2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Port Yard Staging", caption: "Project packages staged near Mundra port" },
    ],
    ctaHeadline: "Let's Engineer Your Project Cargo Transportation",
    seoTitle: "Project Cargo Road Transportation India | Industrial Logistics | Arrowline",
    seoDesc: "Turnkey project cargo road transportation for EPC contractors and industrial projects across India. Port staging, heavy haulage, and site coordination.",
    isPublished: true,
    displayOrder: 4,
  },
  {
    id: "road-sub-5",
    slug: "trailer-multi-axle-transportation",
    parentSlug: "road-transportation",
    parentName: "Road Transportation",
    title: "Trailer & Multi-Axle Transportation",
    shortDesc: "Comprehensive fleet of high-capacity flatbeds, semi-low beds, low-beds, and hydraulic multi-axle trailers for specialized industrial freight.",
    heroHeadline: "Trailer & Multi-Axle Transportation Fleet Across India",
    heroSubheadline: "High-tonnage vehicle deployment configured precisely for heavy industrial machinery, steel, pre-cast structures, and high-cube containers.",
    heroBadge: "ROAD TRANSPORTATION • TRAILER & MULTI-AXLE",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    aboutBadge: "TRAILER FLEET CAPABILITIES",
    aboutHeading: "Matching the Right Axle Configuration to Your Cargo Load & Route.",
    aboutDescription: "The safety, cost efficiency, and legal compliance of road transportation depend heavily on selecting the correct trailer chassis. Arrowline Logistics operates and coordinates an extensive fleet of specialized commercial trailers, ranging from standard 40-foot flatbeds to 24-axle hydraulic modular trailers. We ensure appropriate axle weight distribution to protect both your cargo and highway infrastructure.",
    aboutBulletPoints: [
      "40-foot and 45-foot flatbed and semi-low bed trailers for container and steel haulage",
      "Ultra low-bed and drop-deck trailers with deck heights as low as 300mm for high cargo",
      "Hydraulic multi-axle modular trailers capable of payload capacities exceeding 250 MT",
      "Telescopic extendable trailers extending up to 45 meters for long beams and wind blades",
      "All vehicles fitted with certified high-tensile lashing points and anti-skid timber flooring",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    capabilities: [
      { title: "Flatbed Trailers (40ft / 45ft)", desc: "Versatile platforms for standard containers, bundled steel plates, pipes, and palletized machinery." },
      { title: "Semi-Low & Low-Bed Trailers", desc: "Lower center of gravity platforms ideal for excavators, cranes, transformers, and industrial drums." },
      { title: "Hydraulic Multi-Axle Pullers", desc: "Modular axle units with hydraulic suspension and steering for super-heavy concentrated loads." },
      { title: "Extendable Beam Trailers", desc: "Telescopic chassis engineered for bridge girders, long steel poles, and wind turbine components." },
    ],
    whyArrowline: [
      { number: "01", title: "Fleet Diversity", desc: "Comprehensive range of vehicle types available on demand at Mundra Port and major transport hubs." },
      { number: "02", title: "Mechanical Integrity", desc: "Rigorous preventive maintenance and tire inspections ensuring zero on-highway breakdown risk." },
      { number: "03", title: "Weight Optimization", desc: "Engineered axle load calculations complying strictly with NHAI bridge and highway limits." },
      { number: "04", title: "Vetted Operators", desc: "Experienced heavy-trailer drivers trained in defensive driving and dynamic load management." },
      { number: "05", title: "Pan-India Deployment", desc: "Rapid positioning of trailers across Gujarat, Maharashtra, Rajasthan, NCR, and Southern India." },
    ],
    processSteps: [
      { step: "01", title: "Payload Specification", desc: "Assessing weight, dimensions, center of gravity, and loading equipment type." },
      { step: "02", title: "Chassis Selection", desc: "Choosing flatbed, low-bed, or multi-axle configuration based on clearance and weight." },
      { step: "03", title: "Pre-Trip Inspection", desc: "Checking tires, brakes, hydraulic lines, twist locks, and lashings." },
      { step: "04", title: "Secure Loading", desc: "Positioning cargo over designated trailer load points and applying chain binders." },
      { step: "05", title: "Corridor Transit", desc: "GPS-monitored highway movement following approved heavy-transport routes." },
      { step: "06", title: "Safe De-rigging", desc: "Unbinding and offloading coordination at destination warehouse or plant floor." },
    ],
    applications: [
      { title: "Steel Plates, Coils & Beams", desc: "High-density steel products secured with specialized coil cradles and chains.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Construction & Mining Vehicles", desc: "Tracked excavators, wheel loaders, road rollers, and asphalt pavers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Pre-cast Concrete Structures", desc: "Long bridge beams, building pillars, and infrastructural pre-cast slabs.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Industrial Chillers & Motors", desc: "Factory HVAC equipment, heavy diesel generator sets, and industrial compressors.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Heavy Engineering & Fabrication", "Steel & Metals", "Construction & Infrastructure", "Commercial Manufacturing", "Mining & Earthmoving", "Wind Energy"],
    faqs: [
      { q: "What is the weight capacity of hydraulic multi-axle trailers?", a: "Hydraulic multi-axle trailers are modular and can be linked in 2, 4, 6, 8, or more axle lines. Depending on the configuration, they can safely carry payloads from 50 MT up to over 300 MT." },
      { q: "When is a low-bed trailer required instead of a standard flatbed?", a: "A low-bed trailer is required when cargo height exceeds 2.8 meters on a standard flatbed, helping lower the total loaded height to clear the standard 4.5 to 5.0-meter highway bridge limits." },
      { q: "How do you ensure proper lashing and safety of heavy cargo on trailers?", a: "We utilize certified grade-80 and grade-100 transport chain binders, heavy-duty ratchet straps, anti-skid rubber mats, and welded corner stoppers calculated specifically for the cargo's center of gravity." },
      { q: "Can trailers be hired for long-term dedicated fleet contracts?", a: "Yes. Arrowline offers dedicated trailer leasing and operations management contracts for manufacturers and port logistics users." },
      { q: "Are Arrowline trailers permitted to operate across all Indian states?", a: "Yes. All our vehicles carry national commercial permits, comprehensive insurance, and digital toll/GPS integrations for seamless inter-state transit." },
    ],
    gallery: [
      { id: "t1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Multi-Axle Trailer in Transit", caption: "Heavy payload trailer movement across national corridor" },
      { id: "t2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Low-Bed Trailer", caption: "Low-bed chassis carrying oversized industrial equipment" },
    ],
    ctaHeadline: "Deploy the Right Trailer Fleet for Your Cargo",
    seoTitle: "Trailer & Multi-Axle Transportation India | Heavy Low-Bed Haulage | Arrowline",
    seoDesc: "High-capacity trailer and multi-axle transportation across India. 40ft flatbeds, semi-low beds, ultra low-beds, and modular hydraulic pullers.",
    isPublished: true,
    displayOrder: 5,
  },
  {
    id: "road-sub-6",
    slug: "machinery-industrial-cargo-transportation",
    parentSlug: "road-transportation",
    parentName: "Road Transportation",
    title: "Machinery & Industrial Cargo Transportation",
    shortDesc: "Precision road freight for factory machinery, engineering equipment, electrical assemblies, and industrial plant consignments across India.",
    heroHeadline: "Machinery & Industrial Cargo Transportation Services",
    heroSubheadline: "Damage-free transit for high-value factory production lines, CNC machines, transformers, pumps, and precision engineering goods.",
    heroBadge: "ROAD TRANSPORTATION • MACHINERY & INDUSTRIAL",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg",
    aboutBadge: "MACHINERY TRANSPORTATION",
    aboutHeading: "Safeguarding High-Value Industrial Assets During Long-Haul Transit.",
    aboutDescription: "Industrial machinery and precision engineering assemblies require specialized handling, shock-absorbing transit protection, and customized securing. Arrowline Logistics provides dedicated road freight solutions tailored to industrial machinery manufacturers, factory relocations, and import capital goods movements. From crated CNC milling machines to heavy foundry equipment, we ensure zero vibration damage and on-time plant arrival.",
    aboutBulletPoints: [
      "Customized lashing and dunnage protecting sensitive electronics and calibrated axes",
      "Air-suspension and specialized flatbed vehicles for vibration-sensitive machinery",
      "Comprehensive factory relocation logistics including multi-machine phased transit",
      "Port-to-plant direct delivery from Mundra clearance straight to assembly lines",
      "Full digital transit logging with continuous driver communication and temperature tracking",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    capabilities: [
      { title: "Vibration-Controlled Transit", desc: "Air-suspension trailers and rubber dunnage mats to absorb highway shocks and road vibrations." },
      { title: "Weatherproof Enclosed Trucking", desc: "Waterproof closed containers and heavy tarpaulin wrapping to prevent moisture and dust corrosion." },
      { title: "Factory Relocation Management", desc: "End-to-end dismantling, serial number indexing, phased trucking, and plant delivery." },
      { title: "Crane & Forklift Placement", desc: "Coordinating rigging crews at origin and destination for zero-impact machinery handling." },
    ],
    whyArrowline: [
      { number: "01", title: "Machinery Expertise", desc: "Deep understanding of center of gravity, delicate bearing points, and lifting brackets." },
      { number: "02", title: "Protection Standards", desc: "Industrial-grade moisture barriers, desiccants, and multi-point chain securing." },
      { number: "03", title: "Time-Critical Delivery", desc: "Strict adherence to installation schedules to prevent assembly team downtime." },
      { number: "04", title: "Port Direct Link", desc: "Direct transfer from Mundra Port import terminals straight to factory shop floors." },
      { number: "05", title: "Full Cargo Liability", desc: "Comprehensive documentation and strict SOPs ensuring complete asset protection." },
    ],
    processSteps: [
      { step: "01", title: "Machine Assessment", desc: "Checking dimensions, weight, fragile components, and securing points." },
      { step: "02", title: "Packing & Wrapping", desc: "Ensuring wooden crating, moisture film, and corner edge protectors are in place." },
      { step: "03", title: "Rigging & Loading", desc: "Supervised forklift/crane placement onto vehicle with weight centering." },
      { step: "04", title: "Anti-Vibration Lashing", desc: "Applying rubber mats, load binders, and heavy-duty polyester straps." },
      { step: "05", title: "Monitored Transit", desc: "Speed-controlled highway movement with real-time GPS telemetry." },
      { step: "06", title: "Factory Unloading", desc: "Precision placement into factory bay or staging dock with signed inspection." },
    ],
    applications: [
      { title: "CNC Machines & Lathes", desc: "High-precision computer numerical control machining centers and laser cutters.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Plastic Injection Molding Units", desc: "Heavy hydraulic clamping units, molds, and auxiliary drying machinery.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Textile & Spinning Machinery", desc: "Carding machines, ring frames, and automated knitting looms.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Pumps, Compressors & Turbines", desc: "Industrial fluid handling pumps, air compressors, and electrical motors.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Machinery Manufacturers & OEMs", "Automotive Ancillaries", "Plastic & Polymer Processing", "Textiles & Garment Manufacturing", "Chemical & Pharmaceutical Plants", "Tooling & Die Casting"],
    faqs: [
      { q: "How do you protect sensitive CNC machinery from road vibrations?", a: "We utilize air-ride suspension trailers, heavy-duty anti-vibration elastomeric rubber pads, and soft-strap ratchets that secure the machine frame without applying stress to calibrated spindles or electronics." },
      { q: "Can Arrowline handle complete factory plant relocations?", a: "Yes. We manage turnkey factory relocations, including equipment cataloging, sequenced trucking, and phased delivery to match your new facility's installation sequence." },
      { q: "Do you transport machinery directly from Mundra Port?", a: "Yes. A significant portion of our machinery transport involves picking up imported European, Japanese, and Chinese machinery at Mundra Port and delivering directly to factories across India." },
      { q: "How is heavy machinery secured against sliding on open flatbeds?", a: "We use timber dunnage nailed to trailer floors, steel wheel chocks, cross-lashing grade-80 chains, and non-slip mats providing high friction coefficients." },
      { q: "What documentation is needed for inter-state machinery movement?", a: "You will need the commercial tax invoice, e-Way bill, packing list with machine serial numbers, and any applicable state transport declarations." },
    ],
    gallery: [
      { id: "m1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "CNC Machinery Transit", caption: "High-value precision machine secured on Arrowline flatbed" },
      { id: "m2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "Port Clearance Direct", caption: "Direct loading of import machinery at Mundra Port" },
    ],
    ctaHeadline: "Safeguard Your Industrial Machinery Shipments",
    seoTitle: "Machinery & Industrial Cargo Transportation India | Arrowline Logistics",
    seoDesc: "Precision road freight for industrial machinery, CNC equipment, factory plants, and heavy engineering goods across India with Arrowline Logistics.",
    isPublished: true,
    displayOrder: 6,
  },
];

// =========================================================================
// 2. RAIL TRANSPORTATION
// =========================================================================

const railSubServices: SubServiceData[] = [
  {
    id: "rail-sub-1",
    slug: "rail-freight-transportation",
    parentSlug: "rail-transportation",
    parentName: "Rail Transportation",
    title: "Rail Freight Transportation",
    shortDesc: "High-capacity scheduled rail freight services leveraging Western Dedicated Freight Corridors (WDFC) and Indian Railways networks for long-haul cargo.",
    heroHeadline: "Reliable Rail Freight Transportation Across India",
    heroSubheadline: "Cost-effective, scheduled trainload and wagon-load freight services connecting Mundra Port to Northern, Central, and Southern industrial hubs.",
    heroBadge: "RAIL TRANSPORTATION • RAIL FREIGHT",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    aboutBadge: "RAIL FREIGHT SERVICES",
    aboutHeading: "Connecting Sea Ports to Inland Industrial Centers Via High-Capacity Rail.",
    aboutDescription: "Rail freight represents the most cost-effective and environmentally sustainable transport mode for moving high-volume industrial goods over distances exceeding 500 kilometers. Arrowline Logistics integrates directly with Indian Railways and container train operators (CONCOR) to deliver scheduled rail freight solutions. Operating directly out of Mundra Port, we connect maritime trade with key inland dry ports and industrial sidings.",
    aboutBulletPoints: [
      "Direct integration with Western Dedicated Freight Corridor (WDFC) for express transit",
      "Significant cost savings of 25% to 40% compared to long-distance road trucking",
      "Guaranteed wagon and rake allocations for bulk, containerized, and industrial freight",
      "End-to-end intermodal coordination from port dock to inland railhead and factory gate",
      "Substantially reduced carbon footprint per ton-kilometer for ESG-compliant supply chains",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    capabilities: [
      { title: "WDFC Express Corridors", desc: "Utilizing high-speed dedicated rail freight lines from Mundra to Northern India ICDs." },
      { title: "Bulk Wagon Allocations", desc: "Covered box (BOXN), flat wagon (BRN/BCN), and specialized rake placements for industrial loads." },
      { title: "Terminal Handling Synchronization", desc: "Coordinated crane offloading at inland container depots and railway goods sheds." },
      { title: "Intermodal First & Last Mile", desc: "Trucking fleets positioned at railheads for seamless delivery to consignee docks." },
    ],
    whyArrowline: [
      { number: "01", title: "Corridor Access", desc: "Direct access to Mundra Port rail sidings connecting to major national rail corridors." },
      { number: "02", title: "Volume Economy", desc: "Unmatched cost savings on bulk, heavy metal, and multi-container long-haul consignments." },
      { number: "03", title: "Weather Immunity", desc: "Rail schedules remain immune to highway closures, monsoons, and road traffic gridlocks." },
      { number: "04", title: "Schedule Reliability", desc: "Predictable departure and arrival windows coordinated with CONCOR timetables." },
      { number: "05", title: "End-to-End Tracking", desc: "Rail wagon telemetry combined with road tracking for complete cargo visibility." },
    ],
    processSteps: [
      { step: "01", title: "Freight Assessment", desc: "Evaluating volume, weight, commodity classification, and destination railhead." },
      { step: "02", title: "Rake & Wagon Booking", desc: "Scheduling wagon allocation with railway operators and terminal sidings." },
      { step: "03", title: "Port Siding Loading", desc: "Direct rail wagon loading from Mundra Port terminal or dock warehouse." },
      { step: "04", title: "Dedicated Rail Transit", desc: "Express movement along dedicated freight lines with milestone tracking." },
      { step: "05", title: "Inland Depot Arrival", desc: "Shunting and gantry crane unloading at destination ICD or private siding." },
      { step: "06", title: "Last-Mile Trucking", desc: "Transfer onto Arrowline local trailers for final delivery to factory gate." },
    ],
    applications: [
      { title: "Containerized Import Cargo", desc: "High-volume container rakes moving from Mundra to Delhi NCR, Ludhiana, and Jaipur.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Steel & Metallurgical Freight", desc: "Coils, billets, structural steel, and TMT bars moved in bulk open wagons.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Minerals, Coal & Fertilizer", desc: "Bulk agricultural commodities, soda ash, cement, and chemical raw materials.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Finished Industrial Goods", desc: "Palletized consumer goods and automotive components in covered rail wagons.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
    ],
    industries: ["Steel & Heavy Metals", "Cement & Construction Materials", "Fertilizers & Chemicals", "Automotive & Manufacturing", "Agriculture & Food Commodities", "International Trade (Exim)"],
    faqs: [
      { q: "Why should a business choose rail freight over road transportation?", a: "Rail freight offers substantial cost savings (often 25-40% lower on long-haul routes over 500 km), higher single-trip volume capacity (up to 2,500-3,000 MT per train load), immunity to highway traffic/weather delays, and significantly lower carbon emissions." },
      { q: "How does rail connectivity work from Mundra Port?", a: "Mundra Port has dedicated double-stack container-capable rail sidings integrated directly with the Western Dedicated Freight Corridor (WDFC), enabling high-speed transit to Northern ICDs (such as Delhi NCR, Dadri, Kathuwas, and Ludhiana) in under 24 to 36 hours." },
      { q: "What is the minimum volume required for rail freight?", a: "We handle both Full Train Loads (rake level) and individual container / multi-container wagon shipments (FCL) through consolidated container train services." },
      { q: "Does Arrowline handle first-mile and last-mile road trucking from railheads?", a: "Yes. Our multimodal logistics team arranges seamless road pickup at origin, transfers to the rail siding, rail haulage, and final road delivery from the destination ICD directly to your factory." },
      { q: "How is cargo tracked during rail transit?", a: "We monitor rail wagon and train movement via FOIS (Freight Operations Information System) and CONCOR telemetry, providing regular milestone updates to clients." },
    ],
    gallery: [
      { id: "rf1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Container Train Rake", caption: "Double-stack container train leaving Mundra port siding" },
      { id: "rf2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "ICD Rail Terminal", caption: "Gantry crane offloading at inland container depot" },
    ],
    ctaHeadline: "Harness the Cost & Scale Advantage of Rail Freight",
    seoTitle: "Rail Freight Transportation Services India | Mundra Rail Cargo | Arrowline",
    seoDesc: "Cost-effective rail freight transportation services across India. WDFC corridor access, full train loads, container trains, and multimodal integration.",
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: "rail-sub-2",
    slug: "container-rail-transportation",
    parentSlug: "rail-transportation",
    parentName: "Rail Transportation",
    title: "Container Rail Transportation",
    shortDesc: "Scheduled container train services connecting Mundra Port to inland container depots (ICDs) across North and Central India.",
    heroHeadline: "Container Rail Transportation & ICD Connectivity",
    heroSubheadline: "Scheduled double-stack container rakes from Mundra Port to major inland dry ports for import and export containers.",
    heroBadge: "RAIL TRANSPORTATION • CONTAINER RAIL",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg",
    aboutBadge: "CONTAINER RAIL LOGISTICS",
    aboutHeading: "Seamless Port-to-ICD Container Movement via Dedicated Freight Corridors.",
    aboutDescription: "Container rail transportation is the backbone of India's import-export supply chain, moving thousands of 20ft and 40ft containers daily from maritime terminals to inland trade hubs. Arrowline Logistics coordinates container rake movements between Mundra Port and Inland Container Depots (ICDs) across Delhi NCR, Rajasthan, Punjab, Haryana, and Uttar Pradesh. We eliminate port congestion and optimize long-haul container shipping economics.",
    aboutBulletPoints: [
      "Direct double-stack container train operations on the Western Dedicated Freight Corridor",
      "Regular scheduled services to major ICDs: Dadri, Tughlakabad, Khatuwas, Sanand, Ludhiana",
      "Complete customs bond transit coordination from port terminal to dry port",
      "Both 20ft and 40ft standard, high-cube, and specialized container handling",
      "Integrated last-mile delivery from inland dry port directly to factory gates",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    capabilities: [
      { title: "Double-Stack Container Capability", desc: "Maximizing volume efficiency and lowering per-TEU freight rates on electrified corridors." },
      { title: "ICD Network Connectivity", desc: "Direct links to all major inland container depots across Northern and Western India." },
      { title: "Customs In-Bond Movement", desc: "Enabling cargo to move under customs bond to destination ICD for localized duty clearance." },
      { title: "Empty Container Repositioning", desc: "Coordinated return of empty boxes back to maritime terminals for export stuffing." },
    ],
    whyArrowline: [
      { number: "01", title: "Port Terminal Access", desc: "Seamless coordination with all Mundra container terminals (MICT, CT2, CT3, CT4)." },
      { number: "02", title: "Transit Speed", desc: "WDFC rail transit reaches Delhi NCR inland depots in as fast as 24-30 hours." },
      { number: "03", title: "Demurrage Avoidance", desc: "Immediate rail loading upon vessel discharge minimizing port ground rent and container detention." },
      { number: "04", title: "High Reliability", desc: "Scheduled rail timetables unaffected by highway congestion or weather blockages." },
      { number: "05", title: "Full Multimodal Control", desc: "Single-window accountability from maritime arrival to inland warehouse dock." },
    ],
    processSteps: [
      { step: "01", title: "Terminal Discharge", desc: "Container discharge from vessel at Mundra Port terminal." },
      { step: "02", title: "Rail Siding Transfer", desc: "Internal port transfer from container stack to rail loading siding." },
      { step: "03", title: "Train Rake Loading", desc: "Loading onto scheduled container train with customs bond paperwork." },
      { step: "04", title: "Corridor Rail Transit", desc: "Express transit via Dedicated Freight Corridor to destination ICD." },
      { step: "05", title: "ICD Gantry Offload", desc: "Arrival and stacking at destination dry port for customs clearance." },
      { step: "06", title: "Factory Delivery", desc: "Local trailer delivery from ICD to final manufacturing consignee." },
    ],
    applications: [
      { title: "Import Raw Materials", desc: "Chemicals, polymers, metal scrap, paper pulp, and manufacturing inputs in 20ft/40ft boxes.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Export Finished Products", desc: "Automotive parts, textiles, garments, tiles, and machinery moved under export seal.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Solar Module Shipments", desc: "High-volume containerized solar panels and inverters for utility-scale solar parks.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Consumer Goods & Electronics", desc: "Retail inventories and consumer appliances destined for major consumption centers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
    ],
    industries: ["International Trade (Exim)", "Solar & Clean Energy", "Textiles & Garment Exports", "Chemicals & Plastics", "Ceramics & Tiles", "Automotive & Heavy Industry"],
    faqs: [
      { q: "What is an ICD (Inland Container Depot) and how does container rail help?", a: "An ICD is a dry port located inland that functions like a seaport, offering customs clearance, container storage, and cargo inspection. Container rail allows import cargo to bypass port customs and travel directly by train to an ICD near your factory for local clearance." },
      { q: "Which Inland Container Depots does Arrowline connect from Mundra?", a: "We coordinate container rail movement to major ICDs including ICD Dadri, ICD Tughlakabad (TKD), ICD Patli, ICD Khatuwas, ICD Sanand, ICD Ludhiana, ICD Jaipur, and ICD Hyderabad." },
      { q: "What is double-stack container rail?", a: "Double-stacking involves placing two shipping containers on top of each other on specialized railway flatcars along high-clearance electrified freight corridors (WDFC), doubling train capacity and lowering freight costs." },
      { q: "Can Arrowline handle both 20-foot and 40-foot containers by rail?", a: "Yes. We handle 20ft standard, 40ft standard, 40ft High Cube, and specialized open-top/flat-rack containers on rail rakes." },
      { q: "How do we prevent container detention when moving by rail?", a: "Our dedicated Mundra rail desk ensures rapid rake loading within the free port period and coordinates immediate trailer pickup at the destination ICD once the train arrives." },
    ],
    gallery: [
      { id: "cr1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Double-Stack Container Train", caption: "High-capacity container train moving on Dedicated Freight Corridor" },
      { id: "cr2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Mundra Port Rail Siding", caption: "Container crane loading direct from port stack" },
    ],
    ctaHeadline: "Fast-Track Your Containers via High-Speed Rail Corridors",
    seoTitle: "Container Rail Transportation Services India | Port to ICD | Arrowline",
    seoDesc: "Scheduled container rail transportation from Mundra Port to major inland container depots (ICDs). High-speed double-stack trains, cost savings, and live tracking.",
    isPublished: true,
    displayOrder: 2,
  },
  {
    id: "rail-sub-3",
    slug: "full-train-load-ftl",
    parentSlug: "rail-transportation",
    parentName: "Rail Transportation",
    title: "Full Train Load (FTL) Services",
    shortDesc: "Dedicated full train load (rake) logistics for high-volume bulk commodities, minerals, cement, fertilizers, and industrial steel.",
    heroHeadline: "Full Train Load (FTL) Dedicated Rail Services",
    heroSubheadline: "Exclusive chartered trainload capacity moving 2,500+ metric tons per single journey for major industrial supply chains.",
    heroBadge: "RAIL TRANSPORTATION • FULL TRAIN LOAD",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    aboutBadge: "FULL TRAIN LOAD (RAKE)",
    aboutHeading: "Massive Volume Capacity. Predictable Schedules. Maximum Freight Economy.",
    aboutDescription: "For mega-scale industrial operations, Full Train Load (FTL) rake movements provide unmatched logistical scale and economies of scale. Arrowline Logistics coordinates complete dedicated trainloads (typically 40 to 45 wagons moving 2,500 to 3,500 MT of cargo per rake) for heavy manufacturing, mining, agriculture, and infrastructure sectors. We handle terminal siding approvals, wagon indenting, and end-to-end transit execution.",
    aboutBulletPoints: [
      "Dedicated full rake capacity (40-45 wagons) carrying up to 3,500 Metric Tons per trip",
      "Specialized wagon types: BOXN (open top), BCN/BCNHL (covered), and BRN (flat wagons)",
      "Direct private siding-to-siding movement bypassing public freight terminals",
      "Coordination with Indian Railways FOIS for priority track slot allocation",
      "Ideal for cement, coal, iron ore, steel coils, fertilizers, and bulk grain movements",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    capabilities: [
      { title: "Full Rake Indenting & Allocation", desc: "Managing statutory railway indents and securing priority train allocations." },
      { title: "Private Siding Management", desc: "Coordination at factory and port rail sidings for rapid mechanized loading and unloading." },
      { title: "Bulk Cargo Handling", desc: "Mechanized conveyor, tippler, and gantry crane loading for zero cargo loss." },
      { title: "High-Volume Transit Control", desc: "Round-the-clock railway operations monitoring from departure to destination siding." },
    ],
    whyArrowline: [
      { number: "01", title: "Unmatched Scale", desc: "Single train movement replaces 80 to 100 highway trucks, slashing logistical complexity." },
      { number: "02", title: "Lowest Cost Per Ton", desc: "Optimal freight economics for high-volume industrial bulk materials." },
      { number: "03", title: "Direct Siding Routing", desc: "Direct loading and unloading at private plant sidings with minimal double-handling." },
      { number: "04", title: "Regulatory Expertise", desc: "In-depth knowledge of Indian Railways commercial freight tariffs, demurrage rules, and siding policies." },
      { number: "05", title: "Turnkey Coordination", desc: "Managing loading labor, machinery, port permissions, and railway clearances." },
    ],
    processSteps: [
      { step: "01", title: "Volume & Route Planning", desc: "Analyzing monthly tonnage, siding specifications, and wagon type required." },
      { step: "02", title: "Railway Indent Placement", desc: "Submitting official railway indent and securing rake placement schedule." },
      { step: "03", title: "Siding Placement", desc: "Placement of empty rake at port or private plant rail siding." },
      { step: "04", title: "Mechanized Loading", desc: "High-speed loading within railway free time using conveyors or loaders." },
      { step: "05", title: "Block Train Transit", desc: "Dedicated point-to-point rail movement on prioritized freight tracks." },
      { step: "06", title: "Destination Unloading", desc: "Mechanized discharge at destination siding and rake release back to railway." },
    ],
    applications: [
      { title: "Cement & Clinker", desc: "Bulk cement and clinker transported from manufacturing plants to distribution hubs.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Steel Billets, Coils & TMT", desc: "Finished and semi-finished steel products moved from mills to industrial markets.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Fertilizers & Agro Commodities", desc: "Urea, DAP, potash, and food grains moved in covered BCN wagons under dry protection.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Coal, Minerals & Ores", desc: "Raw materials for thermal power plants, foundries, and metallurgical smelters.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Steel & Metal Producers", "Cement & Building Materials", "Fertilizer & Agro Industries", "Thermal Power & Energy", "Mining & Mineral Extraction", "Large-Scale Infrastructure"],
    faqs: [
      { q: "What is a Full Train Load (FTL / Rake) in rail logistics?", a: "A Full Train Load (or full rake) is a complete dedicated train consisting of 40 to 45 rail wagons booked exclusively for one client's cargo, moving 2,500 to 3,500 metric tons directly between two railway sidings." },
      { q: "What types of wagons are used for Full Train Load movements?", a: "We utilize BOXN (open high-sided wagons for minerals/coal), BCN/BCNHL (covered waterproof wagons for cement, grain, fertilizers), and BRN/BFNS (flat wagons with stanchions for steel coils, plates, and long rails)." },
      { q: "How is loading managed within the railway free time?", a: "Indian Railways enforces strict loading/unloading free time (typically 5 to 9 hours depending on rake type). Arrowline deploys heavy-duty mechanization, loaders, and experienced supervision teams to guarantee zero demurrage penalties." },
      { q: "Can Full Train Load rakes operate between private sidings?", a: "Yes. Point-to-point private siding movements provide maximum efficiency, moving cargo directly from a port or factory siding into the destination plant siding without intermediate handling." },
      { q: "How much advance notice is required to book a full rail rake?", a: "Railway indents typically require 3 to 7 days advance placement depending on corridor congestion and wagon availability." },
    ],
    gallery: [
      { id: "ftl1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Full Train Load Rake", caption: "Dedicated bulk freight rake moving across Western corridor" },
      { id: "ftl2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Steel Rake Loading", caption: "Mechanized steel coil loading onto flat rail wagons" },
    ],
    ctaHeadline: "Scale Your Bulk Freight Logistics with Full Train Loads",
    seoTitle: "Full Train Load (FTL) Rail Freight Services India | Arrowline Logistics",
    seoDesc: "Dedicated Full Train Load (FTL / Rake) rail freight services in India. 2,500+ MT capacity per train, private siding integration, and bulk commodities.",
    isPublished: true,
    displayOrder: 3,
  },
  {
    id: "rail-sub-4",
    slug: "multimodal-rail-transportation",
    parentSlug: "rail-transportation",
    parentName: "Rail Transportation",
    title: "Multimodal Rail Transportation",
    shortDesc: "Synchronized rail, road, and port logistics combining the cost efficiency of long-haul rail with the precision of first-and-last-mile trucking.",
    heroHeadline: "Integrated Multimodal Rail & Road Transportation",
    heroSubheadline: "End-to-end multimodal supply chain pipelines seamlessly combining rail freight, highway trucking, and port handling.",
    heroBadge: "RAIL TRANSPORTATION • MULTIMODAL RAIL",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg",
    aboutBadge: "MULTIMODAL RAIL INTEGRATION",
    aboutHeading: "The Best of Both Worlds: Rail Cost Efficiency + Road Doorstep Delivery.",
    aboutDescription: "Pure rail transport moves heavy cargo between railheads, but businesses need door-to-door delivery. Arrowline's multimodal rail transportation integrates long-haul rail corridors with dedicated first-mile pickup and last-mile trucking. We take full single-window responsibility from origin factory floor to destination warehouse, managing all modal transfers, transshipments, and digital tracking.",
    aboutBulletPoints: [
      "Single-carrier accountability for complete door-to-door multimodal journeys",
      "Synchronized transshipment between road trailers and rail wagons at dry ports",
      "Optimal balance of lower rail freight costs and flexible road pickup/delivery",
      "Unified digital consignment tracking across both rail lines and highway sectors",
      "Seamless integration with customs clearance and port terminal operations at Mundra",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    capabilities: [
      { title: "First-Mile Road Collection", desc: "Dedicated truck fleets picking up cargo from factory gates and hauling to nearest railhead." },
      { title: "Express Rail Transit", desc: "Long-haul movement via Dedicated Freight Corridors bypassing road toll and traffic." },
      { title: "Rapid Terminal Transshipment", desc: "Specialized reach stackers and cranes transferring containers/cargo in under 30 minutes." },
      { title: "Last-Mile Dock Delivery", desc: "Local delivery trailers scheduled precisely to match consignee receiving dock windows." },
    ],
    whyArrowline: [
      { number: "01", title: "Single-Window Simplicity", desc: "One logistics partner, one contract, one point of contact for the entire journey." },
      { number: "02", title: "Cost & Speed Balance", desc: "Up to 30% cost savings over pure road freight while maintaining predictable transit timelines." },
      { number: "03", title: "Transshipment Safety", desc: "Experienced terminal handlers ensuring zero cargo handling damage during modal shifts." },
      { number: "04", title: "Fleet Synergy", desc: "Arrowline-owned and contracted road trailers synchronized with railhead train schedules." },
      { number: "05", title: "Green Logistics", desc: "Significant reduction in overall corporate carbon emissions through rail-first routing." },
    ],
    processSteps: [
      { step: "01", title: "Door Pickup", desc: "Arrowline truck collects cargo at shipper manufacturing facility." },
      { step: "02", title: "Railhead Transfer", desc: "Transfer to origin rail terminal or Mundra port rail siding." },
      { step: "03", title: "Rail Loading", desc: "Secure loading onto scheduled container or freight rail rake." },
      { step: "04", title: "Long-Haul Rail Transit", desc: "High-speed rail movement across national freight corridors." },
      { step: "05", title: "Destination Transshipment", desc: "Unloading at destination dry port and staging onto local delivery chassis." },
      { step: "06", title: "Doorstep Delivery", desc: "Final road delivery and signed proof of delivery at consignee dock." },
    ],
    applications: [
      { title: "Heavy Industrial Components", desc: "Machinery, castings, and fabricated assemblies moving between manufacturing states.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Fast-Moving Consumer Goods", desc: "Palletized packaged goods moving from western production hubs to northern consumption zones.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Import Raw Materials", desc: "Port containers transferred from Mundra vessel direct to inland factories.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Automotive Parts & Engines", desc: "Synchronized JIT supply chain components moving between auto clusters.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
    ],
    industries: ["Automotive & OEMs", "FMCG & Consumer Goods", "Chemicals & Plastics", "Heavy Engineering", "Textiles & Apparel", "Solar & Renewable Energy"],
    faqs: [
      { q: "What is multimodal rail transportation?", a: "Multimodal rail transportation combines multiple transport modes—typically road trucking for initial pickup and final delivery, combined with rail freight for the long-haul middle section—under a single unified logistics contract and tracking system." },
      { q: "How does multimodal rail save costs compared to pure road transport?", a: "Because rail freight per ton-kilometer is significantly cheaper than diesel trucking over long distances (500+ km), combining short-haul trucking with long-haul rail reduces overall freight expenditure by 20% to 35%." },
      { q: "Who is responsible if cargo is delayed or damaged during a modal shift?", a: "Arrowline assumes single-window end-to-end liability across the entire journey, eliminating finger-pointing between separate trucking companies and rail handlers." },
      { q: "How long does a multimodal journey typically take from Mundra to North India?", a: "A complete multimodal door-to-door transit from Mundra Port to a factory in Delhi NCR, Haryana, or Rajasthan typically takes 2 to 4 days, including road transfers and rail transit." },
      { q: "Can we track our multimodal shipment in real time?", a: "Yes. Our tracking dashboard integrates both truck GPS telemetry and railway wagon location data, providing continuous visibility from origin to destination." },
    ],
    gallery: [
      { id: "mr1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Multimodal Terminal Hub", caption: "Synchronized road-rail container transfer at dry port" },
      { id: "mr2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "First-Mile Road Haulage", caption: "Arrowline trailer delivering container to rail siding" },
    ],
    ctaHeadline: "Streamline Your Supply Chain with Multimodal Rail Logistics",
    seoTitle: "Multimodal Rail Transportation Services India | Door to Door | Arrowline",
    seoDesc: "Seamless multimodal rail and road transportation services across India. End-to-end door-to-door delivery, cost efficiency, and single-window accountability.",
    isPublished: true,
    displayOrder: 4,
  },
  {
    id: "rail-sub-5",
    slug: "intermodal-rail-freight",
    parentSlug: "rail-transportation",
    parentName: "Rail Transportation",
    title: "Intermodal Rail Freight",
    shortDesc: "Standardized containerized intermodal rail freight without cargo handling during transfer between ships, trains, and highway trucks.",
    heroHeadline: "Standardized Intermodal Rail Freight Solutions",
    heroSubheadline: "Zero cargo touchpoints during mode transfers using standardized ISO containers across sea, rail, and road networks.",
    heroBadge: "RAIL TRANSPORTATION • INTERMODAL FREIGHT",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
    aboutBadge: "INTERMODAL RAIL ADVANTAGE",
    aboutHeading: "Seamlessly Transitioning Standard Containers Across Ship, Rail & Highway.",
    aboutDescription: "Intermodal rail freight involves the movement of cargo in standardized containers or trailers across multiple modes of transportation without the cargo itself being handled during mode changes. Arrowline Logistics orchestrates intermodal supply chains connecting Mundra maritime terminals to inland rail corridors and highway delivery. This eliminates theft, contamination, and handling damage while maximizing transit velocity.",
    aboutBulletPoints: [
      "Zero cargo touchpoints—the sealed container moves seamlessly between ship, rail, and road",
      "Elimination of cargo damage, pilferage, and weather exposure during transshipment",
      "Standardized ISO container handling using modern twist-lock mechanisms and gantry cranes",
      "Optimized for international shipping containers and domestic intermodal boxes",
      "Synchronized documentation complying with maritime bills of lading and railway receipts",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    capabilities: [
      { title: "Standardized ISO Handling", desc: "Universal compatibility across container ships, rail flatcars, and highway skeletal trailers." },
      { title: "Rapid Terminal Transfers", desc: "Gantry crane transfers from rail flatcars onto delivery chassis in under 15 minutes." },
      { title: "Sealed Cargo Integrity", desc: "Customs and tamper-evident high-security seals remain intact throughout the entire journey." },
      { title: "Reduced Carbon Footprint", desc: "Maximizing the rail sector length to reduce total journey greenhouse gas emissions." },
    ],
    whyArrowline: [
      { number: "01", title: "Zero Cargo Risk", desc: "No direct touching of cargo prevents scratches, spills, weather exposure, or breakage." },
      { number: "02", title: "Speed of Transfer", desc: "Automated container lifting allows rapid mode changes without labor-intensive restuffing." },
      { number: "03", title: "Port Integration", desc: "Direct rail loading at Mundra port container terminals immediately after ship offloading." },
      { number: "04", title: "Corridor Reliability", desc: "Priority train paths along the Western Dedicated Freight Corridor." },
      { number: "05", title: "End-to-End Visibility", desc: "Real-time tracking of container seal, temperature (for reefers), and GPS location." },
    ],
    processSteps: [
      { step: "01", title: "Factory Stuffing", desc: "Cargo stuffed and sealed inside standard ISO container at origin." },
      { step: "02", title: "First-Mile Road Transit", desc: "Container hauled on trailer to origin rail terminal or Mundra port." },
      { step: "03", title: "Gantry Rail Loading", desc: "Container lifted by gantry crane directly onto rail flatcar without opening." },
      { step: "04", title: "Intermodal Rail Leg", desc: "High-speed rail transit across national freight corridors." },
      { step: "05", title: "Destination Crane Lift", desc: "Container transferred from train onto delivery trailer at inland dry port." },
      { step: "06", title: "Final Doorstep Unseal", desc: "Consignee breaks the seal at final destination for secure de-stuffing." },
    ],
    applications: [
      { title: "High-Value Electronic Goods", desc: "Sealed container movement protecting sensitive electronics from moisture and pilferage.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Chemicals & Liquid ISO Tanks", desc: "Specialized liquid chemical ISO tank containers moved safely without transfer pumping.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Automotive Parts & Engines", desc: "Crated automotive components moving under factory seal to assembly plants.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "FMCG & Packaged Foods", desc: "Clean container boxes preserving packaged food quality across multi-state transit.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
    ],
    industries: ["Electronics & Consumer Tech", "Chemicals & Petrochemicals", "Automotive & Heavy Industry", "Pharmaceuticals", "Food & Beverage", "Exim Shippers"],
    faqs: [
      { q: "What is the difference between multimodal and intermodal freight?", a: "While both involve multiple modes of transport, 'Intermodal' specifically means the cargo stays inside the exact same container throughout the entire trip without ever being unpacked or handled during mode changes. 'Multimodal' refers to the single-contract management of the entire journey." },
      { q: "Can ISO liquid tank containers be moved by intermodal rail?", a: "Yes. Standard 20ft ISO tank containers carrying non-hazardous and approved hazardous liquid chemicals can be safely transported via intermodal rail flatcars." },
      { q: "How are containers secured onto railway flatcars?", a: "Railway flatcars are equipped with standardized automatic twist-locks that lock the four bottom corner castings of the ISO container securely to the chassis frame." },
      { q: "What are the security benefits of intermodal rail?", a: "Because the container is sealed at origin and never opened until it reaches the destination factory, cargo theft, pilferage, and accidental damage are virtually eliminated." },
      { q: "Does intermodal rail support reefer (temperature-controlled) containers?", a: "Yes. Specialized reefer container trains equipped with central generator power cars maintain continuous temperature control during rail transit." },
    ],
    gallery: [
      { id: "ir1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Intermodal Rail Flatcar", caption: "Standardized container secured with twist-locks on rail wagon" },
      { id: "ir2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "Reach Stacker Transfer", caption: "Rapid container transfer between rail wagon and road chassis" },
    ],
    ctaHeadline: "Protect Cargo Integrity with Intermodal Rail Freight",
    seoTitle: "Intermodal Rail Freight Services India | Container Rail Logistics | Arrowline",
    seoDesc: "Standardized intermodal rail freight services connecting Mundra Port across India. Zero cargo touchpoints, sealed container security, and maximum cost efficiency.",
    isPublished: true,
    displayOrder: 5,
  },
  {
    id: "rail-sub-6",
    slug: "bulk-industrial-cargo",
    parentSlug: "rail-transportation",
    parentName: "Rail Transportation",
    title: "Bulk & Industrial Cargo Transportation",
    shortDesc: "High-tonnage rail transportation for heavy industrial commodities, raw materials, steel, minerals, and loose bulk goods.",
    heroHeadline: "Bulk & Industrial Cargo Rail Transportation",
    heroSubheadline: "Heavy-tonnage rail freight solutions designed for raw material supply chains, metallurgical plants, and bulk commodity movements.",
    heroBadge: "RAIL TRANSPORTATION • BULK INDUSTRIAL",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    aboutBadge: "BULK RAIL LOGISTICS",
    aboutHeading: "Moving High-Tonnage Industrial Commodities with Maximum Rail Efficiency.",
    aboutDescription: "Heavy industry requires continuous, reliable raw material supply chains moving thousands of tons of bulk cargo without interruption. Arrowline Logistics specializes in bulk and industrial cargo rail logistics, connecting port bulk terminals and mining regions to industrial smelters, power plants, and manufacturing clusters across India. We manage open wagon rakes, covered bulk trains, and mechanized terminal transfer operations.",
    aboutBulletPoints: [
      "Specialized bulk rail wagons: BOXN open wagons, BCN covered rakes, and hopper wagons",
      "High payload capacity moving up to 3,500 MT of bulk material per single trainload",
      "Mechanized loading via port conveyor systems, wheel loaders, and wagon tipplers",
      "Strict moisture and environmental protection protocols for sensitive bulk commodities",
      "Coordination with Indian Railways freight corridors for prioritized route clearance",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    capabilities: [
      { title: "Open & Covered Wagon Fleets", desc: "Deploying the exact wagon type required for weather-tolerant or moisture-sensitive bulk materials." },
      { title: "Rapid Mechanized Loading", desc: "High-speed port terminal loading systems to complete rake loading within railway free time." },
      { title: "Heavy Metallurgical Transit", desc: "Specialized securing and weight distribution for heavy steel billets, slabs, and coils on flat wagons." },
      { title: "Industrial Siding Management", desc: "Operating within private plant railway sidings for direct factory raw material intake." },
    ],
    whyArrowline: [
      { number: "01", title: "Heavy Cargo Scale", desc: "Capable of handling continuous multi-rake monthly supply programs for major industries." },
      { number: "02", title: "Terminal Siding Speed", desc: "Expert loading supervision minimizing railway demurrage and detention charges." },
      { number: "03", title: "Port Direct Link", desc: "Direct rail lines connecting Mundra Port dry bulk and breakbulk berths into the national grid." },
      { number: "04", title: "Cost Efficiency", desc: "Significantly lower per-ton shipping costs compared to road trucking for heavy commodities." },
      { number: "05", title: "Supply Chain Reliability", desc: "Buffer stock management and scheduled train arrivals preventing plant shutdown." },
    ],
    processSteps: [
      { step: "01", title: "Commodity Analysis", desc: "Evaluating density, moisture sensitivity, grain size, and wagon loading characteristics." },
      { step: "02", title: "Rake Indenting", desc: "Booking appropriate railway wagon type and securing loading siding slot." },
      { step: "03", title: "Port Berth Discharge", desc: "Discharging vessel bulk cargo direct into port rail wagons or staging yard." },
      { step: "04", title: "Railway Transit", desc: "Coordinated freight movement across dedicated rail corridors with telemetry." },
      { step: "05", title: "Destination Siding Arrival", desc: "Placement at plant siding for mechanized tippler or crane discharge." },
      { step: "06", title: "Weight Reconciliation", desc: "Weighbridge gross and tare certification verifying exact delivered tonnage." },
    ],
    applications: [
      { title: "Steel Plates, Billets & Coils", desc: "Finished industrial steel products moved on heavy flatbed wagons with stanchions.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Coal & Coke", desc: "Thermal and coking coal for power plants, foundries, and steel manufacturers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Fertilizers (Urea / DAP)", desc: "Bagged and bulk fertilizer shipments moved in covered waterproof BCN rakes.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Minerals & Industrial Sand", desc: "Bauxite, gypsum, silica sand, and bentonite clay for manufacturing plants.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Steel Mills & Foundries", "Thermal Power Generation", "Cement & Building Materials", "Fertilizer Manufacturers", "Chemical & Mineral Processing", "Mining & Metal Smelting"],
    faqs: [
      { q: "What types of bulk commodities can be transported by rail?", a: "We transport a broad range of bulk industrial goods including finished steel (coils, plates, TMT), coal, coke, iron ore, clinker, cement, fertilizers (urea, DAP), bauxite, soda ash, and agricultural commodities." },
      { q: "How is bulk cargo protected from rain and weather in rail transit?", a: "Moisture-sensitive cargo (such as cement, fertilizers, and grains) is transported exclusively in covered, waterproof BCN/BCNHL wagons. For open BOXN wagons, heavy-duty waterproof tarpaulins and tie-downs are applied." },
      { q: "What is the weight capacity of a bulk rail rake?", a: "A standard 45-wagon freight rake carries between 2,500 to 3,500 metric tons of bulk material in a single journey, replacing up to 100 heavy highway trucks." },
      { q: "How do you verify weight accuracy for bulk commodities?", a: "All wagons pass through certified electronic in-motion weighbridges (EIMWB) at both origin and destination sidings to guarantee exact net payload verification." },
      { q: "Can Arrowline manage siding operations inside our plant?", a: "Yes. We offer comprehensive siding logistics management, including shunting coordination, mechanized unloading labor, and tippler equipment operation." },
    ],
    gallery: [
      { id: "bi1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Bulk Freight Train", caption: "Heavy industrial bulk rake moving along electrified rail corridor" },
      { id: "bi2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Steel Wagon Loading", caption: "Mechanized gantry crane loading steel coils onto rail flatcars" },
    ],
    ctaHeadline: "Power Your Industrial Supply Chain with Bulk Rail Logistics",
    seoTitle: "Bulk & Industrial Cargo Rail Transportation India | Arrowline Logistics",
    seoDesc: "High-tonnage bulk and industrial cargo rail transportation across India. Dedicated rakes for steel, coal, fertilizers, minerals, and heavy commodities.",
    isPublished: true,
    displayOrder: 6,
  },
];

// =========================================================================
// 3. PROJECT CARGO TRANSPORTATION
// =========================================================================

const projectCargoSubServices: SubServiceData[] = [
  {
    id: "proj-sub-1",
    slug: "heavy-odc-cargo",
    parentSlug: "project-cargo-transportation",
    parentName: "Project Cargo Transportation",
    title: "Heavy & ODC Cargo Transportation",
    shortDesc: "Engineered heavy-lift transportation for Over Dimensional Cargo (ODC) and super-heavy industrial machinery exceeding standard highway parameters.",
    heroHeadline: "Heavy & ODC Cargo Transportation With Engineered Precision",
    heroSubheadline: "Hydraulic multi-axle trailers, technical route surveys, civil infrastructure reinforcement, and turn-key heavy haulage across India.",
    heroBadge: "PROJECT CARGO • HEAVY & ODC",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377043/arrowline/general/project-road.jpg",
    aboutBadge: "HEAVY & ODC TRANSPORTATION",
    aboutHeading: "Safely Moving India's Heaviest & Largest Industrial Machinery.",
    aboutDescription: "Over Dimensional Cargo (ODC) and super-heavy project equipment demand specialized engineering, precision equipment selection, and rigorous safety coordination. Arrowline Logistics specializes in hauling super-heavy reactors, power transformers, wind turbine components, and industrial machinery across complex Indian road corridors. We handle everything from technical bridge load assessments to multi-axle hydraulic puller execution.",
    aboutBulletPoints: [
      "Hydraulic multi-axle modular trailers capable of handling concentrated loads exceeding 350 MT",
      "Detailed engineering route surveys assessing bridge load ratings, turning radiuses, and vertical clearances",
      "Statutory MoRTH and NHAI nationwide online heavy cargo transit permits and state escorts",
      "Civil road modifications including bypass construction, tree trimming, and power line shutdowns",
      "Experienced heavy-haul transport engineers on-site from port vessel hook to plant foundation",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Hydraulic Modular Multi-Axles", desc: "Configurable multi-axle combinations distributing extreme point loads safely across highways." },
      { title: "Drop-Deck & Low-Bed Fleet", desc: "Ultra low-bed trailers providing maximum vertical clearance under road overbridges (ROBs)." },
      { title: "Civil Route Engineering", desc: "Physical surveying and temporary bridge propping/bypass construction for heavy convoys." },
      { title: "Escort & Pilot Protection", desc: "Dedicated front and rear escort teams coordinating local traffic and safe navigation." },
    ],
    whyArrowline: [
      { number: "01", title: "Engineering First", desc: "Every heavy lift is engineered with AutoCAD swept path analysis, center of gravity, and lashing plans." },
      { number: "02", title: "Port Staging Power", desc: "Direct access to heavy-lift mobile harbor cranes and staging yards at Mundra Port." },
      { number: "03", title: "Permit Network", desc: "Established relations for rapid NHAI, state police, and electrical authority clearances." },
      { number: "04", title: "Specialized Equipment", desc: "Modern hydraulic multi-axle pullers, steering dollies, and girder bridge trailers." },
      { number: "05", title: "Zero-Incident Record", desc: "Strict adherence to international safety standards protecting multi-crore capital assets." },
    ],
    processSteps: [
      { step: "01", title: "Engineering Assessment", desc: "Analyzing dimensional drawings, center of gravity, and lifting/lashing points." },
      { step: "02", title: "Physical Route Survey", desc: "Surveying the entire route for bridges, culverts, toll plazas, and overhead obstacles." },
      { step: "03", title: "Permits & Clearances", desc: "Securing statutory NHAI, state administration, and power utility permissions." },
      { step: "04", title: "Port Hook Offloading", desc: "Direct vessel tandem crane discharge onto Arrowline hydraulic multi-axle trailer." },
      { step: "05", title: "Supervised Transit", desc: "Slow, controlled convoy movement escorted by technical teams and pilot vehicles." },
      { step: "06", title: "Foundation Placement", desc: "Direct positioning or hydraulic skidding onto plant foundation at site." },
    ],
    applications: [
      { title: "Power Transformers & Turbines", desc: "Heavy electrical generation transformers and steam turbines for power grids.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Petrochemical Reactors & Columns", desc: "High-pressure catalytic reactors, distillation columns, and flare stacks.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Wind Turbine Nacelles & Blades", desc: "Heavy wind turbine nacelles and extra-long wind turbine rotor blades.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Foundry & Steel Mill Presses", desc: "Heavy hydraulic press frames, forging hammers, and continuous casting rollers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["Power Generation & Utilities", "Oil, Gas & Petrochemicals", "Heavy Engineering & Fabrication", "Renewable Energy (Wind & Solar)", "Mining & Mineral Processing", "Infrastructure & Bridge Construction"],
    faqs: [
      { q: "What is considered Heavy & ODC Cargo in Indian logistics?", a: "In India, cargo is classified as ODC (Over Dimensional Cargo) when dimensions exceed 12m length, 2.6m width, or 3.8m height, or when single-unit payload weights exceed standard commercial truck limits (often 40 MT to 350+ MT)." },
      { q: "What is a hydraulic multi-axle trailer?", a: "A hydraulic multi-axle trailer is a modular heavy-duty platform where each axle can be steered independently and adjusted hydraulically in height, allowing uniform weight distribution across dozens of wheels to protect highway bridges." },
      { q: "How do you handle bridge load limits during super-heavy movements?", a: "Our civil engineering team conducts structural load assessments of all bridges along the route. Where necessary, we implement temporary bridge propping, use steel plate spreaders, or construct bypass detours." },
      { q: "Can Arrowline pick up heavy ODC cargo directly from ships at Mundra Port?", a: "Yes. We coordinate directly with port stevedores and heavy-lift vessel cranes to take cargo under hook directly onto our positioned multi-axle trailers." },
      { q: "How are clearances obtained for overhead electrical cables along the route?", a: "We coordinate with local state electricity boards (DISCOMs) to arrange scheduled power shutdowns or cable lifting teams during the passage of extra-height cargo." },
    ],
    gallery: [
      { id: "ho1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Heavy Transformer Transit", caption: "280 MT power transformer on 18-axle hydraulic puller" },
      { id: "ho2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Vessel Under-Hook Loading", caption: "Heavy reactor discharge direct onto Arrowline modular trailer" },
    ],
    ctaHeadline: "Engineer Your Heavy & ODC Movement With Arrowline",
    seoTitle: "Heavy & ODC Cargo Transportation India | Heavy Lift Logistics | Arrowline",
    seoDesc: "Specialized Heavy and ODC Cargo transportation across India. Hydraulic multi-axle trailers, route surveys, bridge propping, and turnkey heavy lift logistics.",
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: "proj-sub-2",
    slug: "breakbulk-cargo",
    parentSlug: "project-cargo-transportation",
    parentName: "Project Cargo Transportation",
    title: "Breakbulk Cargo Transportation",
    shortDesc: "Specialized port stevedoring, marshalling, and highway transport for non-containerized cargo, steel structures, pipes, and crated machinery.",
    heroHeadline: "Breakbulk Cargo Transportation & Port Handling",
    heroSubheadline: "Efficient movement of non-containerized heavy and oversized project shipments from Mundra Port to project sites across India.",
    heroBadge: "PROJECT CARGO • BREAKBULK",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg",
    aboutBadge: "BREAKBULK SPECIALIZATION",
    aboutHeading: "Handling Non-Containerized Project Freight With Total Control.",
    aboutDescription: "Not all industrial cargo fits into standard shipping containers. Breakbulk cargo—including bundled steel pipes, structural girders, large crated machinery, turbine shafts, and rail wagons—requires specialized port-side handling, dedicated rigging, and tailored trailer configurations. Arrowline Logistics provides comprehensive breakbulk management from vessel discharge at Mundra Port to final site delivery.",
    aboutBulletPoints: [
      "Direct vessel-to-truck and vessel-to-storage breakbulk stevedoring coordination",
      "Dedicated staging yards near Mundra Port for sorting, inspection, and sequenced dispatch",
      "Fleet of high-capacity flatbeds, pipe carriers, and semi-low bed trailers",
      "Specialized timber dunnage, coil saddles, and certified chain lashing",
      "Digital inventory tracking matching individual piece numbers and shipping marks",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Direct Hook Receiving", desc: "Coordinating multi-crane discharge from breakbulk vessel holds direct onto positioned trailers." },
      { title: "Port Yard Marshalling", desc: "Short-term storage and grouping of multi-piece project consignments at Mundra staging yards." },
      { title: "Pipe & Steel Transport", desc: "Trailers equipped with bolsters and stanchions designed for high-tonnage pipes and steel beams." },
      { title: "Phased Site Delivery", desc: "Coordinated delivery schedules matching site laydown area capacity and crane availability." },
    ],
    whyArrowline: [
      { number: "01", title: "Mundra Port Proximity", desc: "Immediate operations desk at Mundra Port ensuring zero vessel standby delays." },
      { number: "02", title: "Rigging Expertise", desc: "Certified riggers and heavy-lift supervisors ensuring damage-free slings and spreader beams." },
      { number: "03", title: "Fleet Availability", desc: "Capacity to mobilize 50+ flatbeds and trailers simultaneously for large breakbulk vessel discharges." },
      { number: "04", title: "Piece-Level Tracking", desc: "Tracking every individual piece, crate, and bundle with barcode / manifest matching." },
      { number: "05", title: "Cost Efficiency", desc: "Eliminating port demurrage through rapid evacuation to off-dock staging facilities." },
    ],
    processSteps: [
      { step: "01", title: "Manifest Review", desc: "Cataloging all breakbulk pieces, dimensions, weights, and lifting instructions." },
      { step: "02", title: "Vessel Discharge", desc: "Supervising ship crane discharge onto quay or directly onto waiting trailers." },
      { step: "03", title: "Port Evacuation", desc: "Moving cargo quickly to off-dock staging yard to avoid high terminal storage fees." },
      { step: "04", title: "Sequenced Loading", desc: "Reloading onto road trailers in the exact order needed at construction site." },
      { step: "05", title: "Highway Transport", desc: "Secure road transit with certified chain lashing and real-time GPS telemetry." },
      { step: "06", title: "Site Offload & Signoff", desc: "Supervised unloading and piece-by-piece physical verification against shipping marks." },
    ],
    applications: [
      { title: "Steel Pipes & Tubing", desc: "Oil and gas pipelines, water transmission pipes, and casing strings.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Structural Steel & Girders", desc: "Heavy building trusses, bridge sections, and industrial plant structural members.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Crated Industrial Machinery", desc: "Factory machinery and components packed in heavy wooden export crates.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Wind Energy Towers & Hubs", desc: "Tubular steel tower segments, hub castings, and generator frames.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Oil & Gas Pipelines", "Infrastructure & Bridges", "Steel & Metals", "Renewable Energy", "Plant Engineering & Construction", "International Freight Forwarders"],
    faqs: [
      { q: "What is breakbulk cargo?", a: "Breakbulk cargo refers to non-containerized goods that must be loaded individually onto ships or trailers—such as steel pipes, structural beams, heavy crates, coils, and large machinery pieces." },
      { q: "How does Arrowline handle breakbulk discharge at Mundra Port?", a: "Our port team coordinates directly with ship stevedores, placing trailers under the vessel's hook for direct discharge, or transferring cargo to our nearby staging yard to eliminate costly port wharfage." },
      { q: "What safety measures are used to secure round steel pipes during transit?", a: "We utilize heavy-duty steel stanchions (bolsters), rubber-lined pipe saddles, dynamic ratchet binders, and interlocking timber dunnage to prevent rolling or shifting during highway transit." },
      { q: "Can you handle multi-thousand-ton breakbulk shipments?", a: "Yes. We have the fleet capacity to deploy dozens of trailers concurrently to evacuate thousands of tons of breakbulk cargo from a single vessel discharge." },
      { q: "How do you track individual crates and pieces during transit?", a: "Every piece is logged by its shipping mark, dimensions, weight, and serial number in our digital manifest system, providing complete visibility from port to site." },
    ],
    gallery: [
      { id: "bb1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Breakbulk Vessel Discharge", caption: "Heavy pipe bundles discharged under hook at Mundra port" },
      { id: "bb2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Structural Steel Transport", caption: "Heavy industrial steel trusses secured on flatbed trailer" },
    ],
    ctaHeadline: "Move Your Breakbulk Cargo With Port-to-Site Expertise",
    seoTitle: "Breakbulk Cargo Transportation India | Port Handling & Haulage | Arrowline",
    seoDesc: "Specialized breakbulk cargo transportation and port handling services from Mundra Port across India. Steel pipes, heavy machinery, structural cargo, and staging.",
    isPublished: true,
    displayOrder: 2,
  },
  {
    id: "proj-sub-3",
    slug: "industrial-machinery",
    parentSlug: "project-cargo-transportation",
    parentName: "Project Cargo Transportation",
    title: "Industrial Machinery Transportation",
    shortDesc: "End-to-end transportation for factory machinery, heavy engineering presses, production lines, and industrial manufacturing plants.",
    heroHeadline: "Industrial Machinery Transportation Across India",
    heroSubheadline: "Precision road logistics for high-value factory equipment, CNC centers, molding presses, boilers, and entire manufacturing plant lines.",
    heroBadge: "PROJECT CARGO • INDUSTRIAL MACHINERY",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    aboutBadge: "INDUSTRIAL MACHINERY TRANSPORT",
    aboutHeading: "Safeguarding High-Value Capital Equipment From Origin to Installation.",
    aboutDescription: "Industrial machinery represents critical capital investment where any in-transit shock, moisture ingress, or delivery delay can stall an entire plant commissioning timeline. Arrowline Logistics delivers specialized industrial machinery transportation designed for OEMs, machine importers, and expanding manufacturing facilities. From single heavy machines to phased plant relocations, we guarantee damage-free transit and seamless delivery.",
    aboutBulletPoints: [
      "Vibration-absorbing dunnage and air-ride suspension options for sensitive electronics",
      "Specialized low-bed, semi-low bed, and open flatbed trailers tailored to machine dimensions",
      "Full weatherproofing with heavy tarpaulins, shrink wrapping, and desiccant bags",
      "Direct port clearance from Mundra straight to factory assembly shop floors",
      "Coordination with rigging teams for synchronized loading and foundation placement",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Low-Bed Machine Transport", desc: "Low deck height trailers ensuring extra-tall machinery clears overhead highway obstacles." },
      { title: "Factory Relocation Logistics", desc: "Complete logistics management for moving operational machinery between manufacturing sites." },
      { title: "Anti-Vibration Securing", desc: "Specialized chain binders, rubber pads, and nylon straps calculated for machine center of gravity." },
      { title: "Turnkey Rigging Coordination", desc: "Coordinating heavy forklift and crane operations at factory pickup and delivery bays." },
    ],
    whyArrowline: [
      { number: "01", title: "Machinery Familiarity", desc: "Experienced in handling delicate spindle centers, hydraulic lines, and electrical control panels." },
      { number: "02", title: "Port Direct Dispatch", desc: "Immediate pickup of imported European, Japanese, and Chinese machinery at Mundra Port." },
      { number: "03", title: "Schedule Adherence", desc: "Timely delivery aligned with foreign technician and commissioning engineer schedules." },
      { number: "04", title: "Total Cargo Security", desc: "Full transit risk management and tamper-evident documentation." },
      { number: "05", title: "Pan-India Reach", desc: "Direct delivery to manufacturing hubs across Gujarat, Maharashtra, NCR, Tamil Nadu, and Karnataka." },
    ],
    processSteps: [
      { step: "01", title: "Machine Inspection", desc: "Evaluating dimensions, weight, lifting points, and fragile components." },
      { step: "02", title: "Trailer Matching", desc: "Selecting the optimal low-bed or flatbed chassis based on height and weight." },
      { step: "03", title: "Supervised Loading", desc: "Rigging and crane placement with exact weight distribution over trailer axles." },
      { step: "04", title: "Lashing & Protection", desc: "Applying rubber dunnage, chain binders, corner protectors, and waterproof tarpaulins." },
      { step: "05", title: "Monitored Transit", desc: "Speed-controlled highway movement with real-time GPS telemetry and driver check-ins." },
      { step: "06", title: "Plant Bay Delivery", desc: "Positioning trailer inside factory bay for direct crane unloading onto foundation." },
    ],
    applications: [
      { title: "CNC Machining Centers", desc: "Multi-axis milling machines, horizontal machining centers, and precision lathes.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Plastic & Rubber Molding", desc: "High-tonnage injection molding machines, extrusion lines, and blow molders.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Metal Stamping & Forging", desc: "Hydraulic press frames, mechanical stamping presses, and forging hammers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Industrial Boilers & Chillers", desc: "Packaged steam boilers, central chillers, air compressors, and heat exchangers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Automotive & Component Manufacturers", "Plastic & Polymer Processing", "General Engineering & Fabrication", "Textiles & Garment Manufacturing", "Pharmaceutical & Chemical Plants", "Packaging & Paper"],
    faqs: [
      { q: "How do you protect precision CNC machines during long-distance road transit?", a: "We place heavy industrial anti-vibration rubber mats under machine feet, secure the main chassis with calibrated chains and ratchet straps, and ensure air-suspension trailer transport to prevent road shocks from affecting sensitive axes." },
      { q: "Can you transport oversized factory machinery exceeding standard height?", a: "Yes. By utilizing our specialized semi-low bed and ultra low-bed trailers (with deck heights as low as 300mm to 600mm), we can safely move extra-tall machinery while remaining under standard highway bridge clearances." },
      { q: "Do you handle machinery imported through Mundra Port?", a: "Yes. We frequently clear and transport imported capital goods from Mundra Port directly to factory locations across all Indian states." },
      { q: "How do you coordinate with factory installation teams?", a: "Our operations coordinator provides exact ETA milestones so your rigging crew, mobile cranes, and commissioning engineers are ready the moment the trailer arrives." },
      { q: "Is machinery covered during transit against rain and road dust?", a: "Yes. All open trailer shipments are wrapped in heavy industrial plastic and covered with multi-layer waterproof tarpaulins tightly secured with bungee cords." },
    ],
    gallery: [
      { id: "im1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Molding Machine Transit", caption: "Heavy injection molding press on low-bed trailer" },
      { id: "im2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "CNC Machine Delivery", caption: "Precision CNC center delivered directly to factory bay" },
    ],
    ctaHeadline: "Safeguard Your Industrial Machinery Transport",
    seoTitle: "Industrial Machinery Transportation Services India | Arrowline Logistics",
    seoDesc: "Precision industrial machinery transportation across India. Low-bed trailers, CNC machine haulage, factory relocations, and port-to-plant delivery.",
    isPublished: true,
    displayOrder: 3,
  },
  {
    id: "proj-sub-4",
    slug: "multi-axle-special-trailer",
    parentSlug: "project-cargo-transportation",
    parentName: "Project Cargo Transportation",
    title: "Multi-Axle & Special Trailer Transportation",
    shortDesc: "Deployment of hydraulic modular multi-axles, extendable trailers, drop-decks, and specialized pullers for super-heavy industrial logistics.",
    heroHeadline: "Multi-Axle & Special Trailer Heavy Haulage",
    heroSubheadline: "Specialized hydraulic axle lines, steerable modular pullers, and extendable beam trailers engineered for India's heaviest freight.",
    heroBadge: "PROJECT CARGO • MULTI-AXLE & SPECIAL",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    aboutBadge: "SPECIAL TRAILER FLEET",
    aboutHeading: "Engineering Extreme Load Distribution With Modular Hydraulic Axles.",
    aboutDescription: "When single-piece cargo weight exceeds 50 to 300+ Metric Tons, standard commercial trucks are incapable of carrying the load. Arrowline Logistics deploys specialized hydraulic modular multi-axle trailers (Goldhofer / Scheuerle technology) where each axle line features hydraulic suspension and independent steering. This allows us to navigate sharp turns, negotiate uneven terrain, and distribute immense weight safely across road bridges.",
    aboutBulletPoints: [
      "Modular hydraulic axle combinations expandable from 4 up to 32+ axle lines",
      "Independent hydraulic steering allowing crab steering, sharp pivot turns, and elevation control",
      "Drop-deck and vessel-bed attachments designed specifically for high-diameter tanks and vessels",
      "Extendable telescopic flatbeds extending up to 45 meters for long wind blades and structural beams",
      "Heavy-duty prime movers with multi-axle drive delivering thousands of horsepower",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Hydraulic Suspension Equalization", desc: "Maintains level cargo stability across uneven road cambers and highway gradients." },
      { title: "Telescopic Extendable Decks", desc: "Chassis that extend up to 45 meters for extra-long industrial and wind energy structures." },
      { title: "Drop-Deck & Well-Bed Modules", desc: "Low cradle beds carrying oversized diameter vessels just inches above the road." },
      { title: "Multi-Tractor Push-Pull Configurations", desc: "Dual prime movers coupled together for steep mountain passes and heavy industrial loads." },
    ],
    whyArrowline: [
      { number: "01", title: "Equipment Mastery", desc: "Certified hydraulic axle technicians and heavy puller drivers with decades of heavy-haul experience." },
      { number: "02", title: "Engineering Simulation", desc: "Pre-trip computerized load calculations, tipping angle analysis, and axle load certifications." },
      { number: "03", title: "Port Staging Base", desc: "Mundra Port base allowing rapid assembly and configuration of modular axles." },
      { number: "04", title: "Statutory Permits", desc: "Securing national multi-axle permits, police escorts, and civil authority approvals." },
      { number: "05", title: "Safety Redundancy", desc: "Dual hydraulic circuits, emergency brake systems, and dedicated mechanical chase vehicles." },
    ],
    processSteps: [
      { step: "01", title: "Load Distribution Math", desc: "Calculating total weight, axle count required, and individual tire load ratings." },
      { step: "02", title: "Axle Assembly", desc: "Coupling hydraulic modular lines and fitting drop-deck or bolster modules." },
      { step: "03", title: "Hydraulic Hookup", desc: "Connecting hydraulic steering, suspension lines, and testing leveling systems." },
      { step: "04", title: "Controlled Cargo Loading", desc: "Positioning heavy piece and checking suspension pressure across all axle groups." },
      { step: "05", title: "Heavy Convoy Transit", desc: "Escorted road movement with hydraulic operators controlling steerable axles on turns." },
      { step: "06", title: "Site Delivery & Jacking", desc: "Utilizing trailer hydraulic stroke to lower cargo directly onto site stools/foundation." },
    ],
    applications: [
      { title: "Heavy Power Transformers", desc: "200 MT to 350 MT generating transformers moved on modular multi-axles.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Chemical & Refinery Reactors", desc: "Extra-diameter pressure vessels carried in drop-deck well beds.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Turbine Rotors & Generators", desc: "High-density power generation equipment moved from port to power plant site.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Pre-cast Bridge Girders", desc: "Extra-long concrete and steel girders moved on extendable steerable trailers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["Power & Energy Transmission", "Oil, Gas & Refining", "Heavy Civil Infrastructure", "Heavy Engineering & Fabrication", "Wind Turbine Manufacturers", "Defense & Aerospace"],
    faqs: [
      { q: "How do hydraulic multi-axle trailers work?", a: "Hydraulic multi-axle trailers use interconnected hydraulic cylinders on each wheel pair. This ensures equal weight distribution on all tires regardless of road bumps, while hydraulic steering allows the entire trailer to navigate tight turns that rigid trailers cannot manage." },
      { q: "What is the maximum payload capacity of a multi-axle modular trailer?", a: "Because modules can be coupled side-by-side and end-to-end, capacity is virtually limitless—standard configurations easily handle 100 MT to 350+ MT." },
      { q: "What is a drop-deck / well-bed trailer?", a: "A drop-deck or well-bed trailer has a lowered center section between the axles, allowing tall cylindrical cargo (like refinery vessels or boilers) to ride close to the ground to clear overhead bridges." },
      { q: "Can hydraulic trailers lower cargo directly onto foundations?", a: "Yes. The hydraulic suspension has a vertical stroke (typically 300mm to 600mm) that allows the trailer to lower cargo directly onto foundation stools, sometimes eliminating the need for expensive rental cranes." },
      { q: "How fast do heavy multi-axle convoys travel?", a: "Super-heavy multi-axle convoys typically travel at a controlled, safe speed of 15 to 30 km/h, covering 80 to 150 km per day depending on terrain and bridge crossings." },
    ],
    gallery: [
      { id: "ma1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "24-Axle Hydraulic Puller", caption: "Heavy refinery reactor moving on coupled modular axles" },
      { id: "ma2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Drop-Deck Configuration", caption: "Drop-deck trailer carrying large diameter pressure vessel" },
    ],
    ctaHeadline: "Deploy World-Class Hydraulic Multi-Axle Equipment",
    seoTitle: "Multi-Axle & Special Trailer Transportation India | Arrowline Logistics",
    seoDesc: "Hydraulic multi-axle and special trailer transportation services across India. Modular hydraulic lines, drop-decks, extendable trailers, and heavy pullers.",
    isPublished: true,
    displayOrder: 4,
  },
  {
    id: "proj-sub-5",
    slug: "end-to-end-project-logistics",
    parentSlug: "project-cargo-transportation",
    parentName: "Project Cargo Transportation",
    title: "End-to-End Project Logistics",
    shortDesc: "Turnkey project logistics management from global origin to site foundation, including port handling, staging, customs, and heavy transport.",
    heroHeadline: "End-to-End Project Logistics & Turnkey Management",
    heroSubheadline: "Complete single-source logistics execution for capital projects, EPC contracts, industrial plant setups, and infrastructure developments.",
    heroBadge: "PROJECT CARGO • END-TO-END",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
    aboutBadge: "TURNKEY PROJECT MANAGEMENT",
    aboutHeading: "Managing Every Logistics Variable From Port of Entry to Final Commissioning.",
    aboutDescription: "Industrial capital projects involve hundreds of moving parts—from ocean charters and customs clearance at Mundra Port to specialized heavy haulage, laydown yard management, and crane rigging at site. Arrowline Logistics acts as a single-source project logistics partner, taking total operational accountability for delivering entire industrial plants on schedule and within budget.",
    aboutBulletPoints: [
      "Single-source turnkey accountability for entire industrial project supply chains",
      "Pre-project logistics consulting, route feasibility, and transport budget optimization",
      "Mundra Port stevedoring, customs clearance, and off-dock staging yard management",
      "Multi-modal execution combining coastal shipping, rail freight, and heavy road transport",
      "Dedicated on-site logistics command teams coordinating daily deliveries with EPC managers",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    capabilities: [
      { title: "Pre-Feasibility & Budgeting", desc: "Detailed route surveys, bridge analysis, and accurate tariff modeling before project procurement." },
      { title: "Port & Customs Management", desc: "Seamless port handling, customs project registration (PIR), and bonded staging at Mundra." },
      { title: "Sequenced Multimodal Transport", desc: "Coordinating heavy multi-axles, container fleets, and rail rakes to match plant erection schedules." },
      { title: "On-Site Laydown Management", desc: "Managing site receipt, inventory logging, crane offloading, and foundation placement." },
    ],
    whyArrowline: [
      { number: "01", title: "Single Responsibility", desc: "Eliminates multi-vendor friction, contractual gaps, and finger-pointing between handlers." },
      { number: "02", title: "Mundra Port Stronghold", desc: "Our primary hub at Mundra Port ensures priority terminal handling and storage space." },
      { number: "03", title: "Proven Track Record", desc: "Successfully executed logistics for renewable energy parks, refineries, and steel plants." },
      { number: "04", title: "Safety & Compliance", desc: "HSE-compliant protocols adhering strictly to multinational EPC and corporate standards." },
      { number: "05", title: "Schedule Certainty", desc: "Precision coordination ensuring zero plant commissioning delays and crane idle costs." },
    ],
    processSteps: [
      { step: "01", title: "Project Inception", desc: "Reviewing equipment list, critical path items, delivery milestones, and site constraints." },
      { step: "02", title: "Route & Port Planning", desc: "Conducting route surveys, securing permits, and setting up staging yards at Mundra." },
      { step: "03", title: "Port Reception & Clearance", desc: "Vessel stevedoring, customs clearance, and staging yard inventory reconciliation." },
      { step: "04", title: "Synchronized Dispatch", desc: "Executing sequenced road and rail dispatches matching site erection priorities." },
      { step: "05", title: "Site Offload & Rigging", desc: "Supervising crane offloading and foundation placement at destination laydown." },
      { step: "06", title: "Project Closeout", desc: "Final documentation, POD consolidation, and project reconciliation report." },
    ],
    applications: [
      { title: "Utility Solar & Wind Parks", desc: "Complete logistics for solar parks and wind farms across Gujarat, Rajasthan, and MP.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Refinery Expansion Projects", desc: "Multi-package turnkey transport for petrochemical complexes and gas processing plants.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Steel & Metallurgical Plants", desc: "Heavy machinery, rolling mills, furnaces, and structural packages for steel mills.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Chemical & Fertilizer Units", desc: "High-pressure synthesis loops, reactors, storage tanks, and modular process skids.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["EPC Contractors & Turnkey Builders", "Renewable Energy Developers", "Oil, Gas & Petrochemicals", "Steel & Metals", "Power Generation & Utilities", "Chemical & Fertilizer Producers"],
    faqs: [
      { q: "What does End-to-End Project Logistics include?", a: "It includes complete project logistics from international arrival or factory origin to final foundation placement: route feasibility surveys, port handling at Mundra, customs clearance, off-dock staging, multi-axle and container road haulage, on-site crane offloading, and final reconciliation." },
      { q: "How does Arrowline assist during the pre-bid stage of an EPC project?", a: "We provide EPC contractors with pre-bid transport feasibility reports, route bottleneck analysis, heavy-lift budget estimates, and transit timeline models to help them bid competitively and accurately." },
      { q: "Can you manage staging yards near Mundra Port for long-term project cargo?", a: "Yes. We operate secure open and covered staging yards near Mundra Port where project packages can be safely stored, inspected, and dispatched in phased batches." },
      { q: "How do you coordinate site deliveries with civil construction contractors?", a: "We embed a dedicated project logistics coordinator who communicates daily with site construction managers, ensuring equipment arrives in the exact erection sequence without crowding the site laydown area." },
      { q: "What safety protocols are followed for turnkey project logistics?", a: "We enforce international HSE guidelines, conduct daily driver tool-box talks, require certified lifting gear and PPE, and maintain 24/7 convoy telemetry monitoring." },
    ],
    gallery: [
      { id: "e2e1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Turnkey Project Execution", caption: "Complete project cargo convoy arriving at industrial site" },
      { id: "e2e2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Site Foundation Placement", caption: "Heavy equipment tandem crane placement onto plant foundation" },
    ],
    ctaHeadline: "Partner With Arrowline for Turnkey Project Logistics",
    seoTitle: "End-to-End Project Logistics India | Turnkey Industrial Transport | Arrowline",
    seoDesc: "Turnkey end-to-end project logistics management for EPC contractors and industrial developers across India. Port handling, staging, heavy haulage, and site delivery.",
    isPublished: true,
    displayOrder: 5,
  },
];

// =========================================================================
// 4. WAREHOUSING & STORAGE
// =========================================================================

const warehousingSubServices: SubServiceData[] = [
  {
    id: "ware-sub-1",
    slug: "general-industrial-warehousing",
    parentSlug: "warehousing-storage",
    parentName: "Warehousing & Storage",
    title: "General & Industrial Warehousing",
    shortDesc: "Secure, weather-protected covered and open industrial storage facilities located near Mundra Port and major transportation corridors.",
    heroHeadline: "Strategic General & Industrial Warehousing Solutions",
    heroSubheadline: "Modern warehousing infrastructure near Mundra Port and major logistics hubs featuring advanced security, heavy flooring, and high ceilings.",
    heroBadge: "WAREHOUSING • INDUSTRIAL STORAGE",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    aboutBadge: "INDUSTRIAL WAREHOUSING",
    aboutHeading: "Secure Storage Facilities Engineered for Industrial Goods & Raw Materials.",
    aboutDescription: "Modern manufacturing and trade require scalable, secure storage facilities strategically positioned close to maritime gateways and arterial highways. Arrowline Logistics provides general and industrial warehousing facilities equipped with high-load industrial flooring, modern dock levelers, 24/7 CCTV surveillance, and flexible leasing options. Located adjacent to Mundra Port, our warehouses serve as ideal consolidation and buffer hubs.",
    aboutBulletPoints: [
      "High-clearance covered storage with heavy-duty industrial reinforced flooring",
      "Secure open yard storage for heavy machinery, steel, and weather-tolerant industrial cargo",
      "Strategically located near Mundra Port and major Gujarat highway intersections",
      "24/7 on-site physical security, perimeter fencing, and high-definition CCTV monitoring",
      "Flexible short-term and long-term storage agreements tailored to business seasonal demand",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    capabilities: [
      { title: "Covered Warehouse Facilities", desc: "Weatherproof facilities with high plinth levels protecting against rain, dust, and humidity." },
      { title: "Open Industrial Staging Yards", desc: "Compacted, secure open storage for structural steel, pipes, heavy machinery, and containers." },
      { title: "Multi-Dock Loading Bays", desc: "Hydraulic dock levelers for rapid trailer turnaround and efficient container loading." },
      { title: "Fire Safety & Compliance", desc: "Equipped with automatic sprinkler systems, fire hydrants, and complete regulatory approvals." },
    ],
    whyArrowline: [
      { number: "01", title: "Port Proximity", desc: "Located just minutes from Mundra Port gates, drastically reducing port drayage expenses." },
      { number: "02", title: "Scalable Capacity", desc: "Easily scale up or down your storage footprint based on import batch sizes and market demand." },
      { number: "03", title: "Industrial Strength", desc: "Engineered floors capable of carrying high point-load machinery and stacked pallet weights." },
      { number: "04", title: "Total Security", desc: "Round-the-clock security personnel, access control, and continuous digital recording." },
      { number: "05", title: "Transport Integration", desc: "Directly coupled with Arrowline's road and rail fleet for instantaneous dispatch." },
    ],
    processSteps: [
      { step: "01", title: "Inbound Receipt", desc: "Truck arrival, physical gate verification, and condition check of arriving cargo." },
      { step: "02", title: "Unloading & Inspection", desc: "Mechanized forklift/crane offloading and piece-by-piece tally against packing list." },
      { step: "03", title: "Location Allocation", desc: "Assigning optimal racked or floor storage location based on cargo characteristics." },
      { step: "04", title: "Secure Storage", desc: "Safe custody with regular inventory audits, pest control, and environmental protection." },
      { step: "05", title: "Outbound Picking", desc: "Retrieval of designated inventory lots based on client dispatch order." },
      { step: "06", title: "Truck Loading & Gate-Out", desc: "Secure loading onto outbound trailer, document handover, and gate clearance." },
    ],
    applications: [
      { title: "Industrial Raw Materials", desc: "Chemical bags, polymer pellets, rubber bales, and mineral sacks in dry covered bays.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Finished Manufactured Goods", desc: "Palletized consumer appliances, packaging supplies, and electrical equipment.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Steel Plates, Coils & Pipes", desc: "Heavy metallurgical products stored securely in our heavy-duty yard storage.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Import Project Staging", desc: "Capital goods held in buffer storage prior to phased project site erection.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Industrial Manufacturing", "Chemicals & Polymers", "Import & Export Traders", "Automotive & Heavy Industry", "Steel & Metals", "Retail & Consumer Goods"],
    faqs: [
      { q: "Where are Arrowline's primary warehouse facilities located?", a: "Our primary warehousing infrastructure is strategically located near Mundra Port, Gujarat, offering immediate access to the port container terminals, bulk berths, and the national highway network." },
      { q: "What types of goods can be stored in your industrial warehouses?", a: "We store a wide variety of industrial goods including raw materials, chemicals (non-hazardous and approved classifications), machinery, steel, palletized goods, automotive components, and project cargo." },
      { q: "Do you offer both covered and open yard storage?", a: "Yes. We offer high-ceiling weatherproof covered warehouses for sensitive goods and secure open yards for heavy machinery, steel, and containers." },
      { q: "What security measures are implemented at your warehouses?", a: "Our facilities feature 24/7 security guards, automated entry gates, perimeter boundary walls, high-definition CCTV coverage, fire protection systems, and strict visitor access controls." },
      { q: "Can we rent warehouse space on a short-term flexible basis?", a: "Yes. We offer flexible commercial terms ranging from short-term spot storage for import consignments to multi-year dedicated warehouse operations." },
    ],
    gallery: [
      { id: "gw1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Covered Warehouse Interior", caption: "High-clearance racked industrial storage facility" },
      { id: "gw2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Loading Dock Bay", caption: "Multi-trailer dock loading and unloading operations" },
    ],
    ctaHeadline: "Secure Your Industrial Storage Near Mundra Port",
    seoTitle: "General & Industrial Warehousing Services India | Mundra Storage | Arrowline",
    seoDesc: "Secure general and industrial warehousing facilities near Mundra Port, Gujarat. Covered storage, open yards, 24/7 security, and integrated transport.",
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: "ware-sub-2",
    slug: "distribution-fulfillment",
    parentSlug: "warehousing-storage",
    parentName: "Warehousing & Storage",
    title: "Distribution & Fulfillment",
    shortDesc: "End-to-end B2B distribution, order fulfillment, pick-and-pack, kitting, and regional dispatch management across India.",
    heroHeadline: "Efficient Distribution & B2B Order Fulfillment",
    heroSubheadline: "Accelerating your supply chain with precision order fulfillment, value-added packaging, and express nationwide dispatch.",
    heroBadge: "WAREHOUSING • DISTRIBUTION & FULFILLMENT",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    aboutBadge: "DISTRIBUTION & FULFILLMENT",
    aboutHeading: "Optimizing the Flow of Goods from Warehouse Shelves to End Customers.",
    aboutDescription: "Fast, accurate fulfillment is essential for maintaining customer satisfaction and optimizing inventory turnover. Arrowline Logistics provides complete distribution and order fulfillment services for manufacturers, distributors, and commercial brands. From receiving bulk shipments to sorting, custom kitting, barcoding, and dispatching to retail distributors or industrial buyers, we manage your supply chain execution flawlessly.",
    aboutBulletPoints: [
      "B2B order fulfillment with strict picking accuracy and same-day dispatch capabilities",
      "Value-added services including barcoding, MRP labeling, shrink-wrapping, and kitting",
      "Multi-channel distribution directly into regional wholesaler and dealer networks",
      "Seamless integration with Arrowline's pan-India FTL and LTL transportation fleet",
      "Reverse logistics and returns inspection management for commercial distributors",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    capabilities: [
      { title: "Pick & Pack Operations", desc: "Efficient lot picking, carton packing, and palletizing customized to consignee specifications." },
      { title: "Value-Added Labeling", desc: "Application of statutory compliance labels, MRP stickers, barcodes, and promotional tags." },
      { title: "Cross-Docking Services", desc: "Immediate sorting and direct transfer from inbound containers onto outbound regional trucks." },
      { title: "Scheduled Regional Dispatch", desc: "Consolidated dispatch timetables delivering reliably into major state consumer markets." },
    ],
    whyArrowline: [
      { number: "01", title: "Order Precision", desc: "99.8% order accuracy through systematic barcode scanning and multi-point weight checks." },
      { number: "02", title: "Speed of Dispatch", desc: "Orders received before cut-off are picked, packed, and loaded on outbound trucks the same day." },
      { number: "03", title: "Freight Integration", desc: "Instant handoff to Arrowline's linehaul road network eliminating third-party pickup delays." },
      { number: "04", title: "Custom Flexibility", desc: "Tailored packing and bundling customized to your corporate branding and B2B requirements." },
      { number: "05", title: "Cost Reduction", desc: "Shared warehouse fulfillment models reducing fixed overhead and administrative burden." },
    ],
    processSteps: [
      { step: "01", title: "Order Receipt", desc: "Receiving electronic dispatch orders from client ERP / sales system." },
      { step: "02", title: "Batch Picking", desc: "Systematic lot picking from warehouse locations using mobile handheld scanners." },
      { step: "03", title: "Kitting & Labeling", desc: "Applying barcodes, shrink wrapping, and bundling products as specified." },
      { step: "04", title: "Quality Check & Packing", desc: "Final verification against invoice manifest and packing into secure transport cartons." },
      { step: "05", title: "Dock Staging & Manifest", desc: "Palletizing, wrapping, and generating e-Way bills and transport manifests." },
      { step: "06", title: "Linehaul Dispatch", desc: "Loading onto scheduled Arrowline linehaul trucks for direct regional delivery." },
    ],
    applications: [
      { title: "FMCG & Consumer Goods", desc: "Bulk receiving, carton picking, and daily store replenishment across retail networks.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Automotive Spare Parts", desc: "Kitting and distributing spare parts direct to regional dealer service workshops.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Industrial Hardware & Tools", desc: "Sorting and dispatching industrial tools and components to construction contractors.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Chemical & Lubricant Packaging", desc: "Palletizing and distributing drums and containers to regional distributors.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
    ],
    industries: ["FMCG & Consumer Packaged Goods", "Automotive Spares & Aftermarket", "Industrial Consumables & Hardware", "Chemicals & Lubricants", "Electrical & Appliances", "Wholesale & B2B Distribution"],
    faqs: [
      { q: "What is B2B fulfillment and how does Arrowline support it?", a: "B2B fulfillment involves receiving bulk products from manufacturing plants or port imports, storing them, and then picking, packing, and shipping specific bulk orders to regional distributors, retail chains, or industrial customers." },
      { q: "Do you provide value-added services like labeling and repacking?", a: "Yes. We provide complete value-added services including MRP sticker application, barcode labeling, product repacking, bundling, kitting, and shrink-wrapping." },
      { q: "What is cross-docking and can Arrowline handle it?", a: "Cross-docking is the process of unloading materials from an incoming truck or container and loading them directly onto outbound trucks with little or no storage in between. Arrowline manages high-speed cross-docking to reduce transit time and storage costs." },
      { q: "How quickly can orders be fulfilled and dispatched?", a: "Standard B2B orders received before the daily cut-off time are picked, verified, packed, and loaded onto outbound linehaul vehicles on the same day." },
      { q: "How do you ensure picking accuracy?", a: "We utilize barcode verification, piece counting, and final gross weight checks before sealing pallets, maintaining over 99.8% order accuracy." },
    ],
    gallery: [
      { id: "df1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Fulfillment Packing Station", caption: "High-accuracy order picking and pallet wrapping" },
      { id: "df2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Outbound Dispatch Loading", caption: "Palletized orders loading onto regional distribution fleet" },
    ],
    ctaHeadline: "Accelerate Your B2B Distribution & Order Fulfillment",
    seoTitle: "Distribution & Fulfillment Services India | Warehouse Dispatch | Arrowline",
    seoDesc: "Fast, accurate B2B distribution and order fulfillment services across India. Pick and pack, value-added labeling, cross-docking, and integrated road delivery.",
    isPublished: true,
    displayOrder: 2,
  },
  {
    id: "ware-sub-3",
    slug: "inventory-management",
    parentSlug: "warehousing-storage",
    parentName: "Warehousing & Storage",
    title: "Inventory Management",
    shortDesc: "Real-time stock tracking, FIFO/LIFO control, batch and serial number tracking, and automated inventory reconciliation.",
    heroHeadline: "Accurate Inventory Management & Stock Visibility",
    heroSubheadline: "Complete real-time visibility over stock levels, batch numbers, expiration dates, and automated replenishment alerts.",
    heroBadge: "WAREHOUSING • INVENTORY MANAGEMENT",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    aboutBadge: "INVENTORY VISIBILITY",
    aboutHeading: "Transforming Warehouse Storage into Intelligent, Transparent Stock Control.",
    aboutDescription: "Effective inventory management is the difference between smooth production and costly stockouts. Arrowline Logistics provides comprehensive inventory management systems and operational processes that give clients total visibility over their goods in our custody. From barcode scanning and batch tracking to FIFO stock rotation and automated cycle counts, we keep your inventory accurate, audit-ready, and optimized.",
    aboutBulletPoints: [
      "Real-time inventory visibility with stock balance reporting and location mapping",
      "Strict rotation control supporting FIFO (First In, First Out) and FEFO systems",
      "Batch, heat, lot, and serial number tracking for complete product traceability",
      "Regular physical cycle counts and automated inventory reconciliation audits",
      "Automated low-stock threshold alerts preventing unexpected production stockouts",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    capabilities: [
      { title: "Barcode & QR Code Scanning", desc: "Every pallet, carton, and bin is scanned at putaway, transfer, and pick." },
      { title: "FIFO / FEFO Stock Rotation", desc: "Automated pick logic prioritizing oldest inventory lots to eliminate spoilage and obsolescence." },
      { title: "Cycle Counting & Audits", desc: "Continuous rolling stock counts ensuring perpetual inventory accuracy exceeding 99.5%." },
      { title: "Traceability & Recall Ready", desc: "Full historical audit trail from inbound container manifest to final outbound delivery." },
    ],
    whyArrowline: [
      { number: "01", title: "Stock Accuracy", desc: "Rigorous verification protocols eliminating discrepancies between digital records and physical stock." },
      { number: "02", title: "Traceability", desc: "Instant lookup of any batch number, manufacturing date, or import customs entry." },
      { number: "03", title: "Reduced Shrinkage", desc: "Strict access controls, electronic logs, and 24/7 security preventing pilferage." },
      { number: "04", title: "Audit Ready", desc: "Generate instant stock reports, valuation summaries, and movement logs for corporate auditors." },
      { number: "05", title: "Seamless Integration", desc: "Daily or weekly automated EDI/Excel inventory status reports delivered to your logistics team." },
    ],
    processSteps: [
      { step: "01", title: "Inbound Barcode Tagging", desc: "Goods received, verified against packing list, and tagged with unique location barcodes." },
      { step: "02", title: "System Putaway", desc: "Scanning into designated rack or bay location with immediate digital inventory update." },
      { step: "03", title: "Continuous Monitoring", desc: "Live tracking of stock balance, batch numbers, and environmental conditions." },
      { step: "04", title: "Cycle Count Auditing", desc: "Scheduled physical counts verifying accuracy without interrupting daily operations." },
      { step: "05", title: "FIFO Order Allocation", desc: "Automated pick lists directing staff to the exact batch and rack location." },
      { step: "06", title: "Outbound Scan-Out", desc: "Final scan upon truck loading updating stock balance and generating delivery note." },
    ],
    applications: [
      { title: "Raw Material Buffer Stock", desc: "Managing safety stock of critical industrial chemicals, metals, and components near ports.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Batch-Controlled Polymers", desc: "Tracking resin melt-flow grades, heat numbers, and manufacturing batch numbers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "High-Value Capital Spares", desc: "Individual serial number tracking for expensive machine replacement tooling.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Commercial Finished Inventory", desc: "Managing multi-SKU retail and wholesale stock ready for rapid dispatch.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
    ],
    industries: ["Chemicals & Polymers", "Automotive & Manufacturing", "FMCG & Consumer Products", "Industrial Engineering", "Pharmaceuticals", "Import & Export Distributors"],
    faqs: [
      { q: "How does Arrowline track inventory stored in its warehouses?", a: "We utilize barcode-based inventory management systems where every inbound lot is assigned a unique tracking identifier and scanned into a specific rack/bin location, providing real-time stock visibility." },
      { q: "Can you enforce FIFO (First In, First Out) inventory rotation?", a: "Yes. Our system automatically directs warehouse picking teams to retrieve the oldest stock first, ensuring proper stock rotation and preventing product obsolescence." },
      { q: "How frequently are inventory audits and cycle counts conducted?", a: "We perform continuous rolling cycle counts daily/weekly on high-velocity SKUs, along with comprehensive monthly and quarterly physical reconciliation audits." },
      { q: "Can clients receive automated stock reports?", a: "Yes. We provide automated daily, weekly, or monthly inventory summary reports detailing opening balance, receipts, dispatches, and closing stock by SKU and batch number." },
      { q: "What happens if there is an inventory discrepancy?", a: "Our strict scan-in/scan-out verification maintains stock accuracy over 99.5%. Any physical variance is immediately flagged, investigated via CCTV audit logs, and reconciled." },
    ],
    gallery: [
      { id: "im1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Barcode Scanner In Action", caption: "Warehouse team scanning inventory during location putaway" },
      { id: "im2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Organized Racked Storage", caption: "Systematic pallet racking with clear aisle location markers" },
    ],
    ctaHeadline: "Gain Complete Real-Time Visibility Over Your Inventory",
    seoTitle: "Inventory Management Services India | Stock Control & Tracking | Arrowline",
    seoDesc: "Professional inventory management and stock control services in India. Barcode tracking, FIFO rotation, cycle counts, and real-time stock visibility.",
    isPublished: true,
    displayOrder: 3,
  },
  {
    id: "ware-sub-4",
    slug: "container-storage-handling",
    parentSlug: "warehousing-storage",
    parentName: "Warehousing & Storage",
    title: "Container Storage & Handling",
    shortDesc: "Dedicated off-dock container yard storage, container stuffing/de-stuffing, twist-lock chassis handling, and empty container management.",
    heroHeadline: "Container Storage & Yard Handling Solutions",
    heroSubheadline: "Secure off-dock container yard facilities near Mundra Port offering reach stacker handling, container storage, and de-stuffing.",
    heroBadge: "WAREHOUSING • CONTAINER HANDLING",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg",
    aboutBadge: "CONTAINER YARD & HANDLING",
    aboutHeading: "Optimizing Container Flow Near Mundra Port to Eliminate Demurrage.",
    aboutDescription: "High container terminal ground rent and shipping line detention fees can rapidly erode profit margins. Arrowline Logistics operates secure off-dock container storage and handling facilities located immediately outside Mundra Port. Equipped with heavy-duty reach stackers and skilled container handlers, our yard provides safe container staging, professional stuffing/de-stuffing, and empty box management.",
    aboutBulletPoints: [
      "Heavy-duty paved container yard equipped with reach stackers capable of stacking up to 5-high",
      "Cost-effective alternative to expensive port terminal container storage and demurrage",
      "Professional container stuffing (export) and de-stuffing (import) with covered staging docks",
      "Safe storage for laden 20ft and 40ft containers, flat racks, open tops, and empty boxes",
      "Direct integration with Arrowline's container trailer fleet for immediate port gate-in/gate-out",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    capabilities: [
      { title: "Heavy Reach Stacker Handling", desc: "45-ton reach stackers for safe container handling and high-density yard stacking." },
      { title: "Container De-stuffing & Transfer", desc: "Unloading imported containers directly into warehouse storage or onto regional trucks." },
      { title: "Export Stuffing & Lashing", desc: "Expert container stuffing with specialized lashing, chocking, and weight distribution." },
      { title: "Empty Container Management", desc: "Storing, cleaning, and repositioning empty shipping line containers." },
    ],
    whyArrowline: [
      { number: "01", title: "Port Cost Savings", desc: "Evacuate containers from Mundra port terminals within free time to avoid heavy port storage rates." },
      { number: "02", title: "Heavy Equipment", desc: "Modern, certified reach stackers operated by experienced container terminal operators." },
      { number: "03", title: "Stuffing Expertise", desc: "Strict adherence to CTU code for seaworthy lashing and weight distribution." },
      { number: "04", title: "24/7 Yard Access", desc: "Round-the-clock container gate operations supporting urgent export shipping cut-offs." },
      { number: "05", title: "Fleet Synergy", desc: "Immediate chassis availability for moving boxes between port terminals and our yard." },
    ],
    processSteps: [
      { step: "01", title: "Port Evacuation", desc: "Arrowline trailer hauls container out of Mundra terminal before port free time expires." },
      { step: "02", title: "Yard Gate-In", desc: "Container seal and exterior inspection, gate-in recording, and reach stacker lift." },
      { step: "03", title: "Stack Storage", desc: "Safe stacking in designated yard bay with electronic location tracking." },
      { step: "04", title: "Dock De-stuffing", desc: "Placement at covered warehouse dock for cargo de-stuffing and inventory sorting." },
      { step: "05", title: "Empty Return Dispatch", desc: "Loading empty container onto chassis and returning to shipping line depot." },
      { step: "06", title: "Cargo Onforwarding", desc: "Loading de-stuffed cargo onto domestic trucks for onward transport." },
    ],
    applications: [
      { title: "Import Container Buffer", desc: "Holding import containers outside port to avoid port demurrage while customs clears.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Export Cargo Stuffing", desc: "Consolidating factory cargo and stuffing into export shipping containers.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Flat-Rack & Open-Top Handling", desc: "Handling heavy machinery and ODC cargo mounted on specialized container equipment.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Empty Box Repositioning", desc: "Short-term storage and depot management for shipping lines and leasing companies.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
    ],
    industries: ["Import / Export Shippers", "International Freight Forwarders", "Shipping Lines & Box Operators", "Solar & Renewable Importers", "Chemical & Raw Material Traders", "Automotive & Manufacturing"],
    faqs: [
      { q: "Why move containers to an off-dock container yard?", a: "Seaport container terminals charge high escalating ground rent after the short initial free period (typically 3-5 days). Moving containers to Arrowline's off-dock yard near Mundra Port cuts storage costs by up to 60-70% while you finalize customs clearance or inland transport." },
      { q: "Can Arrowline de-stuff containers and load the cargo onto domestic trucks?", a: "Yes. We provide complete container de-stuffing services: taking cargo out of import containers, inspecting it, staging it in our warehouse, and reloading onto regular domestic trucks, allowing the empty container to be returned promptly to avoid shipping line detention fees." },
      { q: "What equipment is used in your container yard?", a: "We operate 45-ton heavy reach stackers, empty container handlers, heavy-duty container trailers, and specialized forklift trucks equipped with drum clamps and carpet booms." },
      { q: "Do you handle export container stuffing and lashing?", a: "Yes. We handle professional export container stuffing, including certified timber chocking, heavy strapping, and cargo weight balancing compliant with SOLAS VGM regulations." },
      { q: "How close is your container storage yard to Mundra Port?", a: "Our container handling facilities are located within minutes of Mundra Port's main gates, ensuring rapid turnarounds between port terminals and our yard." },
    ],
    gallery: [
      { id: "cs1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Reach Stacker Container Lift", caption: "Heavy reach stacker stacking 40ft containers in yard" },
      { id: "cs2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Container De-stuffing Dock", caption: "Cargo de-stuffing at covered warehouse dock" },
    ],
    ctaHeadline: "Eliminate Port Demurrage with Off-Dock Container Storage",
    seoTitle: "Container Storage & Handling Services India | Mundra Yard | Arrowline",
    seoDesc: "Secure off-dock container storage and handling near Mundra Port, Gujarat. Reach stacker lifting, stuffing/de-stuffing, empty container management, and drayage.",
    isPublished: true,
    displayOrder: 4,
  },
  {
    id: "ware-sub-5",
    slug: "loading-unloading",
    parentSlug: "warehousing-storage",
    parentName: "Warehousing & Storage",
    title: "Loading & Unloading",
    shortDesc: "Mechanized and manual cargo handling, cross-dock transfer, heavy forklift rigging, and dock operations ensuring zero handling damage.",
    heroHeadline: "Professional Cargo Loading & Unloading Services",
    heroSubheadline: "Safe, mechanized cargo handling using modern forklifts, cranes, dock levelers, and experienced rigging crews.",
    heroBadge: "WAREHOUSING • LOADING & UNLOADING",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
    aboutBadge: "CARGO HANDLING EXPERTISE",
    aboutHeading: "Precision Handling Protocols Protecting Your Cargo at Every Transition.",
    aboutDescription: "The physical transfer of cargo between transport vehicles and storage facilities represents the moment of highest risk for handling damage. Arrowline Logistics provides professional, mechanized loading and unloading operations supported by experienced equipment operators and rigorous safety protocols. Whether handling palletized consumer goods, delicate drums, or heavy machinery, we guarantee safe, damage-free execution.",
    aboutBulletPoints: [
      "Modern forklift fleet (3 MT to 10 MT capacity) fitted with specialized attachments",
      "Heavy-duty mobile crane and gantry handling for non-palletized and heavy industrial items",
      "Hydraulic dock levelers ensuring smooth transition between warehouse floor and trailer beds",
      "Trained handling crews adhering to strict PPE, cargo stacking, and dunnage standards",
      "Complete visual inspection, damage reporting, and tally reconciliation during every operation",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    capabilities: [
      { title: "Mechanized Forklift Operations", desc: "Diesel, electric, and LPG forklifts fitted with side-shifters, drum grabs, and extended tines." },
      { title: "Heavy Crane Rigging", desc: "Trained crane riggers deploying certified slings, shackles, and spreader beams for heavy pieces." },
      { title: "Manual Handling Supervision", desc: "Supervised labor teams for delicate carton unstacking, sorting, and palletizing." },
      { title: "Cross-Docking Efficiency", desc: "Direct vehicle-to-vehicle transfer reducing dwell time and double-handling expenses." },
    ],
    whyArrowline: [
      { number: "01", title: "Damage Prevention", desc: "Zero-damage handling standards with specialized cushioning, rubber attachments, and proper lifting angles." },
      { number: "02", title: "Turnaround Speed", desc: "Rapid truck loading and unloading minimizing driver waiting times and demurrage." },
      { number: "03", title: "Certified Equipment", desc: "All forklifts, cranes, slings, and shackles are third-party tested and safety certified." },
      { number: "04", title: "Cargo Tally Accuracy", desc: "Rigorous inbound/outbound tally checking verifying carton counts and seal integrity." },
      { number: "05", title: "Hazardous & Sensitive Care", desc: "Trained operators equipped to handle chemical drums, fragile glass, and heavy steel." },
    ],
    processSteps: [
      { step: "01", title: "Vehicle Docking", desc: "Trailer reversed onto warehouse dock leveler with wheel chocks engaged." },
      { step: "02", title: "Pre-Unload Inspection", desc: "Checking cargo condition, strapping integrity, and any signs of in-transit shifting." },
      { step: "03", title: "Equipment Deployment", desc: "Selecting appropriate forklift, crane, or manual handling team." },
      { step: "04", title: "Systematic Unloading", desc: "Careful removal from truck bed following proper center of gravity principles." },
      { step: "05", title: "Tally & Inspection", desc: "Piece count verification against shipping documents and physical condition check." },
      { step: "06", title: "Staging / Putaway", desc: "Transferring cargo to designated warehouse storage bay or outbound staging area." },
    ],
    applications: [
      { title: "Palletized Industrial Cargo", desc: "Fast unloading of shrink-wrapped pallets using counterbalanced forklift trucks.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Heavy Machinery & Crates", desc: "Mobile crane and heavy forklift handling of machinery weighing up to 25 MT.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Chemical Drums & Carboys", desc: "Safe handling of liquid chemicals using hydraulic drum clamp attachments.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Steel Coils & Long Bundles", desc: "Boom and crane handling of steel coils, rebar bundles, and long pipes.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["Manufacturing & Assembly", "Chemicals & Petrochemicals", "FMCG & Food Processing", "Steel & Metals", "Retail & Wholesale Distribution", "Building Materials & Cement"],
    faqs: [
      { q: "What types of equipment do you use for cargo loading and unloading?", a: "We utilize industrial counterbalanced forklifts (3 MT to 10 MT), reach stackers (45 MT), mobile hydraulic cranes (15 MT to 100 MT), hydraulic dock levelers, pallet jacks, and specialized drum clamp attachments." },
      { q: "How do you prevent cargo damage during unloading?", a: "We use appropriate forklift attachments (like rubber-padded drum clamps), inspect cargo before touching it, ensure proper weight distribution, and enforce strict rigging and lifting angle safety limits." },
      { q: "Can you handle direct truck-to-truck cross-docking?", a: "Yes. We frequently execute cross-docking operations where goods are unloaded from incoming long-haul trailers, sorted, and immediately loaded onto local delivery vehicles with zero warehouse dwell time." },
      { q: "What happens if damaged goods are found during vehicle unloading?", a: "Our supervisors immediately take high-definition photographs, document the exact damaged carton/piece numbers on the delivery note, and provide a formal cargo damage report to the client before storing the goods." },
      { q: "Are handling operations available 24/7 for urgent night dispatches?", a: "Yes. Our warehouse and dock operations run 24/7 upon advance notice to accommodate urgent early-morning deliveries or midnight transport cut-offs." },
    ],
    gallery: [
      { id: "lu1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Forklift Pallet Loading", caption: "Heavy forklift loading palletized cargo at dock" },
      { id: "lu2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Crane Rigging Operation", caption: "Heavy crane loading industrial machinery onto flatbed trailer" },
    ],
    ctaHeadline: "Ensure Safe, Damage-Free Cargo Handling with Arrowline",
    seoTitle: "Cargo Loading & Unloading Services India | Warehouse Dock Handling | Arrowline",
    seoDesc: "Professional cargo loading and unloading services in India. Forklift handling, heavy crane rigging, hydraulic dock operations, and cross-docking.",
    isPublished: true,
    displayOrder: 5,
  },
];

// =========================================================================
// MAIN SERVICES (4 APPROVED VERTICALS)
// =========================================================================

export const MAIN_SERVICES: MainServiceData[] = [
  {
    id: "main-road",
    slug: "road-transportation",
    title: "Road Transportation",
    shortDesc: "Professional road transportation solutions across India for containerized, full truckload (FTL), less-than-truckload (LTL), ODC, heavy haulage, project and industrial cargo movements.",
    category: "Highway Freight",
    keyCapability: "FTL, Container Chassis & ODC Heavy Haulage",
    heroBadge: "ROAD TRANSPORTATION • PAN-INDIA",
    heroHeadline: "Reliable Road Transportation Services Across India",
    heroSubheadline: "Pan-India road transportation network anchored at Mundra Port, connecting ports, factories, warehouses, and industrial corridors with speed, safety, and precision.",
    heroDescription: "Professional road transportation solutions for containerized, full truckload, less-than-truckload, ODC, heavy haulage, project and industrial cargo movements across India.",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    highlights: ["FTL & LTL", "ODC & HEAVY HAULAGE", "CONTAINER MOVEMENT", "PAN-INDIA ROAD NETWORK"],
    aboutBadge: "ROAD TRANSPORTATION",
    aboutHeading: "Connecting Ports, Roads & Businesses.",
    aboutDescription: "Arrowline Logistics delivers a premier road freight network built on reliability, GPS-tracked fleet discipline, and seamless port-to-factory integration. Anchored at Mundra Port, Gujarat—the gateway to northern and western trade—we orchestrate dedicated highway movements across 500+ Indian cities. From single container chassis dispatches to complex multi-axle heavy-haul convoys, our operations guarantee on-time transit and zero-damage delivery.",
    aboutBulletPoints: [
      "Container Transportation (20ft & 40ft dedicated chassis)",
      "FTL & LTL Transportation (9 MT to 40 MT flexible truckloads)",
      "ODC & Heavy Haulage (Engineered route surveys & permits)",
      "Project Cargo Transportation (Turnkey EPC site movements)",
      "Trailer & Multi-Axle Transportation (Hydraulic modular pullers)",
      "Machinery & Industrial Cargo Transportation (Factory equipment)",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    whyArrowline: [
      { number: "01", title: "Port Connectivity", desc: "Anchored directly at Mundra Port for immediate vehicle placement upon vessel discharge." },
      { number: "02", title: "Route Planning", desc: "Pre-surveyed national highway corridors optimized to eliminate transit delays and tolls." },
      { number: "03", title: "Right Vehicle Selection", desc: "Matching exact cargo weight and dimensions to open flatbeds, containers, or multi-axles." },
      { number: "04", title: "Coordinated Execution", desc: "Continuous GPS telemetry, 24/7 central dispatch monitoring, and digital proof-of-delivery." },
      { number: "05", title: "Pan-India Delivery", desc: "Robust transport network connecting every state, port, and inland manufacturing cluster." },
    ],
    processSteps: [
      { step: "01", title: "Cargo Requirement", desc: "Assessing cargo weight, dimensions, pickup location, and delivery schedule." },
      { step: "02", title: "Route Planning", desc: "Designing optimal highway paths and verifying state transport permissions." },
      { step: "03", title: "Vehicle Selection", desc: "Deploying vetted, GPS-equipped trailers matched to cargo profile." },
      { step: "04", title: "Dispatch", desc: "Supervised loading, certified lashing, and electronic e-Way bill issuance." },
      { step: "05", title: "Cargo Movement", desc: "Safe transit with continuous telemetry and automatic milestone updates." },
      { step: "06", title: "Delivery", desc: "On-time arrival, dock placement, and digital sign-off (e-POD)." },
    ],
    applications: [
      { title: "ISO Shipping Containers", desc: "20ft and 40ft import/export shipping boxes moved under port customs pass.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Industrial Machinery", desc: "Factory production machinery, CNC units, and precision engineering parts.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Over Dimensional Cargo (ODC)", desc: "Transformers, boilers, turbines, and large industrial pressure vessels.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Steel & Metallurgical Freight", desc: "Steel coils, plates, beams, structural sections, and pipeline bundles.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Automotive Assemblies", desc: "Engines, stampings, and automotive parts delivered JIT to assembly plants.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Commercial & FMCG Freight", desc: "Packaged consumer goods and industrial materials moved across regional hubs.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
    ],
    industries: ["Manufacturing & Engineering", "Automotive & Components", "Steel & Metals", "Chemicals & Petrochemicals", "FMCG & Consumer Goods", "Renewable Energy (Solar/Wind)", "Infrastructure & Construction", "Import / Export Traders"],
    networkDescription: "Connecting ports, factories, warehouses and project sites through road transportation across 500+ Indian cities.",
    faqs: [
      { q: "What is road transportation?", a: "Road transportation is the movement of goods over highway networks using commercial vehicles such as container trailers, flatbeds, multi-axles, and closed trucks, providing flexible door-to-door connectivity between ports, factories, and warehouses." },
      { q: "What road transportation services does Arrowline Logistics provide?", a: "Arrowline provides six specialized road services: Container Transportation, FTL & LTL Transportation, ODC & Heavy Haulage, Project Cargo Transportation, Trailer & Multi-Axle Transportation, and Machinery & Industrial Cargo Transportation." },
      { q: "What is the difference between FTL and LTL transportation?", a: "FTL (Full Truckload) dedicates an entire vehicle to a single shipper for direct, point-to-point transit. LTL (Less than Truckload) consolidates multiple smaller shipments into a single truck, allowing clients to pay only for the fraction of space and weight they use." },
      { q: "Does Arrowline provide container transportation from Mundra Port?", a: "Yes. Operating directly out of Mundra Port, we provide dedicated 20ft and 40ft container chassis for import container delivery to factories and export container transit to maritime terminals." },
      { q: "What is ODC and heavy haulage transportation?", a: "ODC (Over Dimensional Cargo) refers to shipments that exceed standard commercial vehicle dimensions or weights. Arrowline handles ODC using specialized hydraulic multi-axle trailers, route surveys, and statutory NHAI road permissions." },
      { q: "Can Arrowline handle project and industrial cargo across India?", a: "Yes. We manage turnkey project logistics for industrial plants, refineries, solar parks, and infrastructure builders, coordinating sequenced deliveries directly to construction sites." },
      { q: "Does Arrowline provide road transportation across all states in India?", a: "Yes. Our fleet operates across all Indian states and Union Territories, connecting coastal ports in Gujarat and Maharashtra to northern industrial hubs (NCR, Punjab, Rajasthan) and southern manufacturing corridors (Tamil Nadu, Karnataka, Telangana)." },
    ],
    gallery: [
      { id: "mr1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Pan-India Road Fleet", caption: "Arrowline heavy trailer moving on Western corridor" },
      { id: "mr2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Heavy ODC Transit", caption: "Hydraulic multi-axle trailer carrying industrial equipment" },
      { id: "mr3", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Mundra Port Operations", caption: "Container haulage dispatch from Mundra Port terminal" },
      { id: "mr4", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Factory Dock Loading", caption: "Scheduled FTL loading at manufacturing warehouse" },
    ],
    ctaHeadline: "Move Your Cargo With Confidence",
    seoTitle: "Road Transportation Services in India | Pan-India Freight | Arrowline",
    seoDesc: "Premier road transportation services across India from Arrowline Logistics. FTL, LTL, container chassis, ODC heavy haulage, and machinery transport from Mundra Port.",
    isPublished: true,
    displayOrder: 1,
    subServices: roadSubServices,
  },
  {
    id: "main-rail",
    slug: "rail-transportation",
    title: "Rail Transportation",
    shortDesc: "Cost-effective, scheduled rail freight and container train operations connecting major ports, ICDs, and industrial terminals across India.",
    category: "Rail Logistics",
    keyCapability: "WDFC Container Trains & Bulk Freight Rakes",
    heroBadge: "RAIL TRANSPORTATION • PAN-INDIA",
    heroHeadline: "Reliable Rail Transportation Solutions Across India",
    heroSubheadline: "Scheduled double-stack container trains and dedicated freight rakes connecting Mundra Port with inland dry ports and industrial centers.",
    heroDescription: "Cost-effective, scheduled rail freight and container train operations connecting major ports, ICDs, and industrial terminals across India.",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    highlights: ["RAIL FREIGHT", "CONTAINER RAIL", "MULTIMODAL CONNECTIVITY", "INDUSTRIAL CARGO"],
    aboutBadge: "RAIL TRANSPORTATION",
    aboutHeading: "Connecting Rail Networks, Ports & Industrial Hubs.",
    aboutDescription: "Rail freight represents India's most economical, reliable, and sustainable transport corridor for moving bulk commodities and containerized cargo over long distances. Arrowline Logistics connects maritime commerce at Mundra Port to national rail corridors and the Western Dedicated Freight Corridor (WDFC). Through strategic coordination with Indian Railways and container train operators (CONCOR), we deliver high-velocity long-haul rail logistics.",
    aboutBulletPoints: [
      "Rail Freight Transportation (WDFC high-speed corridors)",
      "Container Rail Transportation (Double-stack port to ICD trains)",
      "Full Train Load (FTL) Services (2,500+ MT dedicated rakes)",
      "Multimodal Rail Transportation (Door-to-door road/rail integration)",
      "Intermodal Rail Freight (Sealed zero-handling container transit)",
      "Bulk & Industrial Cargo Transportation (Steel, minerals, cement)",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    whyArrowline: [
      { number: "01", title: "Dedicated Corridors", desc: "Direct access to Western Dedicated Freight Corridor (WDFC) for express transit speeds." },
      { number: "02", title: "Volume Economy", desc: "Significant freight cost reductions of 25% to 40% on long-distance movements over 500 km." },
      { number: "03", title: "Terminal Siding Sync", desc: "Direct loading at Mundra port rail sidings and destination Inland Container Depots (ICDs)." },
      { number: "04", title: "Weather Immunity", desc: "Guaranteed transit timelines unaffected by highway traffic, monsoons, or road toll delays." },
      { number: "05", title: "Lower Carbon Footprint", desc: "Eco-friendly, low-emission transportation supporting corporate sustainability targets." },
    ],
    processSteps: [
      { step: "01", title: "Cargo Assessment", desc: "Evaluating shipment volume, weight, commodity classification, and destination ICD." },
      { step: "02", title: "Rail Planning", desc: "Scheduling wagon allocation and securing priority train slots with rail operators." },
      { step: "03", title: "Terminal Coordination", desc: "Transferring cargo to Mundra port rail siding and mechanized loading onto rake." },
      { step: "04", title: "Rail Movement", desc: "High-speed rail transit across dedicated freight corridors with continuous telemetry." },
      { step: "05", title: "Intermodal Connection", desc: "Gantry crane offloading at destination dry port and staging onto local delivery trailers." },
      { step: "06", title: "Delivery", desc: "Final road delivery and signed confirmation at consignee factory or warehouse dock." },
    ],
    applications: [
      { title: "Import Containerized Cargo", desc: "20ft and 40ft container trains moving from Mundra to Northern ICD dry ports.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
      { title: "Steel Billets & Heavy Coils", desc: "High-tonnage industrial steel products moved on heavy-duty railway flatcars.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Bulk Minerals, Ores & Coal", desc: "Raw materials for thermal power plants, metallurgical smelters, and chemical units.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Cement, Clinker & Aggregates", desc: "Bulk building materials moved from plants directly to regional distribution sidings.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Fertilizers & Agriculture", desc: "Urea, DAP, and food grains moved in covered waterproof BCN wagons across India.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Automotive Components", desc: "Crated automotive parts and sub-assemblies moving between manufacturing clusters.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
    ],
    industries: ["Steel & Metal Manufacturing", "Cement & Building Materials", "Fertilizers & Chemicals", "Automotive & Components", "Agriculture & Food Commodities", "International Trade (Exim Shippers)", "Power & Energy", "Mining & Minerals"],
    networkDescription: "Connecting rail terminals, ports and industrial hubs through rail freight across the Western Dedicated Freight Corridor and Indian Railways network.",
    faqs: [
      { q: "What is rail freight transportation?", a: "Rail freight transportation is the movement of containerized and bulk cargo using specialized railway wagons across national rail corridors, providing high-capacity, cost-effective long-haul transit." },
      { q: "What is container rail transportation?", a: "Container rail transportation moves standard ISO shipping containers (20ft and 40ft) on specialized flatcars between seaports like Mundra and Inland Container Depots (ICDs) located near major inland consumption cities." },
      { q: "What is Full Train Load (FTL) in rail services?", a: "Full Train Load (or full rake service) is the booking of an entire dedicated train consisting of 40 to 45 wagons carrying 2,500 to 3,500 metric tons of cargo in a single non-stop journey." },
      { q: "What is multimodal rail transportation?", a: "Multimodal rail combines road trucking for first-mile pickup and last-mile delivery with high-speed rail freight for the long-haul middle section, providing door-to-door delivery with single-window accountability." },
      { q: "What is intermodal rail freight?", a: "Intermodal rail freight moves cargo inside sealed standardized containers across ship, train, and truck modes without the cargo itself ever being unpacked or handled during transfers." },
      { q: "What types of industrial cargo can be moved by rail?", a: "Rail handles containerized import/export goods, industrial steel, coal, minerals, cement, fertilizers, chemicals (in ISO tanks), automotive parts, and bulk agricultural commodities." },
      { q: "Does Arrowline provide rail transportation across India?", a: "Yes. Arrowline coordinates rail movements from Mundra Port across Northern India (Delhi NCR, Punjab, Haryana, Rajasthan), Central India (Madhya Pradesh, Gujarat), and Southern corridors via Dedicated Freight Corridors." },
    ],
    gallery: [
      { id: "mrail1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", title: "Dedicated Container Train", caption: "Double-stack container train on Western Dedicated Freight Corridor" },
      { id: "mrail2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "Rail Siding Gantry", caption: "High-speed gantry crane transferring containers at Mundra railhead" },
      { id: "mrail3", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Steel Flatcar Rake", caption: "Heavy industrial steel coils secured on railway flatcars" },
      { id: "mrail4", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Port Rail Terminal", caption: "Mundra Port intermodal rail facility" },
    ],
    ctaHeadline: "Move More Cargo Through Smarter Rail Logistics",
    seoTitle: "Rail Transportation Services in India | Container Rail Freight | Arrowline",
    seoDesc: "Cost-effective rail transportation and container train services across India. Direct WDFC corridor access from Mundra Port to major inland ICD dry ports.",
    isPublished: true,
    displayOrder: 2,
    subServices: railSubServices,
  },
  {
    id: "main-project-cargo",
    slug: "project-cargo-transportation",
    title: "Project Cargo Transportation",
    shortDesc: "Turnkey engineering and logistics solutions for over-dimensional (ODC), breakbulk, super-heavy machinery, and infrastructure project shipments.",
    category: "Specialized Project Logistics",
    keyCapability: "Engineered ODC, Multi-Axle Pullers & EPC Logistics",
    heroBadge: "PROJECT CARGO • SPECIALIZED LOGISTICS",
    heroHeadline: "Moving Heavy & Complex Cargo With Precision",
    heroSubheadline: "Engineered heavy-lift transportation, route surveys, multi-axle hydraulic pullers, and turnkey project logistics for industrial developments across India.",
    heroDescription: "Turnkey engineering and logistics solutions for over-dimensional (ODC), breakbulk, super-heavy machinery, and infrastructure project shipments across India.",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    highlights: ["HEAVY CARGO", "ODC MOVEMENT", "SPECIAL TRAILERS", "PROJECT LOGISTICS"],
    aboutBadge: "PROJECT CARGO TRANSPORTATION",
    aboutHeading: "Moving Complex Cargo From Planning to Project Site.",
    aboutDescription: "Project cargo requires specialized engineering, meticulous civil route planning, and dedicated heavy-haulage equipment. Arrowline Logistics specializes in transporting oversized industrial equipment, boilers, transformers, and structural components that exceed standard highway dimensions and weight limits. We manage everything from civil bridge surveys and statutory permits to multi-axle trailer deployment and escort coordination.",
    aboutBulletPoints: [
      "Heavy & ODC Cargo Transportation (Hydraulic multi-axle haulage)",
      "Breakbulk Cargo Transportation (Non-containerized port stevedoring)",
      "Industrial Machinery Transportation (Factory plant equipment)",
      "Multi-Axle & Special Trailer Transportation (Low-bed, drop-deck)",
      "End-to-End Project Logistics (Turnkey EPC site coordination)",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    whyArrowline: [
      { number: "01", title: "Technical Engineering", desc: "Detailed route surveys, bridge load ratings, center of gravity, and swept-path analysis." },
      { number: "02", title: "Heavy Equipment Fleet", desc: "Hydraulic modular multi-axles, drop-deck well beds, and extendable beam trailers." },
      { number: "03", title: "Statutory Approvals", desc: "Expert handling of NHAI, MoRTH, state police, and electricity board clearances." },
      { number: "04", title: "Port Staging Strength", desc: "Direct access to heavy-lift berths and secure staging yards at Mundra Port." },
      { number: "05", title: "Zero-Incident Safety", desc: "Rigorous HSE protocols protecting high-value capital assets throughout transit." },
    ],
    processSteps: [
      { step: "01", title: "Project Assessment", desc: "Evaluating technical drawings, weights, dimensions, lifting points, and timelines." },
      { step: "02", title: "Cargo & Route Planning", desc: "Conducting physical road surveys and identifying bridge bypasses and overhead wires." },
      { step: "03", title: "Equipment Planning", desc: "Configuring hydraulic modular axles and prime movers matched to cargo profile." },
      { step: "04", title: "Movement Execution", desc: "Supervised loading, certified lashing, and escorted convoy highway transit." },
      { step: "05", title: "Site Coordination", desc: "Aligning arrival with site mobile crane contractors and foundation laydown." },
      { step: "06", title: "Project Delivery", desc: "Precise placement onto foundation stools and final client signoff." },
    ],
    applications: [
      { title: "Power Transformers & Turbines", desc: "Heavy electrical generation transformers, steam turbines, and generators.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Refinery Columns & Reactors", desc: "High-pressure catalytic reactors, distillation columns, and chemical skids.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Wind Energy Components", desc: "Heavy nacelles, tower sections, and long rotor blades moved to wind farms.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Heavy Foundry & Stamping Presses", desc: "Multi-hundred-ton hydraulic forging presses and industrial casting units.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "TBM & Infrastructure Parts", desc: "Tunnel boring machines, pre-cast bridge girders, and metro construction equipment.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Steel Mill Machinery", desc: "Rolling mills, continuous casting rollers, and heavy structural assemblies.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
    ],
    industries: ["EPC Contractors & Turnkey Builders", "Power Generation & Utilities", "Oil, Gas & Petrochemicals", "Renewable Energy (Wind & Solar)", "Heavy Engineering & Fabrication", "Steel & Metallurgical Plants", "Mining & Earthmoving", "Infrastructure & Bridges"],
    networkDescription: "Connecting project origin points with industrial and infrastructure destinations across all Indian states and economic zones.",
    faqs: [
      { q: "What is project cargo transportation?", a: "Project cargo transportation is the specialized logistics management of heavy, oversized, high-value, or complex industrial equipment required for specific capital engineering and construction projects." },
      { q: "What is ODC (Over Dimensional Cargo)?", a: "ODC refers to cargo that exceeds the standard dimensions or gross vehicle weight limits established by road transport regulations, requiring hydraulic modular trailers, route surveys, and statutory NHAI permits." },
      { q: "What is breakbulk cargo transportation?", a: "Breakbulk refers to non-containerized cargo—such as steel pipes, structural girders, large crated machinery, and heavy equipment—that is loaded individually onto ships and specialized road trailers." },
      { q: "How is heavy machinery transported safely by road?", a: "Heavy machinery is transported using low-bed or hydraulic multi-axle trailers with anti-vibration dunnage, high-tensile chain binders, and route-engineered clearances protecting against overhead obstacles." },
      { q: "What is multi-axle transportation?", a: "Multi-axle transportation uses modular trailer platforms with multiple hydraulically suspended and steered axle lines to distribute massive single-piece loads (up to 350+ MT) safely across highways and bridges." },
      { q: "What does end-to-end project logistics involve?", a: "End-to-end project logistics involves managing the complete supply chain: pre-bid consulting, route surveys, port handling at Mundra, customs clearance, off-dock staging, multi-axle road transit, and foundation positioning at site." },
      { q: "How does Arrowline plan complex cargo movements?", a: "Arrowline plans complex movements through technical drawing analysis, physical route surveys, AutoCAD swept-path simulations, statutory permit acquisition, and dedicated on-site engineering supervision." },
    ],
    gallery: [
      { id: "mpc1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Heavy Transformer Haulage", caption: "280 MT power transformer moving on 18-axle hydraulic puller" },
      { id: "mpc2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Port Direct Discharge", caption: "Heavy reactor vessel offloaded direct to Arrowline trailer" },
      { id: "mpc3", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg", title: "Tandem Crane Lifting", caption: "Precision tandem crane lifting for industrial project equipment" },
      { id: "mpc4", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Wind Energy Transport", caption: "Wind turbine components transit across Rajasthan highway" },
    ],
    ctaHeadline: "Let's Plan Your Complex Cargo Movement",
    seoTitle: "Project Cargo Transportation Services India | ODC Heavy Lift | Arrowline",
    seoDesc: "Specialized project cargo and ODC transportation services across India. Hydraulic multi-axles, route surveys, breakbulk port handling, and turnkey EPC logistics.",
    isPublished: true,
    displayOrder: 3,
    subServices: projectCargoSubServices,
  },
  {
    id: "main-warehousing",
    slug: "warehousing-storage",
    title: "Warehousing & Storage",
    shortDesc: "Strategic industrial warehousing, distribution fulfillment, inventory management, and container storage facilities located near Mundra Port and major transit corridors.",
    category: "Contract Warehousing",
    keyCapability: "Port-Side Covered Storage & Off-Dock Container Yards",
    heroBadge: "WAREHOUSING & STORAGE",
    heroHeadline: "Strategic Warehousing & Storage Solutions",
    heroSubheadline: "State-of-the-art industrial storage, container handling, inventory management, and distribution hubs strategically located near Mundra Port.",
    heroDescription: "Strategic warehousing, container handling, inventory management, and distribution solutions engineered for industrial supply chains across India.",
    heroImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    highlights: ["INDUSTRIAL STORAGE", "DISTRIBUTION", "INVENTORY MANAGEMENT", "CARGO HANDLING"],
    aboutBadge: "WAREHOUSING & STORAGE",
    aboutHeading: "Strategic Storage. Smarter Cargo Flow.",
    aboutDescription: "Effective warehousing connects maritime import arrivals, buffer storage, and domestic distribution into a synchronized supply chain. Arrowline Logistics provides modern industrial warehousing facilities situated near Mundra Port, Gujarat. From secure covered racked storage and open industrial staging yards to off-dock container handling and automated inventory tracking, we optimize your cargo flow and eliminate port demurrage.",
    aboutBulletPoints: [
      "General & Industrial Warehousing (Covered facilities & open yards)",
      "Distribution & Fulfillment (B2B picking, kitting, and cross-docking)",
      "Inventory Management (Barcode tracking, FIFO control, live reporting)",
      "Container Storage & Handling (45 MT reach stackers & de-stuffing docks)",
      "Loading & Unloading (Mechanized forklift fleet & heavy rigging teams)",
    ],
    aboutImage: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
    whyArrowline: [
      { number: "01", title: "Port Proximity", desc: "Located minutes from Mundra Port terminals for immediate cargo evacuation and zero demurrage." },
      { number: "02", title: "Heavy Infrastructure", desc: "High-load industrial flooring, hydraulic dock levelers, and 45-ton reach stacker equipment." },
      { number: "03", title: "Inventory Transparency", desc: "Real-time stock tracking with lot, batch, and serial number visibility via automated reporting." },
      { number: "04", title: "24/7 Security", desc: "Continuous CCTV surveillance, perimeter fencing, and trained security personnel on site." },
      { number: "05", title: "Integrated Transport", desc: "Directly connected with Arrowline's linehaul road and rail fleet for rapid onward dispatch." },
    ],
    processSteps: [
      { step: "01", title: "Inbound Planning", desc: "Scheduling arrival, verifying container/truck paperwork, and preparing dock bays." },
      { step: "02", title: "Cargo Receiving", desc: "Mechanized unloading, physical count tally, and visual condition inspection." },
      { step: "03", title: "Storage", desc: "Assigning dedicated racked or yard storage location with barcode scan-in." },
      { step: "04", title: "Inventory Management", desc: "Continuous stock monitoring, FIFO control, and automated reconciliation reports." },
      { step: "05", title: "Order Processing", desc: "Picking, kitting, labeling, and palletizing matching client dispatch orders." },
      { step: "06", title: "Dispatch", desc: "Secure loading onto outbound trucks and e-Way bill / POD handover." },
    ],
    applications: [
      { title: "Industrial Raw Materials", desc: "Chemical bags, polymer pellets, rubber bales, and mineral sacks in covered bays.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
      { title: "Finished Commercial Goods", desc: "Palletized consumer appliances, packaging materials, and retail products.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
      { title: "Import Containers & Equipment", desc: "20ft and 40ft containers staged in our off-dock yard to eliminate port demurrage.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg" },
      { title: "Structural Steel & Pipes", desc: "Heavy metallurgical products and bundles stored securely in our heavy open yard.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
      { title: "Automotive Parts & Spares", desc: "Organized racked storage for automotive parts ready for JIT factory replenishment.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
      { title: "Project Staging Packages", desc: "Consolidated capital goods staged and sorted prior to phased installation at site.", image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg" },
    ],
    industries: ["Industrial Manufacturing", "Chemicals & Petrochemicals", "Import & Export Traders", "Automotive & Heavy Industry", "FMCG & Consumer Packaged Goods", "Renewable Energy & Solar", "Steel & Metals", "Retail & Wholesale Distribution"],
    networkDescription: "Connecting suppliers, storage facilities and distribution networks through strategic warehousing near Mundra Port and major transit corridors.",
    faqs: [
      { q: "What is industrial warehousing?", a: "Industrial warehousing is the provision of secure, heavy-duty storage facilities (both covered warehouses and open yards) engineered for raw materials, manufactured products, machinery, and commercial goods." },
      { q: "What is distribution and fulfillment?", a: "Distribution and fulfillment encompasses receiving bulk cargo, managing inventory, picking and packing specific orders, applying custom labeling, and dispatching shipments to regional wholesalers and retailers." },
      { q: "How does inventory management work at Arrowline?", a: "We utilize barcode-based tracking to record every inbound item into designated rack/bin locations, enforce FIFO rotation, conduct regular cycle counts, and provide clients with real-time stock visibility." },
      { q: "Does Arrowline provide container storage and handling near Mundra Port?", a: "Yes. We operate secure off-dock container yards equipped with 45-ton reach stackers, providing container storage, stuffing, and de-stuffing at rates far lower than port terminal demurrage." },
      { q: "What does loading and unloading involve?", a: "Our loading and unloading services use modern forklifts, hydraulic dock levelers, and crane rigging to transfer goods safely between transport vehicles and warehouse docks with zero handling damage." },
      { q: "What types of goods can be stored in your facilities?", a: "We store industrial raw materials, chemicals (non-hazardous and approved classifications), manufactured goods, steel, machinery, palletized consumer products, and containers." },
      { q: "How can warehousing support supply chain operations?", a: "Strategic warehousing near ports buffers against shipping delays, prevents port demurrage, allows bulk purchase economies, and enables rapid order fulfillment to regional consumption centers." },
    ],
    gallery: [
      { id: "mwh1", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", title: "Modern Covered Warehouse", caption: "High-clearance racked industrial storage facility near Mundra" },
      { id: "mwh2", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", title: "Container Dock Operations", caption: "Multi-bay loading docks for rapid trailer turnaround" },
      { id: "mwh3", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", title: "Heavy Storage Yard", caption: "Secured open yard for heavy industrial steel and machinery" },
      { id: "mwh4", url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", title: "Forklift Handling Station", caption: "Precision forklift pallet handling inside facility" },
    ],
    ctaHeadline: "Let's Build a Smarter Storage Solution",
    seoTitle: "Warehousing & Storage Services India | Mundra Industrial Storage | Arrowline",
    seoDesc: "Strategic warehousing, distribution fulfillment, container storage, and inventory management near Mundra Port, Gujarat with Arrowline Logistics.",
    isPublished: true,
    displayOrder: 4,
    subServices: warehousingSubServices,
  },
];

// Helper functions for easy access
export function getAllMainServices(): MainServiceData[] {
  return MAIN_SERVICES.filter(s => s.isPublished);
}

export function getMainServiceBySlug(slug: string): MainServiceData | undefined {
  return MAIN_SERVICES.find(s => s.slug === slug);
}

export function getSubServiceBySlug(parentSlug: string, subSlug: string): SubServiceData | undefined {
  const parent = getMainServiceBySlug(parentSlug);
  if (!parent) return undefined;
  return parent.subServices.find(sub => sub.slug === subSlug);
}

export function getAllSubServices(): SubServiceData[] {
  return MAIN_SERVICES.flatMap(m => m.subServices);
}

export function getRelatedServices(currentServiceSlug: string, currentSubSlug?: string) {
  if (currentSubSlug) {
    const parent = getMainServiceBySlug(currentServiceSlug);
    const siblings = parent ? parent.subServices.filter(s => s.slug !== currentSubSlug) : [];
    const otherMain = MAIN_SERVICES.filter(m => m.slug !== currentServiceSlug);
    return {
      parent,
      siblings,
      otherMain,
    };
  } else {
    const otherMain = MAIN_SERVICES.filter(m => m.slug !== currentServiceSlug);
    const current = getMainServiceBySlug(currentServiceSlug);
    return {
      current,
      otherMain,
      subServices: current ? current.subServices : [],
    };
  }
}
