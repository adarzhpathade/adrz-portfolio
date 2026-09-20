"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BlurText from "@/components/react-bits/BlurText";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface GlobalNavProps {
  scrollTriggerTrigger?: string;
}

export default function GlobalNav({ scrollTriggerTrigger = "#main-scroll-container" }: GlobalNavProps) {
  const navContainerRef = useRef<HTMLElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const rightNavRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const navContainer = navContainerRef.current;
    const titleWrapper = titleWrapperRef.current;
    const titleText = titleTextRef.current;
    const rightNav = rightNavRef.current;

    if (!navContainer || !titleWrapper || !titleText || !rightNav) return;

    const getMetrics = () => {
      const isDesktop = window.innerWidth >= 768;
      const targetScale = isDesktop ? 0.22 : 0.40;
      const targetX = isDesktop ? 18 : 12;
      const targetY = isDesktop ? 12 : 12;
      const heroEl = document.getElementById("hero-main-title");
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
      const heroX = heroRect ? heroRect.left : (window.innerWidth - titleWrapper.offsetWidth) / 2;
      const heroY = heroRect ? heroRect.top : (isDesktop ? 10 : 4);

      // Exact vertical centerline of the scaled "ADARSH'26" title on Page 2
      const scaledTitleHeight = titleWrapper.offsetHeight * targetScale;
      const titleCenterY = targetY + (scaledTitleHeight / 2);

      // Exact Y offset for right nav so its centerline aligns perfectly inline with titleCenterY
      const navHeight = rightNav.offsetHeight || 20;
      const rightNavY = titleCenterY - (navHeight / 2);

      return {
        heroX,
        heroY,
        targetX,
        targetY,
        targetScale,
        rightNavY,
      };
    };

    // Timeline synced with the master scroll sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=480%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // 0.00 -> 0.25: Title is rendered directly in HeroSection with mix-blend-difference over WebGL background
    // 0.25 -> 0.42: Transition to Page 2
    // Title fades in at heroX, heroY and smoothly scales down into top-left logo on Page 2
    tl.fromTo(
      titleWrapper,
      {
        x: () => getMetrics().heroX,
        y: () => getMetrics().heroY,
        scale: 1,
        opacity: 0,
        transformOrigin: "left top",
      },
      {
        x: () => getMetrics().targetX,
        y: () => getMetrics().targetY,
        scale: () => getMetrics().targetScale,
        opacity: 1,
        ease: "power1.inOut",
        duration: 0.17,
      },
      0.25
    );

    // Title color transitions smoothly to deep black (#080808) for Page 2 & Page 3
    tl.to(
      titleText,
      {
        color: "#080808",
        ease: "power1.inOut",
        duration: 0.17,
      },
      0.25
    );

    // Right nav links fade and slide in to the exact inline centerline of the title
    tl.fromTo(
      rightNav,
      {
        opacity: 0,
        y: () => getMetrics().rightNavY - 6,
      },
      {
        opacity: 1,
        y: () => getMetrics().rightNavY,
        ease: "power2.out",
        duration: 0.12,
      },
      0.30
    );

    // 0.83 -> 0.98: Transition to Dark Section
    // Nav remains in its exact pinned position ("nav will be as it is"),
    // but typography smoothly transitions back to pure white (#FFFFFF) for crisp legibility on dark background
    tl.to(
      titleText,
      {
        color: "#FFFFFF",
        ease: "power1.inOut",
        duration: 0.15,
      },
      0.83
    );

    tl.to(
      rightNav,
      {
        color: "#FFFFFF",
        ease: "power1.inOut",
        duration: 0.15,
      },
      0.83
    );

    // Explicitly anchor timeline total duration to 1.0 so nav remains pinned in position
    // across all sections with zero unwanted movement
    tl.set({}, {}, 1.0);

  }, { scope: navContainerRef, dependencies: [scrollTriggerTrigger] });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header 
      ref={navContainerRef} 
      className="fixed top-0 left-0 w-full h-0 z-40 pointer-events-none"
    >
      <div className="w-full relative h-screen">
        {/* Main Title / Brand Heading - Animates to top-left logo on Page 2 */}
        <div 
          ref={titleWrapperRef}
          className="absolute top-0 left-0 pointer-events-auto flex items-center justify-center whitespace-nowrap cursor-pointer select-none origin-top-left opacity-0"
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <h1 
            ref={titleTextRef}
            className="text-6xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-[380] tracking-normal uppercase leading-none flex items-center justify-center text-white"
          >
            <BlurText 
              text={[
                { text: "ADARSH" },
                { text: "'26", className: "font-display italic font-normal normal-case" }
              ]} 
              delay={30}
              stepDuration={0.25}
              animateBy="letters" 
              direction="top" 
              className="inline-flex" 
            />
          </h1>
        </div>

        {/* Right Navigation - Desktop shows DESIGN — FOLIO, (CONTACT), (ABOUT); Mobile shows ONLY (CONTACT) */}
        {/* top-0 allows GSAP to dynamically center its Y position inline with the title */}
        <nav 
          ref={rightNavRef}
          className="absolute top-0 right-4 md:right-6 pointer-events-auto flex items-center gap-6 md:gap-8 opacity-0 text-[#080808]"
          aria-label="Main Navigation"
        >
          <div className="hidden md:inline-block">
            <LetterSwapPingPong
              label="DESIGN — FOLIO"
              staggerFrom="first"
              reverse={false}
              className="font-mono text-[13px] sm:text-xs md:text-xs tracking-wider uppercase cursor-pointer transition-opacity text-current"
            />
          </div>
          <div className="inline-block">
            <LetterSwapPingPong
              label="(Contact)"
              staggerFrom="first"
              reverse={false}
              className="font-mono text-[13px] sm:text-xs md:text-xs tracking-wider uppercase cursor-pointer transition-opacity text-current"
              onClick={() => {
                const contactEl = document.getElementById("contact");
                if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
          <div className="hidden md:inline-block">
            <LetterSwapPingPong
              label="(About)"
              staggerFrom="first"
              reverse={false}
              className="font-mono text-[13px] sm:text-xs md:text-xs tracking-wider uppercase cursor-pointer transition-opacity text-current"
              onClick={() => {
                const aboutEl = document.getElementById("about");
                if (aboutEl) aboutEl.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
