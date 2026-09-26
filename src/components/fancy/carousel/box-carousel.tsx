"use client";

import React, {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

import type { ValueAnimationTransition } from "motion-dom";

type ValueAnimationOptions = ValueAnimationTransition<number>;

interface CarouselItem {
  /**
   * Unique identifier for the carousel item
   */
  id: string;
  /**
   * The type of media: "image" or "video"
   */
  type: "image" | "video";
  /**
   * Source URL for the image or video
   */
  src: string;
  /**
   * (Optional) Alternative text for images
   */
  alt?: string;
  /**
   * (Optional) Poster image for videos (displayed before playback)
   */
  poster?: string;
  /**
   * (Optional) Link to project website
   */
  link?: string;
}

/**
 * Props for a single face of the cube in the BoxCarousel.
 */
interface FaceProps {
  /**
   * The CSS transform string to position and rotate the face in 3D space.
   */
  transform: string;
  /**
   * Optional additional CSS class names for the face.
   */
  className?: string;
  /**
   * Optional React children to render inside the face.
   */
  children?: ReactNode;
  /**
   * Optional inline styles for the face.
   */
  style?: React.CSSProperties;
  /**
   * If true, enables debug mode (e.g., shows backface and opacity).
   */
  debug?: boolean;
}

const CubeFace = memo(
  ({
    transform,
    className,
    children,
    style,
    debug,
  }: FaceProps & { isDragging?: boolean; enableDrag?: boolean }) => (
    <div
      className={cn(
        "absolute overflow-hidden select-none [backface-visibility:hidden] cursor-default",
        debug && "backface-visible opacity-50",
        className
      )}
      style={{ transform, ...style }}
    >
      {children}
    </div>
  )
);

CubeFace.displayName = "CubeFace";

const MediaRenderer = memo(
  ({
    item,
    className,
    debug = false,
  }: {
    item: CarouselItem;
    className?: string;
    debug?: boolean;
  }) => {
    if (!debug) {
      if (item.type === "video") {
        return (
          <video
            src={item.src}
            poster={item.poster}
            className={cn(
              "w-full h-full object-cover select-none pointer-events-none",
              className
            )}
            muted
            loop
            autoPlay
            playsInline
            draggable={false}
          />
        );
      }

      return (
        <img
          src={item.src}
          alt={item.alt || ""}
          draggable={false}
          className={cn(
            "w-full h-full object-cover select-none pointer-events-none",
            className
          )}
        />
      );
    }

    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center border text-2xl select-none pointer-events-none",
          className
        )}
      >
        {item.id}
      </div>
    );
  }
);

MediaRenderer.displayName = "MediaRenderer";

export interface BoxCarouselRef {
  /**
   * Advance to the next item in the carousel.
   */
  next: () => void;

  /**
   * Go back to the previous item in the carousel.
   */
  prev: () => void;

  /**
   * Get the index of the currently visible item.
   */
  getCurrentItemIndex: () => number;
}

type RotationDirection = "top" | "bottom" | "left" | "right";

interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/**
 * Props for the BoxCarousel component
 */
interface BoxCarouselProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * Array of items to display in the carousel
   */
  items: CarouselItem[];

  /**
   * Width of the carousel in pixels
   */
  width: number;

  /**
   * Height of the carousel in pixels
   */
  height: number;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Enable debug mode (shows extra info/overlays)
   */
  debug?: boolean;

  /**
   * Perspective value for 3D effect (in px)
   * @default 600
   */
  perspective?: number;

  /**
   * The axis and direction of rotation
   * @default "vertical"
   * "top" | "bottom" | "left" | "right"
   */
  direction?: RotationDirection;

  /**
   * Transition configuration for rotation animation
   * @default { duration: 1.25, ease: [0.953, 0.001, 0.019, 0.995] }
   */
  transition?: ValueAnimationOptions;

  /**
   * Transition configuration for snapping after drag
   * @default { type: "spring", damping: 30, stiffness: 200 }
   */
  snapTransition?: ValueAnimationOptions;

  /**
   * Spring physics config for drag interaction
   * @default { stiffness: 200, damping: 30 }
   */
  dragSpring?: SpringConfig;

  /**
   * Enable auto-play mode
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Interval (ms) between auto-play transitions
   * @default 3000
   */
  autoPlayInterval?: number;

  /**
   * Callback when the current item index changes
   */
  onIndexChange?: (index: number) => void;

  /**
   * Enable drag interaction
   * @default true
   */
  enableDrag?: boolean;

  /**
   * Sensitivity of drag (higher = more rotation per pixel)
   * @default 0.5
   */
  dragSensitivity?: number;

  /**
   * Callback when a cube face is clicked without dragging
   */
  onItemClick?: (item: CarouselItem, index: number) => void;
}

