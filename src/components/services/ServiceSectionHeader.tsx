import type { ReactNode } from "react";
import { ScrollReveal } from "../motion/primitives";
import { cn } from "../../utils/cn";

interface ServiceSectionHeaderProps {
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

/* Shared editorial section header used across every premium service section.
   Headings stand directly on their own — no eyebrow/label titles. */
export default function ServiceSectionHeader({
  title,
  description,
  align = "center",
  dark = false,
  className,
}: ServiceSectionHeaderProps) {
  return (
    <ScrollReveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <h2
        className={cn(
          "text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-[#062B3A]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-base",
            dark ? "text-slate-300" : "text-[#4A6070]",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}