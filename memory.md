# Memory — Adarsh'26 Portfolio (adrz)

Last updated: 2026-09-26 (Enhanced mobile experience: buttery smooth touch scroll, dynamic theme-color, dvh viewports, and cinematic blur transitions)

---

## Project Overview

A cinematic, scroll-driven portfolio site built with **Next.js 16**, **GSAP**, **Three.js**, **Framer Motion**, and **Lenis** smooth scroll. Features a 4-page vertical scroll experience with 3D carousels, GLSL shaders, spring-physics UI, interactive canvas typography, and a coordinated preloader.

- **Live URL**: https://adrz-26.vercel.app  
- **Repo**: https://github.com/adarzhpathade/adrz-portfolio  
- **Main Branch**: `main`  
- **Latest Commit**: TBD (committing mobile enhancements)

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
│   │   ├── Preloader.tsx     ← cinematic loader with GSAP exit morph & calibrated title gap (100dvh base)
│   │   ├── HeroSection.tsx   ← hero with ADARSH'26, shader, bio & 3-line reveal
│   │   ├── Page2.tsx         ← unified WebGL LiquidGlassCarousel with responsive DPR, card sizing, and curve radius
│   │   ├── Page3.tsx         ← 3D BoxCarousel with click-to-redirect, skills typography & blur exit transitions
│   │   ├── Page4.tsx         ← footer / contact with interactive TechText "LET'S CREATE." wordmark & Gestalt colophon
│   │   ├── GlobalNav.tsx     ← fixed nav with scroll-driven animations & responsive branding
│   │   └── AboutCard.tsx     ← 3D floating drawer (light/dark adaptive) with Resume download link
│   ├── globals.css           ← global styles, scrollbar hiding, overscroll bounce prevention
│   ├── layout.tsx            ← font loading, metadata (PWA standalone), viewport, Analytics
│   └── page.tsx              ← main orchestrator (scroll scrub, desktop/mobile auto-scroll, dynamic theme-color)
├── components/
│   ├── SmoothScroll.tsx      ← Lenis provider with syncTouch and GSAP lagSmoothing(500, 33)
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
- **Desktop Section Auto-Scroll**: Uses intent-based threshold check in `onUpdate`. If the user scrolls past 70% of the Hero's exit animation (progress `0.28`), `lenis.scrollTo` fires to gracefully auto-navigate to the start of Section 2.
- **Mobile Section Auto-Scroll**: Implemented buttery smooth auto-scrolls tailored for phone dimensions. Hero -> Projects auto-scrolls when crossing progress `0.22`, and Projects -> Skills auto-scrolls gracefully when passing `0.55`.
- **Scroll Tuning**:
  - Lenis configuration: `duration: 1.5`, `wheelMultiplier: 0.9` for a weightier, cinematic desktop feel. `syncTouch: true` with `touchMultiplier: 2` added for highly responsive mobile virtual scrolling.
  - GSAP `scrub`: Increased to `1.2` on desktop timelines to introduce more noticeable animation lag for maximum fluidity. Mobile is tuned to `0.35` for snappy tracking.

### 2. Enhanced Native Mobile View (PWA & Viewport)
- **Dynamic Viewport Height**: Replaced all `h-screen` and `100vh` properties with `100dvh` (Dynamic Viewport Height) across the application. This prevents layout jarring and component shifting when the mobile browser's address bar collapses or expands on scroll.
- **Dynamic Taskbar Theme**: A GSAP `onUpdate` hook in `page.tsx` dynamically modifies the `<meta name="theme-color">` to match the exact background color of the current section (Hero = `#000000`, Projects = `#ECECEC`, Skills = `#080808`), merging the browser UI with the design perfectly.
- **Standalone PWA Mode**: Added `appleWebApp: { capable: true, statusBarStyle: "black-translucent" }` to `layout.tsx` so users can add the portfolio to their home screen to bypass the browser UI entirely.
- **No Rubber-Band Bouncing**: Added `overscroll-behavior-y: none` to the global `html`/`body` to lock the scroll boundaries and prevent pulling past the top/bottom edges of the site.

### 3. Unified WebGL Carousel on Page 2 (`Page2.tsx`)
- Unified `LiquidGlassCarousel` on **all devices** (mobile, tablet, desktop), delivering the complete cinematic 3D video experience everywhere.
- **Responsive Card Geometry**: Tightened cylinder curvature radius from default 1200 to `600` on mobile (< 210px card width) combined with `gap: 4px`. This keeps neighboring cards clustered naturally within the mobile viewport.

