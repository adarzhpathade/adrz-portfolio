"use client";

import { useEffect, useRef, useState } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  type SpringOptions 
} from "framer-motion";

interface AboutCardProps {
  isOpen: boolean;
  onClose: () => void;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function AboutCard({ isOpen, onClose }: AboutCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // TiltedCard Spring Motion Values
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const zElevate = useSpring(0, springValues);

  // Track screen size for responsive placement and animation
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // TiltedCard Mouse Interaction Handlers
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -10; // Balanced, refined 3D tilt
    const rotationY = (offsetX / (rect.width / 2)) * 10;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    if (isMobile) return;
    scale.set(1.02);
    zElevate.set(38);
  }

  function handleMouseLeave() {
    if (isMobile) return;
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    zElevate.set(0);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: Ambient dark blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-[6px] cursor-pointer"
            aria-label="Close about modal"
          />

          {/* Positioning Container: Docked to the right with margin for clean tilt and slide */}
          <div 
            className="fixed inset-0 z-[70] pointer-events-none flex items-stretch justify-end p-3 sm:p-5 md:p-8"
          >
            {/* Outer Slide Wrapper: Slides smoothly and slowly from the right side */}
            <motion.div
              initial={{ 
                opacity: 0, 
                x: isMobile ? 120 : 70 
              }}
              animate={{ 
                opacity: 1, 
                x: 0 
              }}
              exit={{ 
                opacity: 0, 
                x: isMobile ? 120 : 70 
              }}
              transition={{
                duration: isMobile ? 0.65 : 0.48,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-auto [perspective:1200px] w-full h-full max-w-[88vw] sm:max-w-[390px] md:max-w-[400px]"
            >
              {/* Inner Tilting Card: Unflattened 3D context with visible overflow on desktop */}
              <motion.div
                ref={cardRef}
                style={{
                  rotateX: isMobile ? 0 : rotateX,
                  rotateY: isMobile ? 0 : rotateY,
                  scale: isMobile ? 1 : scale,
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-full bg-[#090909] shadow-[0_20px_70px_rgba(0,0,0,0.95)] rounded-[12px] p-6 sm:p-7 md:p-8 text-white select-none overflow-y-auto md:overflow-visible flex flex-col justify-between will-change-transform [transform-style:preserve-3d] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20"
              >
                <div className="[transform-style:preserve-3d]">
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6 sm:mb-8 [transform:translateZ(12px)]">
                    {/* Increased size and 100% white opacity for ABOUT */}
                    <span className="font-mono text-xs sm:text-sm tracking-wider uppercase text-white font-medium">
                      ABOUT
                    </span>
                    <button
                      onClick={onClose}
                      className="font-mono text-[10px] sm:text-xs tracking-wider uppercase text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Close (ESC)"
                    >
                      (CLOSE)
                    </button>
                  </div>

                  {/* Main Bio Text: Dynamic hover elevation with highlighted key terms */}
                  <motion.div 
                    style={{ z: zElevate }}
                    className="space-y-6 will-change-transform [transform-style:preserve-3d]"
                  >
                    <p className="font-sans text-[13px] sm:text-[14px] md:text-[14.5px] font-[450] leading-relaxed tracking-tight uppercase text-white/60">
                      <span className="text-white font-medium drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
                        ADARSH PATHADE
                      </span>{" "}
                      IS A{" "}
                      <span className="text-white font-medium drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
                        DESIGNER
                      </span>{" "}
                      AND{" "}
                      <span className="text-white font-medium drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">
                        DEVELOPER
                      </span>{" "}
                      FOCUSED ON DIGITAL EXPERIENCES, MOTION, AND CREATIVE DEVELOPMENT.
                    </p>
                    <p className="font-sans text-[13px] sm:text-[14px] md:text-[14.5px] font-[450] leading-relaxed tracking-tight uppercase text-white/55">
                      WITH A STRONG EYE FOR VISUAL DESIGN AND INTERACTION, HE BUILDS MODERN WEBSITES THAT BLEND DESIGN WITH CODE. HIS WORK FOCUSES ON CLEAN INTERFACES, SMOOTH ANIMATIONS, AND IMMERSIVE DIGITAL EXPERIENCES.
                    </p>
                  </motion.div>
                </div>

                {/* Lower Meta Sections: Layered 3D hierarchy */}
                <div className="mt-8 sm:mt-12 space-y-6 pt-6 border-t border-white/[0.08] [transform-style:preserve-3d]">
                  {/* EDUCATION Section */}
                  <div className="[transform-style:preserve-3d]">
                    <h4 className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-white/40 mb-2.5 [transform:translateZ(12px)]">
                      EDUCATION
                    </h4>
                    <div className="space-y-1 font-mono text-[11px] sm:text-xs uppercase text-white tracking-normal leading-relaxed [transform-style:preserve-3d]">
                      {/* College Name: Dynamic forward elevation on hover */}
                      <motion.p 
                        style={{ z: zElevate }}
                        className="font-medium text-white/95 will-change-transform drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                      >
                        ACROPOLIS INSTITUTE OF TECHNOLOGY &amp; RESEARCH
                      </motion.p>
                      <p className="text-white/60 [transform:translateZ(16px)]">
                        24 – PRESENT
                      </p>
                      <p className="text-white/80 [transform:translateZ(16px)]">
                        B.TECH — COMPUTER SCIENCE &amp; INFORMATION TECHNOLOGY
                      </p>
                    </div>
                  </div>

                  {/* SKILLS Section */}
                  <div className="[transform-style:preserve-3d]">
                    <h4 className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-white/40 mb-2.5 [transform:translateZ(12px)]">
                      SKILLS
                    </h4>
                    {/* Skills Items: Dynamic forward elevation on hover */}
                    <motion.div 
                      style={{ z: zElevate }}
                      className="space-y-1.5 font-mono text-[11px] sm:text-xs uppercase text-white/90 tracking-normal leading-relaxed will-change-transform drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
                    >
                      <p>REACT / NEXT.JS</p>
                      <p>GSAP / FRAMER MOTION</p>
                      <p>After Effects</p>
                      <p>Premiere Pro</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
