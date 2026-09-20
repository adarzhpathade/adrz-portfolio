"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    // 1. Asset & Readiness Tracking
    let assetsLoaded = false;

    const checkReadiness = async () => {
      try {
        // Wait for window load
        if (document.readyState !== "complete") {
          await new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });
        }

        // Wait for custom fonts to be decoded and ready
        if (document.fonts) {
          await document.fonts.ready;
        }

        // Wait for critical images
        const images = Array.from(document.querySelectorAll("img"));
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
          })
        );
      } catch (err) {
        console.warn("Preloader asset check warning:", err);
      } finally {
        assetsLoaded = true;
      }
    };

    checkReadiness();

    // Fallback safety: ensure assetsLoaded is true after 3.5s maximum
    const safetyTimer = setTimeout(() => {
      assetsLoaded = true;
    }, 3500);

    // 2. Smooth Paced Progress Animation (Direct DOM update — Zero React re-renders)
    const progressObj = { val: 0 };
    let animFrame: number;

    const startTime = performance.now();
    const minDuration = 1800; // Minimum 1.8s for cinematic feel

    const updateProgress = () => {
      const elapsed = performance.now() - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);

      let targetVal = 0;
      if (!assetsLoaded) {
        // Hold around 85-90% if assets are still fetching
        targetVal = Math.min(timeRatio * 90, 89);
      } else {
        // Assets are ready: ease smoothly to 100%
        if (timeRatio < 1) {
          targetVal = timeRatio * 100;
        } else {
          targetVal = 100;
        }
      }

      // Smooth lerp towards targetVal
      progressObj.val += (targetVal - progressObj.val) * 0.12;
      const currentInt = Math.floor(progressObj.val);

      if (counterNumberRef.current) {
        counterNumberRef.current.textContent = String(currentInt).padStart(2, "0");
      }

      if (targetVal >= 99.5 && progressObj.val >= 99) {
        progressObj.val = 100;
        if (counterNumberRef.current) {
          counterNumberRef.current.textContent = "100";
        }

        if (!exitStartedRef.current) {
          exitStartedRef.current = true;
          // Hold 100% briefly, then trigger morph
          setTimeout(startExitAnimation, 220);
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
  }, []);

  // 3. Exit Morph Choreography
  const startExitAnimation = () => {
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
    // Starting state: y = 42vh, scale = 0.38
    // Target state: y = 0, scale = 1.0 (exact match to HeroSection hero-main-title)
    tl.fromTo(
      title,
      {
        y: "42vh",
        scale: 0.38,
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
  };

  // Lock initial GSAP values so they align 1:1 with inline CSS
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    gsap.set(title, {
      y: "42vh",
      scale: 0.38,
      transformOrigin: "center center",
      willChange: "transform",
    });
  }, []);

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
                transform: "translateY(42vh) scale(0.38)",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <h1 className="text-[clamp(3.5rem,12vw,17vh)] font-[380] tracking-normal uppercase leading-none flex items-center justify-center text-white">
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

        {/* Bottom Digital Progress Counter inside () */}
        <div
          ref={counterRef}
          className="absolute bottom-[6vh] sm:bottom-[7vh] left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center"
        >
          <span className="font-mono text-[clamp(11px,0.95vw,1.45vh)] text-text-light/75 tracking-widest uppercase tabular-nums">
            (&nbsp;<span ref={counterNumberRef}>00</span>%&nbsp;)
          </span>
        </div>
      </div>
    </div>
  );
}
