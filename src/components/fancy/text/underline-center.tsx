"use client";

import { ElementType, useEffect, useRef, FC } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface UnderlineProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  transition?: Transition;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
}

const CenterUnderline: FC<UnderlineProps> = ({
  children,
  as = "span",
  className,
  transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  underlineHeightRatio = 0.035,
  underlinePaddingRatio = 0.06,
  ...props
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize) || 24;
        const underlineHeight = Math.max(1, Math.round(fontSize * underlineHeightRatio * 10) / 10);
        const underlinePadding = Math.max(2, fontSize * underlinePaddingRatio);
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

  const underlineVariants = {
    hidden: {
      width: "0%",
      opacity: 0,
      transition: transition as any,
    },
    visible: {
      width: "100%",
      opacity: 1,
      transition: transition as any,
    },
  };

  return (
    <motion.span
      className={cn("relative inline-block cursor-pointer select-none pb-0.5", className)}
      initial="hidden"
      whileHover="visible"
      ref={textRef}
      {...(props as any)}
    >
      <span className="relative z-10 inline-block">{children}</span>
      <motion.span
        className="absolute left-1/2 -translate-x-1/2 bg-current pointer-events-none z-0"
        style={{
          height: "var(--underline-height, 1px)",
          bottom: "calc(-1 * var(--underline-padding, 2px))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
    </motion.span>
  );
};

CenterUnderline.displayName = "CenterUnderline";

export default CenterUnderline;
