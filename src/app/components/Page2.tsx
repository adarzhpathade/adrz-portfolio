"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LiquidGlassCarousel from "@/components/originkit/ui/liquid-glass-carousel-custom-style";
import GradualBlur from "@/components/react-bits/GradualBlur";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Page2Props {
  scrollTriggerTrigger?: string;
}

const PORTFOLIO_VIDEOS = [
  {
    image: "/videos/Advance Animations.webm",
    title: "Advance Animations",
  },
  {
    image: "/videos/Coffee Cup.webm",
    title: "Coffee Cup",
  },
  {
    image: "/videos/Human Brain.webm",
    title: "Human Brain",
  },
  {
    image: "/videos/Object Centric Animation - 2.webm",
    title: "Object Centric Animation",
  },
  {
    image: "/videos/Text Centric Animation - 1.webm",
    title: "Text Centric Animation",
  },
  {
    image: "/videos/What You See -.webm",
    title: "What You See",
  },
];

export default function Page2({
  scrollTriggerTrigger = "#main-scroll-container",
}: Page2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const [entryTrigger, setEntryTrigger] = useState(0);

  useGSAP(
    () => {
      const carouselWrapper = carouselWrapperRef.current;
      if (!carouselWrapper) return;

      // Start initially hidden until Page 2 comes into view
      gsap.set(carouselWrapper, {
        opacity: 0,
        pointerEvents: "none",
      });

      let hasEntered = false;

      ScrollTrigger.create({
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=480%",
        onUpdate: (self) => {
          // As soon as Hero starts finishing sliding up and Page 2 is becoming fully visible (around 38%+)
          if (self.progress >= 0.38) {
            if (!hasEntered) {
              hasEntered = true;
              carouselWrapper.style.pointerEvents = "auto";
              gsap.to(carouselWrapper, {
                opacity: 1,
                duration: 0.35,
                overwrite: "auto",
              });
              setEntryTrigger((prev) => prev + 1);
            }
          } else if (self.progress < 0.26) {
            // User scrolled back up towards the Hero — hide and prepare for next entry
            if (hasEntered) {
              hasEntered = false;
              carouselWrapper.style.pointerEvents = "none";
              gsap.to(carouselWrapper, {
                opacity: 0,
                duration: 0.3,
                overwrite: "auto",
              });
            }
          }
        },
      });
    },
    { scope: sectionRef, dependencies: [scrollTriggerTrigger] }
  );

  return (
    <section
      ref={sectionRef}
      id="page-2"
      className="relative w-full h-full bg-[#ECECEC] text-[#080808] overflow-hidden select-none"
    >
      {/* Carousel container holding the 3D card animation & description */}
      <div
        ref={carouselWrapperRef}
        className="relative w-full h-full z-10"
        style={{ opacity: 0 }}
      >
        {/* Scaled-down & shifted-up Carousel container */}
        <div className="w-full h-full flex items-center justify-center translate-y-0 sm:-translate-y-6 pt-14 sm:pt-14 pb-14 sm:pb-12">
          <LiquidGlassCarousel
            items={PORTFOLIO_VIDEOS}
            background="#ECECEC"
            cardWidth={240}
            cardHeight={390}
            gap={30}
            curved={true}
            cornerRadius={18}
            entryTrigger={entryTrigger}
            entry={{
              enabled: true,
              enterFrom: "bottom",
              transition: {
                duration: 1.0,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
            autoScroll={{
              enabled: true,
              speed: 65,
              resumeDelay: 1000,
            }}
            motion={{
              snap: false,
              glide: 6.8,
              sensitivity: 6.0,
            }}
            lens={{
              enabled: false,
              shape: "square",
              width: 0.55,
              height: 0.75,
              rotation: 15,
              dispersion: 6,
              ringColor: "rgba(0, 0, 0, 0.08)",
            }}
            interaction={{
              drag: true,
              wheel: false,
              clickToFocus: true,
            }}
          />
        </div>

        {/* Bottom bio / description — 3 balanced lines on mobile, 2 lines on desktop */}
        <div className="absolute bottom-8 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full text-center px-4 z-40 pointer-events-auto">
          {/* Mobile 3-line balanced block */}
          <p className="block sm:hidden text-[8px] sm:text-[10px] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase">
            A COLLECTION OF ORIGINAL MOTION GRAPHICS<br />
            AND VISUAL EXPERIMENTS, CRAFTED THROUGH<br />
            DESIGN, ANIMATION AND AFTER EFFECTS.
          </p>

          {/* Tablet/Desktop 2-line layout */}
          <p className="hidden sm:block text-[8px] sm:text-[10px] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase">
            A collection of original motion graphics and visual experiments,<br />
            crafted through design, animation and After Effects.
          </p>
        </div>
      </div>

      {/* Left Edge Subtle Gradual Blur */}
      <GradualBlur
        target="parent"
        position="left"
        width="6rem"
        mobileWidth="2.5rem"
        tabletWidth="4.5rem"
        desktopWidth="6.5rem"
        responsive={true}
        strength={0.9}
        divCount={4}
        curve="ease-in"
        exponential={false}
        opacity={0.8}
        zIndex={30}
      />

      {/* Right Edge Subtle Gradual Blur */}
      <GradualBlur
        target="parent"
        position="right"
        width="6rem"
        mobileWidth="2.5rem"
        tabletWidth="4.5rem"
        desktopWidth="6.5rem"
        responsive={true}
        strength={0.9}
        divCount={4}
        curve="ease-in"
        exponential={false}
        opacity={0.8}
        zIndex={30}
      />
    </section>
  );
}
