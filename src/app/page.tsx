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
      (window as any).__lenis?.stop();
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
    } else {
      document.body.style.overflow = "";
      (window as any).__lenis?.start();
      (window as any).__lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [isPreloaderComplete]);

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
