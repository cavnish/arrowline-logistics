import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ClipboardList,
  Route,
  Truck,
  Radar,
  PackageCheck,
} from "lucide-react";
import { SectionHeading } from "./motion/primitives";

const STEPS = [
  {
    icon: ClipboardList,
    n: "01",
    title: "Plan",
    desc: "Cargo analysis, mode selection and a committed schedule — before anything moves.",
  },
  {
    icon: Route,
    n: "02",
    title: "Route",
    desc: "Corridor selection, permits and port slotting engineered around your timeline.",
  },
  {
    icon: Truck,
    n: "03",
    title: "Deploy",
    desc: "The right vehicle arrives on schedule. Loading, lashing and dispatch verification.",
  },
  {
    icon: Radar,
    n: "04",
    title: "Track",
    desc: "Live GPS visibility, milestone alerts and a 24/7 desk watching every leg.",
  },
  {
    icon: PackageCheck,
    n: "05",
    title: "Deliver",
    desc: "Timed arrival, safe unloading and digital proof of delivery closure.",
  },
];

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.72", "end 0.55"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 });

  /* Desktop: progress scales the fill line across the five steps. */
  const scaleX = useTransform(smooth, [0, 1], [0, 1]);
  /* Mobile: vertical fill. */
  const scaleY = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="how-we-move"
      aria-label="How Arrowline moves cargo — five step process"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="How We Move"
          title={
            <>
              A process engineered
              <span className="text-[#FF6B1A]"> for certainty.</span>
            </>
          }
          description="Five disciplined stages take freight from enquiry to proof of delivery — visible at every step."
        />

        {/* ============ Desktop horizontal timeline ============ */}
        <div className="relative mt-16 hidden lg:block">
          {/* Track */}
          <div className="absolute left-[10%] right-[10%] top-[26px] h-[2px] bg-[#062B3A]/10" aria-hidden="true">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A]"
              style={{ scaleX }}
            />
          </div>
          {/* Traveling indicator */}
          <motion.div
            className="absolute top-[21px] z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-[#FF6B1A] shadow-[0_0_0_4px_rgba(255,107,26,0.2)]"
            style={{ left: useTransform(smooth, [0, 1], ["10%", "90%"]) }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-5 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="group text-center"
                >
                  <div className="relative z-10 mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#062B3A]/15 bg-white shadow-sm transition-all duration-300 group-hover:border-[#FF6B1A]/60 group-hover:shadow-[0_8px_20px_rgba(255,107,26,0.25)]">
                    <Icon className="h-5 w-5 text-[#062B3A] transition-colors duration-300 group-hover:text-[#FF6B1A]" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="mt-4 text-[10px] font-extrabold tracking-[0.2em] text-[#FF6B1A]">
                    {step.n}
                  </div>
                  <h3 className="mt-1 text-base font-extrabold tracking-tight text-[#062B3A]">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[200px] text-xs leading-relaxed text-[#4A6070]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ============ Mobile vertical timeline ============ */}
        <div className="relative mt-12 lg:hidden">
          <div className="absolute bottom-2 left-[23px] top-2 w-[2px] bg-[#062B3A]/10" aria-hidden="true">
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-[#FF6B1A] to-[#FF8C2A]"
              style={{ scaleY }}
            />
          </div>

          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="relative flex items-start gap-5 pl-0"
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#062B3A]/15 bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-[#062B3A]" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#FF6B1A]">
                        {step.n}
                      </span>
                      <h3 className="text-base font-extrabold tracking-tight text-[#062B3A]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#4A6070]">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
