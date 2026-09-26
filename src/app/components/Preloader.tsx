"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onStartExit?: () => void;
  onComplete: () => void;
}

export default function Preloader({ onStartExit, onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterNumberRef = useRef<HTMLSpanElement>(null);
  const exitStartedRef = useRef(false);

  // Exit Morph Choreography
  const startExitAnimation = useCallback(() => {
    onStartExit?.();

    const backdrop = backdropRef.current;
    const title = titleRef.current;
    const centerText = centerTextRef.current;
    const counter = counterRef.current;
    const container = containerRef.current;

    if (!backdrop || !title || !counter || !container) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // A. Bottom progress counter smoothly fades out
    tl.to(
      counter,
      {
        opacity: 0,
        y: 12,
        filter: "blur(6px)",
        duration: 0.35,
        ease: "power2.in",
      },
      0
    );

    // B. Black backdrop shrinks from 100vh down to exactly 80vh (matching HeroSection's black rectangle)
    tl.to(
      backdrop,
      {
        height: "80vh",
        duration: 1.15,
        ease: "expo.inOut",
      },
      0.15
    );

    // C. ADARSH'26 scales up and moves from below center line up to top of hero section
    // Starting state: y = 44vh (mobile) / 43.5vh (desktop), scale = 0.70 (mobile) / 0.62 (desktop)
    // Target state: y = 0, scale = 1.0 (exact match to HeroSection hero-main-title)
    const isMobile = window.innerWidth < 768;
    const initialScale = isMobile ? 0.70 : 0.62;
    const initialY = isMobile ? "44vh" : "43.5vh";

    tl.fromTo(
      title,
      {
        y: initialY,
        scale: initialScale,
      },
      {
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: "expo.inOut",
      },
      0.15
    );

    // D. Subtitle softly settles into its permanent center spot
    if (centerText) {
      tl.to(
        centerText,
        {
          opacity: 0.7,
          duration: 0.6,
          ease: "power1.out",
        },
        0.3
      );
    }

    // E. Fade container opacity out at the very end for an invisible zero-seam handoff
    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power1.out",
      },
      1.15
    );
  }, [onStartExit, onComplete]);

  useEffect(() => {
    // 1. Asset & Readiness Tracking
    let assetsLoaded = false;

    const checkReadiness = async () => {
      try {
        // 1. Wait for document and window load state
        if (typeof document !== "undefined" && document.readyState !== "complete") {
          await new Promise<void>((resolve) => {
            const onReady = () => {
              window.removeEventListener("load", onReady);
              document.removeEventListener("DOMContentLoaded", onReady);
              resolve();
            };
            window.addEventListener("load", onReady, { once: true });
            document.addEventListener("DOMContentLoaded", onReady, { once: true });
          });
        }

        // 2. Wait for custom typography fonts to decode and render
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }

        // 3. Explicitly preload critical project portfolio images
        const criticalImages = [
          "/images/sentinel-terminal.webp",
          "/images/adarsh-26.webp",
        ];

        const preloadImg = (src: string) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });

        await Promise.all(criticalImages.map(preloadImg));

        // 4. Wait for all DOM images
        if (typeof document !== "undefined") {
          const images = Array.from(document.images);
          await Promise.all(
            images.map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((res) => {
                img.onload = res;
                img.onerror = res;
              });
            })
          );
        }

        // 5. On Desktop: warm up initial Page 2 showcase videos in cache
        if (typeof window !== "undefined" && window.innerWidth >= 768) {
          const desktopVideos = [
            "/videos/advance-animations.webm",
            "/videos/coffee-cup.webm",
            "/videos/human-brain.webm",
          ];
          desktopVideos.forEach((src) => {
            try {
              const v = document.createElement("video");
              v.preload = "metadata";
              v.src = src;
              v.muted = true;
              v.load();
            } catch {
              // ignore
            }
          });
        }
      } catch (err) {
        console.warn("Preloader asset check warning:", err);
      } finally {
        assetsLoaded = true;
      }
    };

    checkReadiness();

    // Fallback safety: ensure assetsLoaded is true after 3.2s maximum
    const safetyTimer = setTimeout(() => {
      assetsLoaded = true;
    }, 3200);

    // 2. Smooth Numerical Progress Animation
    let animFrame = 0;
    const progressObj = { val: 0 };
    const startTime = performance.now();

    const updateProgress = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;

      // Realistic progressive curve: accelerates to 88% while loading assets, then sprints to 100%
      let targetVal: number;
      if (!assetsLoaded) {
        targetVal = Math.min(88, elapsed * 42);
      } else {
        targetVal = 100;
      }

      // Smooth lerp towards target
      const lerpSpeed = assetsLoaded ? 0.14 : 0.08;
      progressObj.val += (targetVal - progressObj.val) * lerpSpeed;

      const currentInt = Math.floor(progressObj.val);

      if (counterNumberRef.current) {
        counterNumberRef.current.textContent = String(currentInt).padStart(2, "0");
      }

      if (progressObj.val >= 99.5) {
        progressObj.val = 100;
        if (counterNumberRef.current) {
          counterNumberRef.current.textContent = "100";
        }

        if (!exitStartedRef.current) {
          exitStartedRef.current = true;
          // Hold 100% briefly, then trigger morph
          setTimeout(() => {
            startExitAnimation();
          }, 220);
        }
        return;
      }

      animFrame = requestAnimationFrame(updateProgress);
    };

    animFrame = requestAnimationFrame(updateProgress);

    return () => {
      clearTimeout(safetyTimer);
      cancelAnimationFrame(animFrame);
    };
  }, [startExitAnimation]);

  // Lock initial GSAP values so they align 1:1 with inline CSS
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const isMobile = window.innerWidth < 768;
    const initialScale = isMobile ? 0.70 : 0.62;
    const initialY = isMobile ? "44vh" : "43.5vh";

    gsap.set(title, {
      y: initialY,
      scale: initialScale,
      transformOrigin: "center center",
      willChange: "transform",
    });
  }, []);

  const isMobileClient = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const clientInitialY = isMobileClient ? "44vh" : "43.5vh";
  const clientInitialScale = isMobileClient ? 0.70 : 0.62;

  return (
    <div
      ref={containerRef}
      id="site-preloader"
      className="fixed inset-0 z-50 w-full h-full pointer-events-auto select-none overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Black backdrop — starts at 100vh, lifts to 80vh to match hero rectangle */}
      <div
        ref={backdropRef}
        className="absolute top-0 left-0 w-full h-screen bg-[#080808] overflow-hidden"
      >
        {/* Mirrored Hero Content Container (80vh relative bounds) */}
        <div className="relative w-full h-[80vh] flex flex-col justify-between pt-0 pb-4 pointer-events-none">
          
          {/* Top Title Container: houses ADARSH'26 */}
          <div className="w-full relative flex flex-col items-center pt-4 md:pt-0">
            <div
              ref={titleRef}
              className="z-20 text-center flex items-center justify-center select-none pointer-events-none"
              style={{
                transform: `translateY(${clientInitialY}) scale(${clientInitialScale})`,
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <h1 className="text-[clamp(2.4rem,11.5vw,17vh)] sm:text-[clamp(3.5rem,12vw,17vh)] font-[380] tracking-normal uppercase leading-none flex items-center justify-center text-white">
                <span className="inline-flex">
                  <span>ADARSH</span>
                  <span className="font-display italic font-normal normal-case ml-[0.05em]">
                    &apos;26
                  </span>
                </span>
              </h1>
            </div>
          </div>

          {/* Center Hero Text: already at its exact center location (top-[55%] -translate-y-1/2) */}
          <div
            ref={centerTextRef}
            className="w-full text-center px-4 absolute top-[55%] -translate-y-1/2 z-10"
          >
            <p className="text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
              MIXING CODE, AI, MOTION, &amp; VISUALS
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Digital Progress Counter — outside backdrop, positioned to the fixed viewport */}
      <div
        ref={counterRef}
        className="absolute bottom-[max(3vh,env(safe-area-inset-bottom,12px))] sm:bottom-[7vh] left-1/2 -translate-x-1/2 z-[60] pointer-events-none text-center"
      >
        <span className="font-mono text-[clamp(11px,0.95vw,1.45vh)] text-text-light/75 tracking-widest uppercase tabular-nums">
          (&nbsp;<span ref={counterNumberRef}>00</span>%&nbsp;)
        </span>
      </div>
    </div>
  );
}
