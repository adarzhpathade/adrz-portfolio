"use client";

import { ElementType, useEffect, useRef, useState, useMemo, FC } from "react";
import { motion, useAnimationControls, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoesOutComesInUnderlineProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: ElementType;
  direction?: "left" | "right";
  className?: string;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
  transition?: Transition;
}

const GoesOutComesInUnderline: FC<GoesOutComesInUnderlineProps> = ({
  children,
  as = "span",
  direction = "left",
  className,
  underlineHeightRatio = 0.08,
  underlinePaddingRatio = 0.05,
  transition = {
    duration: 0.45,
    ease: "easeOut",
  },
  ...props
}) => {
  const controls = useAnimationControls();
  const [blocked, setBlocked] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const MotionComponent = useMemo(
    () => ((motion as any).create ? (motion as any).create(as) : (motion as any)(as)),
    [as]
  );

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize);
        const underlineHeight = Math.max(1, fontSize * underlineHeightRatio);
        const underlinePadding = fontSize * underlinePaddingRatio;
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

  const animate = async () => {
    if (blocked) return;

    setBlocked(true);

    await controls.start({
      width: 0,
      transition: transition as any,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    });

    await controls.start({
      width: "100%",
      transition: transition as any,
      transitionEnd: {
        left: direction === "left" ? 0 : "auto",
        right: direction === "left" ? "auto" : 0,
      },
    });

    setBlocked(false);
  };

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        className={cn("absolute bg-current", {
          "left-0": direction === "left",
          "right-0": direction === "right",
        })}
        style={{
          height: "var(--underline-height, 1.5px)",
          bottom: "calc(-1 * var(--underline-padding, 2px))",
          width: "100%",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  );
};

GoesOutComesInUnderline.displayName = "GoesOutComesInUnderline";

export default GoesOutComesInUnderline;
