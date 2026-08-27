import { motion } from "framer-motion";
import { Anchor, Award, ShieldCheck } from "lucide-react";
import { CLIENT_LOGOS } from "../data/logisticsData";

export default function TrustStrip() {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section
      className="overflow-hidden border-y border-slate-200 bg-white py-7 sm:py-9"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF6B1A]">
              Our Trusted Network
            </p>

            <h2
              id="trust-heading"
              className="mt-1 text-lg font-bold tracking-tight text-[#1E3A8A] sm:text-xl"
            >
              Trusted by Industry Leaders
            </h2>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#FF6B1A]" />
              Mundra Port Registered
            </span>

            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#1E3A8A]" />
              IATA & CONCOR Licensed
            </span>
          </div>
        </div>
      </div>

      {/* Logo Slider */}
      <div
        className="relative mt-6 overflow-hidden"
        aria-label="Trusted clients and logistics partners"
      >
        {/* Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <motion.div
          className="flex w-max gap-3 px-3 sm:gap-4"
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
                flex w-[175px] shrink-0 items-center gap-3
                rounded-lg border border-slate-200
                bg-slate-50 px-3 py-2.5
                transition-colors duration-200
                hover:bg-white
                sm:w-[200px]
                sm:px-4
                sm:py-3
              "
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-slate-200 sm:h-9 sm:w-9">
                <Anchor className="h-4 w-4 text-[#FF6B1A]" />
              </div>

              <div className="min-w-0">
                <strong className="block truncate text-[11px] font-bold uppercase tracking-wide text-[#1E3A8A] sm:text-xs">
                  {client.logoType}
                </strong>

                <span className="block truncate text-[9px] text-slate-500 sm:text-[10px]">
                  {client.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}