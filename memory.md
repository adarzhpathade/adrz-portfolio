# Memory — Adarsh'26 Portfolio (adrz)

Last updated: 2026-09-26 (Unified WebGL carousel across all devices, mobile & desktop performance optimization, desktop section snapping, TechText wordmark calibration, build & ESLint clean)

---

## Project Overview

A cinematic, scroll-driven portfolio site built with **Next.js 16**, **GSAP**, **Three.js**, **Framer Motion**, and **Lenis** smooth scroll. Features a 4-page vertical scroll experience with 3D carousels, GLSL shaders, spring-physics UI, interactive canvas typography, and a coordinated preloader.

- **Live URL**: https://adrz-26.vercel.app  
- **Repo**: https://github.com/adarzhpathade/adrz-portfolio  
- **Main Branch**: `main`  
- **Latest Commit**: `be17637` (`main` branch)

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16.3.5 (App Router, Turbopack)
- **Animation**: GSAP 3.14 + ScrollTrigger (scroll-linked scrubbing & snapping), Framer Motion (spring physics, layout)
- **3D Graphics & Canvas**:
  - Three.js WebGL with video textures (`LiquidGlassCarousel` on both desktop & mobile with adaptive DPR and geometry)
  - Custom GLSL reflection shaders (`ReflectShader` on Hero & Page 4 with visibility-aware rAF gating)
  - CSS 3D transforms with preserve-3d (`BoxCarousel` on Page 3)
  - Canvas 2D/WebGL interactive wordmark (`TechText` on Page 4 with particle sweeps and calibrated letter metrics)
- **Scroll**: Lenis smooth scroll (exposed via typed `window.__lenis`)
- **Styling**: Tailwind CSS v4 + custom CSS tokens
- **Fonts**: PP Neue Montreal (Regular/Light), PP Eiko (Italic), Fragment Mono — self-hosted woff2 in `src/fonts/`
- **Analytics**: Vercel Analytics (`@vercel/analytics/next`)
- **Deploy**: Vercel (auto-deploy from `main` branch)

### File Structure
```
src/
├── app/
│   ├── components/
│   │   ├── Preloader.tsx     ← cinematic loader with GSAP exit morph & calibrated title gap
│   │   ├── HeroSection.tsx   ← hero with ADARSH'26, shader, bio & 3-line reveal
│   │   ├── Page2.tsx         ← unified WebGL LiquidGlassCarousel with responsive DPR, card sizing, and curve radius
│   │   ├── Page3.tsx         ← 3D BoxCarousel with click-to-redirect + skills typography
│   │   ├── Page4.tsx         ← footer / contact with interactive TechText "LET'S CREATE." wordmark & Gestalt colophon
│   │   ├── GlobalNav.tsx     ← fixed nav with scroll-driven animations & responsive branding
│   │   └── AboutCard.tsx     ← 3D floating drawer (light/dark adaptive)
│   ├── globals.css           ← global styles, scrollbar hiding
│   ├── layout.tsx            ← font loading, metadata, viewport, Analytics
│   └── page.tsx              ← main orchestrator (scroll scrub, desktop section snapping, mobile swipe navigation)
├── components/
│   ├── SmoothScroll.tsx      ← Lenis provider with typed window.__lenis & GSAP lagSmoothing(500, 33)
│   ├── fancy/
│   │   ├── carousel/box-carousel.tsx   ← 3D CSS cube with drag rotation & click-to-redirect
│   │   └── text/letter-swap-pingpong-anim.tsx
│   ├── originkit/ui/
│   │   ├── liquid-glass-carousel-custom-style.tsx  ← WebGL video carousel with visibility rAF pausing & mobile DPR 1.0
│   │   └── reflect-shader.tsx                      ← GLSL reflection shader with complete rAF termination offscreen
│   ├── react-bits/
│   │   ├── BlurText.tsx
│   │   ├── GradualBlur.tsx
│   │   └── TechText.tsx                            ← interactive canvas wordmark with bounding-box letter-spacing fix
│   └── ui/
│       └── cylinder-carousel.tsx                   ← legacy mobile 3D cylinder carousel component
├── fonts/
│   ├── PPNeueMontreal-Regular.woff2
│   ├── PPNeueMontreal-Light.woff2
│   ├── PPEiko-RegularItalic.woff2
│   └── FragmentMono-Regular.woff2
├── hooks/use-screen-size.ts
├── lib/utils.ts
└── types/
    └── global.d.ts           ← Window.__lenis TypeScript declaration
```

---

## Key Systems

### 1. Scroll Orchestration & Snapping (`page.tsx`)
- Single GSAP ScrollTrigger timeline scrubs all 4 pages via `#main-scroll-container` (`end: "+=600%"`).
- **Desktop Section Snapping**: Native ScrollTrigger `snap` config active when `!isMobile`:
  - `snapTo: [0.0, 0.18, 0.38, 0.66, 0.86, 1.0]` (Hero Initial, Hero Reveal, Page 2 Carousel, Page 3 Projects, Page 3 Skills, Page 4 Contact).
  - `duration: { min: 0.25, max: 0.75 }`, `delay: 0.15`, `ease: "power2.inOut"`. Automatically and smoothly settles on narrative stops once scroll exceeds ~60% between stops.
