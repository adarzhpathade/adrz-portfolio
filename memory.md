# Memory — ADARSH'26 Portfolio Architecture, Page 3 3D Box Carousel & Responsive Calibrations

Last updated: 2026-09-19 (Session complete, verified with 0 TypeScript/build errors)

---

## What was built

1. **Page 3 Selected Work with Interactive 3D Cube Carousel** ([src/app/components/Page3.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/Page3.tsx)):
   - Engineered the complete Page 3 canvas attached seamlessly below Page 2 on the unified `#ECECEC` light background.
   - Built an interactive rotating 3D box cube showcasing featured projects (`Sentinel Terminal` and `Adarsh'26`).
   - Integrated project info panels with animated text reveals, animated underline hover states ([src/components/fancy/text/underline-center.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/components/fancy/text/underline-center.tsx)), and active project metadata.
   - Designed the massive bottom brand typography headline (`PROJECTS`) matching the dual-font signature (`PR` and `JECTS` in `PP Neue Montreal`, `O` in `PP Eiko Italic`).
   - Built entrance choreography via GSAP ScrollTrigger (`y: 140 -> 0`, `rotateX: 22 -> 0`, `rotateY: -32 -> 0`, `rotateZ: -5 -> 0`, `scale: 0.82 -> 1`, `opacity: 0 -> 1`).

2. **3D Box Carousel Engine** ([src/components/fancy/carousel/box-carousel.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/components/fancy/carousel/box-carousel.tsx)):
   - 4-face 3D cube utilizing CSS `transform-style: preserve-3d` with exact `translateZ(depth / 2)` calculations based on container dimensions.
   - Supports touch/pointer drag, spring physics (`stiffness: 200, damping: 30`), auto-play, keyboard navigation, and imperative `next()` / `prev()` controls.
   - Fixed Framer Motion v13 animation typing by importing `ValueAnimationTransition` from `motion-dom` for typed `animate(motionValue, number, options)`.

3. **Responsive Dimension Calibration Engine**:
   - Page 3 3D Box Cube:
     - **Large Desktop (`≥ 1440px`)**: `470px × 275px` (scaled down for optimal breathing room around `PROJECTS` and the top statement).
     - **Desktop / Laptops (`1024px – 1440px`)**: `430px × 250px`.
     - **Small Laptops / Tablets (`768px – 1024px`)**: `380px × 220px`.
     - **Tablets (`640px – 768px`)**: `310px × 180px`.
     - **Standard Mobile (`< 640px`)**: `280px × 165px` (maintains ~55px to 80px side margins, never touches screen edges).
     - **Compact Mobile (`< 380px`)**: `250px × 148px`.
   - Dimensions are evaluated synchronously with window resize listeners and passed to `<BoxCarousel key={`${width}-${height}`} />` to guarantee clean remounts without 3D depth glitches when switching breakpoints.

4. **Page 2 Mobile Typography & Layout Refinement** ([src/app/components/Page2.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/Page2.tsx)):
   - Solved empty vertical space on mobile by adjusting the carousel container offset to `translate-y-0 sm:-translate-y-6 pt-14 pb-14`.
   - Formatted the mobile bottom statement into 3 balanced lines (`39 / 39 / 36` characters) with `bottom-8` clearance:
     ```text
     A COLLECTION OF ORIGINAL MOTION GRAPHICS
     AND VISUAL EXPERIMENTS, CRAFTED THROUGH
     DESIGN, ANIMATION AND AFTER EFFECTS.
     ```
   - Desktop view preserved with the clean 2-line layout (`hidden sm:block`).

5. **Global Header & Navigation Scaling** ([src/app/components/GlobalNav.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/GlobalNav.tsx)):
   - Enlarged `(CONTACT)` navigation link on mobile to `text-[13px] sm:text-xs md:text-sm` for legibility and tap accessibility.
   - Fine-tuned `ADARSH'26` header title scroll target metrics (`targetScale: 0.40` on mobile, `0.22` on desktop) with precise vertical centerline alignment with the contact link.

