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
    src: "/images/sentinel-terminal-v2.png",
    alt: "Sentinel",
    link: "https://sentinel-magnm.vercel.app/",
  },
  {
    id: "2",
    normalText: "ADARSH",
    italicText: "'26",
    technologies: "NEXT.JS 16 / THREE.JS / GLSL / GSAP",
    src: "/images/adarsh-26-v4.png",
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
      if (w < 380) {
        setDimensions({ width: 250, height: 148 });
      } else if (w < 640) {
        setDimensions({ width: 280, height: 165 });
      } else if (w < 768) {
        setDimensions({ width: 310, height: 180 });
      } else if (w < 1024) {
        setDimensions({ width: 380, height: 220 });
      } else if (w < 1440) {
        setDimensions({ width: 430, height: 250 });
      } else {
        setDimensions({ width: 470, height: 275 });
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

      // Entrance choreography: 3D cube and info reveal when Page 3 arrives (progress 0.70)
      ScrollTrigger.create({
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=480%",
        onUpdate: (self) => {
          // Trigger when Page 3 is active in the viewport (progress >= 0.66)
          if (self.progress >= 0.66 && self.progress < 0.90) {
            galleryWrapper.style.pointerEvents = "auto";
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
          } else if (self.progress < 0.60) {
            // Reset when user scrolls back up toward Page 2
            if (hasEntered) {
              hasEntered = false;
              galleryWrapper.style.pointerEvents = "none";
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
          } else if (self.progress >= 0.90) {
            galleryWrapper.style.pointerEvents = "none";
          }

          // Trigger BlurText for the 5 skills when dark canvas arrives (progress >= 0.92)
          if (self.progress >= 0.92) {
            setSkillsInView((prev) => (!prev ? true : prev));
          } else if (self.progress < 0.88) {
            setSkillsInView((prev) => (prev ? false : prev));
          }
        },
      });

      // Scrubbed exit transition into dark canvas (0.83 -> 0.98)
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerTrigger,
          start: "top top",
          end: "+=480%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Bottom "PROJECTS" heading fades out with letter-by-letter React Bits BlurText effect
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
              each: 0.008,
              from: "start",
              ease: "power1.inOut",
            },
            ease: "power2.inOut",
            duration: 0.11,
          },
          0.83
        );
      }

      // Middle content (3D cube, left title, right tech info) wipes out simply through opacity
      if (contentWrapper) {
        exitTl.fromTo(
          contentWrapper,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.12,
          },
          0.83
        );
        exitTl.set(contentWrapper, { pointerEvents: "none" }, 0.95);
      }

      // Top statement wipes out simply through opacity
      if (topStatement) {
        exitTl.fromTo(
          topStatement,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.12,
          },
          0.83
        );
      }

      // Section background smoothly transitions from #ECECEC to dark (#080808)
      if (section) {
        exitTl.fromTo(
          section,
          { backgroundColor: "#ECECEC" },
          {
            backgroundColor: "#080808",
            ease: "power1.inOut",
            duration: 0.15,
          },
          0.83
        );
      }

      // 5 Skills Center Overlay fades in as the content fades out and background turns dark
      if (skillsContainer) {
        exitTl.fromTo(
          skillsContainer,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.06,
          },
          0.92
        );
        exitTl.set(skillsContainer, { pointerEvents: "auto" }, 0.93);
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
        className="w-full pt-20 sm:pt-14 md:pt-16 px-4 text-center z-40 pointer-events-auto shrink-0"
      >
        <p className="text-[8px] sm:text-[10px] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase">
          I LOVE DESIGN, MOTION &amp; VIDEO<br />
          AND BRING IDEAS TO LIFE THROUGH VISUALS<br />
          /HERE&apos;S SOME OF MY WORK
        </p>
      </div>

      {/* Middle Section — equidistant between top statement and bottom heading */}
      <div 
        ref={contentWrapperRef}
        className="relative z-20 w-full flex-1 flex flex-col items-center justify-center my-auto px-4 sm:px-6 md:px-10 lg:px-16 pointer-events-auto"
      >
        <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          
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
                        className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-[#080808] uppercase tracking-tight whitespace-nowrap !flex-nowrap items-baseline cursor-pointer"
                      />
                    </a>
                  ) : (
                    <LetterSwapPingPong
                      key={activeProject.id}
                      label={labelSegments}
                      reverse={false}
                      staggerFrom="first"
                      staggerDuration={0.02}
                      className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-[#080808] uppercase tracking-tight whitespace-nowrap !flex-nowrap items-baseline cursor-pointer"
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
                key={`${width}-${height}`}
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
                <span className="text-[8px] sm:text-[10px] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase whitespace-nowrap">
                  {activeProject.technologies}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Massive Project Heading at the bottom — mixed fonts (Neue Montreal sans with Eiko italic O) */}
      <div 
        ref={projectsHeadingRef}
        className="w-full pb-6 sm:pb-6 md:pb-8 px-4 text-center pointer-events-none select-none z-10 shrink-0"
      >
        <h2 className="text-[15vw] sm:text-7xl md:text-[11vw] lg:text-[12.5vw] xl:text-[13.5vw] uppercase tracking-tight leading-none text-current whitespace-nowrap inline-flex items-baseline justify-center">
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
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 ${
          skillsInView ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center gap-2.5 sm:gap-3 md:gap-4 px-4 w-full max-w-5xl text-center ${
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
                className="font-sans font-[450] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-tight cursor-pointer py-0.5 hover:text-white/95 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Bottom description in the same style as Page 2 and Hero bottom text */}
        <div
          className={`absolute bottom-8 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full text-center px-4 z-40 ${
            skillsInView ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {/* Mobile 3-line balanced layout */}
          <p className="block sm:hidden text-[8px] sm:text-[10px] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
            A mix of creative and technical skills<br />
            I use to turn ideas into engaging visuals,<br />
            interactive experiences, and digital products.
          </p>

          {/* Tablet/Desktop 2-line layout */}
          <p className="hidden sm:block text-[8px] sm:text-[10px] font-mono tracking-normal text-text-light/70 leading-tight uppercase">
            A mix of creative and technical skills I use to turn ideas into<br />
            engaging visuals, interactive experiences, and digital products.
          </p>
        </div>
      </div>
    </section>
  );
});

export default Page3;
