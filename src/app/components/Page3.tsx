"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import BoxCarousel, {
  type BoxCarouselRef,
  type CarouselItem,
} from "@/components/fancy/carousel/box-carousel";
import BlurText, { type TextSegment } from "@/components/react-bits/BlurText";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim";
import useScreenSize from "@/hooks/use-screen-size";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ProjectData {
  id: string;
  normalText: string;
  italicText: string;
  technologies: string;
  src: string;
  alt: string;
  link?: string;
}

// Only 2 active portfolio projects
const PROJECTS: ProjectData[] = [
  {
    id: "1",
    normalText: "SENTINEL",
    italicText: "",
    technologies: "NEXT.JS 16 / TYPESCRIPT / TAILWIND / AI SDK",
    src: "/images/sentinel-terminal.webp",
    alt: "Sentinel",
    link: "https://sentinel-magnm.vercel.app/",
  },
  {
    id: "2",
    normalText: "ADARSH",
    italicText: "'26",
    technologies: "NEXT.JS 16 / THREE.JS / GLSL / GSAP",
    src: "/images/adarsh-26.webp",
    alt: "Adarsh'26 Portfolio",
    link: "https://adrz-2026.vercel.app/",
  },
];

// 4 faces of the 3D box cube mapped alternating between the 2 projects
const carouselItems: CarouselItem[] = [
  { id: "1", type: "image", src: PROJECTS[0].src, alt: PROJECTS[0].alt },
  { id: "2", type: "image", src: PROJECTS[1].src, alt: PROJECTS[1].alt },
  { id: "3", type: "image", src: PROJECTS[0].src, alt: PROJECTS[0].alt },
  { id: "4", type: "image", src: PROJECTS[1].src, alt: PROJECTS[1].alt },
];

interface SkillItem {
  id: string;
  text: string;
}

// 5 Skills: clean sans-serif typography, center aligned, no italics
const SKILLS: SkillItem[] = [
  { id: "web-design", text: "WEB DESIGN" },
  { id: "motion-design", text: "MOTION DESIGN" },
  { id: "video-editing", text: "VIDEO EDITING" },
  { id: "ui-ux-design", text: "UI/UX DESIGN" },
  { id: "web-development", text: "WEB DEVELOPMENT" },
];

interface Page3Props {
  scrollTriggerTrigger?: string;
}

