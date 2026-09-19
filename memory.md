# Memory — Hero Reveal, Scroll Curtain Transition & GlobalNav Architecture

Last updated: 2026-09-19 16:16:00

## What was built

- **Global Navigation Layer (`src/app/components/GlobalNav.tsx`):**
  - Created a persistent, fixed navigation component (`fixed top-0 left-0 w-full z-40 pointer-events-none`) that seamlessly bridges the Hero and Page 2 sections.
  - Controls the main brand heading (`ADARSH'25`) with `BlurText` on mount.
  - On scrolling from Hero into Page 2, the main heading smoothly scales down (`scale: 0.22` on desktop, `scale: 0.36` on mobile) and translates to the top-left corner (`x: 18px / 10px`, `y: 12px / 8px`), transitioning color from `#ffffff` to solid deep black (`#080808`).
  - Right-hand navigation items (`DESIGN — FOLIO`, `(CONTACT)`, `(ABOUT)`) fade in to `opacity: 1`, dynamically calculated to align on the exact vertical centerline of the scaled `ADARSH'25` title:
    - **Desktop (`>= 768px`)**: Displays `DESIGN — FOLIO`, `(CONTACT)`, and `(ABOUT)`.
    - **Mobile (`< 768px`)**: Exclusively displays `(CONTACT)` (`DESIGN — FOLIO` and `(ABOUT)` hidden via `hidden md:inline-block`).
  - Integrated `LetterSwapPingPong` on all right nav items to match the typography and hover micro-interaction of the Hero section (`font-mono text-[10px] sm:text-xs tracking-wider uppercase cursor-pointer transition-opacity text-[#080808]`).
  - Clicking the scaled `ADARSH'25` logo triggers a smooth scroll back to the top.

- **Synchronized Hero-to-Page-2 Curtain Transition (`src/app/components/HeroSection.tsx` & `src/app/page.tsx`):**
  - Choreographed sequence tied to `#main-scroll-container` with Lenis smooth scrolling.
  - Phase 1 (0% -> 45% scroll): Dark rectangle overlay scrolls up out of view, center subtitle fades out, 3-line text begins hidden and reveals word-by-word with blur and stagger, bottom "DESIGN — Folio" fades out, initial hero side links fade out.
  - Phase 1.5 (45% -> 55% scroll): Hold state displaying the revealed Hero (shader active in background, 3-line text crisp).
  - Phase 2 (55% -> 100% scroll): 3-line text blurs out (`opacity: 0, filter: blur(12px), y: -30`), and the entire Hero section slides up (`yPercent: -100`), acting like a physical curtain pulling back to reveal Page 2 underneath while the navbar transitions in lockstep.
  - Replaced the duplicate heading in `HeroSection.tsx` with an invisible layout spacer (`opacity-0 pointer-events-none select-none`) to maintain layout spacing and prevent layout shifts.

- **Page 2 Clean Canvas (`src/app/components/Page2.tsx`):**
  - Cleared all temporary content (carousel, watermark, bio) while retaining the clean `#ECECEC` background canvas and responsive layout.
  - Ready as an empty section for new feature instructions.

- **Smooth Scrolling Integration (`src/components/SmoothScroll.tsx` & `src/app/layout.tsx`):**
  - Integrated Lenis smooth scroll wrapped in `src/components/SmoothScroll.tsx` and connected to GSAP ticker.
  - Fixed ticker removal cleanup to pass identical function reference (`updateRaf`), avoiding memory leaks on unmount.

- **Sticky Viewport Page Architecture (`src/app/page.tsx`):**
  - Stacks `Page2` at `z-10` and `HeroSection` at `z-20` inside a CSS sticky viewport (`sticky top-0 left-0 w-full h-screen overflow-hidden`) with a 220vh scroll track (`h-[220vh]`).
  - Eliminates DOM pin-spacer jumping and enables deterministic bidirectional scrub.

## Decisions made

- **Single Master Scroll Container (`#main-scroll-container`)**:
  - Synced both `GlobalNav` and `HeroSection` to the same scroll trigger and track distance (`start: "top top"`, `end: "+=220%"`), ensuring both timelines scrub in lockstep.
- **Persistent Header for Main Text**:
  - Rather than letting the heading scroll away with the hero, moving the heading into `GlobalNav` ensures it smoothly transforms into the permanent navbar brand mark.
- **Dynamic Centerline Alignment**:
  - Calculated right nav position dynamically (`rightNavY = titleCenterY - (navHeight / 2)`) rather than using static pixel estimates, ensuring exact inline alignment regardless of font rasterization or responsive scaling.
- **CSS Sticky Viewport over GSAP DOM Pinning**:
  - Using `sticky top-0 h-screen` for the viewport container avoids DOM manipulation artifacts from GSAP `.pin-spacer`, providing a smoother experience with Lenis.

## Problems solved

- **Text Overlay on Initial Page Refresh**:
  - The 3-line text ("DESIGN, BUILD & EXPERIMENT...") was initially displaying on page load overlapping the center subtitle and bottom heading.
  - Resolved by applying `opacity-0` and inline `style={{ opacity: 0, filter: "blur(12px)" }}` in JSX, calling `gsap.set(words, { opacity: 0 })` on mount, and delaying the reveal tween to start at timeline offset `0.06`.
- **Top and Left Corner Gap**:
  - Tightened the target offsets for the scaled logo (`x: 18px` desktop / `10px` mobile, `y: 12px` desktop / `8px` mobile) to match the tight, corner-tucked look in the reference design.
- **Nav Hover & Font Inconsistency**:
  - Converted static anchor/span nav tags in `GlobalNav` to `<LetterSwapPingPong>` with `font-mono text-[10px] sm:text-xs tracking-wider uppercase cursor-pointer text-[#080808]`, restoring full visual and interactive parity with the hero.

## Current state

- Hero section animations (hidden -> reveal) work cleanly with reflection shader background.
- Hero-to-Page-2 curtain reveal is buttery smooth in both scroll directions.
- Scaled `ADARSH'25` logo and right nav items are inline, responsive, and styled.
- Page 2 is an empty clean canvas ready for next development tasks.
- App builds cleanly (`npm run build` passes with 0 errors).

## Next session starts with

- Implementing the content and interactive components for Page 2 based on developer instructions.

## Open questions

- Specific components, layouts, or portfolio items to feature on Page 2.
