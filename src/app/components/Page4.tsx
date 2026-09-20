"use client";

import { forwardRef } from "react";
import ReflectShader from "@/components/originkit/ui/reflect-shader";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";

interface Page4Props {
  scrollTriggerTrigger?: string;
}

const Page4 = forwardRef<HTMLElement, Page4Props>(function Page4(
  { scrollTriggerTrigger = "#main-scroll-container" },
  ref
) {
  return (
    <footer
      ref={ref}
      id="contact"
      className="relative w-full h-full min-h-screen flex flex-col justify-between items-center overflow-hidden bg-black text-white select-none"
    >
      {/* WebGL animated shader background — mouse follow disabled (hover={0}) */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <ReflectShader
          speed={130}
          hover={0}
          zoom={210}
          bandGap={24}
          brightness={110}
          style={{
            minWidth: "100%",
            minHeight: "100%",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Main Content Layer with mix-blend-difference — exactly as in Hero */}
      <div className="relative z-20 mix-blend-difference w-full h-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 md:px-12 pt-[6vh] pb-[3vh] pointer-events-none text-white max-w-[1600px] mx-auto">
        
        {/* Top spacer for GlobalNav clearance */}
        <div className="w-full shrink-0 h-4 sm:h-6" />

        {/* Center Hero Block — Minimal Kinetic Focus */}
        <div className="w-full flex flex-col items-center justify-center my-auto py-4 pointer-events-auto select-none">
          
          {/* Refined Headline */}
          <p className="text-[clamp(1rem,1.8vw,2.6vh)] font-[450] tracking-tight uppercase text-white/90 text-center max-w-2xl px-4 leading-snug">
            Got a project? Let’s make something great.
          </p>

          {/* Massive Display Title: Hero of the Footer */}
          <a
            href="mailto:adarshpathade79@gmail.com"
            title="Send an email to Adarsh"
            className="group block w-full max-w-full text-center mt-3 sm:mt-5 cursor-pointer select-none transition-transform duration-300 hover:scale-[1.01]"
          >
            <h1 className="font-sans text-[clamp(3.5rem,13vw,17vh)] font-[380] leading-[0.85] tracking-tighter uppercase whitespace-nowrap text-center text-white inline-flex items-baseline justify-center">
              <span className="mr-[0.2em]">LET’S</span>
              <span className="font-display italic font-normal mr-[0.14em]">C</span>
              <span>REATE.</span>
            </h1>
          </a>

          {/* Direct Email Typography Link with LetterSwapPingPong (No Glass, No Box, No Arrow) */}
          <div className="flex items-center justify-center mt-4 sm:mt-6">
            <a
              href="mailto:adarshpathade79@gmail.com"
              className="inline-block text-white transition-opacity hover:opacity-80 cursor-pointer"
            >
              <LetterSwapPingPong
                label="ADARSHPATHADE79@GMAIL.COM"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(10px,1.1vw,1.8vh)] tracking-wider uppercase cursor-pointer text-white"
              />
            </a>
          </div>
        </div>

        {/* Bottom Editorial Bar: 4 Scattered Items Across Viewport */}
        <div className="w-full grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3 sm:gap-6 pointer-events-auto select-none text-white shrink-0 pt-4">
          {/* 1. Designer / Developer Credit */}
          <div className="text-left shrink-0">
            <p className="text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal leading-tight uppercase text-white/70">
              DESIGN &amp; DEV BY ADARSH
            </p>
          </div>

          {/* 2. LinkedIn Link */}
          <div className="text-right sm:text-center shrink-0">
            <a
              href="https://www.linkedin.com/in/adarzhpathade"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white transition-opacity hover:opacity-80"
            >
              <LetterSwapPingPong
                label="LINKEDIN"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(8px,0.85vw,1.35vh)] tracking-normal uppercase cursor-pointer text-white"
              />
            </a>
          </div>

          {/* 3. GitHub Link */}
          <div className="text-left sm:text-center shrink-0">
            <a
              href="https://github.com/adarzhpathade"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white transition-opacity hover:opacity-80"
            >
              <LetterSwapPingPong
                label="GITHUB"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(8px,0.85vw,1.35vh)] tracking-normal uppercase cursor-pointer text-white"
              />
            </a>
          </div>

          {/* 4. Editorial Location (Year Removed) */}
          <div className="text-right shrink-0">
            <p className="text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal leading-tight uppercase text-white/70">
              BASED IN INDIA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Page4;