- **Mobile Touch Navigation**:
  - Vertical swipe threshold set to `55px` (calibrated to reject accidental micro-drags and horizontal carousel interactions).
  - Smooth glide via `lenis.scrollTo` with `duration: 0.9s` and `easeInOutQuad` easing (`t < 0.5 ? 2*t*t : 1 - (-2*t+2)^2 / 2`).
  - Lockout period set to `1000ms`.
  - Mobile GSAP scrub tuned to `0.6` for smooth tracking without lag.
- **Theming**: `isDarkTheme` reactive state (`progress >= 0.24 && < 0.74` = light mode for Page 2 & Page 3 projects, dark mode elsewhere).

### 2. Unified WebGL Carousel on Page 2 (`Page2.tsx`)
- Unified `LiquidGlassCarousel` on **all devices** (mobile, tablet, desktop), delivering the complete cinematic 3D video experience everywhere.
- **Responsive Card Geometry**:
  - `< 480px`: width `155px`, height `245px`, `gap: 4px`, `curveRadius: 600`, `cornerRadius: 12`.
  - `< 640px`: width `175px`, height `280px`, `gap: 4px`, `curveRadius: 600`, `cornerRadius: 12`.
  - `< 768px`: width `200px`, height `320px`, `gap: 4px`, `curveRadius: 600`, `cornerRadius: 12`.
  - `>= 768px`: dynamic aspect ratio calculation, `gap: Math.round(cardWidth * 0.125)`, `curveRadius: 0` (default 1200), `cornerRadius: 18`.
- **Mobile Arc Calibration**:
  - Tightened cylinder curvature radius from default 1200 to `600` on mobile (< 210px card width) combined with `gap: 4px`. This keeps neighboring cards clustered naturally within the mobile viewport without excessive gap or awkward perspective divergence.
- **Motion Tuning**:
  - Mobile: `glide: 4.5`, `sensitivity: 8.0`, auto-scroll speed `45`, entry duration `0.7s`.
  - Desktop: `glide: 6.8`, `sensitivity: 6.0`, auto-scroll speed `65`, entry duration `1.0s`.
- Edge `GradualBlur` overlays (left & right) active across all screen sizes.

### 3. Mobile Performance & Battery Optimization
- **`ReflectShader` Visibility Gating (`reflect-shader.tsx`)**:
  - Previously, the animation frame loop ran continuously at 60fps offscreen (only skipping `gl.drawArrays` while still queuing `requestAnimationFrame`).
  - Resolved with an `IntersectionObserver` that terminates the rAF loop (`raf = 0`) when the canvas leaves viewport, and safely restarts (`startLoop()`) upon re-entry.
- **`LiquidGlassCarousel` Visibility Gating (`liquid-glass-carousel-custom-style.tsx`)**:
  - Added visibility observer hook to completely halt `tick()` when offscreen, preventing frame scheduling and CPU/GPU cycles when browsing other sections.
  - Capped mobile device pixel ratio to `1.0` (`maxDpr = isMobile ? 1 : 2`), preventing massive 3x/4x fragment overdraw on high-DPI phone displays.
  - Disabled WebGL antialiasing on mobile (`antialias: !isMobile`).
- **SmoothScroll GSAP Lag Smoothing (`SmoothScroll.tsx`)**:
  - Re-enabled GSAP lag smoothing at `gsap.ticker.lagSmoothing(500, 33)` (was previously 0), preventing sudden visual jumps when background threads cause momentary frame drops.

### 4. Page 4 Interactive Wordmark & Layout (`Page4.tsx`, `TechText.tsx`)
- Integrated interactive canvas `TechText` for the headline: `"LET'S CREATE."`.
  - Features particle specks, dash strokes, letter reveal, and sweep animation.
  - `draggable={false}` to maintain stable page interaction.
  - Responsive container height: `h-[clamp(130px,22vh,260px)]` with `-my-1 sm:my-0`.
- **Canvas Layout & Text Fit Fix (`TechText.tsx`)**:
  - Standard Canvas 2D `actualBoundingBoxLeft` + `actualBoundingBoxRight` diverges from glyph advance width when `letterSpacing` is negative (`-0.04`).
  - `ensureLayout` was enhanced to use `Math.max(boundingBoxWidth, advanceWidth)` for fit calculation and canvas centering, eliminating letter clipping on wide and narrow viewports alike.
- **Email Typography Link**:
  - Directly follows wordmark with minimal gap (`mt-1 sm:mt-2`).
  - Interactive `LetterSwapPingPong` animation on hover.