const Page3 = forwardRef<HTMLElement, Page3Props>(function Page3(
  { scrollTriggerTrigger = "#main-scroll-container" },
  ref
) {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const leftInfoRef = useRef<HTMLDivElement>(null);
  const rightInfoRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<BoxCarouselRef>(null);
  const topStatementRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const projectsHeadingRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [skillsInView, setSkillsInView] = useState(false);

  const safeIndex =
    ((activeIndex % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
  const activeProject = PROJECTS[safeIndex];

  const DEFAULT_DIMENSIONS = { width: 470, height: 275 };

  // Responsive dimensions: default to desktop for consistent SSR/client hydration
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>(DEFAULT_DIMENSIONS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w < 380) {
        setDimensions({ width: 250, height: 148 });
      } else if (w < 640) {
        setDimensions({ width: 280, height: 165 });
      } else if (w < 768) {
        setDimensions({ width: 320, height: 188 });
      } else {
        // Proportional dynamic scaling: locks the exact 100% scale ratio across all zoom levels and resolutions
        const aspect = 470 / 275;
        // Optimal height is ~31% of viewport height, bounded by horizontal width allocation
        let targetHeight = Math.round(Math.min(h * 0.31, (w * 0.35) / aspect));
        targetHeight = Math.max(230, targetHeight);
        const targetWidth = Math.round(targetHeight * aspect);

        setDimensions({ width: targetWidth, height: targetHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { width, height } = dimensions;

  useGSAP(
    () => {
      const galleryWrapper = galleryWrapperRef.current;
      const leftInfo = leftInfoRef.current;
      const rightInfo = rightInfoRef.current;
      const topStatement = topStatementRef.current;
      const contentWrapper = contentWrapperRef.current;
      const projectsHeading = projectsHeadingRef.current;
      const section = sectionRef.current;
      if (!galleryWrapper) return;

      // Start initially hidden below the viewport tilted in 3D space
      gsap.set(galleryWrapper, {
        y: 140,
        rotateX: 22,
        rotateY: -32,
        rotateZ: -5,
        scale: 0.82,
        opacity: 0,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      });

      if (leftInfo) {
        gsap.set(leftInfo, { opacity: 0, y: 30, filter: "blur(8px)" });
      }
      if (rightInfo) {
        gsap.set(rightInfo, { opacity: 0, y: 30, filter: "blur(8px)" });
      }

      let hasEntered = false;
      const skillsContainer = skillsContainerRef.current;

      // Entrance choreography: 3D cube and info reveal when Page 3 arrives (progress 0.58+)
      ScrollTrigger.create({
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=600%",
        onUpdate: (self) => {
          // Trigger when Page 3 is active in the viewport (progress >= 0.58 and < 0.72)
          if (self.progress >= 0.58 && self.progress < 0.72) {
            galleryWrapper.style.pointerEvents = "auto";
            if (contentWrapper) contentWrapper.style.pointerEvents = "auto";
            if (skillsContainer) skillsContainer.style.pointerEvents = "none";
            if (!hasEntered) {
              hasEntered = true;
              gsap.to(galleryWrapper, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1,
                duration: 1.35,
                ease: "power2.out",
                overwrite: "auto",
              });

              if (leftInfo && rightInfo) {
                gsap.to([leftInfo, rightInfo], {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 1.1,
                  delay: 0.15,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
            }
          } else if (self.progress < 0.50) {
            // Reset when user scrolls back up toward Page 2
            if (hasEntered) {
              hasEntered = false;
              galleryWrapper.style.pointerEvents = "none";
              if (contentWrapper) contentWrapper.style.pointerEvents = "none";
              gsap.to(galleryWrapper, {
                y: 140,
                rotateX: 22,
                rotateY: -32,
                rotateZ: -5,
                scale: 0.82,
                opacity: 0,
                duration: 0.45,
                overwrite: "auto",
              });

              if (leftInfo && rightInfo) {
                gsap.to([leftInfo, rightInfo], {
                  opacity: 0,
                  y: 30,
                  filter: "blur(8px)",
                  duration: 0.4,
                  overwrite: "auto",
                });
              }
            }
          } else if (self.progress >= 0.72) {
            galleryWrapper.style.pointerEvents = "none";
            if (contentWrapper) contentWrapper.style.pointerEvents = "none";
          }

          // Trigger BlurText for the 5 skills ONLY after projects are 100% faded out (progress >= 0.83 and < 0.93)
          if (self.progress >= 0.83 && self.progress < 0.93) {
            setSkillsInView((prev) => (!prev ? true : prev));
          } else if (self.progress < 0.81) {
            setSkillsInView((prev) => (prev ? false : prev));
          } else if (self.progress >= 0.93) {
            // Disable pointer events during curtain reveal to Page 4
            setSkillsInView(false);
          }
        },
      });

      // Scrubbed exit transition into dark canvas (0.72 -> 0.80)
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerTrigger,
          start: "top top",
          end: "+=600%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Bottom "PROJECTS" heading fades out completely between 0.72 and 0.79
      const blurLetters = projectsHeading?.querySelectorAll(".blur-text-letter");
      if (blurLetters && blurLetters.length > 0) {
        exitTl.fromTo(
          blurLetters,
          {
            opacity: 1,
            filter: "blur(0px)",
            color: "#080808",
            y: 0,
          },
          {
            opacity: 0,
            filter: "blur(20px)",
            color: "#FFFFFF",
            y: -36,
            stagger: {
              each: 0.006,
              from: "start",
              ease: "power1.inOut",
            },
            ease: "power2.in",
            duration: 0.07,
          },
          0.72
        );
      }

      // Middle content (3D cube, left title, right tech info) wipes out cleanly by 0.79
      if (contentWrapper) {
        exitTl.fromTo(
          contentWrapper,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power1.in",
            duration: 0.07,
          },
          0.72
        );
        exitTl.set(contentWrapper, { pointerEvents: "none" }, 0.79);
      }

      // Top statement wipes out cleanly by 0.78
      if (topStatement) {
        exitTl.fromTo(
          topStatement,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power1.in",
            duration: 0.06,
          },
          0.72
        );
      }

      // Section background smoothly transitions from #ECECEC to dark (#080808) by 0.80
      if (section) {
        exitTl.fromTo(
          section,
          { backgroundColor: "#ECECEC" },
          {
            backgroundColor: "#080808",
            ease: "power1.inOut",
            duration: 0.08,
          },
          0.72
        );
      }

      // 5 Skills Center Overlay fades in ONLY at 0.82 (after previous elements are 100% invisible)
      if (skillsContainer) {
        exitTl.fromTo(
          skillsContainer,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.04,
          },
          0.82
        );
        exitTl.set(skillsContainer, { pointerEvents: "auto" }, 0.83);
        // Curtain reveal starts at 0.93 — disable pointer events on skills container
        exitTl.set(skillsContainer, { pointerEvents: "none" }, 0.93);
      }

      // Anchor timeline duration to 1.0
      exitTl.set({}, {}, 1.0);
    },
    { scope: sectionRef, dependencies: [scrollTriggerTrigger] }
  );

  return (
    <section
      ref={(node) => {
        (sectionRef as any).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as any).current = node;
      }}
      id="page-3"
      className="relative w-full h-full bg-[#ECECEC] text-[#080808] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Top Statement — positioned below header nav with clean editorial spacing */}
      <div 
        ref={topStatementRef}
        className="w-full pt-16 sm:pt-[4.5vh] md:pt-[5vh] px-4 text-center z-40 pointer-events-auto shrink-0"
      >
        <p className="text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase">
          I LOVE DESIGN, MOTION &amp; VIDEO<br />
          AND BRING IDEAS TO LIFE THROUGH VISUALS<br />
          /HERE&apos;S SOME OF MY WORK
        </p>
      </div>

      {/* Middle Section — centered with constrained vertical span to prevent over-stretching */}
      <div 
        ref={contentWrapperRef}
        className="relative z-20 w-full flex-1 flex flex-col items-center justify-center my-auto px-4 sm:px-6 md:px-10 lg:px-16 pointer-events-auto max-h-[62vh] overflow-visible"
      >
        <div className="w-full max-w-[1540px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          
          {/* Left Column: Project Name (Single line, mix of normal & italic font with blur text effect) */}
          <div
            ref={leftInfoRef}
            className="w-full md:w-auto md:flex-1 flex items-center justify-center md:justify-start order-1 md:order-1 py-1 pointer-events-auto"
            style={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, filter: "blur(10px)", y: 6 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -6 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="whitespace-nowrap"
              >
                {(() => {
                  const labelSegments = activeProject.italicText
                    ? [
                        {
                          text: activeProject.normalText + " ",
                          className: "font-sans font-[450]",
                        },
                        {
                          text: activeProject.italicText,
                          className: "font-display italic font-medium",
                        },
                      ]
                    : [
                        {
                          text: activeProject.normalText,
                          className: "font-sans font-[450]",
                        },
                      ];

                  return activeProject.link ? (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block cursor-pointer"
                    >
                      <LetterSwapPingPong
                        key={activeProject.id}
                        label={labelSegments}
                        reverse={false}
                        staggerFrom="first"
                        staggerDuration={0.02}
                        className="text-[clamp(1.4rem,2.4vw,3.8vh)] text-[#080808] uppercase tracking-tight whitespace-nowrap !flex-nowrap items-baseline cursor-pointer"
                      />
                    </a>
                  ) : (
                    <LetterSwapPingPong
                      key={activeProject.id}
                      label={labelSegments}
                      reverse={false}
                      staggerFrom="first"
                      staggerDuration={0.02}
                      className="text-[clamp(1.4rem,2.4vw,3.8vh)] text-[#080808] uppercase tracking-tight whitespace-nowrap !flex-nowrap items-baseline cursor-pointer"
                    />
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center Column: 3D Box Carousel */}
          <div
            ref={galleryWrapperRef}
            className="shrink-0 flex items-center justify-center order-2 md:order-2 my-3 sm:my-3 md:my-0 pointer-events-auto cursor-grab"
            style={{ opacity: 0 }}
          >
            {mounted ? (
              <BoxCarousel
                ref={carouselRef}
                items={carouselItems}
                width={width}
                height={height}
                direction="right"
                enableDrag
                autoPlay
                autoPlayInterval={4500}
                perspective={1000}
                onIndexChange={setActiveIndex}
              />
            ) : (
              <div
                style={{ width: DEFAULT_DIMENSIONS.width, height: DEFAULT_DIMENSIONS.height }}
                className="opacity-0 pointer-events-none"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Right Column: Technologies (Single line, digital monospace font) */}
          <div
            ref={rightInfoRef}
            className="w-full md:w-auto md:flex-1 flex items-center justify-center md:justify-end order-3 md:order-3"
            style={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, filter: "blur(10px)", y: 6 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -6 }}
                transition={{
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.04,
                }}
                className="whitespace-nowrap"
              >
                <span className="text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase whitespace-nowrap">
                  {activeProject.technologies}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Massive Project Heading at the bottom — clamped so it remains in exact proportion to the 3D Box */}
      <div 
        ref={projectsHeadingRef}
        className="w-full pb-4 sm:pb-[2.5vh] md:pb-[3vh] px-4 text-center pointer-events-none select-none z-10 shrink-0"
      >
        <h2 className="text-[clamp(3.5rem,13vw,16.5vh)] uppercase tracking-tight leading-none text-current whitespace-nowrap inline-flex items-baseline justify-center">
          <span className="font-sans font-[450] inline-flex">
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>P</span>
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>R</span>
          </span>
          <span className="font-display italic font-medium mx-[0.01em] inline-flex">
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>O</span>
          </span>
          <span className="font-sans font-[450] inline-flex">
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>J</span>
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>E</span>
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>C</span>
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>T</span>
            <span className="blur-text-letter inline-block" style={{ willChange: "transform, filter, opacity" }}>S</span>
          </span>
        </h2>
      </div>
      {/* 5 Skills Center Overlay on Dark Canvas */}
      <div
        ref={skillsContainerRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none"
      >
        <div
          className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-4 w-full max-w-5xl text-center ${
            skillsInView ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {SKILLS.map((skill, index) => (
            <div
              key={skill.id}
              className="flex items-center justify-center text-center w-full select-none"
            >
              <LetterSwapPingPong
                label={skill.text}
                reverse={false}
                staggerFrom="first"
                staggerDuration={0.02}
                trigger={skillsInView}
                initialDelay={index * 0.08}
                className="font-sans font-[450] text-[clamp(1.85rem,4vw,5.8vh)] leading-none text-white uppercase tracking-tight cursor-pointer py-0.5 hover:text-white/95 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Bottom description in the same style as Page 2 and Hero bottom text */}
        <div
          className={`absolute bottom-[3.5vh] left-1/2 -translate-x-1/2 w-full text-center px-4 z-40 ${
            skillsInView ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {/* Mobile 3-line balanced layout */}
          <p className="block sm:hidden text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
            A mix of creative and technical skills<br />
            I use to turn ideas into engaging visuals,<br />
            interactive experiences, and digital products.
          </p>

          {/* Tablet/Desktop 2-line layout */}
          <p className="hidden sm:block text-[clamp(8px,0.85vw,1.35vh)] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
            A mix of creative and technical skills I use to turn ideas into<br />
            engaging visuals, interactive experiences, and digital products.
          </p>
        </div>
      </div>
    </section>
  );
});

export default Page3;
