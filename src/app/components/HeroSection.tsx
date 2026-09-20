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

const REVEAL_LINES = [
  "I DESIGN, BUILD & EXPERIMENT",
  "WITH CODE, AI & MOTION. TURNING IDEAS",
  "INTO DIGITAL EXPERIENCES & VISUAL STORIES."
];

interface HeroSectionProps {
  scrollTriggerTrigger?: string;
  isAboutOpen?: boolean;
  onToggleAbout?: () => void;
  isReady?: boolean;
}

export default function HeroSection({ 
  scrollTriggerTrigger = "#main-scroll-container",
  isAboutOpen = false,
  onToggleAbout,
  isReady = true,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rectangleRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLDivElement>(null);
  const bottomHeadingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const rectangle = rectangleRef.current;
    const about = aboutRef.current;
    const contact = contactRef.current;
    const centerText = centerTextRef.current;
    const heroTitle = heroTitleRef.current;
    const revealText = revealTextRef.current;
    const bottomHeading = bottomHeadingRef.current;

    if (!section || !rectangle || !about || !contact || !centerText || !heroTitle || !revealText || !bottomHeading) return;

    const isMobile = window.innerWidth < 768;
    // Master scroll timeline synchronized with GlobalNav, Page2, and Page3
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=600%", 
        scrub: isMobile ? 0.35 : 1,
        invalidateOnRefresh: true,
      },
    });

    // --- PHASE 1: Hero Reveal (0.00 -> 0.16) ---
    // 1. Dark rectangle scrolls up and out (revealing the shader background)
    tl.to(rectangle, {
      yPercent: -100,
      ease: "none",
      duration: 0.16,
    }, 0);

    // 2. Center subtitle fades out quickly
    tl.to(centerText, {
      opacity: 0,
      ease: "power2.in",
      duration: 0.07,
    }, 0);

    // 3. Initial hero side links fade out quickly on scroll
    tl.to([about, contact], {
      opacity: 0,
      duration: 0.03,
      ease: "power2.in",
    }, 0);

    // 4. 3-line text words reveal with blur focus and subtle y translation
    const words = revealText.querySelectorAll<HTMLElement>(".reveal-word");
    tl.fromTo(
      words,
      {
        opacity: 0,
        filter: "blur(12px)",
        y: 20,
      },
      {
        opacity: 0.55,
        filter: "blur(0px)",
        y: 0,
        stagger: {
          amount: 0.06,
          ease: "power1.inOut",
        },
        ease: "power2.out",
        duration: 0.05,
      },
      0.015
    );

    // 5. Bottom "DESIGN — Folio" fades out promptly on scroll
    tl.to(bottomHeading, {
      opacity: 0,
      filter: "blur(14px)",
      ease: "power1.out",
      duration: 0.03,
    }, 0);

    // --- PHASE 1.5: Hold Hero Revealed State (0.14 -> 0.20) ---

    // --- PHASE 2: Transition to Page 2 (0.20 -> 0.34) ---
    // 6. 3-line text fades out and blurs upwards
    tl.to(revealText, {
      opacity: 0,
      filter: "blur(12px)",
      y: -30,
      ease: "power2.in",
      duration: 0.05,
    }, 0.20);

    // 6b. Hero main title fades out at 0.20 as GlobalNav smoothly scales the persistent logo into position
    tl.to(heroTitle, {
      opacity: 0,
      ease: "power1.in",
      duration: 0.025,
    }, 0.20);

    // 7. Hero section physically slides up and out of the viewport,
    // revealing the light-colored Page 2 sitting underneath
    tl.to(section, {
      yPercent: -100,
      ease: "power1.inOut",
      duration: 0.14,
    }, 0.20);

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
          {/* Main Hero Heading — actively reacts with animated ReflectShader background via mix-blend-difference */}
          <div ref={heroTitleRef} id="hero-main-title" className="z-10 text-center flex items-center justify-center select-none pointer-events-auto px-2">
            <h1 className="text-[clamp(2.4rem,11.5vw,17vh)] sm:text-[clamp(3.5rem,12vw,17vh)] font-[380] tracking-normal uppercase leading-none flex items-center justify-center text-white">
              <span className="inline-flex">
                <span>ADARSH</span>
                <span className="font-display italic font-normal normal-case ml-[0.05em]">
                  &apos;26
                </span>
              </span>
            </h1>
          </div>
          
          {/* Initial Hero links: (About) & (Contact) — visible on load, fade out on scroll */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex items-center gap-8 mt-4 md:mt-0 md:absolute md:inset-0 md:w-full md:px-8 lg:px-16 md:justify-between pointer-events-none z-20"
          >
            <div ref={aboutRef} className="pointer-events-auto">
              <LetterSwapPingPong
                label={isAboutOpen ? "(Close)" : "(About)"}
                staggerFrom="first"
                reverse={false}
                className="font-mono text-[clamp(9px,0.85vw,1.3vh)] tracking-wider uppercase cursor-pointer transition-opacity"
                onClick={onToggleAbout}
              />
            </div>
            <div ref={contactRef} className="pointer-events-auto">
              <a href="mailto:adarshpathade79@gmail.com" className="inline-block text-current">
                <LetterSwapPingPong
                  label="(Contact)"
                  staggerFrom="first"
                  reverse={false}
                  className="font-mono text-[clamp(9px,0.85vw,1.3vh)] tracking-wider uppercase cursor-pointer transition-opacity"
                />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Center Text — visible on load, fades out on scroll */}
        <div ref={centerTextRef} className="w-full text-center px-4 absolute top-[55%] -translate-y-1/2 z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p className="text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
              MIXING CODE, AI, MOTION, &amp; VISUALS
            </p>
          </motion.div>
        </div>

        {/* 3-Line Text — hidden by default, revealed on scroll, blurs out on transition to Page 2 */}
        <div ref={revealTextRef} className="w-full text-center px-4 flex flex-col items-center justify-center z-20 absolute bottom-[7vh] md:bottom-[8vh] pointer-events-none">
          {REVEAL_LINES.map((line, lineIndex) => (
            <p key={lineIndex} className="text-[clamp(0.95rem,2.2vw,3.2vh)] sm:text-[clamp(1.1rem,2.4vw,3.6vh)] font-[450] tracking-wide uppercase text-white leading-[1.25] sm:leading-[1.2] flex flex-wrap justify-center gap-x-[0.35em] gap-y-0 px-2 max-w-[95vw]">
              {line.split(/\s+/).map((word, wordIndex) => (
                <span 
                  key={`${lineIndex}-${wordIndex}`} 
                  className="reveal-word inline-block opacity-0"
                  style={{ 
                    opacity: 0, 
                    filter: "blur(12px)",
                    willChange: "filter, opacity, transform",
                    transform: "translateZ(0)",
                  }}
                >
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Bottom "DESIGN — Folio" text */}
        <div ref={bottomHeadingRef} className="w-full flex justify-center pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            <h2 className="text-[clamp(1.1rem,2vw,3vh)] font-normal tracking-tight uppercase leading-none flex items-center justify-center">
              <span>DESIGN — </span>
              <span className="font-display italic font-normal normal-case ml-2">Folio</span>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Bottom bio in Hero — visible on load */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="absolute bottom-[1.5vh] left-1/2 -translate-x-1/2 w-full text-center z-10 pointer-events-none px-4"
      >
        <p className="text-[clamp(9px,2.4vw,12px)] sm:text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
          Creative Technologist Based in India<br />
          Building Digital Experiences Through Code, AI &amp; Motion.
        </p>
      </motion.div>
    </section>
  );
}
