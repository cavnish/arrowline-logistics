import { LOGISTICS_STATS } from "../data/logisticsData";
import { AnimatedCounter, StaggerGroup, StaggerItem } from "./motion/primitives";

/**
 * MetricsStrip — editorial performance band directly under the hero.
 * Large oversized numbers with hairline dividers; not card-like.
 */
export default function MetricsStrip() {
  return (
    <section
      id="metrics-strip"
      aria-label="Arrowline Logistics performance metrics"
      className="relative border-b border-[#062B3A]/10 bg-white"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <StaggerGroup
          className="grid grid-cols-2 divide-x divide-y divide-[#062B3A]/10 lg:grid-cols-4 lg:divide-y-0"
          stagger={0.1}
        >
          {LOGISTICS_STATS.map((stat) => {
            const isFloat = stat.number.includes(".");
            const numeric = parseFloat(stat.number.replace(/[^0-9.]/g, ""));
            const suffix = stat.number.includes("+") ? "+" : stat.number.includes("%") ? "%" : "";
            const isStatic = stat.number === "24/7" || isFloat;

            return (
              <StaggerItem
                key={stat.label}
                className="group px-5 py-8 sm:px-8 sm:py-10 lg:py-12"
              >
                <div className="stat-figure text-[clamp(2rem,3.6vw,3.4rem)] font-extrabold tracking-tight text-[#062B3A] transition-colors duration-300 group-hover:text-[#FF6B1A]">
                  {isStatic ? (
                    <span>{stat.number}</span>
                  ) : (
                    <AnimatedCounter
                      value={numeric}
                      suffix={suffix}
                      groupSeparator={!isFloat}
                    />
                  )}
                </div>
                <div className="mt-2 text-[13px] font-bold uppercase tracking-[0.12em] text-[#062B3A]">
                  {stat.label}
                </div>
                <p className="mt-1.5 hidden text-xs leading-relaxed text-[#4A6070] sm:block">
                  {stat.sublabel}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
