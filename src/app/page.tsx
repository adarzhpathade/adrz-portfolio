"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlobalNav from "./components/GlobalNav";
import HeroSection from "./components/HeroSection";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Page4 from "./components/Page4";
import AboutCard from "./components/AboutCard";
import Preloader from "./components/Preloader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const lightCanvasRef = useRef<HTMLDivElement>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPreloaderExiting, setIsPreloaderExiting] = useState(false);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleToggleAbout = () => {
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const p = maxScroll > 0 ? scrollY / maxScroll : 0;
      setIsDarkTheme(p < 0.24 || p >= 0.74);
    }
    setIsAboutOpen((prev) => !prev);
  };

  // Lock scroll during initial preloader presentation
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (!isPreloaderComplete) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      window.__lenis?.stop();
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
    } else {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.__lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [isPreloaderComplete]);

  // Mobile Section Snap / Auto-Scroll: On a little scroll or swipe in mobile view,
  // automatically and smoothly transitions the whole section to the next/previous state.
  useEffect(() => {
    if (typeof window === "undefined" || !isPreloaderComplete || isAboutOpen) return;

    // The key narrative section stops of the portfolio on mobile:
    // 0.00: Hero Initial (dark cover, title, subtitle)
    // 0.18: Hero Revealed (shader background active, 3-line statement in focus)
    // 0.38: Page 2 (Light canvas with 3D Motion Graphics Carousel)
    // 0.66: Page 3 Projects (3D Cube Projects Gallery)
    // 0.86: Page 3 Skills (Dark theme #080808 with animated BlurText skills)
    // 1.00: Page 4 Footer (ReflectShader Contact Section)
    const SECTIONS = [0.0, 0.18, 0.38, 0.66, 0.86, 1.0];
    let isTransitioning = false;
    let transitionTimeout: NodeJS.Timeout | null = null;
    let touchStartY = 0;
    let touchStartX = 0;
    let isTrackingTouch = false;

    const getTargetScrollY = (targetProgress: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      return Math.round(targetProgress * maxScroll);
    };

    const getCurrentProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };

    const scrollToProgress = (targetProgress: number) => {
      if (isTransitioning) return;
      isTransitioning = true;

      const targetY = getTargetScrollY(targetProgress);
      const lenis = window.__lenis;

      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(targetY, {
          duration: 1.4,
          // Silky smooth easeInOutCubic: gentle start, buttery glide, soft deceleration
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
          lock: true,
        });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }

      if (transitionTimeout) clearTimeout(transitionTimeout);
      transitionTimeout = setTimeout(() => {
        isTransitioning = false;
      }, 1450);
    };

    const goToNextSection = () => {
      const currentP = getCurrentProgress();
      // Find the next section ahead of current progress (+ epsilon)
      const nextSection = SECTIONS.find((s) => s > currentP + 0.03);
      if (nextSection !== undefined) {
        scrollToProgress(nextSection);
      }
    };

    const goToPrevSection = () => {
      const currentP = getCurrentProgress();
      // Find the previous section behind current progress (- epsilon)
      const prevSections = SECTIONS.filter((s) => s < currentP - 0.03);
      if (prevSections.length > 0) {
        const prevSection = prevSections[prevSections.length - 1];
        scrollToProgress(prevSection);
      }
    };

    // Touch event handlers for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768 || e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTrackingTouch = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768 || !isTrackingTouch || e.touches.length !== 1) return;

      if (isTransitioning) {
        // Prevent touch interruption during section transition
        e.preventDefault();
        return;
      }

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = currentY - touchStartY;
      const deltaX = currentX - touchStartX;

      // If user is dragging horizontally (e.g. spinning the 3D CylinderCarousel on Page 2),
      // do NOT intercept — let the carousel handle it cleanly
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isTrackingTouch = false;
        return;
      }

      // "On little scroll of the user" — small threshold (22px) detects vertical scroll intent
      if (Math.abs(deltaY) >= 22) {
        e.preventDefault();
        isTrackingTouch = false;

        if (deltaY < 0) {
          // Swiped UP -> user intends to scroll DOWN to the next section
          goToNextSection();
        } else {
          // Swiped DOWN -> user intends to scroll UP to the previous section
          goToPrevSection();
        }
      }
    };

    const onTouchEnd = () => {
      isTrackingTouch = false;
    };

    // Wheel event handler for mobile-sized viewports (e.g. DevTools emulator or small screens)
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768) return;

      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) >= 12) {
        e.preventDefault();
        if (e.deltaY > 0) {
          goToNextSection();
        } else {
          goToPrevSection();
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      if (transitionTimeout) clearTimeout(transitionTimeout);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
    };
  }, [isPreloaderComplete, isAboutOpen]);

  useGSAP(
    () => {
      const lightCanvas = lightCanvasRef.current;
      if (!lightCanvas) return;

      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#main-scroll-container",
          start: "top top",
          end: "+=600%",
          scrub: isMobile ? 0.35 : 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // 0.00 -> 0.24: Hero (Dark)
            // 0.24 -> 0.74: Page 2 & Page 3 Carousel (Light)
            // 0.74 -> 1.00: Page 3 Skills & Page 4 (Dark)
            const p = self.progress;
            const dark = p < 0.24 || p >= 0.74;
            setIsDarkTheme(dark);
          },
        },
      });

      // 0.00 -> 0.48: lightCanvas stays at yPercent: 0 (showing Page 2)
      // 0.48 -> 0.62: lightCanvas smoothly scrolls up by 50% of its height,
      // bringing Page 3 100% fully into the viewport
      // 0.62 -> 0.74: Page 3 holds fully in place for interactive 3D exploration
      tl.fromTo(
        lightCanvas,
        { yPercent: 0 },
        {
          yPercent: -50,
          ease: "power1.inOut",
          duration: 0.14,
        },
        0.48
      );

      // 0.72 -> 0.80: lightCanvas background smoothly transitions to dark (#080808)
      tl.to(
        lightCanvas,
        {
          backgroundColor: "#080808",
          ease: "power1.inOut",
          duration: 0.08,
        },
        0.72
      );

      // 0.82 -> 0.92: Page 3 dark skills hold completely clean with zero interference

      // 0.93 -> 1.00: lightCanvas smoothly scrolls from -50% to -100%,
      // lifting Page 3 up like a curtain to reveal Page 4 (Footer with ReflectShader) underneath
      tl.to(
        lightCanvas,
        {
          yPercent: -100,
          ease: "power1.inOut",
          duration: 0.07,
        },
        0.93
      );

      // Unblock pointer events for Page 4 once lightCanvas has moved out, and restore on reverse scrub
      tl.fromTo(
        lightCanvas,
        { pointerEvents: "auto" },
        { pointerEvents: "none", duration: 0.02 },
        0.98
      );

      // Explicitly anchor timeline total duration to 1.0
      tl.set({}, {}, 1.0);
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      id="main-scroll-container"
      className="w-full relative bg-black"
    >
      {/* Persistent Global Nav Header — animated title and responsive links */}
      <GlobalNav 
        scrollTriggerTrigger="#main-scroll-container" 
        isAboutOpen={isAboutOpen}
        onToggleAbout={handleToggleAbout}
      />

      {/* About Card Overlay — reveals smoothly with adaptive dark/light theme */}
      <AboutCard 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
        isDark={isDarkTheme}
      />

      {/* Sticky viewport pinned smoothly for the duration of the scroll animation */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Page 4 (Footer) sits at the base z-0 with animated ReflectShader background */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
          <Page4 scrollTriggerTrigger="#main-scroll-container" />
        </div>

        {/* Unified Light Canvas (Page 2 + Page 3) layered above Page 4 at z-10 */}
        <div
          ref={lightCanvasRef}
          className="absolute top-0 left-0 w-full flex flex-col bg-[#ECECEC] z-10 pointer-events-auto"
          style={{ height: "200%" }}
        >
          {/* Page 2 occupies the top 100vh */}
          <div className="w-full h-1/2 relative shrink-0">
            <Page2 scrollTriggerTrigger="#main-scroll-container" />
          </div>

          {/* Page 3 occupies the bottom 100vh, continuously attached */}
          <div className="w-full h-1/2 relative shrink-0">
            <Page3 scrollTriggerTrigger="#main-scroll-container" />
          </div>
        </div>

        {/* HeroSection is layered on top at z-20 and slides up out of the viewport */}
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
          <HeroSection 
            scrollTriggerTrigger="#main-scroll-container" 
            isAboutOpen={isAboutOpen}
            onToggleAbout={handleToggleAbout}
            isReady={isPreloaderExiting}
          />
        </div>
      </div>

      {/* Initial cinematic Page Preloader */}
      {!isPreloaderComplete && (
        <Preloader 
          onStartExit={() => setIsPreloaderExiting(true)}
          onComplete={() => setIsPreloaderComplete(true)}
        />
      )}

      {/* Scroll track providing the smooth scroll distance (600vh) */}
      <div className="h-[600vh] w-full pointer-events-none" />
    </main>
  );
}
