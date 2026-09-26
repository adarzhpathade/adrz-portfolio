# Memory — Adarsh'26 Portfolio (adrz)

Last updated: 2026-09-26 (Snappier mobile scroll, earlier section auto-scrolls, hero button layout fix)

---

## Project Overview

A cinematic, scroll-driven portfolio site built with **Next.js 16**, **GSAP**, **Three.js**, **Framer Motion**, and **Lenis** smooth scroll. Features a 4-page vertical scroll experience with 3D carousels, GLSL shaders, spring-physics UI, interactive canvas typography, and a coordinated preloader.

- **Live URL**: https://adrz-26.vercel.app  
- **Repo**: https://github.com/adarzhpathade/adrz-portfolio  
- **Main Branch**: `main`  
- **Latest Commit**: `a2e1621` — fix: snappier mobile scroll, earlier section transitions, hero button layout

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
│   │   ├── HeroSection.tsx   ← hero with ADARSH'26, shader, bio, 3-line reveal, & fixed About/Contact buttons
│   │   ├── Page2.tsx         ← unified WebGL LiquidGlassCarousel with responsive DPR, card sizing, and curve radius
│   │   ├── Page3.tsx         ← 3D BoxCarousel with click-to-redirect, skills typography & blur exit transitions
│   │   ├── Page4.tsx         ← footer / contact with interactive TechText "LET'S CREATE." wordmark & Gestalt colophon
│   │   ├── GlobalNav.tsx     ← fixed nav with scroll-driven animations & responsive branding
│   │   └── AboutCard.tsx     ← 3D floating drawer (light/dark adaptive) with Resume download link
│   ├── globals.css           ← global styles, scrollbar hiding, overscroll bounce prevention
│   ├── layout.tsx            ← font loading, metadata (PWA standalone), viewport, Analytics
│   └── page.tsx              ← main orchestrator (scroll scrub, desktop/mobile auto-scroll, dynamic theme-color)
├── components/
│   ├── SmoothScroll.tsx      ← Lenis provider with device-adaptive config (mobile: 0.8s/2.5x touch, desktop: 1.5s/0.9x wheel)
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
- **Mobile Section Auto-Scroll**: Buttery smooth auto-scrolls tailored for phone dimensions:
  - Hero → Projects auto-scrolls at progress `0.20` (target: `maxScroll * 0.30`, duration `0.9s`). Reset threshold: `0.13`.
  - Projects → Skills auto-scrolls at progress `0.42` (target: `maxScroll * 0.64`, duration `0.9s`). Reset threshold: `0.36`.
  - **Key change this session**: Projects→Skills threshold was at `0.55` — required far too much scrolling on mobile. Moved to `0.42` so it fires much earlier once the user shows intent to move past projects.
- **Scroll Tuning**:
  - Desktop Lenis: `duration: 1.5`, `wheelMultiplier: 0.9`. GSAP `scrub: 1.2` for cinematic lag.
  - Mobile Lenis: `duration: 0.8`, `touchMultiplier: 2.5`, `syncTouchLerp: 0.075`. GSAP `scrub: 0.35` for snappy tracking.
  - `syncTouch: true` on both, but mobile gets faster interpolation via `syncTouchLerp`.

### 2. Device-Adaptive Lenis Configuration (`SmoothScroll.tsx`)
- **Key change this session**: Lenis now detects `window.innerWidth < 768` at init and applies a completely different config for mobile vs desktop:
  - **Mobile**: `duration: 0.8` (was 1.5 — cuts deceleration in half), `touchMultiplier: 2.5` (was 2 — each swipe covers more distance), `syncTouchLerp: 0.075` (new — faster interpolation so scroll catches up to finger immediately).
  - **Desktop**: Unchanged (`duration: 1.5`, `wheelMultiplier: 0.9`, `touchMultiplier: 2`).
- `gsap.ticker.lagSmoothing(500, 33)` remains for both to prevent sudden jumps on frame drops.

### 3. Enhanced Native Mobile View (PWA & Viewport)
- **Dynamic Viewport Height**: All `h-screen` / `100vh` replaced with `100dvh` across the application.
- **Dynamic Taskbar Theme**: GSAP `onUpdate` modifies `<meta name="theme-color">` per section. Mobile thresholds: dark when `p < 0.20 || p >= 0.55` (updated this session to match new auto-scroll thresholds).
- **Standalone PWA Mode**: `appleWebApp: { capable: true, statusBarStyle: "black-translucent" }`.
- **No Rubber-Band Bouncing**: `overscroll-behavior-y: none` on `html`/`body`.

### 4. Unified WebGL Carousel on Page 2 (`Page2.tsx`)
- Unified `LiquidGlassCarousel` on **all devices** with responsive card geometry.
- Mobile: tightened cylinder curvature radius to `600`, `gap: 4px`, DPR `1.0`.

