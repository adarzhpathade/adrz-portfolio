"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt?: string;
  title?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number; // in seconds
  cardWidth?: number; // in pixels
  draggable?: boolean;
  perspective?: string | number;
  radius?: number;
  face?: "convex" | "concave";
  curve?: "flat" | "subtle" | "medium";
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 28,
      cardWidth = 180,
      draggable = true,
      perspective = "1600px",
      radius,
      face = "concave",
      curve = "subtle",
      ...props
    },
    ref
  ) => {
    // Duplicate images until at least 16 items are present.
    // For 6 images, this creates 18 items (3 full cycles) with only 20° per card,
    // producing a gentle, subtle panoramic curve instead of steep hexagonal angles.
    const displayItems = useMemo(() => {
      if (!images || images.length === 0) return [];
      let items = [...images];
      while (items.length < 16) {
        items = [...items, ...images];
      }
      return items;
    }, [images]);

    const N = displayItems.length || 1;
    const cylinderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragAngle, setDragAngle] = useState<number | null>(null);
    const startXRef = useRef(0);
    const currentAngleRef = useRef(0);
    const isDraggingRef = useRef(false);
    const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate a relaxed radius that creates a subtle, gentle 3D arc
    // pushed IN like a panoramic theater screen
    const computedRadius = useMemo(() => {
      if (radius) return radius;
      const anglePerCard = (2 * Math.PI) / N;
      const minRadius = (cardWidth * 0.5) / Math.tan(anglePerCard * 0.5);

      const multipliers = {
        flat: 1.5,
        subtle: 1.28,
        medium: 1.12,
      };
      const mult = multipliers[curve] || multipliers.subtle;
      return Math.round(minRadius * mult);
    }, [radius, cardWidth, N, curve]);

    // Track rotation angle when starting a drag
    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!draggable) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        startXRef.current = e.clientX;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        } catch {}

        if (resumeTimerRef.current) {
          clearTimeout(resumeTimerRef.current);
        }

        if (cylinderRef.current) {
          const style = window.getComputedStyle(cylinderRef.current);
          const transformVal = style.transform;
          if (transformVal && transformVal !== "none") {
            try {
              const matrix = new DOMMatrixReadOnly(transformVal);
              const rad = Math.atan2(matrix.m13, matrix.m11);
              const deg = -rad * (180 / Math.PI);
              if (dragAngle === null) {
                currentAngleRef.current = deg;
                setDragAngle(deg);
              }
            } catch {
              // Fallback if matrix reading fails
            }
          }
        }
      },
      [draggable, dragAngle]
    );

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      startXRef.current = e.clientX;
      // When dragging left (deltaX < 0), angle increases so cards move to the left following the finger
      currentAngleRef.current -= deltaX * 0.35;
      setDragAngle(currentAngleRef.current);
    }, []);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}

      // Resume smooth continuous auto-rotation after 2.5s of inactivity
      resumeTimerRef.current = setTimeout(() => {
        setDragAngle(null);
      }, 2500);
    }, []);

    useEffect(() => {
      return () => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      };
    }, []);

    const zSign = face === "concave" ? -1 : 1;

    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--r": `${computedRadius}px`,
      "--ba": `calc(1turn / var(--n))`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[340px] grid place-items-center overflow-hidden touch-pan-y select-none",
          draggable && (isDragging ? "cursor-grabbing" : "cursor-grab"),
          className
        )}
        style={{
          perspective: typeof perspective === "number" ? `${perspective}px` : perspective,
          maskImage: "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...props}
      >
        <div
          ref={cylinderRef}
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] motion-reduce:!animate-[ry_128s_linear_infinite]",
            containerClassName
          )}
          style={{
            ...customStyle,
            animation: dragAngle === null ? "ry var(--anim-dur) linear infinite" : "none",
            transform: dragAngle !== null ? `rotateY(${dragAngle}deg)` : undefined,
            transition: isDragging ? "none" : undefined,
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          <style>
            {`
              @keyframes ry {
                to { transform: rotateY(1turn); }
              }
            `}
          </style>

          {displayItems.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt || `Carousel image ${i}`}
              draggable={false}
              className={cn(
                "[grid-area:1/1] object-cover rounded-2xl [backface-visibility:hidden] select-none pointer-events-none transition-shadow duration-300",
                cardClassName
              )}
              style={{
                width: "var(--w)",
                aspectRatio: "7/10",
                "--i": i,
                transform: `rotateY(calc(-1 * var(--i) * var(--ba))) translateZ(calc(${zSign} * var(--r)))`,
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";
export default CylinderCarousel;