const BoxCarousel = forwardRef<BoxCarouselRef, BoxCarouselProps>(
  (
    {
      items,
      width,
      height,
      className,
      perspective = 600,
      debug = false,
      direction = "left",
      transition = { duration: 1.25, ease: [0.953, 0.001, 0.019, 0.995] },
      snapTransition = { type: "spring", damping: 30, stiffness: 200 },
      dragSpring: _dragSpring = { stiffness: 200, damping: 30 },
      autoPlay = false,
      autoPlayInterval = 3000,
      onIndexChange,
      enableDrag = true,
      dragSensitivity = 0.5,
      onItemClick,
      ...props
    },
    ref
  ) => {
    void _dragSpring;
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDraggingState, setIsDraggingState] = useState(false);

    const prefersReducedMotion = useReducedMotion();

    const _transition = useMemo(
      () => (prefersReducedMotion ? { duration: 0 } : transition),
      [prefersReducedMotion, transition]
    );

    const isRotating = useRef(false);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
    const dragDistance = useRef(0);
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startPosition = useRef({ x: 0, y: 0 });
    const startRotation = useRef(0);
    const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const baseRotateX = useMotionValue(0);
    const baseRotateY = useMotionValue(0);

    // Stop rotation and release lock unconditionally
    const releaseLock = useCallback(() => {
      isRotating.current = false;
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }, []);

    // Drag functionality - robust touch and mouse handling
    const handleDragStart = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!enableDrag) return;

        // Immediately stop active animations so user has tactile instant control
        baseRotateX.stop();
        baseRotateY.stop();
        releaseLock();

        isDragging.current = true;
        hasDragged.current = false;
        dragDistance.current = 0;
        if (dragTimeoutRef.current) {
          clearTimeout(dragTimeoutRef.current);
          dragTimeoutRef.current = null;
        }

        setIsDraggingState(true);
        const point = "touches" in e ? e.touches[0] : e;
        startPosition.current = { x: point.clientX, y: point.clientY };
        const isVertical = direction === "top" || direction === "bottom";
        startRotation.current = isVertical ? baseRotateX.get() : baseRotateY.get();

        if (typeof document !== "undefined") {
          document.body.style.userSelect = "none";
        }
      },
      [enableDrag, direction, baseRotateX, baseRotateY, releaseLock]
    );

    const handleDragMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current) return;

        const point = "touches" in e ? e.touches[0] : e;
        const deltaX = point.clientX - startPosition.current.x;
        const deltaY = point.clientY - startPosition.current.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // If on touch and vertical scroll motion dominates, abort drag to let page scroll freely
        if ("touches" in e && !hasDragged.current) {
          if (absY > absX && absY > 8) {
            isDragging.current = false;
            setIsDraggingState(false);
            return;
          }
        }

        const dist = Math.hypot(deltaX, deltaY);
        dragDistance.current = dist;
        if (dist > 14) {
          hasDragged.current = true;
          if ("cancelable" in e && e.cancelable && absX > absY) {
            e.preventDefault();
          }
        }

        const isVertical = direction === "top" || direction === "bottom";
        const delta = isVertical ? deltaY : deltaX;
        const rotationDelta = delta * dragSensitivity;

        let newRotation = startRotation.current;

        if (direction === "top" || direction === "right") {
          newRotation += rotationDelta;
        } else {
          newRotation -= rotationDelta;
        }

        // Constrain rotation to ±120 degrees from drag start
        const minRotation = startRotation.current - 120;
        const maxRotation = startRotation.current + 120;
        newRotation = Math.max(minRotation, Math.min(maxRotation, newRotation));

        if (isVertical) {
          baseRotateX.set(newRotation);
        } else {
          baseRotateY.set(newRotation);
        }
      },
      [direction, dragSensitivity, baseRotateX, baseRotateY]
    );

    const handleDragEnd = useCallback(() => {
      if (!isDragging.current) return;

      isDragging.current = false;
      setIsDraggingState(false);

      if (typeof document !== "undefined") {
        document.body.style.userSelect = "";
      }

      // Keep hasDragged flag active briefly so the synthetic click event (right after mouseup) is ignored
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = setTimeout(() => {
        hasDragged.current = false;
        dragDistance.current = 0;
      }, 150);

      const isVertical = direction === "top" || direction === "bottom";
      const targetMotionValue = isVertical ? baseRotateX : baseRotateY;
      const currentValue = targetMotionValue.get();

      // Calculate nearest 90-degree step
      const quarterRotations = Math.round(currentValue / 90);
      const snappedRotation = quarterRotations * 90;

      isRotating.current = true;
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(releaseLock, 1200);

      animate(targetMotionValue, snappedRotation, {
        ...snapTransition,
        onComplete: () => {
          releaseLock();
          const normalizedTurn = ((quarterRotations % items.length) + items.length) % items.length;
          setCurrentItemIndex(normalizedTurn);
          onIndexChange?.(normalizedTurn);
        },
      });
    }, [
      direction,
      baseRotateX,
      baseRotateY,
      items.length,
      snapTransition,
      onIndexChange,
      releaseLock,
    ]);

    // Handle pure click on cube (not triggered during/after dragging)
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (hasDragged.current || dragDistance.current > 14) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const currentItem = items[currentItemIndex];
        if (onItemClick) {
          onItemClick(currentItem, currentItemIndex);
        } else if (currentItem?.link) {
          try {
            const a = document.createElement("a");
            a.href = currentItem.link;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } catch {
            window.open(currentItem.link, "_blank", "noopener,noreferrer");
          }
        }
      },
      [items, currentItemIndex, onItemClick]
    );

    // Stable global window listeners for drag
    const handleDragMoveRef = useRef(handleDragMove);
    const handleDragEndRef = useRef(handleDragEnd);
    handleDragMoveRef.current = handleDragMove;
    handleDragEndRef.current = handleDragEnd;

    useEffect(() => {
      if (!enableDrag) return;

      const onMove = (e: MouseEvent | TouchEvent) => handleDragMoveRef.current(e);
      const onEnd = () => handleDragEndRef.current();

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onEnd);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
        if (typeof document !== "undefined") {
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
        }
      };
    }, [enableDrag]);

    const next = useCallback(() => {
      if (items.length === 0 || isDragging.current) return;

      const isVertical = direction === "top" || direction === "bottom";
      const targetMotionValue = isVertical ? baseRotateX : baseRotateY;
      targetMotionValue.stop();

      const currentVal = targetMotionValue.get();
      const currentQuarter = Math.round(currentVal / 90);
      const targetRotation =
        (currentQuarter + (direction === "top" || direction === "right" ? 1 : -1)) * 90;

      isRotating.current = true;
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(releaseLock, 1400);

      animate(targetMotionValue, targetRotation, {
        ..._transition,
        onComplete: () => {
          releaseLock();
          const quarterRotations = Math.round(targetRotation / 90);
          const normalizedTurn =
            ((quarterRotations % items.length) + items.length) % items.length;
          setCurrentItemIndex(normalizedTurn);
          onIndexChange?.(normalizedTurn);
        },
      });
    }, [items.length, direction, _transition, baseRotateX, baseRotateY, onIndexChange, releaseLock]);

    const prev = useCallback(() => {
      if (items.length === 0 || isDragging.current) return;

      const isVertical = direction === "top" || direction === "bottom";
      const targetMotionValue = isVertical ? baseRotateX : baseRotateY;
      targetMotionValue.stop();

      const currentVal = targetMotionValue.get();
      const currentQuarter = Math.round(currentVal / 90);
      const targetRotation =
        (currentQuarter - (direction === "top" || direction === "right" ? 1 : -1)) * 90;

      isRotating.current = true;
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(releaseLock, 1400);

      animate(targetMotionValue, targetRotation, {
        ..._transition,
        onComplete: () => {
          releaseLock();
          const quarterRotations = Math.round(targetRotation / 90);
          const normalizedTurn =
            ((quarterRotations % items.length) + items.length) % items.length;
          setCurrentItemIndex(normalizedTurn);
          onIndexChange?.(normalizedTurn);
        },
      });
    }, [items.length, direction, _transition, baseRotateX, baseRotateY, onIndexChange, releaseLock]);

    useImperativeHandle(
      ref,
      () => ({
        next,
        prev,
        getCurrentItemIndex: () => currentItemIndex,
      }),
      [next, prev, currentItemIndex]
    );

    const depth = useMemo(
      () => (direction === "top" || direction === "bottom" ? height : width),
      [direction, width, height]
    );

    const transform = useTransform(
      [baseRotateX, baseRotateY],
      ([x, y]) =>
        `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`
    );

    // Determine face transforms based on the desired rotation axis
    const faceTransforms = useMemo(() => {
      switch (direction) {
        case "left":
          return [
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ];
        case "top":
          return [
            `rotateX(90deg) translateZ(${height / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateX(-90deg) translateZ(${height / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px) rotateZ(180deg)`,
          ];
        case "right":
          return [
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ];
        case "bottom":
          return [
            `rotateX(-90deg) translateZ(${height / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateX(90deg) translateZ(${height / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px) rotateZ(180deg)`,
          ];
        default:
          return [
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ];
      }
    }, [direction, width, height, depth]);

    // Auto play functionality - pauses on hover and during drag
    useEffect(() => {
      if (autoPlay && items.length > 0 && !isHovered && !isDraggingState) {
        const interval = setInterval(next, autoPlayInterval);
        return () => clearInterval(interval);
      }
    }, [autoPlay, items.length, next, autoPlayInterval, isHovered, isDraggingState]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (isRotating.current) return;

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            if (direction === "left" || direction === "right") {
              prev();
            }
            break;
          case "ArrowRight":
            e.preventDefault();
            if (direction === "left" || direction === "right") {
              next();
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (direction === "top" || direction === "bottom") {
              prev();
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            if (direction === "top" || direction === "bottom") {
              next();
            }
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            const currentItem = items[currentItemIndex];
            if (onItemClick) {
              onItemClick(currentItem, currentItemIndex);
            } else if (currentItem?.link) {
              window.open(currentItem.link, "_blank", "noopener,noreferrer");
            }
            break;
          default:
            break;
        }
      },
      [direction, next, prev, items, currentItemIndex, onItemClick]
    );

    return (
      <div
        className={cn(
          "relative focus:outline-0 select-none group touch-pan-y cursor-default",
          className
        )}
        style={{
          width,
          height,
          perspective: `${perspective}px`,
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Open ${items[currentItemIndex]?.alt || `Item ${currentItemIndex + 1}`} project site`}
        aria-describedby="carousel-instructions"
        aria-live="polite"
        aria-atomic="true"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleClick}
        {...props}
      >
        <div className="sr-only" aria-live="assertive">
          Showing item {currentItemIndex + 1} of {items.length}:{" "}
          {items[currentItemIndex]?.alt || `Item ${currentItemIndex + 1}`}
        </div>

        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          style={{
            transform: transform,
          }}
        >
          {/* First face (Left) */}
          <CubeFace
            transform={faceTransforms[0]}
            style={
              debug
                ? { width, height, backgroundColor: "#ff9999" }
                : { width, height }
            }
            debug={debug}
            isDragging={isDraggingState}
            enableDrag={enableDrag}
          >
            {items[3 % items.length] && (
              <MediaRenderer item={items[3 % items.length]} debug={debug} />
            )}
          </CubeFace>

          {/* Second face (Front) */}
          <CubeFace
            transform={faceTransforms[1]}
            style={
              debug
                ? { width, height, backgroundColor: "#99ff99" }
                : { width, height }
            }
            debug={debug}
            isDragging={isDraggingState}
            enableDrag={enableDrag}
          >
            {items[0] && (
              <MediaRenderer item={items[0]} debug={debug} />
            )}
          </CubeFace>

          {/* Third face (Right) */}
          <CubeFace
            transform={faceTransforms[2]}
            style={
              debug
                ? { width, height, backgroundColor: "#9999ff" }
                : { width, height }
            }
            debug={debug}
            isDragging={isDraggingState}
            enableDrag={enableDrag}
          >
            {items[1 % items.length] && (
              <MediaRenderer item={items[1 % items.length]} debug={debug} />
            )}
          </CubeFace>

          {/* Fourth face (Back) */}
          <CubeFace
            transform={faceTransforms[3]}
            style={
              debug
                ? { width, height, backgroundColor: "#ffff99" }
                : { width, height }
            }
            debug={debug}
            isDragging={isDraggingState}
            enableDrag={enableDrag}
          >
            {items[2 % items.length] && (
              <MediaRenderer item={items[2 % items.length]} debug={debug} />
            )}
          </CubeFace>
        </motion.div>
      </div>
    );
  }
);

BoxCarousel.displayName = "BoxCarousel";

export default BoxCarousel;
export type { CarouselItem, RotationDirection, SpringConfig };
