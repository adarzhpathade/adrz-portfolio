"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ReflectShader from "@/components/originkit/ui/reflect-shader";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";
import BlurText from "@/components/react-bits/BlurText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rectangleRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const bottomHeadingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const rectangle = rectangleRef.current;
    const heading = headingRef.current;
    const about = aboutRef.current;
    const contact = contactRef.current;
    const centerText = centerTextRef.current;
    const bottomHeading = bottomHeadingRef.current;

    if (!section || !rectangle || !heading || !about || !contact || !centerText || !bottomHeading) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    });

    // All animations start at position 0 (concurrent, driven by scroll)

    // 1. Dark rectangle scrolls up and out (ONLY the background)
    tl.to(rectangle, {
      yPercent: -100,
      ease: "none",
    }, 0);

    // 2. Center subtitle fades out
    tl.to(centerText, {
      opacity: 0,
      ease: "power2.in",
    }, 0);

    // 3. Bottom "DESIGN — Folio" fades out with blur
    tl.to(bottomHeading, {
      opacity: 0,
      filter: "blur(12px)",
      ease: "power2.in",
    }, 0);


    // 5. Nav links fade out instantly at the start of scroll
    tl.to([about, contact], {
      opacity: 0,
      duration: 0.05,
      ease: "power2.in",
    }, 0);

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="hero" className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-black text-white">
      {/* WebGL background — fixed so it persists behind all sections */}
      <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden">
        <ReflectShader speed={150} hover={0} zoom={150} style={{ minWidth: "100%", minHeight: "100%", width: "100%", height: "100%" }} />
      </div>

      {/* Dark rectangle — ONLY the background, no children. Scrolls out independently. */}
      <div ref={rectangleRef} className="absolute top-0 left-0 z-10 w-full h-[80vh] bg-brand-dark pointer-events-none" />

      {/* Text content overlay — stays in place, animates independently */}
      <div className="relative z-20 mix-blend-difference w-full h-[80vh] flex flex-col justify-between pt-0 pb-4 pointer-events-none">
        <div className="w-full relative flex flex-col items-center pt-4 md:pt-0">
          <div ref={headingRef} className="z-10 text-center flex items-center justify-center">
            <h2 className="text-6xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-[380] tracking-normal uppercase leading-none flex items-center justify-center text-white">
              <BlurText 
                text={[
                  { text: "ADARSH" },
                  { text: "'25", className: "font-display italic font-normal normal-case" }
                ]} 
                delay={30}
                stepDuration={0.25}
                animateBy="letters" 
                direction="top" 
                className="inline-flex" 
              />
            </h2>
          </div>
          
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
        
        <div ref={centerTextRef} className="w-full text-center px-4">
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

        <div ref={bottomHeadingRef} className="w-full flex justify-center">
          <h1 className="text-lg sm:text-2xl lg:text-[2rem] font-normal tracking-tight uppercase leading-none flex items-center justify-center">
            <BlurText 
              text={[
                { text: "DESIGN — " },
                { text: "Folio", className: "font-display italic font-normal normal-case" }
              ]} 
              delay={30}
              stepDuration={0.25}
              animateBy="letters" 
              direction="bottom" 
              className="inline-flex" 
            />
          </h1>
        </div>
      </div>

      {/* "Creative Technologist" text stays — will persist into Section 2 */}
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

