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
import useScreenSize from "@/hooks/use-screen-size";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const { isMobile, mounted } = useScreenSize();
  const containerRef = useRef<HTMLElement>(null);
  const lightCanvasRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef({ page2Triggered: false, mobileProjectsTriggered: false, mobileSkillsTriggered: false });
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

  // Pre-calculate and refresh ScrollTrigger measurements once DOM is mounted behind loader
  useEffect(() => {
    if (mounted) {
      ScrollTrigger.refresh();
    }
  }, [mounted]);

  useGSAP(
    () => {
      const lightCanvas = lightCanvasRef.current;
      if (!lightCanvas) return;

      const mm = gsap.matchMedia();

      const updateThemeColor = (p: number, isMobileTimeline: boolean) => {
        const isDark = isMobileTimeline 
          ? (p < 0.22 || p >= 0.60)
          : (p < 0.24 || p >= 0.74);
          
        setIsDarkTheme(isDark);
        
        let themeColor = "#000000";
        if (!isDark) themeColor = "#ECECEC";
        else if (p > 0.5) themeColor = "#080808"; 
        
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
          metaTheme = document.createElement('meta');
          metaTheme.setAttribute('name', 'theme-color');
          document.head.appendChild(metaTheme);
        }
        if (metaTheme.getAttribute("content") !== themeColor) {
          metaTheme.setAttribute("content", themeColor);
        }
      };

      // MOBILE TIMELINE (< 768px): Page 2 is excluded, lightCanvas stays at 0% until curtain reveal
      mm.add("(max-width: 767px)", () => {
        gsap.set(lightCanvas, { yPercent: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#main-scroll-container",
            start: "top top",
            end: "+=600%",
            scrub: 0.35,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              updateThemeColor(p, true);

              if (window.__lenis) {
                // Hero to Projects auto-scroll on mobile
                if (self.direction === 1 && p > 0.22 && p < 0.28 && !autoScrollRef.current.mobileProjectsTriggered) {
                  autoScrollRef.current.mobileProjectsTriggered = true;
                  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                  window.__lenis.scrollTo(maxScroll * 0.32, { duration: 1.2 }); 
                }
                if (self.direction === -1 && p < 0.15) {
                  autoScrollRef.current.mobileProjectsTriggered = false;
                }

                // Projects to Skills auto-scroll on mobile for an easy, smooth transition
                if (self.direction === 1 && p > 0.55 && p < 0.61 && !autoScrollRef.current.mobileSkillsTriggered) {
                  autoScrollRef.current.mobileSkillsTriggered = true;
                  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                  window.__lenis.scrollTo(maxScroll * 0.66, { duration: 1.2 }); 
                }
                if (self.direction === -1 && p < 0.48) {
                  autoScrollRef.current.mobileSkillsTriggered = false;
                }
              }
            },
          },
        });

        tl.set(lightCanvas, { yPercent: 0 }, 0);

        // 0.00 -> 0.58: lightCanvas stays at yPercent: 0 (showing Page 3 full screen)
        // 0.58 -> 0.63: lightCanvas background smoothly transitions to dark (#080808) for Skills
        tl.to(
          lightCanvas,
          {
            backgroundColor: "#080808",
            ease: "power1.inOut",
            duration: 0.05,
          },
          0.58
        );

        // 0.92 -> 1.00: lightCanvas curtain reveal from 0% to -100%, lifting to reveal Page 4 Footer
        tl.to(
          lightCanvas,
          {
            yPercent: -100,
            ease: "power1.inOut",
            duration: 0.08,
          },
          0.92
        );

        // Unblock pointer events for Page 4 once lightCanvas has moved out
        tl.to(
          lightCanvas,
          { pointerEvents: "none", duration: 0.02 },
          0.98
        );

        tl.set({}, {}, 1.0);
      });

      // DESKTOP TIMELINE (>= 768px): lightCanvas holds Page 2 (0-50%) and Page 3 (50-100%)
      mm.add("(min-width: 768px)", () => {
        gsap.set(lightCanvas, { yPercent: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#main-scroll-container",
            start: "top top",
            end: "+=600%",
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              updateThemeColor(p, false);
              
              if (window.__lenis) {
                // If scrolling down and we pass ~28% (roughly 70% through the Hero out transition)
                if (self.direction === 1 && p > 0.28 && p < 0.35 && !autoScrollRef.current.page2Triggered) {
                  autoScrollRef.current.page2Triggered = true;
                  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                  window.__lenis.scrollTo(maxScroll * 0.35, { duration: 1.5 }); 
                }
                // Reset the trigger when user scrolls back up
                if (self.direction === -1 && p < 0.15) {
                  autoScrollRef.current.page2Triggered = false;
                }
              }
            },
          },
        });

        // Lock lightCanvas at yPercent: 0 initially (showing Page 2)
        tl.set(lightCanvas, { yPercent: 0 }, 0);

        // 0.00 -> 0.48: lightCanvas stays firmly at yPercent: 0 (showing Page 2)
        // 0.48 -> 0.62: lightCanvas smoothly scrolls up by 50% to reveal Page 3
        tl.to(
          lightCanvas,
          {
            yPercent: -50,
            ease: "power1.inOut",
            duration: 0.14,
          },
          0.48
        );

        // 0.72 -> 0.76: lightCanvas background smoothly transitions to dark (#080808)
        tl.to(
          lightCanvas,
          {
            backgroundColor: "#080808",
            ease: "power1.inOut",
            duration: 0.04,
          },
          0.72
        );

        // 0.92 -> 1.00: lightCanvas smoothly scrolls from -50% to -100% to reveal Page 4
        tl.to(
          lightCanvas,
          {
            yPercent: -100,
            ease: "power1.inOut",
            duration: 0.08,
          },
          0.92
        );

        // Unblock pointer events for Page 4
        tl.to(
          lightCanvas,
          { pointerEvents: "none", duration: 0.02 },
          0.98
        );

        tl.set({}, {}, 1.0);
      });
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
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden">
        {/* Page 4 (Footer) sits at the base z-0 with animated ReflectShader background */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto">
          <Page4 scrollTriggerTrigger="#main-scroll-container" />
        </div>

        {/* Unified Light Canvas layered above Page 4 at z-10 */}
        <div
          ref={lightCanvasRef}
          className="absolute top-0 left-0 w-full flex flex-col bg-[#ECECEC] z-10 pointer-events-auto h-full md:h-[200%]"
        >
          {/* Page 2 occupies the top 100vh — completely skipped on mobile */}
          <div className="hidden md:block w-full h-1/2 relative shrink-0">
            {mounted && !isMobile ? (
              <Page2 scrollTriggerTrigger="#main-scroll-container" />
            ) : null}
          </div>

          {/* Page 3: 100% on mobile, bottom 50% on desktop */}
          <div className="w-full relative shrink-0 h-full md:h-1/2">
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