### 5. Hero Section Button Layout (`HeroSection.tsx`)
- **Key change this session**: About and Contact buttons on the Hero section were previously in a centered `gap-8` row on mobile — cramped and tiny (9px font from clamp).
- Now: `justify-between w-full px-5` on mobile — buttons sit on opposite edges of the screen with proper breathing room. Font fixed to `11px` on mobile (was resolving to 9px via clamp). Desktop layout unchanged (`md:absolute md:inset-0 md:justify-between`).

### 6. Cinematic Transitions & Effects
- **Blur Exit (`Page3.tsx`)**: Projects heading, bio text, and 3D cube blur from `0px` to `12px` during exit.

### 7. Floating About Card (`AboutCard.tsx`)
- 3D-tilting drawer with responsive layout. Integrated Resume download (`Adarsh Pathade CV.pdf`).

### 8. Mobile Performance & Battery Optimization
- **`ReflectShader` Visibility Gating**: `IntersectionObserver` terminates rAF when offscreen.
- **`LiquidGlassCarousel` Visibility Gating**: Halts `tick()` when offscreen. Mobile DPR capped to `1.0`, antialiasing disabled.
- **GSAP Lag Smoothing**: `lagSmoothing(500, 33)` prevents visual jumps.

---

## Decisions & Patterns

1. **Device-Adaptive Scroll Physics (new)**: Rather than using the same Lenis config for all devices, mobile now gets its own tuned profile — shorter duration, higher touch multiplier, faster lerp. This was necessary because the desktop's cinematic 1.5s duration felt sluggish on touch.
2. **Earlier Auto-Scroll Thresholds (new)**: Projects→Skills was at 0.55 which required scrolling through nearly the entire projects section. Moved to 0.42 — fires once the user shows intent, not after they've already scrolled past everything.
3. **Mobile-First Button Layout (new)**: Hero buttons use `justify-between w-full` on mobile instead of `gap-8` centered — mirrors how native apps space toolbar items.
4. **Unified WebGL Experience**: Maintained the WebGL `LiquidGlassCarousel` across all screens with adaptive DPR.
5. **Intent-Based Auto Scrolling vs Strict Snapping**: Desktop and Mobile both use continuous GSAP ScrollTrigger timelines but employ `onUpdate` threshold auto-scroll for guided editorial navigation.

---

## Problems Solved

1. **Sluggish Mobile Scroll Feel (this session)**:
   - Root cause: Global Lenis config used desktop's heavy `duration: 1.5` and modest `touchMultiplier: 2` on all devices. `syncTouch: true` hijacks native scroll, so the high duration made it feel floaty.
   - Solution: Detect mobile at Lenis init and apply `duration: 0.8`, `touchMultiplier: 2.5`, `syncTouchLerp: 0.075`.

2. **Too Much Scrolling for Projects → Skills (this session)**:
   - Root cause: Auto-scroll threshold was at progress `0.55` (30% of total 600vh scroll track = ~1800vh of swiping). The user had to scroll through the entire projects section before it auto-jumped.
   - Solution: Lowered threshold to `0.42` and target to `0.64`. Duration shortened from `1.2s` to `0.9s`.

3. **Cramped Hero Buttons on Mobile (this session)**:
   - Root cause: `gap-8` centered flex row with `clamp(9px, 0.85vw, 1.3vh)` font — on 390px mobile, `0.85vw` = 3.3px, so the 9px minimum dominated. Buttons were tiny and bunched together under the title.
   - Solution: `justify-between w-full px-5` spreads them edge-to-edge. Fixed font to `11px` on mobile.

4. **Jittery Reverse Scroll & Sudden Jumps (previous session)**:
   - Solution: Restored `gsap.ticker.lagSmoothing(500, 33)`.

5. **Mobile Viewport Bouncing & URL Bar Layout Shifts (previous session)**:
   - Solution: `100dvh` everywhere + `overscroll-behavior-y: none`.

---

## Current State

- **Build**: `npm run build` / Turbopack clean, 0 errors.
- **Lint**: Clean.
- **TypeScript**: `npx tsc --noEmit` clean.
- **Git**: All changes committed and pushed to `main` (`a2e1621`).
- **Live URL**: https://adrz-26.vercel.app (auto-deploys from `main`)

---

## Next Session Starts With

1. Test live deployment on physical mobile devices (iOS Safari / Android Chrome) to verify snappier scroll feel and earlier Projects→Skills transition.
2. Verify the hero About/Contact buttons look properly spaced on real phones.
3. Optional: Clean up legacy unused `src/components/ui/cylinder-carousel.tsx`.
