"use client";

import { ElementType, useEffect, useRef, useState, FC } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComesInGoesOutUnderlineProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: ElementType;
  direction?: "left" | "right";
  className?: string;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
  transition?: Transition;
}

const ComesInGoesOutUnderline: FC<ComesInGoesOutUnderlineProps> = ({
  children,
  as = "span",
  direction = "left",
  className,
  underlineHeightRatio = 0.08,
  underlinePaddingRatio = 0.08,
  transition = {
    duration: 0.35,
    ease: [0.25, 0.1, 0.25, 1],
  },
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize) || 24;
        const underlineHeight = Math.max(2, fontSize * underlineHeightRatio);
        const underlinePadding = Math.max(3, fontSize * underlinePaddingRatio);
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`
        );
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`
        );
      }
    };

    updateUnderlineStyles();
    window.addEventListener("resize", updateUnderlineStyles);

    return () => window.removeEventListener("resize", updateUnderlineStyles);
  }, [underlineHeightRatio, underlinePaddingRatio]);

  return (
    <span
      className={cn("relative inline-block cursor-pointer select-none pb-0.5", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={textRef}
      {...props}
    >
      <span className="relative z-10 inline-block">{children}</span>
      <motion.span
        className="absolute left-0 w-full bg-current pointer-events-none z-0"
        style={{
          height: "var(--underline-height, 2px)",
          bottom: "calc(-1 * var(--underline-padding, 3px))",
          transformOrigin: isHovered
            ? direction === "left"
              ? "left"
              : "right"
            : direction === "left"
            ? "right"
            : "left",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={transition as any}
        aria-hidden="true"
      />
    </span>
  );
};

ComesInGoesOutUnderline.displayName = "ComesInGoesOutUnderline";

export default ComesInGoesOutUnderline;
