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
  // Enhanced fields for detailed service pages
  heroHeadline?: string;
  heroSubheadline?: string;
  ctaText?: string;
  ctaSubtext?: string;
  capabilities?: Array<[string, string]>;
  process?: Array<[string, string, string]>;
  faqs?: Array<[string, string]>;
  industries?: string[];
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
  secondaryEmail: "info@arrowlinelogistics.in",
  phone: "+91 99222 04446",
  secondaryPhone: "+91 9766262612",
  whatsapp: "+919922204446",
  headOffice: "Office 204, Portview Commercial Complex, Near Adani House, Mundra Port Road, Mundra, Kutch, Gujarat - 370421, India",
  aboutShort: "ARROWLINE LOGISTICS is a premier multimodal logistics and transportation company operating across India. Centered at Mundra Port, Gujarat—the gateway of India's maritime trade—we integrate road transportation (FTL/PTL), rail freight, coastal shipping, and customs clearance to deliver reliable, optimized, and secure door-to-door supply chain solutions.",
  aboutDetailed: "Arrowline Logistics provides end-to-end logistics, material transport, and supply chain solutions designed to move industrial goods, containers, and oversized cargo efficiently across India. Grounded at Mundra Port, Gujarat, we coordinate highway transport, CONCOR rail links, coastal shipping routes, and global freight forwarding to deliver seamless pan-India connectivity for major industries."
};

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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
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
    id: "customs-clearance",
    slug: "customs-clearance",
    title: "Customs Clearance",
    category: "Port Brokerage",
    keyCapability: "ICEGATE Documentation & Compliance Management",
    shortDesc: "Compliant custom brokerage and documentation support ensuring smooth, swift clearance of import and export shipments at Mundra Port.",
    longDesc: "We provide compliant customs clearance and brokerage coordination to facilitate smooth cross-border freight flow. From ICEGATE filing to tariff classifications, duty calculations, and port authority liaison, our experienced team manages documentation accurately to prevent costly port delays.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
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
  },

  // ===== 6 SPECIALIZED SERVICE PAGES =====

  {
    id: "full-truck-load",
    slug: "full-truck-load-ftl",
    title: "Full Truck Load (FTL)",
    category: "Direct Road Transport",
    keyCapability: "Dedicated Vehicle Movement",
    heroHeadline: "Full Truck Load Transportation Built for Direct, Reliable Delivery",
    heroSubheadline: "Dedicated truck movement from pickup to delivery without unnecessary transshipment.",
    shortDesc: "Dedicated FTL transportation for manufacturers, distributors, exporters, warehouses and businesses that need direct, controlled movement of full truck shipments across India.",
    longDesc: "Arrowline Logistics provides dedicated FTL transportation for manufacturers, distributors, exporters, warehouses and businesses that need direct, controlled movement of full truck shipments across India. One vehicle, one shipment, direct delivery—eliminating multiple handling points and consolidation delays.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    features: [
      "Direct movement without transshipment or intermediate consolidation",
      "Lower handling and reduced transshipment risk",
      "Better shipment control from pickup to delivery",
      "Faster transit planning with dedicated vehicle",
      "GPS tracking and real-time milestone updates"
    ],
    benefits: [
      "Dedicated capacity for large bulk or high-value shipments without co-loading risks",
      "Shorter transit times by avoiding intermediate hubs or consolidation delays",
      "End-to-end security control with vetted drivers and digital trip manifests",
      "Flexible dispatch schedules synchronized with manufacturing & warehouse operations"
    ],
    seoTitle: "Full Truck Load (FTL) Transportation Services in India | Arrowline Logistics",
    seoDesc: "Dedicated FTL transportation across India with GPS tracking, proof of delivery, and pan-India coverage from Arrowline Logistics.",
    capabilities: [
      ["Dedicated Full Truck Load", "One dedicated vehicle moves your shipment directly from pickup to delivery."],
      ["Factory-to-Warehouse Transportation", "Specialized movement of goods from manufacturing facilities to distribution centers."],
      ["Factory-to-Customer Delivery", "Direct delivery solutions from production plants to end customers."],
      ["Port-to-Warehouse Movement", "Coordinated container and break-bulk cargo movement from ports to inland warehouses."],
      ["GPS Shipment Tracking", "Real-time GPS visibility with milestone alerts throughout the transit."],
      ["Proof of Delivery", "Digital POD and delivery confirmation for complete transparency."]
    ],
    process: [
      ["01", "Requirement", "Share your pickup, destination, cargo details and timeline."],
      ["02", "Vehicle Planning", "We match the vehicle to your cargo size, weight, route and handling needs."],
      ["03", "Pickup & Loading", "The assigned vehicle arrives on schedule and cargo is loaded and secured."],
      ["04", "GPS Monitored Transit", "Real-time GPS visibility and milestone updates keep your team informed."],
      ["05", "Delivery", "Cargo reaches the required destination according to the planned route."],
      ["06", "POD", "Delivery confirmation and Proof of Delivery are provided as required."]
    ],
    faqs: [
      ["What is FTL transportation?", "FTL means Full Truck Load: a dedicated vehicle moves one customer's shipment directly from pickup to delivery without consolidation."],
      ["When should I choose FTL instead of PTL?", "Choose FTL when you have large shipments (typically >8-10 tons or >70% truck capacity), time-sensitive requirements, or high-value cargo."],
      ["Can I book a dedicated truck for recurring shipments?", "Yes. We arrange recurring monthly transportation plans with fixed schedules for routine business movements."],
      ["Do you provide GPS tracking?", "Yes. Real-time GPS tracking, milestone alerts, and Proof of Delivery are provided for all FTL shipments."],
      ["Can FTL shipments move between states?", "Yes. We support full interstate transportation across major business corridors connecting manufacturing hubs, ports, and distribution centers."],
      ["What types of cargo can be transported by FTL?", "FTL is suitable for manufacturing goods, FMCG, automotive parts, chemicals, pharmaceuticals, retail goods, industrial equipment, and other bulk materials."],
      ["Do you handle specialized cargo?", "Yes. We arrange specialized equipment like temperature-controlled vehicles, tank trucks, and secure containers for specific cargo types."]
    ],
    industries: ["Manufacturing", "FMCG & Retail", "Automotive", "Chemicals", "Pharmaceuticals", "Industrial Equipment", "Solar & Infrastructure"]
  },

  {
    id: "part-load",
    slug: "part-load-ptl",
    title: "Part Load (PTL)",
    category: "Shared Road Capacity",
    keyCapability: "Planned Shared Capacity",
    heroHeadline: "Part Load Transportation for Smarter Shipment Utilization",
    heroSubheadline: "Planned shared capacity for smaller shipments between major business locations.",
    shortDesc: "Part-load solutions for businesses with smaller shipments that do not require full truck capacity. Planned consolidation with scheduled dispatches.",
    longDesc: "Arrowline Logistics offers Part Truck Load (PTL) services for businesses with smaller shipments that do not require complete truck capacity. Our planned consolidation and scheduled dispatch model makes PTL cost-effective while maintaining reliability.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    features: [
      "Shared truck capacity for smaller shipments",
      "Multi-location consolidation from multiple suppliers or to multiple destinations",
      "Scheduled dispatch to major business corridors",
      "Hub-to-hub movement with predictable timelines",
      "Tracking and delivery confirmation for each shipment"
    ],
    benefits: [
      "Cost-effective alternative to FTL for smaller shipments",
      "Predictable dispatch schedules synchronized with business locations",
      "Lower freight per unit than booking full trucks",
      "Flexibility to adjust shipment size without premium charges"
    ],
    seoTitle: "Part Load (PTL) Transportation Services in India | Arrowline Logistics",
    seoDesc: "Cost-effective PTL services for smaller shipments across India. Scheduled consolidation and shared truck capacity from Arrowline Logistics.",
    capabilities: [
      ["Shared Truck Capacity", "Multiple shipments consolidated on one vehicle for cost efficiency."],
      ["Multi-Location Consolidation", "Collect shipments from multiple suppliers and deliver to multiple destinations."],
      ["Scheduled Dispatch", "Regular, predictable dispatch schedules to major business corridors."],
      ["Hub-to-Hub Movement", "Planned movement through consolidation hubs for broader geographic reach."],
      ["Business-to-Business Delivery", "Direct B2B shipments with business-hour delivery windows."],
      ["Shipment Tracking", "Individual shipment tracking even within consolidated loads."]
    ],
    process: [
      ["01", "Shipment Details", "Share your shipment size, pickup, delivery and timeline requirements."],
      ["02", "Consolidation Planning", "We plan pickup-delivery pairings with other shipments on compatible routes."],
      ["03", "Dispatch", "Your shipment is consolidated with others and dispatched on schedule."],
      ["04", "Transit", "Real-time tracking of consolidated load with individual shipment visibility."],
      ["05", "Delivery", "Your shipment is separated and delivered to the final destination."],
      ["06", "POD", "Proof of Delivery confirming receipt at the final destination."]
    ],
    faqs: [
      ["What is PTL transportation?", "PTL (Part Truck Load) is when multiple smaller shipments share truck space on a single vehicle to reduce costs compared to dedicated FTL."],
      ["When is PTL better than FTL?", "PTL is ideal for shipments under 8-10 tons, when you need to reduce transportation costs, or for regular smaller consignments."],
      ["How is shared capacity planned?", "We consolidate compatible shipments with similar pickup, delivery locations and timelines, then dispatch on scheduled routes."],
      ["Can multiple destinations be handled?", "Yes. PTL consolidation can handle shipments to multiple destinations along major business corridors with sequential deliveries."],
      ["Is shipment tracking available?", "Yes. Each shipment is tracked individually even though it's part of a consolidated load."],
      ["What is the typical shipment size for PTL?", "PTL is ideal for shipments ranging from 1-10 tons, or taking up 20-70% of truck capacity."],
      ["How often do PTL shipments dispatch?", "We dispatch to major corridors on fixed schedules—typically daily or twice-weekly depending on the route."]
    ],
    industries: ["Retail", "FMCG", "Distribution", "Import-Export", "Manufacturing", "Wholesalers"]
  },

  {
    id: "local-interstate",
    slug: "local-interstate-transportation",
    title: "Local & Interstate Transportation",
    category: "Pan-India Delivery",
    keyCapability: "Regional & Interstate Distribution",
    heroHeadline: "Reliable Local & Interstate Transportation Across India",
    heroSubheadline: "Factory, warehouse, distributor and customer deliveries planned around your business.",
    shortDesc: "Comprehensive local and interstate transportation services for factory-to-warehouse, warehouse-to-distributor, and customer delivery movements across major Indian business corridors.",
    longDesc: "Arrowline Logistics provides reliable local and interstate transportation services supporting factory deliveries, warehouse transfers, distributor movements, and customer fulfillment across India's major business corridors.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    features: [
      "Factory to warehouse transfers",
      "Warehouse to distributor movement",
      "Distributor to retailer/customer delivery",
      "Port to inland facility movement",
      "Multi-point pickup and delivery consolidation",
      "Interstate corridor expertise (Maharashtra, Gujarat, Delhi NCR, Karnataka, Tamil Nadu, etc.)",
      "Regional hub coordination"
    ],
    benefits: [
      "Planned routes synchronized with supply chain schedules",
      "Cost optimization through corridor expertise",
      "Reliable transit timelines on established routes",
      "Flexibility to add or adjust pickup/delivery points"
    ],
    seoTitle: "Local & Interstate Transportation Services Across India | Arrowline Logistics",
    seoDesc: "Reliable local and interstate delivery services connecting factories, warehouses, distributors and customers across India with Arrowline Logistics.",
    capabilities: [
      ["Factory Deliveries", "Direct pickup from manufacturing facilities to warehouses or customers."],
      ["Warehouse Transfers", "Movement of goods between company warehouses or distribution centers."],
      ["Distributor Movement", "Delivery to regional distributors and wholesalers across states."],
      ["Interstate Transportation", "Specialized services for multi-state movements with compliance coordination."],
      ["Regional Distribution", "Hub-based consolidation for broader geographic reach."],
      ["Port Connectivity", "Direct port-to-inland facility movement for import/export cargo."],
      ["Scheduled Delivery", "Fixed schedules for recurring shipments and regular supply chain movements."],
      ["Reverse Logistics Support", "Return shipment management for product recalls, repairs, or B2C returns."]
    ],
    process: [
      ["01", "Route Planning", "We analyze your pickup locations, delivery points and supply chain schedule."],
      ["02", "Vehicle Assignment", "Appropriate vehicles are assigned based on shipment size and frequency."],
      ["03", "Pickup Execution", "Scheduled pickup from factories, warehouses or distribution centers."],
      ["04", "Transit", "Movement across regions with real-time tracking and updates."],
      ["05", "Delivery", "Delivery to final distribution points or customer locations."],
      ["06", "Documentation", "Proof of delivery and shipment documentation for compliance."]
    ],
    faqs: [
      ["What regions do you cover?", "We provide local and interstate transportation across major business corridors including Maharashtra, Gujarat, Delhi NCR, Rajasthan, Madhya Pradesh, Karnataka, Tamil Nadu, Telangana and other key business hubs."],
      ["Can you handle multi-point deliveries?", "Yes. We consolidate pickups and plan multi-point deliveries to optimize routes and reduce transportation cost."],
      ["Do you provide scheduled transportation?", "Yes. Regular recurring shipments can be scheduled with fixed dispatch dates and timelines."],
      ["What about reverse logistics?", "Yes. We manage product returns, warranty shipments, and reverse logistics for supply chain optimization."],
      ["Are interstate shipments tracked?", "Yes. Real-time tracking, milestone updates, and proof of delivery are provided for all movements."],
      ["How do you ensure timely delivery?", "We use established corridors, experienced drivers, and GPS optimization to maintain predictable, on-time delivery performance."]
    ],
    industries: ["Manufacturing", "FMCG & Retail", "Distribution", "Automotive", "Pharmaceuticals", "E-commerce"]
  },

  {
    id: "container-transport",
    slug: "container-transportation",
    title: "Container Transportation",
    category: "Import-Export Logistics",
    keyCapability: "Port & CFS Coordination",
    heroHeadline: "Container Transportation Connected to Ports, CFS & Inland Destinations",
    heroSubheadline: "20-ft and 40-ft import/export container movement with coordinated road transportation.",
    shortDesc: "Specialized container transportation for 20-ft and 40-ft containers, with seamless coordination between ports, CFS facilities, and inland warehouses.",
    longDesc: "Arrowline Logistics provides specialized container transportation services for import and export cargo movement. From port pickup to CFS delivery to final inland warehouse placement, we coordinate the complete logistics chain.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    features: [
      "20-ft and 40-ft container transportation",
      "Port-to-CFS movement and coordination",
      "CFS-to-warehouse delivery",
      "Factory-to-port export movement",
      "Container tracking and documentation",
      "Empty container coordination",
      "Customs clearance coordination"
    ],
    benefits: [
      "Seamless port-to-inland facility coordination",
      "Reduced container detention and port demurrage",
      "End-to-end visibility from port to destination",
      "Coordinated documentation for customs clearance"
    ],
    seoTitle: "Container Transportation Services | 20ft & 40ft Container Movement | Arrowline",
    seoDesc: "Specialized 20-ft and 40-ft container transportation for import/export with port and CFS coordination from Arrowline Logistics.",
    capabilities: [
      ["20-ft Container Transportation", "Dedicated movement of 20-foot containers from ports to inland facilities."],
      ["40-ft Container Transportation", "Specialized handling and movement of 40-foot containers."],
      ["Port-to-CFS Movement", "Direct pickup from port gates and delivery to Customs Freight Stations."],
      ["CFS-to-Warehouse", "Movement of cleared containers from CFS to final warehouse location."],
      ["Factory-to-Port", "Export container pickup from manufacturing facilities to port for shipment."],
      ["Export Container Movement", "Coordination of full export container movements with customs documentation."],
      ["Import Container Movement", "Handling of incoming containers with port coordination and clearance."],
      ["Documentation Coordination", "Support with shipping documents, port authority liaison, and customs coordination."]
    ],
    process: [
      ["01", "Container Requirement", "Notify us of container size (20ft/40ft), pickup location and destination."],
      ["02", "Vehicle Assignment", "We arrange suitable container trucks and coordinate port/CFS timing."],
      ["03", "Port/CFS Coordination", "Port pickup is coordinated with documentation and customs requirements."],
      ["04", "Pickup & Loading", "Containers are picked up from port/CFS with documentation verification."],
      ["05", "Transit", "Secure movement to destination with tracking and milestone updates."],
      ["06", "Delivery", "Containers are delivered to final warehouse or manufacturing location."]
    ],
    faqs: [
      ["Do you transport 20-ft containers?", "Yes. 20-ft container transportation is available with dedicated container trucks."],
      ["Do you transport 40-ft containers?", "Yes. 40-ft container movement is available with suitable high-capacity vehicle options."],
      ["Can you coordinate port and CFS movement?", "Yes. We manage pickup from port gates, CFS delivery, customs coordination, and inland facility delivery."],
      ["Can containers move from port to warehouse?", "Yes. Direct port-to-inland warehouse movement is coordinated with documentation and customs clearance support."],
      ["Can you support import/export container movement?", "Yes. We handle both import containers (port-to-warehouse) and export containers (factory-to-port) with full coordination."],
      ["What about empty container movement?", "Yes. Empty container coordination and repositioning is available where required."],
      ["How are customs requirements handled?", "We coordinate documentation, port authority liaison, and CFS procedures to ensure smooth clearance."]
    ],
    industries: ["Import-Export", "Manufacturing", "Automotive", "Electronics", "Chemicals", "Retail"]
  },

  {
    id: "express-lastmile",
    slug: "express-last-mile-delivery",
    title: "Express & Last-Mile Delivery",
    category: "Time-Sensitive Transport",
    keyCapability: "Priority Dispatch & Final-Mile Service",
    heroHeadline: "Faster Express & Last-Mile Delivery When Timing Matters",
    heroSubheadline: "Priority dispatch and final-mile delivery with confirmation and POD support.",
    shortDesc: "Express transportation and last-mile delivery services for time-sensitive shipments, retail replenishment, and urgent business cargo with confirmation and tracking.",
    longDesc: "Arrowline Logistics provides fast express transportation and last-mile delivery services for time-critical shipments. When timing matters, our priority dispatch and delivery confirmation ensure your cargo reaches on schedule.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    features: [
      "Priority dispatch for urgent shipments",
      "Express transportation with reduced transit time",
      "Time-sensitive delivery with confirmation",
      "Final-mile delivery from warehouse to customer",
      "Retail replenishment support",
      "Warehouse-to-customer movement",
      "Delivery confirmation and POD"
    ],
    benefits: [
      "Faster delivery for time-sensitive business cargo",
      "Flexibility for urgent or peak-season shipments",
      "Confirmed delivery windows for retail and customer deliveries",
      "Real-time visibility and confirmation"
    ],
    seoTitle: "Express & Last-Mile Delivery Services in India | Arrowline Logistics",
    seoDesc: "Fast express transportation and last-mile delivery for time-sensitive shipments, retail replenishment and urgent business cargo with Arrowline.",
    capabilities: [
      ["Priority Dispatch", "Urgent shipments dispatched with priority placement on available vehicles."],
      ["Express Transportation", "Faster transit routes and priority movement for time-critical cargo."],
      ["Time-Sensitive Delivery", "Guaranteed or committed delivery windows for critical shipments."],
      ["Final-Mile Delivery", "Complete warehouse-to-customer delivery with confirmation."],
      ["Retail Delivery", "Retail replenishment with business-hour delivery windows."],
      ["Warehouse-to-Customer", "Direct delivery from distribution centers to end customers."],
      ["Delivery Confirmation", "Real-time proof of delivery and customer confirmation."]
    ],
    process: [
      ["01", "Request", "Submit your express shipment request with pickup, delivery and timeline."],
      ["02", "Priority Planning", "We prioritize your shipment for the next available express dispatch."],
      ["03", "Dispatch", "Your cargo is dispatched on priority routing to meet the committed timeline."],
      ["04", "Transit", "Express movement with milestone updates and real-time tracking."],
      ["05", "Last Mile", "Final delivery to customer location with timing confirmation."],
      ["06", "Confirmation", "Proof of delivery and customer confirmation provided."]
    ],
    faqs: [
      ["What shipments are suitable for express delivery?", "Urgent business cargo, retail replenishment, critical components, time-sensitive materials, and emergency shipments."],
      ["Can you guarantee delivery windows?", "Yes. We provide committed delivery time windows for express shipments with real-time tracking."],
      ["Do you provide customer confirmation?", "Yes. Delivery confirmation and proof of delivery are provided for each express shipment."],
      ["What is the typical express delivery timeframe?", "Express delivery reduces standard transit time by 20-40% depending on the route and shipment size."],
      ["Can retail stores be supported?", "Yes. We provide retail replenishment delivery with business-hour delivery windows and inventory coordination."],
      ["Is tracking available for express shipments?", "Yes. Real-time GPS tracking, milestone alerts, and delivery confirmation are provided."],
      ["Can express service be scheduled regularly?", "Yes. Regular express dispatch schedules can be arranged for recurring peak-season or urgent shipments."]
    ],
    industries: ["Retail & E-commerce", "FMCG", "Pharmaceuticals", "Electronics", "Time-Sensitive Manufacturing", "Business Services"]
  },

  {
    id: "heavy-odc",
    slug: "heavy-cargo-odc",
    title: "Heavy Cargo & ODC",
    category: "Specialized Transportation",
    keyCapability: "Oversized & Heavy Equipment Movement",
    heroHeadline: "Heavy Cargo & ODC Transportation Planned Around Your Route",
    heroSubheadline: "Suitable trailers and route planning for machinery, steel, solar and project cargo.",
    shortDesc: "Specialized heavy cargo and Over Dimensional Cargo (ODC) transportation for machinery, steel, solar equipment, and project cargo requiring route assessment and planning.",
    longDesc: "Arrowline Logistics provides specialized transportation for heavy and oversized cargo. From machinery and industrial equipment to solar panels and project cargo, we plan routes, select appropriate vehicles, and coordinate the movement of non-standard shipments.",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    features: [
      "Heavy machinery movement",
      "ODC (Over Dimensional Cargo) transportation",
      "Steel and metal shipments",
      "Solar equipment and panels",
      "Project cargo coordination",
      "Trailer selection based on cargo requirements",
      "Route assessment and planning",
      "Loading and securing coordination"
    ],
    benefits: [
      "Experienced ODC handling and route planning",
      "Suitable equipment for heavy and oversized loads",
      "Coordination for permit and compliance requirements where applicable",
      "Safe delivery with specialized loading expertise"
    ],
    seoTitle: "Heavy Cargo & ODC Transportation Services in India | Arrowline Logistics",
    seoDesc: "Specialized heavy cargo and ODC (Over Dimensional Cargo) transportation for machinery, steel, and project cargo across India with Arrowline Logistics.",
    capabilities: [
      ["Heavy Machinery Movement", "Specialized handling of industrial machinery, turbines, and equipment."],
      ["ODC Transportation", "Over Dimensional Cargo movement requiring special route planning and approvals."],
      ["Steel Transportation", "Heavy steel coil, beam, and structural movement with securing expertise."],
      ["Solar Equipment", "Transportation of solar panels, frames, and renewable energy equipment."],
      ["Project Cargo", "Large project shipments including industrial equipment and construction materials."],
      ["Trailer Planning", "Selection of appropriate trailers (flatbed, lowbed, etc.) for cargo requirements."],
      ["Route Assessment", "Detailed route analysis for dimensional and weight compliance."],
      ["Loading & Securing Coordination", "Professional loading with proper lashing, securing and safety measures."]
    ],
    process: [
      ["01", "Cargo Assessment", "Share cargo dimensions, weight, origin and destination for evaluation."],
      ["02", "Vehicle Selection", "We select appropriate trailers based on cargo specifications."],
      ["03", "Route Planning", "Detailed route assessment ensures compliance with dimension and weight regulations."],
      ["04", "Loading & Securing", "Professional loading with proper lashing and safety compliance."],
      ["05", "Transit", "Secure movement to destination with milestone updates and support."],
      ["06", "Delivery", "Safe delivery and unloading at final destination."]
    ],
    faqs: [
      ["What is ODC transportation?", "ODC (Over Dimensional Cargo) refers to shipments exceeding standard truck dimensions or weight limits, requiring special vehicles and route planning."],
      ["What cargo can be transported?", "Heavy machinery, steel shipments, solar equipment, industrial components, and project-specific equipment can be transported."],
      ["How is vehicle selection done?", "Based on cargo dimensions and weight, we select from lowbed trailers, flatbed trucks, or multi-axle configurations."],
      ["Is route planning required?", "Yes. ODC shipments require detailed route assessment to ensure compliance with dimensional and weight regulations."],
      ["Can heavy machinery be transported?", "Yes. Industrial machinery, turbines, and large equipment movement is our specialty."],
      ["Can solar equipment be moved?", "Yes. Solar panels, mounting structures, and renewable energy equipment movement is fully supported."],
      ["Are permits and compliance handled?", "We coordinate route compliance. Clients should verify permit requirements specific to their cargo, routes, and governing authorities."],
      ["What is the typical ODC shipping timeline?", "ODC timelines vary based on route complexity and cargo specifications. We provide estimates during the planning phase."]
    ],
    industries: ["Manufacturing", "Heavy Engineering", "Solar & Renewable", "Steel & Metals", "Infrastructure", "Industrial Equipment"]
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg"
  },
  {
    id: "fmcg-retail",
    title: "FMCG, Food & Retail",
    description: "High-frequency nationwide distribution connecting manufacturing units with regional warehousing hubs.",
    icon: "ShoppingBag",
    cargoTypes: ["Packaged foods", "Beverages", "Consumer goods", "Personal care"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg"
  },
  {
    id: "manufacturing-engineering",
    title: "Manufacturing & Heavy Engineering",
    description: "Industrial equipment, precision machinery, casting units, and structural fabrication transport.",
    icon: "Cog",
    cargoTypes: ["Heavy machinery", "Castings & forgings", "Pumps & turbines", "Industrial assemblies"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg"
  },
  {
    id: "pharmaceutical",
    title: "Pharmaceuticals & Healthcare",
    description: "Secure, time-critical logistics for active pharmaceutical ingredients (API) and medical products.",
    icon: "ShieldAlert",
    cargoTypes: ["APIs & bulk chemicals", "Medical equipment", "Packaging materials", "Formulations"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg"
  },
  {
    id: "chemical",
    title: "Chemicals & Petrochemicals",
    description: "Compliant containerized transportation for specialty chemicals, industrial polymers, and raw resins.",
    icon: "FlaskConical",
    cargoTypes: ["Polymers & resins", "Specialty chemicals", "Bulk liquid containers", "Fertilizers"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg"
  },
  {
    id: "infrastructure-steel",
    title: "Infrastructure, Steel & Metals",
    description: "Heavy-haul flatbed and rail transportation for steel coils, pipes, TMT bars, and construction equipment.",
    icon: "HardHat",
    cargoTypes: ["Steel coils & sheets", "TMT bars & pipes", "Cement & gypsum", "Earthmoving machines"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg"
  },
  {
    id: "solar-energy",
    title: "Solar, Renewable & Energy",
    description: "Specialized handling for solar panels, inverters, transformers, wind turbine components, and substations.",
    icon: "Sun",
    cargoTypes: ["Solar PV modules", "Inverter skids", "Power transformers", "Wind turbine parts"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg"
  },
  {
    id: "ecommerce-electronics",
    title: "E-Commerce & Electronics",
    description: "High-velocity linehaul trucking and express freight connectivity between port hubs and fulfillment centers.",
    icon: "Layers",
    cargoTypes: ["Consumer electronics", "Telecom equipment", "Apparel & textiles", "Bulk parcel linehaul"],
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg"
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
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
    location: "Mundra Headquarters",
    email: "info@arrowlinelogistics.in",
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
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
    alt: "Mundra port shipping container crane unloading cargo at Gujarat terminal",
    caption: "Direct vessel-to-trailer loading of 40-foot containers at Adani Mundra Port."
  },
  {
    id: "g2",
    title: "FTL Heavy Fleet on Expressway Corridor",
    category: "Road Fleet",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    alt: "Modern heavy cargo truck moving down expressway in India at sunset",
    caption: "GPS-enabled FTL high-cube container trucks navigating national express transport corridors."
  },
  {
    id: "g3",
    title: "85-Ton ODC Cargo Transport",
    category: "ODC Cargo",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
    alt: "Large industrial power transformer on multi-axle hydraulic modular trailer",
    caption: "Executing synchronized project cargo logistics using heavy modular multi-axle pullers with safety escorts."
  },
  {
    id: "g4",
    title: "Multimodal Rail Freight Terminal Loading",
    category: "Rail Freight",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    alt: "Double stack container train loaded at inland dry port in India",
    caption: "Direct rail-to-road loading operations in coordination with Indian Railways and CONCOR private freight rail links."
  },
  {
    id: "g5",
    title: "Customs Inspection & Port Gate Dispatch",
    category: "Customs",
    image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
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
    "logo": "https://res.cloudinary.com/uorctww6/image/upload/v1789377037/arrowline/general/favicon.png",
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
    "image": "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
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
