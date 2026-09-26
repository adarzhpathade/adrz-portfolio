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
  isDark?: boolean;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function AboutCard({ isOpen, onClose, isDark = true }: AboutCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // TiltedCard Spring Motion Values
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const zElevate = useSpring(0, springValues);

  // Theme-aware design tokens
  const t = {
    backdrop: isDark ? "bg-black/20" : "bg-black/10",
    cardBg: isDark 
      ? "bg-[#090909] text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] border-white/[0.08]" 
      : "bg-[#F7F7F7] text-[#080808] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-black/[0.08]",
    border: isDark ? "border-white/[0.08]" : "border-black/[0.08]",
    title: isDark ? "text-white" : "text-[#080808]",
    closeBtn: isDark 
      ? "text-white/70 hover:text-white" 
      : "text-[#080808]/70 hover:text-[#080808]",
    highlightedTerm: isDark 
      ? "text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)] font-medium" 
      : "text-[#080808] drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-medium",
    body1: isDark ? "text-white/60" : "text-[#080808]/65",
    body2: isDark ? "text-white/55" : "text-[#080808]/55",
    sectionLabel: isDark ? "text-white/40" : "text-[#080808]/40",
    collegeName: isDark 
      ? "text-white/95 drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]" 
      : "text-[#080808] drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]",
    eduSub1: isDark ? "text-white/60" : "text-[#080808]/60",
    eduSub2: isDark ? "text-white/80" : "text-[#080808]/80",
    skills: isDark 
      ? "text-white/90 drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]" 
      : "text-[#080808]/90 drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]",
  };

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
          {/* Backdrop: Subtle transparent dismiss overlay with minimal blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className={`fixed inset-0 z-[60] cursor-pointer backdrop-blur-[1px] transition-colors duration-300 ${t.backdrop}`}
            aria-label="Close about modal"
          />

          {/* Positioning Container: Centered on mobile, docked to right on desktop, full height */}
          <div 
            className="fixed inset-0 z-[70] pointer-events-none flex items-stretch justify-center md:justify-end p-3 sm:p-4 md:p-8"
          >
            {/* Outer Slide Wrapper: Full height, slides from right off-screen (100vw) to center on mobile */}
            <motion.div
              initial={{ 
                opacity: 0, 
                x: isMobile ? "100vw" : 70 
              }}
              animate={{ 
                opacity: 1, 
                x: 0 
              }}
              exit={{ 
                opacity: 0, 
                x: isMobile ? "100vw" : 70 
              }}
              transition={{
                duration: isMobile ? 0.52 : 0.48,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-auto [perspective:1200px] w-full max-w-[92vw] sm:max-w-[390px] md:max-w-[400px] h-full flex flex-col"
            >
              {/* Inner Tilting Card: Full height with flex justify-between */}
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
                className={`relative w-full h-full border rounded-[14px] md:rounded-[12px] p-6 sm:p-7 md:p-8 select-none overflow-y-auto md:overflow-visible flex flex-col justify-between will-change-transform [transform-style:preserve-3d] transition-colors duration-300 ${t.cardBg}`}
              >
                <div className="[transform-style:preserve-3d]">
                  {/* Top Header */}
                  <div className={`flex items-center justify-between pb-4 border-b mb-6 sm:mb-8 [transform:translateZ(12px)] ${t.border}`}>
                    <span className={`font-mono text-xs sm:text-sm tracking-wider uppercase font-medium ${t.title}`}>
                      ABOUT
                    </span>
                    <button
                      onClick={onClose}
                      className={`font-mono text-[10px] sm:text-xs tracking-wider uppercase transition-colors cursor-pointer ${t.closeBtn}`}
                      title="Close (ESC)"
                    >
                      (CLOSE)
                    </button>
                  </div>

                  {/* Main Bio Text: Dynamic hover elevation with highlighted key terms */}
                  <motion.div 
                    style={{ z: zElevate }}
                    className="space-y-4 will-change-transform [transform-style:preserve-3d]"
                  >
                    <p className={`font-sans text-[11px] sm:text-[12px] md:text-[12.5px] font-[450] leading-relaxed tracking-tight uppercase ${t.body1}`}>
                      <span className={t.highlightedTerm}>
                        ADARSH PATHADE
                      </span>{" "}
                      IS A{" "}
                      <span className={t.highlightedTerm}>
                        DESIGNER
                      </span>{" "}
                      AND{" "}
                      <span className={t.highlightedTerm}>
                        DEVELOPER
                      </span>{" "}
                      FOCUSED ON DIGITAL EXPERIENCES, MOTION, AND CREATIVE DEVELOPMENT.
                    </p>
                    <p className={`font-sans text-[11px] sm:text-[12px] md:text-[12.5px] font-[450] leading-relaxed tracking-tight uppercase ${t.body2}`}>
                      WITH A STRONG EYE FOR VISUAL DESIGN AND INTERACTION, HE BUILDS MODERN WEBSITES THAT BLEND DESIGN WITH CODE. HIS WORK FOCUSES ON CLEAN INTERFACES, SMOOTH ANIMATIONS, AND IMMERSIVE DIGITAL EXPERIENCES.
                    </p>
                  </motion.div>
                </div>

                {/* Lower Meta Sections: Layered 3D hierarchy */}
                <div className={`mt-6 sm:mt-8 space-y-5 pt-5 border-t [transform-style:preserve-3d] ${t.border}`}>
                  {/* EDUCATION Section */}
                  <div className="[transform-style:preserve-3d]">
                    <h4 className={`font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-2.5 [transform:translateZ(12px)] ${t.sectionLabel}`}>
                      EDUCATION
                    </h4>
                    <div className="space-y-1 font-mono text-[11px] sm:text-xs uppercase tracking-normal leading-relaxed [transform-style:preserve-3d]">
                      {/* College Name: Dynamic forward elevation on hover */}
                      <motion.p 
                        style={{ z: zElevate }}
                        className={`font-medium will-change-transform ${t.collegeName}`}
                      >
                        ACROPOLIS INSTITUTE OF TECHNOLOGY &amp; RESEARCH
                      </motion.p>
                      <p className={`[transform:translateZ(16px)] ${t.eduSub1}`}>
                        24 – PRESENT
                      </p>
                      <p className={`[transform:translateZ(16px)] ${t.eduSub2}`}>
                        B.TECH — COMPUTER SCIENCE &amp; INFORMATION TECHNOLOGY
                      </p>
                    </div>
                  </div>

                  {/* SKILLS Section */}
                  <div className="[transform-style:preserve-3d]">
                    <h4 className={`font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-2.5 [transform:translateZ(12px)] ${t.sectionLabel}`}>
                      SKILLS
                    </h4>
                    {/* Skills Items: Dynamic forward elevation on hover */}
                    <motion.div 
                      style={{ z: zElevate }}
                      className={`space-y-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-normal leading-relaxed will-change-transform ${t.skills}`}
                    >
                      <p>REACT / NEXT.JS</p>
                      <p>GSAP / FRAMER MOTION</p>
                      <p>After Effects</p>
                      <p>Premiere Pro</p>
                    </motion.div>
                  </div>

                  {/* RESUME Section */}
                  <div className="[transform-style:preserve-3d]">
                    <h4 className={`font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-2.5 [transform:translateZ(12px)] ${t.sectionLabel}`}>
                      RESUME
                    </h4>
                    <motion.div 
                      style={{ z: zElevate }}
                      className={`font-mono text-[11px] sm:text-xs uppercase tracking-normal will-change-transform ${t.skills}`}
                    >
                      <a 
                        href="/Adarsh Pathade CV.pdf" 
                        download="Adarsh Pathade CV.pdf"
                        className="inline-block hover:opacity-60 transition-opacity cursor-pointer underline underline-offset-4 decoration-current/30 hover:decoration-current/80"
                      >
                        DOWNLOAD PDF
                      </a>
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
