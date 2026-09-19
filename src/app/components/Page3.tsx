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
import BlurText from "@/components/react-bits/BlurText";
import CenterUnderline from "@/components/fancy/text/underline-center";
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
    italicText: "TERMINAL",
    technologies: "NEXT.JS 16 / TYPESCRIPT / TAILWIND / AI SDK",
    src: "/images/sentinel-terminal-v2.png",
    alt: "Sentinel Terminal",
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

  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex =
    ((activeIndex % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
  const activeProject = PROJECTS[safeIndex];

  // Responsive dimensions: scaled down by 10% (470x275 on large desktop, 430x250 on laptops, 280x165 on mobile)
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w < 380) return { width: 250, height: 148 };
      if (w < 640) return { width: 280, height: 165 };
      if (w < 768) return { width: 310, height: 180 };
      if (w < 1024) return { width: 380, height: 220 };
      if (w < 1440) return { width: 430, height: 250 };
      return { width: 470, height: 275 };
    }
    return { width: 470, height: 275 };
  });

  useEffect(() => {
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

      ScrollTrigger.create({
        trigger: scrollTriggerTrigger,
        start: "top top",
        end: "+=360%",
        onUpdate: (self) => {
          // Trigger ONLY after Page 3 has 100% fully arrived in the viewport
          if (self.progress >= 0.93) {
            if (!hasEntered) {
              hasEntered = true;
              galleryWrapper.style.pointerEvents = "auto";
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
          } else if (self.progress < 0.85) {
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
          }
        },
      });
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
      <div className="w-full pt-20 sm:pt-14 md:pt-16 px-4 text-center z-40 pointer-events-auto shrink-0">
        <p className="text-[11px] sm:text-[11px] md:text-xs font-mono tracking-wider text-[#080808]/80 leading-relaxed uppercase">
          I LOVE DESIGN, MOTION &amp; VIDEO<br />
          AND BRING IDEAS TO LIFE THROUGH VISUALS<br />
          /HERE&apos;S SOME OF MY WORK
        </p>
      </div>

      {/* Middle Section — equidistant between top statement and bottom heading */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center my-auto px-4 sm:px-6 md:px-10 lg:px-16 pointer-events-auto">
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
                {activeProject.link ? (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block cursor-pointer"
                  >
                    <CenterUnderline
                      underlineHeightRatio={0.035}
                      underlinePaddingRatio={0.06}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-[#080808] uppercase tracking-tight whitespace-nowrap !flex-nowrap items-baseline cursor-pointer"
                    >
                      <BlurText
                        key={activeProject.id}
                        text={[
                          {
                            text: activeProject.normalText,
                            className: "font-sans font-[450]",
                          },
                          {
                            text: activeProject.italicText,
                            className: "font-display italic font-medium",
                          },
                        ]}
                        delay={45}
                        animateBy="words"
                        direction="top"
                        stepDuration={0.25}
                        threshold={0}
                        rootMargin="200px"
                        animationFrom={{ filter: "blur(12px)", opacity: 0, y: 10 }}
                        animationTo={[
                          { filter: "blur(4px)", opacity: 0.6, y: -2 },
                          { filter: "blur(0px)", opacity: 1, y: 0 },
                        ]}
                        className="inline-flex !flex-nowrap items-baseline"
                      />
                    </CenterUnderline>
                  </a>
                ) : (
                  <CenterUnderline
                    underlineHeightRatio={0.035}
                    underlinePaddingRatio={0.06}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-[#080808] uppercase tracking-tight whitespace-nowrap !flex-nowrap items-baseline cursor-pointer"
                  >
                    <BlurText
                      key={activeProject.id}
                      text={[
                        {
                          text: activeProject.normalText,
                          className: "font-sans font-[450]",
                        },
                        {
                          text: activeProject.italicText,
                          className: "font-display italic font-medium",
                        },
                      ]}
                      delay={45}
                      animateBy="words"
                      direction="top"
                      stepDuration={0.25}
                      threshold={0}
                      rootMargin="200px"
                      animationFrom={{ filter: "blur(12px)", opacity: 0, y: 10 }}
                      animationTo={[
                        { filter: "blur(4px)", opacity: 0.6, y: -2 },
                        { filter: "blur(0px)", opacity: 1, y: 0 },
                      ]}
                      className="inline-flex !flex-nowrap items-baseline"
                    />
                  </CenterUnderline>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center Column: 3D Box Carousel */}
          <div
            ref={galleryWrapperRef}
            className="shrink-0 flex items-center justify-center order-2 md:order-2 my-3 sm:my-3 md:my-0"
            style={{ opacity: 0 }}
          >
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
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#080808]/75 leading-normal uppercase whitespace-nowrap">
                  {activeProject.technologies}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Massive Project Heading at the bottom — mixed fonts (Neue Montreal sans with Eiko italic O) */}
      <div className="w-full pb-6 sm:pb-6 md:pb-8 px-4 text-center pointer-events-none select-none z-10 shrink-0">
        <h2 className="text-[15vw] sm:text-7xl md:text-[11vw] lg:text-[12.5vw] xl:text-[13.5vw] uppercase tracking-tight leading-none text-[#080808] whitespace-nowrap inline-flex items-baseline justify-center">
          <span className="font-sans font-[450]">PR</span>
          <span className="font-display italic font-medium mx-[0.01em]">O</span>
          <span className="font-sans font-[450]">JECTS</span>
        </h2>
      </div>
    </section>
  );
});

export default Page3;
