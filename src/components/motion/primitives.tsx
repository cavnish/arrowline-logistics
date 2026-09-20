import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { cn } from "../../utils/cn";

/* =====================================================================
   SHARED EASING + VARIANTS
   Motion language: smooth, engineered, never bouncy.
   ===================================================================== */
export const AL_EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: AL_EASE },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: AL_EASE } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: AL_EASE } },
};

export const imageRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: AL_EASE },
  },
};

/* Cinematic curtain reveal for editorial imagery: a clip-path wipe
   (inset top→bottom) combined with a gentle inner scale settle.
   GPU-friendly (clip-path + transform + opacity only) and always ends
   fully visible — whileInView guarantees nothing gets stuck hidden. */
export const clipRevealVariants: Variants = {
  hidden: { clipPath: "inset(8% 0% 12% 0%)", opacity: 0 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: {
      clipPath: { duration: 1.0, ease: AL_EASE },
      opacity: { duration: 0.6, ease: "easeOut" },
    },
  },
};

/** Inner img wrapper: pairs with clipRevealVariants for the 1.06→1 settle. */
export const clipRevealInnerVariants: Variants = {
  hidden: { scale: 1.06 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease: AL_EASE },
  },
};

/* =====================================================================
   ScrollReveal — viewport-triggered reveal wrapper.
   Uses whileInView so elements can never get stuck invisible: the
   animation fires whenever the element enters the viewport, and
   MotionConfig reducedMotion="user" (set in App) neutralises motion.
   ===================================================================== */
interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
}

const directionVariants: Record<NonNullable<ScrollRevealProps["direction"]>, Variants> = {
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: {
    hidden: { opacity: 0, scale: 0.965 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: AL_EASE } },
  },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration,
  amount = 0.15,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      variants={directionVariants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay, duration: duration ?? undefined }}
    >
      {children}
    </motion.div>
  );
}

/* =====================================================================
   Stagger group — parent orchestrates children entrances.
   ===================================================================== */
export function StaggerGroup({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/* =====================================================================
   SectionHeading — editorial eyebrow + display heading + lead.
   ===================================================================== */
interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "al-eyebrow mb-4",
            dark ? "text-[#FF8A3D]" : "text-[#FF6B1A]",
            align === "center" && "justify-center"
          )}
        >
          <span
            aria-hidden="true"
            className={cn("h-px w-8", dark ? "bg-[#FF8A3D]/60" : "bg-[#FF6B1A]/60")}
          />
          {eyebrow}
          {align === "center" && (
            <span
              aria-hidden="true"
              className={cn("h-px w-8", dark ? "bg-[#FF8A3D]/60" : "bg-[#FF6B1A]/60")}
            />
          )}
        </span>
      )}
      <h2
        className={cn(
          "al-h2",
          dark ? "text-white" : "text-[#062B3A]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-base",
            dark ? "text-white/60" : "text-[#4A6070]",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}

/* =====================================================================
   AnimatedCounter — counts up when scrolled into view.
   Supports decimals (99.4), grouping (370421 → 370,421) and suffix.
   Falls back to the final value instantly for reduced motion.
   ===================================================================== */
interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  groupSeparator?: boolean;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  groupSeparator = false,
  duration = 1800,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Respect reduced motion — jump straight to the value.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const formatted = groupSeparator
    ? Math.round(display).toLocaleString("en-IN")
    : display.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* =====================================================================
   ImageReveal — cinematic image entrance (mask + scale) with optional
   parallax drift. Always ends fully visible.
   ===================================================================== */
interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  parallax?: number; // px of vertical drift across viewport
  delay?: number;
}

export function ImageReveal({ children, className, parallax = 0, delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!parallax || !ref.current) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -1 (below viewport) → 1 (above viewport)
        const progress = Math.max(-1, Math.min(1, 1 - (rect.top + rect.height / 2) / (vh / 2 + rect.height / 2)));
        y.set(-progress * parallax);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parallax, y]);

  return (
    <motion.div
      ref={ref}
      className={cn("overflow-hidden", className)}
      initial={{ opacity: 0, scale: 1.07 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.05, ease: AL_EASE, delay }}
    >
      <motion.div style={{ y: smoothY }} className="h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

/* =====================================================================
   ClipReveal — editorial image curtain (whileInView, once).
   Outer frame wipes open via clip-path; the inner layer settles from a
   slight zoom. MotionConfig reducedMotion="user" (set in App) collapses
   this to a simple fade for users who prefer reduced motion.
   ===================================================================== */
interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ClipReveal({ children, className, delay = 0 }: ClipRevealProps) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      variants={clipRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      <motion.div
        variants={clipRevealInnerVariants}
        className="h-full w-full [&>*]:h-full [&>*]:w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
