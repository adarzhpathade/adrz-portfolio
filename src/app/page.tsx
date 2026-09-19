"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlobalNav from "./components/GlobalNav";
import HeroSection from "./components/HeroSection";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const lightCanvasRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lightCanvas = lightCanvasRef.current;
      if (!lightCanvas) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#main-scroll-container",
          start: "top top",
          end: "+=360%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0.00 -> 0.68: lightCanvas stays at yPercent: 0 (showing Page 2)
      // 0.68 -> 0.92: lightCanvas smoothly scrolls up by 50% of its height,
      // bringing Page 3 100% fully into the viewport
      // 0.92 -> 1.00: Page 3 holds fully in place while box reveals
      tl.fromTo(
        lightCanvas,
        { yPercent: 0 },
        {
          yPercent: -50,
          ease: "power1.inOut",
          duration: 0.24,
        },
        0.68
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
      <GlobalNav scrollTriggerTrigger="#main-scroll-container" />

      {/* Sticky viewport pinned smoothly for the duration of the scroll animation */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Unified Light Canvas (Page 2 + Page 3) layered underneath at z-10 */}
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
          <HeroSection scrollTriggerTrigger="#main-scroll-container" />
        </div>
      </div>

      {/* Scroll track providing the smooth scroll distance (360vh) */}
      <div className="h-[360vh] w-full pointer-events-none" />
    </main>
  );
}
