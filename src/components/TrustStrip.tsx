import { motion } from "framer-motion";
import { Anchor } from "lucide-react";
import { CLIENT_LOGOS } from "../data/logisticsData";
import Reveal from "./Reveal";

export default function TrustStrip() {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section
      className="overflow-hidden border-y border-slate-200 bg-white py-4 sm:py-9"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal delay={60}>
          <h2
            id="trust-heading"
            className="mt-1 text-base font-bold tracking-tight text-[#1E3A8A] sm:text-xl"
          >
            Trusted by Industry Leaders
          </h2>
        </Reveal>
      </div>

      {/* Logo Slider */}
      <div
        className="relative mt-4 overflow-hidden sm:mt-6"
        aria-label="Trusted clients and logistics partners"
      >
        {/* Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <motion.div
          className="flex w-max gap-2 px-3 sm:gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 35,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {logos.map((client, index) => (
            <div
              key={`${client.logoType}-${index}`}
              className="
                flex h-12 w-[120px] shrink-0 items-center justify-center
                overflow-hidden rounded-lg border border-slate-200
                bg-white p-2 transition-colors duration-200
                hover:bg-slate-50 sm:h-16 sm:w-[160px] sm:p-2.5
              "
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Anchor aria-hidden="true" className="h-8 w-8 text-[#FF6B1A]" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
