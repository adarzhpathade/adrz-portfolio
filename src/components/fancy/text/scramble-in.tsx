"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"

export type TextSegment = { text: string; className?: string }

interface ScrambleInProps {
  text: string | TextSegment[]
  scrambleSpeed?: number
  scrambledLetterCount?: number
  characters?: string
  className?: string
  scrambledClassName?: string
  autoStart?: boolean
  onStart?: () => void
  onComplete?: () => void
}

export interface ScrambleInHandle {
  start: () => void
  reset: () => void
}

const ScrambleIn = forwardRef<ScrambleInHandle, ScrambleInProps>(
  (
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
      className = "",
      scrambledClassName = "",
      autoStart = true,
      onStart,
      onComplete,
    },
    ref
  ) => {
    const fullText = useMemo(() => {
      return Array.isArray(text) ? text.map((s) => s.text).join("") : text
    }, [text])

    const [displayText, setDisplayText] = useState("")
    const [isAnimating, setIsAnimating] = useState(false)
    const [visibleLetterCount, setVisibleLetterCount] = useState(0)
    const [scrambleOffset, setScrambleOffset] = useState(0)

    const startAnimation = useCallback(() => {
      setIsAnimating(true)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      onStart?.()
    }, [onStart])

    const reset = useCallback(() => {
      setIsAnimating(false)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      setDisplayText("")
    }, [])

    useImperativeHandle(ref, () => ({
      start: startAnimation,
      reset,
    }))

    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart, startAnimation])

    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isAnimating) {
        interval = setInterval(() => {
          // Increase visible text length
          if (visibleLetterCount < fullText.length) {
            setVisibleLetterCount((prev) => prev + 1)
          }
          // Start sliding scrambled text out
          else if (scrambleOffset < scrambledLetterCount) {
            setScrambleOffset((prev) => prev + 1)
          }
          // Complete animation
          else {
            clearInterval(interval)
            setIsAnimating(false)
            onComplete?.()
          }

          // Calculate how many scrambled letters we can show
          const remainingSpace = Math.max(0, fullText.length - visibleLetterCount)
          const currentScrambleCount = Math.min(
            remainingSpace,
            scrambledLetterCount
          )

          // Generate scrambled text
          const scrambledPart = Array(currentScrambleCount)
            .fill(0)
            .map(
              () => characters[Math.floor(Math.random() * characters.length)]
            )
            .join("")

          setDisplayText(fullText.slice(0, visibleLetterCount) + scrambledPart)
        }, scrambleSpeed)
      }

      return () => {
        if (interval) clearInterval(interval)
      }
    }, [
      isAnimating,
      fullText,
      visibleLetterCount,
      scrambleOffset,
      scrambledLetterCount,
      characters,
      scrambleSpeed,
      onComplete,
    ])

    const renderText = () => {
      const scrambled = displayText.slice(visibleLetterCount)

      if (Array.isArray(text)) {
        let processedChars = 0
        const segmentSpans = text.map((segment, segIdx) => {
          const segStart = processedChars
          const segEnd = processedChars + segment.text.length
          processedChars = segEnd

          if (visibleLetterCount <= segStart) {
            return null
          }
          const revealedInSeg = Math.min(
            segment.text.length,
            visibleLetterCount - segStart
          )
          const segRevealedText = segment.text.slice(0, revealedInSeg)

          return (
            <span
              key={segIdx}
              className={`${className} ${segment.className || ""}`.trim()}
            >
              {segRevealedText}
            </span>
          )
        })

        return (
          <>
            {segmentSpans}
            <span className={scrambledClassName}>{scrambled}</span>
          </>
        )
      }

      const revealed = displayText.slice(0, visibleLetterCount)
      return (
        <>
          <span className={className}>{revealed}</span>
          <span className={scrambledClassName}>{scrambled}</span>
        </>
      )
    }

    return (
      <>
        <span className="sr-only">{fullText}</span>
        <span className="inline-block whitespace-pre-wrap" aria-hidden="true">
          {renderText()}
        </span>
      </>
    )
  }
)

ScrambleIn.displayName = "ScrambleIn"
export default ScrambleIn
