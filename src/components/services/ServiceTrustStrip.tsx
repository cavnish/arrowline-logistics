import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Clock3,
  ShieldCheck,
  Handshake,
  Globe2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────
   ServiceTrustStrip — the compact credibility line for the service hero.
   Plain and quiet by design: small real Lucide icons in brand orange with
   two-line white labels, set directly on the navy overlay (no glass panel,
   no card, no background, no separators). It sits immediately under the
   CTAs on the left and shares identical language across every service and
   sub-service page. Motion prefers a gentle stagger; hover only nudges the
   icon, nothing bounces. Reduced-motion safe.
   ─────────────────────────────────────────────────────────────────────── */

interface TrustItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const TRUST_ITEMS: TrustItem[] = [
  { icon: Clock3, title: "On Time", subtitle: "Delivery" },
  { icon: ShieldCheck, title: "Safe & Secure", subtitle: "Handling" },
  { icon: Handshake, title: "Customer", subtitle: "Focused" },
  { icon: Globe2, title: "Pan India", subtitle: "Network" },
  { icon: TrendingUp, title: "Delivering", subtitle: "Excellence" },
];

const BASE_DELAY = 0.55;
const STEP_DELAY = 0.09;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ServiceTrustStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? false : "show"}
      variants={reduceMotion ? undefined : itemVariants}
      transition={
        reduceMotion
          ? undefined
          : { staggerChildren: STEP_DELAY, delayChildren: BASE_DELAY }
      }
      className="mt-6 flex w-full max-w-[720px] flex-wrap items-center gap-x-4 gap-y-2.5 sm:mt-9 lg:gap-x-6"
    >
      {TRUST_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <motion.li
            key={item.title}
            variants={reduceMotion ? undefined : itemVariants}
            transition={
              reduceMotion ? undefined : { duration: 0.45, ease: "easeOut" }
            }
            className="group flex items-center gap-2"
          >
            <Icon
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
              className="shrink-0 text-[#FF6B1A] transition-transform duration-200 ease-out group-hover:scale-[1.1]"
            />
            <span className="flex flex-col leading-none">
              <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {item.title}
              </span>
              <span className="mt-0.5 whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/65">
                {item.subtitle}
              </span>
            </span>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