### 4. Cinematic Transitions & Effects
- **Blur Exit (`Page3.tsx`)**: Upgraded the exit transitions on the Projects section (heading, bio text, and 3D cube) so that as they fade out, they simultaneously blur from `0px` to `12px`, creating an elegant depth-of-field transition into the Skills section.

### 5. Floating About Card (`AboutCard.tsx`)
- 3D-tilting drawer overlay with responsive layout (side-docked on desktop, full-width on mobile).
- Integrated direct Resume download (`Adarsh Pathade CV.pdf`) natively into the component structure.
- Resolved layout overflow by scaling down the typography hierarchy and stacking `EDUCATION`, `SKILLS`, and `RESUME` compactly without scroll bleed.

### 6. Mobile Performance & Battery Optimization
- **`ReflectShader` Visibility Gating (`reflect-shader.tsx`)**:
  - Resolved with an `IntersectionObserver` that terminates the rAF loop (`raf = 0`) when the canvas leaves viewport, and safely restarts (`startLoop()`) upon re-entry.
- **`LiquidGlassCarousel` Visibility Gating (`liquid-glass-carousel-custom-style.tsx`)**:
  - Added visibility observer hook to completely halt `tick()` when offscreen. Capped mobile device pixel ratio to `1.0` and disabled WebGL antialiasing on mobile.
- **SmoothScroll GSAP Lag Smoothing (`SmoothScroll.tsx`)**:
  - Maintained `gsap.ticker.lagSmoothing(500, 33)` (fixing a bug where it was mistakenly set to 0). This prevents sudden visual jumps when background threads cause momentary frame drops or when the user violently reverses their scroll direction.

---

## Decisions & Patterns

1. **Mobile Experience as a First-Class Citizen**:
   - Rather than just making the desktop design fit on a phone, we adopted native app patterns (`100dvh`, dynamic taskbar colors, PWA manifest, and `syncTouch: true`) to make the browser melt away.
2. **Unified WebGL Experience**:
   - Maintained the WebGL `LiquidGlassCarousel` across all screens with adaptive DPR (1.0 on mobile, 2.0 on desktop) instead of maintaining a separate CSS cylinder fallback.
3. **Intent-Based Auto Scrolling vs Strict Snapping**:
   - Desktop and Mobile both use continuous GSAP ScrollTrigger timelines but employ a bespoke `onUpdate` threshold auto-scroll (`lenis.scrollTo()`) specifically for jumping between massive sections (Hero -> Projects -> Skills) to give a guided, editorial feel without locking the user's scrollbar.

---

## Problems Solved

1. **Jittery Reverse Scroll & Sudden Jumps**:
   - Root cause: `lagSmoothing(0)` in `SmoothScroll.tsx` forced GSAP to calculate exact elapsed deltas even after heavy thread stalling, causing massive jumps or visual stutter when reversing direction quickly.
   - Solution: Restored `gsap.ticker.lagSmoothing(500, 33)`.
2. **Mobile Viewport Bouncing & URL Bar Layout Shifts**:
   - Root cause: Mobile browsers recalculate `100vh` constantly as the UI hides/shows. iOS defaults to rubber-banding at the edges.
   - Solution: Deployed `100dvh` everywhere and locked `overscroll-behavior-y: none`.
3. **Clunky Mobile Scroll Feel**:
   - Root cause: Native scroll was fighting the heavy GSAP scrub, making the experience feel rigid on touch screens.
   - Solution: Hijacked the touch scroll with `syncTouch: true` and amplified it with `touchMultiplier: 2`, then added smart `onUpdate` auto-scroll breakpoints to glide the user into the sections.

---

## Current State

- **Build**: `npm run build` / Turbopack clean, 0 errors.
- **Lint**: `npx eslint` passes with 0 errors.
- **TypeScript**: `npx tsc --noEmit` passes with 0 errors.
- **Git**: Committing mobile native enhancements & blur animations to `main`.
- **Live URL**: https://adrz-26.vercel.app

---

## Next Session Starts With

1. Test live deployment on physical mobile devices (iOS Safari / Android Chrome) to verify `dvh` changes and dynamic Chrome taskbar updates.
2. Optional: Clean up legacy unused `src/components/ui/cylinder-carousel.tsx` if no longer required as a fallback.
