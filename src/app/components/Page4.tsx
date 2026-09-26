"use client";

import { forwardRef } from "react";
import ReflectShader from "@/components/originkit/ui/reflect-shader";
import Waves from "@/components/react-bits/Waves";
import useScreenSize from "@/hooks/use-screen-size";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";
import TechText from "@/components/react-bits/TechText";

interface Page4Props {
  scrollTriggerTrigger?: string;
}

const Page4 = forwardRef<HTMLElement, Page4Props>(function Page4(
  _props,
  ref
) {
  const { isMobile, mounted } = useScreenSize();

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative w-full h-full min-h-[100dvh] flex flex-col justify-between items-center overflow-hidden bg-black text-white select-none"
    >
      {/* Animated background: lightweight Canvas 2D Waves on mobile (< 768px), WebGL ReflectShader on desktop */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        {mounted && (
          isMobile ? (
            <Waves
              lineColor="rgba(255, 255, 255, 0.3)"
              backgroundColor="transparent"
              waveSpeedX={0.015}
              waveSpeedY={0.007}
              waveAmpX={36}
              waveAmpY={18}
              friction={0.925}
              tension={0.005}
              maxCursorMove={100}
              xGap={12}
              yGap={32}
            />
          ) : (
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
          )
        )}
      </div>

      {/* Main Content Layer with mix-blend-difference — exactly as in Hero */}
      <div className="relative z-20 mix-blend-difference w-full h-full min-h-[100dvh] flex flex-col justify-between items-center px-4 sm:px-8 md:px-12 pt-[6vh] pb-[max(4vh,env(safe-area-inset-bottom,20px))] pointer-events-none text-white max-w-[1600px] mx-auto">
        
        {/* Top spacer for GlobalNav clearance */}
        <div className="w-full shrink-0 h-4 sm:h-6" />

        {/* Center Hero Block — Minimal Kinetic Focus */}
        <div className="w-full flex flex-col items-center justify-center my-auto py-4 pointer-events-auto select-none">
          
          {/* Refined Headline — single line on all screen sizes */}
          <p className="text-[clamp(0.75rem,2.4vw,1.1rem)] font-[450] tracking-tight uppercase text-white/90 text-center whitespace-nowrap px-4 leading-snug">
            Got a project? Let’s talk.
          </p>

          {/* Massive Display Title: TechText Interactive Wordmark */}
          <div className="w-full max-w-[1400px] h-[clamp(130px,22vh,260px)] relative -my-1 sm:my-0 flex items-center justify-center pointer-events-auto">
            <h1 className="sr-only">LET’S CREATE.</h1>
            <TechText
              text="LET'S CREATE."
              fontWeight={400}
              fontSize={180}
              letterSpacing={-0.04}
              color="#ffffff"
              accentColor="#ffffff"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              strokeWidth={1.5}
              specks={15}
              selection={true}
              labels={true}
              draggable={false}
              sweep={true}
              speed={1}
            />
          </div>

          {/* Direct Email Typography Link with LetterSwapPingPong (No Glass, No Box, No Arrow) */}
          <div className="flex items-center justify-center mt-1 sm:mt-2">
            <a
              href="mailto:adarshpathade79@gmail.com"
              className="inline-block text-white transition-opacity hover:opacity-80 cursor-pointer"
            >
              <LetterSwapPingPong
                label="ADARSHPATHADE79@GMAIL.COM"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(9px,2.6vw,12px)] sm:text-[clamp(10px,1.1vw,1.8vh)] tracking-wider uppercase cursor-pointer text-white"
              />
            </a>
          </div>
        </div>

        {/* Bottom Editorial Bar: Tightly grouped links, distinct gap, tightly grouped credits on mobile */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between pointer-events-auto select-none text-white shrink-0 pt-4 pb-[max(2vh,env(safe-area-inset-bottom,12px))] text-center sm:text-left">
          {/* Group 1 (Mobile Top, Desktop Center): Nav Links (LinkedIn & GitHub) closely spaced */}
          <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-center gap-1 sm:gap-8 shrink-0">
            <a
              href="https://www.linkedin.com/in/adarzhpathade"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-white transition-opacity hover:opacity-80 leading-none"
            >
              <LetterSwapPingPong
                label="LINKEDIN"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(11px,2.8vw,13px)] sm:text-[clamp(9px,0.85vw,1.35vh)] tracking-wider uppercase cursor-pointer text-white leading-none"
              />
            </a>
            <a
              href="https://github.com/adarzhpathade"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-white transition-opacity hover:opacity-80 leading-none"
            >
              <LetterSwapPingPong
                label="GITHUB"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(11px,2.8vw,13px)] sm:text-[clamp(9px,0.85vw,1.35vh)] tracking-wider uppercase cursor-pointer text-white leading-none"
              />
            </a>
          </div>

          {/* Group 2 (Mobile Bottom, Desktop Left): Designer Credits & Location with distinct gap from nav links */}
          <div className="order-2 sm:order-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-0 shrink-0 mt-6 sm:mt-0">
            <p className="text-[clamp(10px,2.6vw,12px)] sm:text-[clamp(9px,0.85vw,1.35vh)] font-mono tracking-normal leading-tight uppercase text-white/70">
              DESIGN &amp; DEV BY ADARSH
            </p>
            <p className="sm:hidden text-[clamp(10px,2.6vw,12px)] font-mono tracking-normal leading-tight uppercase text-white/50">
              BASED IN INDIA
            </p>
          </div>

          {/* Desktop Only: Location on far-right */}
          <div className="hidden sm:block sm:order-3 text-right shrink-0">
            <p className="text-[clamp(9px,0.85vw,1.35vh)] font-mono tracking-normal leading-tight uppercase text-white/70">
              BASED IN INDIA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Page4;