- **Mobile Footer Hierarchy**:
  - Single-line headline `"Got a project? Let’s talk."`.
  - Gestalt grouping: links (`LINKEDIN`, `GITHUB`) grouped with `gap-1`, separated by `mt-6` from colophon.

### 5. Preloader System (`Preloader.tsx`)
- **Asset Readiness**: Waits for `document.readyState`, `document.fonts.ready`, and all DOM images with 3.5s safety fallback.
- **Progress Counter**: Positioned as sibling of backdrop, direct DOM ref (`counterNumberRef`) for zero React re-renders during count-up.
- **Exit Morph**: Backdrop shrinks `100vh → 80vh`, `ADARSH'26` scales to `1.0` and glides to `y: 0`.
- **Gap Calibration**: Resting Y `44vh` (mobile) / `43.5vh` (desktop) maintaining ~18–20px vertical gap with subtitle.

### 6. Page 3 3D Box Carousel (`box-carousel.tsx`)
- 4-face CSS 3D cube alternating Sentinel and Adarsh'26 projects.
- Click-to-redirect to live URLs with `hypot(deltaX, deltaY) > 6px` drag disambiguation and 150ms post-drag lock.
- Keyboard navigation (`Enter` and `Space`).

---

## Decisions & Patterns

1. **Unified Experience over Separate Forked Codebases**:
   - Instead of maintaining a separate CSS cylinder carousel on mobile with static images, unified the WebGL `LiquidGlassCarousel` across all screens with adaptive DPR (1.0 on mobile, 2.0 on desktop), disabled antialias on mobile, and responsive geometry/curvature.
2. **Complete rAF Termination on Offscreen Elements**:
   - Skipping the draw call in an active rAF loop still incurs 60fps frame scheduling overhead. Halting rAF loops via `IntersectionObserver` when elements leave the viewport ensures near-zero GPU and CPU consumption when off-screen.
3. **Desktop Snap + Mobile Intent-Based Navigation**:
   - Desktop uses continuous GSAP ScrollTrigger snapping (`snapTo` array with ease `power2.inOut`).
   - Mobile uses vertical swipe intent detection (`threshold = 55px`) with `lenis.scrollTo` smooth gliding and horizontal touch gesture immunity.
4. **Canvas Text Layout Calibration**:
   - When using negative `letterSpacing` in Canvas 2D contexts, advance width (`measureText.width`) and bounding box metrics (`actualBoundingBoxRight + actualBoundingBoxLeft`) behave differently across font renderers; taking `Math.max()` ensures full glyph containment.

---

## Problems Solved

1. **Mobile Lag and GPU Overheating**:
   - Root cause: Multiple un-throttled rAF loops (`ReflectShader` on Hero + Page 4, `LiquidGlassCarousel` on Page 2) running concurrently at 60fps + high DPR fragment shading + `lagSmoothing(0)` causing frame spikes.
   - Solution: Stopped rAF loops when offscreen via `IntersectionObserver`, capped mobile DPR at 1, disabled antialias on mobile, and set `lagSmoothing(500, 33)`.
2. **Mobile Section Snap Sensitivity & Sluggishness**:
   - Root cause: 22px swipe threshold triggered on accidental touch movements; 1.4s glide duration with 1.45s lockout felt slow and unresponsive.
   - Solution: Increased swipe threshold to 55px, reduced transition duration to 0.9s (`easeInOutQuad`), and reduced lockout to 1000ms.
3. **Card Gap and 3D Perspective on Mobile Carousel**:
   - Root cause: Desktop curve radius (1200) pushed mobile cards too far back into z-space, creating large perceived visual gaps even when `gap` was small.
   - Solution: Set `curveRadius: 600` and `gap: 4px` on mobile (< 210px card width), producing a tight, cohesive cylindrical arc.
4. **Page 4 TechText Clipping & Extra Drag Behavior**:
   - Root cause: Canvas bounding box metric did not account for negative letter spacing causing trailing character clipping; drag interaction conflicted with page scroll.
   - Solution: Disabled dragging (`draggable={false}`) and computed width using `Math.max(boundingBoxWidth, advanceWidth)`.
5. **Desktop Section Snapping**:
   - Implemented native GSAP ScrollTrigger snap array (`[0.0, 0.18, 0.38, 0.66, 0.86, 1.0]`) to automatically pull the viewport to key sections when scrolling past 60%.

---

## Current State

- **Build**: `npm run build` / Turbopack clean, 0 errors.
- **Lint**: `npx eslint` passes with 0 errors (3 warnings on pre-existing legacy files).
- **TypeScript**: `npx tsc --noEmit` passes with 0 errors.
- **Git**: Staged and committed to `main` branch.
- **Live URL**: https://adrz-26.vercel.app

---

## Next Session Starts With

1. Test live deployment on physical mobile devices (iOS Safari / Android Chrome) to verify touch glide fluidity and GPU thermal levels.
2. Optional: Clean up legacy unused `src/components/ui/cylinder-carousel.tsx` if no longer required as a fallback.
