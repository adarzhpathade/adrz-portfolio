# Memory — 3D About Card, Full-Site Zoom Resilience & Mobile Optimization

Last updated: 2026-09-20 (Verified with 0 TypeScript/build errors)

---

## What was built

1. **Interactive 3D About Card Drawer** ([src/app/components/AboutCard.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/AboutCard.tsx)):
   - Full-height borderless vertical floating card docked cleanly on the right viewport edge.
   - Refined, narrower width profile (**`max-w-[88vw] sm:max-w-[390px] md:max-w-[400px]`**, `p-6 sm:p-7 md:p-8`) giving it an elegant, non-intrusive editorial presence.
   - Smooth Framer Motion spring 3D tilt tracking (`rotateX: ±10deg`, `rotateY: ±10deg`, `scale: 1.02`).
   - Dynamic hover-driven 3D depth spring (**`zElevate: 0 -> 38px`**):
     - At rest (no hover): `zElevate = 0px`, keeping all words and sentences completely flat on the exact same baseline with zero awkward gaps or vertical tearing.
     - On hover: Elevated elements smoothly spring forward into 3D parallax space (`38px`) with drop shadows.
   - Highlighted key bio terms (**`ADARSH PATHADE`**, **`DESIGNER`**, **`DEVELOPER`**) in crisp 100% white (`text-white font-medium`) and soft ambient drop shadows against muted connective text (`text-white/60`).
   - Clean `ABOUT` header (`text-xs sm:text-sm text-white font-medium`) with adjacent `(CLOSE)` trigger.
   - Education section with `24 – PRESENT` on its own distinct line below `ACROPOLIS INSTITUTE OF TECHNOLOGY & RESEARCH`.
   - Skills section with active tech stack.
   - Cinematic slow slide-in from the right side on mobile devices (`x: 120 -> 0`, `duration: 0.65s`, `ease: [0.16, 1, 0.3, 1]`).

2. **React Bits TiltedCard Component** ([src/components/react-bits/TiltedCard.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/components/react-bits/TiltedCard.tsx)):
   - Complete TypeScript + Tailwind implementation with Framer Motion spring physics.

3. **Full-Site Zoom-Resilient Proportional Scaling (Zoom In/Out & Ultrawide Fixes)**:
   - **Page 3 (`Page3.tsx`)**:
     - Dynamic 3D Box Carousel dimensions (`targetHeight ≈ 31% vh`, aspect ratio 1.71) eliminating the hardcoded 470px cap. The carousel maintains its ~31% height and ~35% width at any zoom level or resolution.
     - Clamped `PROJECTS` display heading (`text-[clamp(3.5rem,13vw,16.5vh)]`), preventing it from ballooning and dwarfing the carousel on zoom-out.
     - Vertical constraints (`max-h-[58vh]`, `pt-[5vh]`, `pb-[3vh]`) keeping the top statement, middle row, and bottom heading in the exact tight editorial relationship seen at 100% scale.
     - Boosted skills typography on dark canvas to **`clamp(1.85rem, 4vw, 5.8vh)`** with `leading-none` and tighter gap (`gap-1 sm:gap-1.5 md:gap-2`) for a monolithic typography lockup.
   - **Page 2 (`Page2.tsx`)**:
     - Added responsive dynamic card dimensions (`targetHeight ≈ 44% vh`) for `LiquidGlassCarousel` so the cards scale with the viewport rather than shrinking to tiny stamps.
     - Secondary description scaled with responsive clamp (`text-[clamp(8px,0.85vw,1.35vh)]`).
   - **HeroSection (`HeroSection.tsx`)**:
     - Clamped display heading `ADARSH'26` (`text-[clamp(3.5rem,12vw,17vh)]`).
     - Proportional `vh`-based bottom offsets for reveal text, bottom heading, and bio.
   - **Page 4 (`Page4.tsx`)**:
     - Clamped display heading `LET'S CREATE` (`text-[clamp(3.5rem,13vw,17vh)]`).
     - Clamped email typography and bottom editorial credit bar.
   - **GlobalNav (`GlobalNav.tsx`)**:
     - Matched header font clamp so scale-down animation aligns 1:1 on all screen sizes and zoom levels.
     - Clamped right navigation links (`text-[clamp(9px,0.85vw,1.3vh)]`).

4. **Shared State Integration** ([src/app/page.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/page.tsx)):
   - Connected `isAboutOpen` and `onToggleAbout` across `GlobalNav`, `HeroSection`, and `AboutCard`.

---

## Decisions Made

- **Preserve-3D Unflattening**:
  - Avoided `overflow-y: auto`, `overflow: hidden`, or CSS clipping on intermediate 3D wrappers on desktop (`md:overflow-visible`), preserving the 3D stacking context for `translateZ` child parallax.
- **Dynamic Motion Spring for 3D Depth**:
  - Implemented `zElevate` via Framer Motion spring (`0px` at rest, `38px` on hover). Avoided static CSS `translateZ` on individual inline words which causes the 3D camera perspective to project them upward and tear the sentence baseline apart.
- **Dual-Axis Typography Clamping (`clamp(min, vw, vh)`)**:
  - Clamping display headers against `vh` ceilings (`16.5vh–17vh`) ensures that scaling down (zooming out) never causes text to blow up and disconnect from the 3D carousels.
- **Narrower Right-Docked Drawer Architecture**:
  - Capped About card width at 400px with `justify-end` across all breakpoints to ensure it functions as an unobtrusive, elegant sidebar overlay.

---

## Problems Solved

1. **Pre-Hover Baseline Tearing in Bio Paragraph**:
   - Static `translateZ(42px)` on `ADARSH PATHADE` and `DESIGNER` was projected upward by 3D perspective even when not hovering, pulling those words ~10px above `IS A`. Solved by unifying the paragraph container depth to hover-driven `zElevate: 0 -> 38px` and styling key words with high-contrast white text.
2. **Extreme Distortion on Browser Zoom (Scale Up/Down)**:
   - Fixed-pixel caps on carousels (`470px`, `240px`) contrasted with unbounded `vw` headers created 1000px+ empty voids on zoom-out. Solved by making carousel dimensions scale proportionally with viewport height and clamping all headers with `vh` ceilings.
3. **About Card Excessive Width**:
   - Reduced width by ~100px to `max-w-[400px]` with refined padding and line lengths.
4. **Mobile About Card Reveal**:
   - Replaced mobile center scale pop with a slow, cinematic slide from the right side (`duration: 0.65s`, `x: 120 -> 0`).

---

## Current State

- **Portfolio Sections**: Hero, Page 2, Page 3 (Projects & Skills), Page 4 (Footer), GlobalNav, and AboutCard are all fully responsive, tested, and verified.
- **Browser Zoom**: Tested across 50%, 67%, 75%, 100%, and 125% scales; proportions and compositions remain locked and visually cohesive.
- **TypeScript**: `npx tsc --noEmit` passes with **0 errors**.
- **Dev Server**: Running on `http://localhost:3000`.

---

## Next Session Starts With

1. **Building the Page Preloader / Loader**:
   - Design and build the initial loading experience (preloader) for the portfolio.
   - Smooth entrance choreography, asset preloading/ready check, and seamless exit transition into the Hero section.

---

## Open Questions

- Preferred aesthetic direction for the preloader: kinetic percentage counter, typographic logo reveal, or shader warmup effect?
