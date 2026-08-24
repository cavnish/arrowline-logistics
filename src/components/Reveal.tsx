import { ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { cn } from "../utils/cn";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Wraps children in a div that fades / slides in when it scrolls into view.
 * `direction` controls entry motion; `delay` staggers multiple items.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration,
  className,
}: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const classMap = {
    up: "reveal-up",
    left: "reveal-left",
    right: "reveal-right",
    scale: "reveal-scale",
  };

  const style: React.CSSProperties = {};
  if (delay) style.animationDelay = `${delay}ms`;
  if (duration) style.animationDuration = `${duration}ms`;

  return (
    <div
      ref={ref}
      className={cn(classMap[direction], isVisible && "is-visible", className)}
      style={style}
    >
      {children}
    </div>
  );
}
