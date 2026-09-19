"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ReflectShader from "@/components/originkit/ui/reflect-shader";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REVEAL_LINES = [
  "I DESIGN, BUILD & EXPERIMENT",
  "WITH CODE, AI & MOTION. TURNING IDEAS",
  "INTO DIGITAL EXPERIENCES & VISUAL STORIES."
];

interface HeroSectionProps {
  scrollTriggerTrigger?: string;
}

export default function HeroSection({ scrollTriggerTrigger = "#main-scroll-container" }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rectangleRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLDivElement>(null);
  const bottomHeadingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const rectangle = rectangleRef.current;
    const about = aboutRef.current;
    const contact = contactRef.current;
    const centerText = centerTextRef.current;
    const revealText = revealTextRef.current;
    const bottomHeading = bottomHeadingRef.current;

    if (!section || !rectangle || !about || !contact || !centerText || !revealText || !bottomHeading) return;

    // Master scroll timeline synchronized with GlobalNav, Page2, and Page3
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=360%", 
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // --- PHASE 1: Hero Reveal (0.00 -> 0.28) ---
    // 1. Dark rectangle scrolls up and out (revealing the shader background)
    tl.to(rectangle, {
      yPercent: -100,
      ease: "none",
      duration: 0.28,
    }, 0);

    // 2. Center subtitle fades out
    tl.to(centerText, {
      opacity: 0,
      ease: "power2.in",
      duration: 0.15,
    }, 0);

    // 3. Initial hero side links fade out quickly on scroll
    tl.to([about, contact], {
      opacity: 0,
      duration: 0.05,
      ease: "power2.in",
    }, 0);

    // 4. Explicitly ensure 3-line text starts completely hidden on initial load/refresh
    const words = revealText.querySelectorAll<HTMLElement>(".reveal-word");
    gsap.set(words, { opacity: 0, filter: "blur(12px)", y: 30 });

    // 5. 3-line text words reveal with blur and y translation as user scrolls
    tl.to(words, 
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.01,
        ease: "none",
        duration: 0.24,
      }, 0.04
    );

    // 6. Bottom "DESIGN — Folio" fades out with blur
    tl.to(bottomHeading, {
      opacity: 0,
      filter: "blur(12px)",
      ease: "power2.in",
      duration: 0.15,
    }, 0);

    // --- PHASE 1.5: Hold Hero Revealed State (0.28 -> 0.33) ---

    // --- PHASE 2: Transition to Page 2 (0.33 -> 0.56) ---
    // 7. 3-line text fades out and blurs upwards
    tl.to(revealText, {
      opacity: 0,
      filter: "blur(12px)",
      y: -30,
      ease: "power2.in",
      duration: 0.09,
    }, 0.33);

    // 8. Hero section physically slides up and out of the viewport,
    // revealing the light-colored Page 2 sitting underneath
    tl.to(section, {
      yPercent: -100,
      ease: "power1.inOut",
      duration: 0.23,
    }, 0.33);

    // Explicitly anchor timeline total duration to 1.0
    tl.set({}, {}, 1.0);

  }, { scope: sectionRef, dependencies: [scrollTriggerTrigger] });

  return (
    <section 
      ref={sectionRef} 
      id="hero" 
      className="absolute inset-0 z-20 w-full h-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-black text-white"
    >
      {/* WebGL shader background — lives inside section so it cleanly slides up with Hero */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <ReflectShader speed={150} hover={0} zoom={150} style={{ minWidth: "100%", minHeight: "100%", width: "100%", height: "100%" }} />
      </div>

      {/* Dark rectangle — background overlay that scrolls out on initial scroll */}
      <div ref={rectangleRef} className="absolute top-0 left-0 z-10 w-full h-[80vh] bg-brand-dark pointer-events-none" />

      {/* Text content overlay */}
      <div className="relative z-20 mix-blend-difference w-full h-[80vh] flex flex-col justify-between pt-0 pb-4 pointer-events-none">
        <div className="w-full relative flex flex-col items-center pt-4 md:pt-0">
          {/* Layout spacer for main heading (the visible heading is animated in GlobalNav) */}
          <div className="z-10 text-center flex items-center justify-center opacity-0 pointer-events-none select-none" aria-hidden="true">
            <h2 className="text-6xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-[380] tracking-normal uppercase leading-none flex items-center justify-center">
              ADARSH<span className="font-display italic font-normal normal-case">'26</span>
            </h2>
          </div>
          
          {/* Initial Hero links: (About) & (Contact) — visible on load, fade out on scroll */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center gap-8 mt-4 md:mt-0 md:absolute md:inset-0 md:w-full md:px-8 lg:px-16 md:justify-between pointer-events-none z-20"
          >
            <div ref={aboutRef} className="pointer-events-auto">
              <LetterSwapPingPong
                label="(About)"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[10px] sm:text-xs tracking-wider uppercase cursor-pointer transition-opacity"
              />
            </div>
            <div ref={contactRef} className="pointer-events-auto">
              <LetterSwapPingPong
                label="(Contact)"
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[10px] sm:text-xs tracking-wider uppercase cursor-pointer transition-opacity"
              />
            </div>
          </motion.div>
        </div>

        {/* Center Text — visible on load, fades out on scroll */}
        <div ref={centerTextRef} className="w-full text-center px-4 md:absolute md:top-[55%] md:-translate-y-1/2 z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="font-mono text-[10px] sm:text-xs tracking-normal uppercase text-text-light">
              MIXING CODE, AI, MOTION, &amp; VISUALS
            </p>
          </motion.div>
        </div>

        {/* 3-Line Text — hidden by default, revealed on scroll, blurs out on transition to Page 2 */}
        <div ref={revealTextRef} className="w-full text-center px-4 flex flex-col items-center justify-center z-20 absolute bottom-12 md:bottom-16 pointer-events-none">
          {REVEAL_LINES.map((line, lineIndex) => (
            <p key={lineIndex} className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-[450] tracking-wide uppercase text-white/80 leading-[1.1] flex flex-wrap justify-center gap-x-[0.35em] gap-y-0">
              {line.split(/\s+/).map((word, wordIndex) => (
                <span 
                  key={`${lineIndex}-${wordIndex}`} 
                  className="reveal-word inline-block opacity-0"
                  style={{ opacity: 0, filter: "blur(12px)" }}
                >
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Bottom "DESIGN — Folio" text */}
        <div ref={bottomHeadingRef} className="w-full flex justify-center">
          <h2 className="text-lg sm:text-2xl lg:text-[2rem] font-normal tracking-tight uppercase leading-none flex items-center justify-center">
            DESIGN — <span className="font-display italic font-normal normal-case ml-2">Folio</span>
          </h2>
        </div>
      </div>

      {/* Bottom bio in Hero — visible on load */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full text-center z-10 pointer-events-none"
      >
        <p className="text-[8px] sm:text-[10px] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
          Creative Technologist Based in India<br />
          Building Digital Experiences Through Code, AI &amp; Motion.
        </p>
      </motion.div>
    </section>
  );
}
