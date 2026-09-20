"use client"

import { useEffect, useMemo, useState } from "react"
import { debounce } from "lodash"
import { AnimationOptions, motion, stagger, useAnimate } from "framer-motion"

export type TextSegment = { text: string; className?: string };

interface TextProps {
  label: string | TextSegment[]
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
  trigger?: boolean
  initialDelay?: number
}

const LetterSwapPingPong = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  trigger,
  initialDelay = 0,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (trigger === undefined) return;
    if (trigger) {
      animate(
        ".letter-wrapper",
        { opacity: 1, filter: "blur(0px)", y: 0 },
        {
          duration: 0.45,
          delay: stagger(0.018, { startDelay: initialDelay || 0, from: staggerFrom }),
          ease: [0.22, 1, 0.36, 1],
        }
      );
    } else {
      animate(
        ".letter-wrapper",
        { opacity: 0, filter: "blur(10px)", y: 32 },
        { duration: 0.25 }
      );
    }
  }, [trigger, initialDelay, staggerFrom]);

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const elements = useMemo(() => {
    if (Array.isArray(label)) {
      return label.flatMap((segment) =>
        segment.text.split("").map((char) => ({
          char: char === " " ? "\u00A0" : char,
          className: segment.className || "",
        }))
      );
    } else {
      return label.split("").map((char) => ({
        char: char === " " ? "\u00A0" : char,
        className: "",
      }));
    }
  }, [label]);

  const fullText = useMemo(() => {
    if (Array.isArray(label)) {
      return label.map((s) => s.text).join("");
    }
    return label;
  }, [label]);

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden ${className || ""}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{fullText}</span>

      {elements.map((item, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex letter-wrapper"
            key={i}
            style={trigger !== undefined ? { opacity: 0, filter: "blur(10px)", transform: "translateY(32px)" } : undefined}
            aria-hidden={true}
          >
            <motion.span className={`relative letter ${item.className}`.trim()} style={{ top: 0 }}>
              {item.char}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary ${item.className}`.trim()}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {item.char}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}

export default LetterSwapPingPong
