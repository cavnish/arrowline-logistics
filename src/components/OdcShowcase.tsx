import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SmartImage from "./ui/SmartImage";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import { SectionHeading } from "./motion/primitives";

const IMAGES = {
  transformer:
    "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
  port:
    "https://res.cloudinary.com/uorctww6/image/upload/v1789377042/arrowline/general/project-port.jpg",
  road:
    "https://res.cloudinary.com/uorctww6/image/upload/v1789377043/arrowline/general/project-road.jpg",
  machinery:
    "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
};

const SPECS = [
  { value: "100T", label: "Heavy Capacity" },
  { value: "32M", label: "Maximum Length" },
  { value: "12-Axle", label: "Specialized Configuration" },
];

const PANELS = [
  {
    image: IMAGES.transformer,
    eyebrow: "Transformers & Reactors",
    title: "Power equipment moved as a precision operation.",
    text: "Multi-axle hydraulic configurations, route surveys and utility coordination move transformers and reactors without compromising a single millimetre.",
  },
  {
    image: IMAGES.port,
    eyebrow: "Port Direct Discharge",
    title: "From vessel to trailer — no idle hours.",
    text: "Project cargo is received directly at the port face and loaded onto prepared trailers, eliminating double handling and demurrage exposure.",
  },
  {
    image: IMAGES.road,
    eyebrow: "Engineered Road Corridors",
    title: "Routes planned around the load.",
    text: "Bridge ratings, overhead clearances and turning geometry are assessed before wheels roll — the corridor fits the cargo, never the reverse.",
  },
  {
    image: IMAGES.machinery,
    eyebrow: "Machinery & Structures",
    title: "Heavy machinery, delivered intact.",
    text: "Industrial machinery, structural steel and long-project assemblies arrive with certified lashing, escort coordination and timed site delivery.",
  },
];

export default function OdcShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], ["0%", "-75%"]);

  return (
    <section
      ref={sectionRef}
      id="odc-showcase"
      aria-label="ODC and project cargo showcase"
      className="relative bg-[#03212D]"
    >
      {/* ============ MOBILE / TABLET: stacked cinematic cards ============ */}
      <div className="py-16 lg:hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <SectionHeading
            dark
            eyebrow="ODC & Project Cargo"
            title={
              <>
                When ordinary transport
                <span className="block text-[#FF8A3D]">isn't enough.</span>
              </>
            }
            description="Oversized cargo demands engineering before execution. Arrowline plans every heavy movement around the load — route, equipment and timing."
          />

          <div className="mt-10 space-y-6">
            {PANELS.map((panel, i) => (
              <motion.figure
                key={panel.eyebrow}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={getOptimizedImageUrl(panel.image, { width: 1000 })}
                    alt={`${panel.eyebrow} — Arrowline Logistics heavy cargo operations`}
                    loading="lazy"
                    width={1000}
                    height={625}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03212D]/70 via-transparent to-transparent" />
                </div>
                <figcaption className="space-y-2 p-5">
                  <span className="al-eyebrow text-[#FF8A3D]">{panel.eyebrow}</span>
                  <h3 className="text-lg font-extrabold leading-snug tracking-tight text-white">
                    {panel.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/55">{panel.text}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          {/* Specs row */}
          <div className="mt-10 grid grid-cols-3 gap-3">
            {SPECS.map((spec) => (
              <div
                key={spec.value}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center"
              >
                <div className="text-xl font-extrabold tracking-tight text-[#FF8A3D] sm:text-2xl">
                  {spec.value}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ DESKTOP: pinned horizontal storytelling ============ */}
      <div className="relative hidden lg:block" style={{ height: `${PANELS.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          {/* Ambient backdrop */}
          <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-[#FF6B1A]/10 blur-[120px]"
            aria-hidden="true"
          />

          {/* Fixed heading column */}
          <div className="relative z-10 w-[38%] pl-16 pr-8 xl:pl-24">
            <SectionHeading
              dark
              eyebrow="ODC & Project Cargo"
              title={
                <>
                  When ordinary transport
                  <span className="block text-[#FF8A3D]">isn't enough.</span>
                </>
              }
              description="Scroll through real Arrowline heavy-cargo operations — every movement planned around the load, not around the road."
            />

            {/* Specs */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {SPECS.map((spec, i) => (
                <motion.div
                  key={spec.value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                  className="border-l-2 border-[#FF6B1A]/60 pl-3"
                >
                  <div className="text-2xl font-extrabold tracking-tight text-white">
                    {spec.value}
                  </div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    {spec.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Horizontal moving track */}
          <motion.div
            className="relative z-10 flex w-[62%] gap-6 pl-8 pr-16"
            style={{ x }}
          >
            {PANELS.map((panel) => (
              <figure
                key={panel.eyebrow}
                className="w-[520px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={getOptimizedImageUrl(panel.image, { width: 1100 })}
                    alt={`${panel.eyebrow} — Arrowline Logistics heavy cargo operations`}
                    loading="lazy"
                    width={1100}
                    height={688}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03212D]/70 via-transparent to-transparent" />
                  <span className="al-eyebrow absolute bottom-4 left-5 text-[#FFB27D]">
                    {panel.eyebrow}
                  </span>
                </div>
                <figcaption className="space-y-2 p-6">
                  <h3 className="text-xl font-extrabold leading-snug tracking-tight text-white">
                    {panel.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/55">{panel.text}</p>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