---

## Decisions Made

- **Continuous 2-Page Sticky Light Canvas**:
  - Combined Page 2 and Page 3 into a continuous `h-[200%]` light canvas (`bg-[#ECECEC]`) inside a pinned sticky container (`h-[360vh]` track).
  - Page 2 translates `yPercent: -50%` between progress `0.72 -> 1.00`, pulling Page 3 into the viewport seamlessly without any white flash or page seam.
- **Dynamic Window Resize vs SSR Hydration**:
  - `BoxCarousel` relies on pixel dimensions to compute `depth / 2` for `translateZ`. If initialized with a desktop default during SSR, mobile hydration caused horizontal box overflow.
  - Resolved by using direct window evaluation in `useState`, subscribing to `resize`, and using dynamic `key={`${width}-${height}`}` to force Framer Motion to recalculate 3D face positions upon viewport changes.
- **Split Typography for Brand Heading**:
  - Rendered `PROJECTS` with `PR` and `JECTS` in `font-sans` (`PP Neue Montreal`) and `O` in `font-display italic` (`PP Eiko`), creating a signature editorial typographic contrast.

---

## Problems Solved

1. **Mobile Edge-to-Edge 3D Cube Clipping**:
   - Initial mobile render stretched the 3D cube edge-to-edge due to desktop SSR dimension fallback.
   - Fixed by managing responsive breakpoint dimensions in `Page3.tsx` with resize listeners, bounding mobile widths to `280px` (standard) and `250px` (compact) with comfortable margins.
2. **Framer Motion v13 `animate()` Overload Mismatch**:
   - TypeScript error `TS2769` occurred because `Parameters<typeof animate>[2]` extracted `AnimationOptions` from the final DOM overload instead of `ValueAnimationTransition<number>`.
   - Fixed by importing `ValueAnimationTransition` from `motion-dom` to type `ValueAnimationOptions`.
3. **Empty / Sparse Screen Appearance on Mobile (Page 2 & Page 3)**:
   - In Page 2: Repositioned carousel vertically (`translate-y-0`) and broke the bottom statement into 3 balanced, legible lines with increased bottom clearance.
   - In Page 3: Increased headline, subline, and bottom `PROJECTS` font sizes (`text-[15vw]`) to fill the mobile frame with confident editorial hierarchy.
4. **Mobile Navigation Legibility**:
   - Mobile `(CONTACT)` link was too small (`text-[10px]`); boosted to `text-[13px]` and aligned with `ADARSH'26` title center.

---

## Current State

- **TypeScript Compilation**: `npx tsc --noEmit` passes with **0 errors**.
- **Next.js Production Build**: `npm run build` succeeds in **5.4s**, 4/4 static pages generated cleanly.
- **Dev Server**: Running on `http://localhost:3000`.
- **All 3 Pages Fully Cohesive**:
  - Page 1: Dark chromatic WebGL ReflectShader Hero with scroll-reactive title animation and text blur reveals.
  - Page 2: Light `#ECECEC` canvas with 3D liquid glass curved carousel (6 WebM motion clips, edge gradual blurs, mobile touch gesture disambiguation).
  - Page 3: Light `#ECECEC` canvas with interactive 3D rotating cube carousel (Sentinel Terminal & Adarsh'26), active project metadata, interactive underlines, and `PROJECTS` display typography.

---

## Next Session Starts With

1. **Add Further Project Case Studies (Optional)**:
   - Expand `PROJECTS` array in [Page3.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/Page3.tsx) with additional work or external project links if needed.
2. **Project Detail Modal / Overlay (Optional)**:
   - Clicking a cube face or the project link can trigger an expanded modal or full-screen case-study preview.
3. **Deploy & Staging Verification**:
   - Ready for Vercel / staging deployment and cross-device testing.

---

## Open Questions

- None. All visual sizing, typography lining, and mobile/desktop calibrations have been validated and approved.
