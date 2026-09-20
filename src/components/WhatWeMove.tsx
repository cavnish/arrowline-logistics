import SmartImage from "./ui/SmartImage";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import { SectionHeading, StaggerGroup, StaggerItem } from "./motion/primitives";

const CARGO_IMAGES = {
  road: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
  port: "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg",
  warehouse: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
  cargo: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
  rail: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
  containers: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
  city: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg",
  yard: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
};

const CARGO = [
  { title: "Industrial Equipment", image: CARGO_IMAGES.cargo, alt: "Industrial equipment being transported by Arrowline Logistics" },
  { title: "Engineering Components", image: CARGO_IMAGES.yard, alt: "Engineering components staged at Arrowline logistics yard" },
  { title: "Machinery", image: CARGO_IMAGES.warehouse, alt: "Heavy machinery warehoused and moved by Arrowline Logistics" },
  { title: "Containers", image: CARGO_IMAGES.containers, alt: "Import export containers moved from Mundra Port" },
  { title: "Steel & Metal", image: CARGO_IMAGES.cargo, alt: "Steel coils and structural metal transported by Arrowline" },
  { title: "Automotive Components", image: CARGO_IMAGES.road, alt: "Automotive components in transit on Indian highway" },
  { title: "Infrastructure Materials", image: CARGO_IMAGES.rail, alt: "Infrastructure materials moving on freight rail corridors" },
  { title: "FMCG & General Cargo", image: CARGO_IMAGES.city, alt: "FMCG and general cargo distribution across Indian cities" },
  { title: "Oversized Cargo", image: CARGO_IMAGES.port, alt: "Oversized cargo handled at Mundra Port" },
  { title: "Project Cargo", image: CARGO_IMAGES.warehouse, alt: "Project cargo staged and transported by Arrowline Logistics" },
];

export default function WhatWeMove() {
  return (
    <section className="relative bg-[#F5F7F8] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cargo Scope"
          align="center"
          title={
            <>
              Cargo built <span className="text-[#FF6B1A]">for movement.</span>
            </>
          }
          description="From everyday freight to engineered heavy cargo, Arrowline handles transportation with the right equipment, route and execution plan."
        />

        <StaggerGroup
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5"
          stagger={0.05}
        >
          {CARGO.map((item) => (
            <StaggerItem key={item.title}>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-[#062B3A]/10">
                <SmartImage
                  src={getOptimizedImageUrl(item.image, { width: 640 })}
                  alt={item.alt}
                  loading="lazy"
                  width={640}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03212D]/85 via-[#03212D]/20 to-transparent transition-opacity duration-300" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-[13px] font-extrabold leading-snug tracking-tight text-white sm:text-sm">
                    {item.title}
                  </span>
                  <span className="mt-1 block h-px w-6 bg-[#FF6B1A] transition-all duration-300 group-hover:w-10" aria-hidden="true" />
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
