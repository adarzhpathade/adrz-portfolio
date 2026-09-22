# Memory — Adarsh'26 Portfolio (adrz)

Last updated: 2026-09-22 (Production build & ESLint clean — 0 errors, pushed to GitHub, deployed to Vercel)

---

## Project Overview

A cinematic, scroll-driven portfolio site built with **Next.js 16**, **GSAP**, **Three.js**, **Framer Motion**, and **Lenis** smooth scroll. Features a 4-page vertical scroll experience with 3D carousels, GLSL shaders, spring-physics UI, and a coordinated preloader.

- **Live URL**: https://adrz-26.vercel.app  
- **Repo**: https://github.com/adarzhpathade/adrz-portfolio  
- **Latest Commit**: `c12bd05` (`main` branch)

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16.3.5 (App Router, Turbopack)
- **Animation**: GSAP + ScrollTrigger (scroll-linked), Framer Motion (spring physics, layout)
- **3D Graphics**:
  - Three.js WebGL with video textures (`LiquidGlassCarousel` on desktop)
  - CSS 3D transforms with preserve-3d (`BoxCarousel` on Page 3, `CylinderCarousel` on mobile Page 2)
  - Custom GLSL reflection shaders (`ReflectShader` on Hero & Page 4)
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
│   │   ├── Page2.tsx         ← adaptive: WebGL LiquidGlassCarousel (desktop) / CSS 3D CylinderCarousel (mobile)
│   │   ├── Page3.tsx         ← 3D BoxCarousel with click-to-redirect + skills typography
│   │   ├── Page4.tsx         ← footer / contact with Gestalt-grouped editorial links & colophon
│   │   ├── GlobalNav.tsx     ← fixed nav with scroll-driven animations & responsive branding
│   │   └── AboutCard.tsx     ← 3D floating drawer (light/dark adaptive)
│   ├── globals.css           ← global styles, scrollbar hiding
│   ├── layout.tsx            ← font loading, metadata, viewport, Analytics
│   └── page.tsx              ← main orchestrator (scroll scrub, theme, mobile section auto-scroll)
├── components/
│   ├── SmoothScroll.tsx      ← Lenis provider with typed window.__lenis
│   ├── fancy/
│   │   ├── carousel/box-carousel.tsx   ← 3D CSS cube with drag rotation & click-to-redirect
│   │   └── text/letter-swap-pingpong-anim.tsx
│   ├── originkit/ui/
│   │   ├── liquid-glass-carousel-custom-style.tsx  ← WebGL video carousel (desktop)
│   │   └── reflect-shader.tsx                      ← GLSL reflection shader
│   ├── react-bits/
│   │   ├── BlurText.tsx
│   │   └── GradualBlur.tsx
│   └── ui/
│       └── cylinder-carousel.tsx   ← mobile-native 3D cylinder carousel (concave, touch-drag)
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

### Public Assets
- `public/images/adarsh-26.webp` (61 KB)
- `public/images/sentinel-terminal.webp` (70 KB)
- `public/images/advance-animations.webp` (45 KB — mobile poster)
- `public/images/coffee-cup.webp` (74 KB — mobile poster)
- `public/images/human-brain.webp` (39 KB — mobile poster)
- `public/images/object-centric-animation-2.webp` (52 KB — mobile poster)
- `public/images/text-centric-animation-1.webp` (32 KB — mobile poster)
- `public/images/what-you-see.webp` (41 KB — mobile poster)
- `public/videos/*.webm` (6 video assets, ~10.7 MB total)

---

## Key Systems

### 1. Scroll Orchestration (`page.tsx`)
- Single GSAP ScrollTrigger timeline scrubs all 4 pages via `#main-scroll-container`.
- `isDarkTheme` state tracks scroll position (`progress >= 0.24 && < 0.74` = light for Page 2/3, dark elsewhere).
- `isAboutOpen` / `onToggleAbout` shared across GlobalNav, HeroSection, AboutCard.
- Fully typed Lenis exposed via `window.__lenis`.

### 2. Mobile Section Auto-Scroll / Smooth Snap (`page.tsx`)
- Vertical touch swipe & wheel intent detection on mobile devices (`threshold = 22px`).
- Distinguishes horizontal gestures (e.g. spinning the 3D carousels) from vertical section navigation.
- Automatically and smoothly glides to narrative section stops:
  - `0.00`: Hero Initial (dark cover, title, subtitle)
  - `0.18`: Hero Revealed (shader background active, 3-line statement in focus) — prevents skipping hero reveal
  - `0.38`: Page 2 (Light canvas with 3D CylinderCarousel)
  - `0.66`: Page 3 Projects (3D Cube Projects Gallery)
  - `0.86`: Page 3 Skills (Dark theme #080808 with animated BlurText skills)
  - `1.00`: Page 4 Footer (ReflectShader Contact Section)
- Uses `easeInOutCubic` easing over `duration: 1.4s` for a slow, silky, cinematic glide without abrupt cuts.

### 3. Preloader System (`Preloader.tsx`)
- **Asset Readiness**: Waits for `document.readyState`, `document.fonts.ready`, and all DOM images with 3.5s safety fallback.
- **Progress Animation**: Direct DOM ref (`counterNumberRef`) — zero React re-renders during count-up, preventing mobile text shifting.
- **Progress Counter**: Positioned as a sibling of the backdrop to the fixed `inset-0` container with `safe-area-inset-bottom` support.
- **Exit Morph**: GSAP timeline shrinks backdrop `100vh → 80vh`, while `ADARSH'26` scales to `1.0` and glides to `y: 0`.
- **Title Gap Calibration**:
  - Scale: `0.70` (mobile) / `0.62` (desktop) for prominent visual branding.
  - Resting Y: `44vh` (mobile) / `43.5vh` (desktop) creating a balanced **~18–20px** vertical gap under `MIXING CODE, AI, MOTION, & VISUALS`.
  - Zero layout shift during morph handoff into the Hero header.

### 4. Page 2 Adaptive Carousels (`Page2.tsx`)
- **Desktop (`>= 768px`)**: Full cinematic WebGL `LiquidGlassCarousel` with 6 interactive video textures, edge gradual blurs, dynamic card dimensions, and click-to-focus.
- **Mobile (`< 768px`)**: Lightweight CSS 3D `CylinderCarousel` (`cylinder-carousel.tsx`):
  - Theater-screen concave orientation (`face="concave"`, cards pushed inward into depth, edges coming forward).
  - 18 facets (`N = 18`, 20° per card) for a gentle, subtle arc rather than steep polygonal angles.
  - Native touch dragging following finger movement naturally, with smooth auto-rotation resuming 2.5s after release.
  - 0% WebGL overhead, 0 running video decoders, eliminating mobile battery and GPU drain.

### 5. Page 3 3D Box Carousel with Click Redirection (`box-carousel.tsx` & `Page3.tsx`)
- 4-face CSS 3D cube alternating between Sentinel and Adarsh'26 projects.
- **Click-to-Redirect**: Clicking or tapping the cube opens the active project's live site in a new tab:
  - Sentinel face -> `https://sentinel-magnm.vercel.app/`
  - Adarsh'26 face -> `https://adrz-26.vercel.app/`
- **Drag vs. Click Disambiguation**: Tracks pointer travel distance; movements > 6px are classified as drag rotations, suppressing click events. A 150ms post-drag lock prevents accidental navigation on touch/mouse release.
- **Visual Affordances**: `cursor-pointer` on hover, `cursor-grabbing` on drag, with native `title` and `aria-label` tooltips.
- **Keyboard Navigation**: `Enter` and `Space` keys open the active project site.

### 6. Page 4 Mobile Footer Hierarchy (`Page4.tsx`)
- **Single-Line Headline**: Shortened to `"Got a project? Let’s talk."` with `whitespace-nowrap` to prevent awkward line breaks on narrow screens.
- **Gestalt Proximity**:
  - Nav links (`LINKEDIN` and `GITHUB`) grouped tightly with `gap-1` (4px) and `inline-flex leading-none` to eliminate inline whitespace.
  - Distinct `mt-6` (24px) gap separating the navigation links from the metadata colophon.
  - Colophon texts (`DESIGN & DEV BY ADARSH` and `BASED IN INDIA`) grouped tightly (`gap-1` / 4px).
- **Desktop Spread**: Seamlessly expands to 3-column spread (`sm:flex-row sm:justify-between`) with credits on left, links in center, location on right.

### 7. AboutCard Drawer (`AboutCard.tsx`)
- **Adaptive Theming**: Light card (`bg-[#F7F7F7]`) on light scroll sections, dark card (`bg-[#090909]`) on dark sections.
- **Mobile**: Slides from right (`x: "100vw" → 0`), full viewport height, centered.
- **Desktop**: Docked right edge, `max-w-[400px]`.
- **3D Interaction**: Framer Motion spring tilt (`±10deg`), hover `zElevate: 0 → 38px`.

---

## Decisions & Patterns

1. **Strict TypeScript over Type Assertions**: Replaced all `(window as any)` with typed `window.__lenis` declared in `src/types/global.d.ts`.
2. **React 19 / React Compiler Compliance**:
   - Zero ref access/mutation during render.
   - All effect dependencies correctly wired with `useCallback` and `useMemo`.
   - Vendor components (`originkit/**`) scoped out in `eslint.config.mjs`.
3. **No `useState` for Frame-Rate Scrubbing**: Direct DOM updates on high-frequency properties (progress counter, scroll scrubbers) avoid reconciler fighting GSAP transforms.
4. **Adaptive Rendering for Mobile vs Desktop**:
   - WebGL & multi-video decoding reserved exclusively for desktop where GPUs and power budgets are ample.
   - Mobile uses GPU-accelerated CSS 3D transforms (`preserve-3d`, WebP assets) for smooth 60fps/120fps performance without thermal throttling.
5. **Drag vs Click Disambiguation**: Any draggable interactive element (e.g. 3D cube) uses a `hypot(deltaX, deltaY) > 6px` threshold with a post-drag timer guard to guarantee pure clicks navigate without false triggers.

---

## Problems Solved

1. **Preloader Title Crowding & Over-correction**:
   - At `42vh`, scaling title to `0.62`/`0.70` placed it within 2-4px of the subtitle.
   - Moving to `48vh`/`50vh` created an excessive ~65px empty gap.
   - Calibrated to `44vh` (mobile) / `43.5vh` (desktop) achieving the optimal ~18–20px editorial gap.
2. **Mobile Section Skipping on Swipe**:
   - Direct swiping from hero initial previously jumped straight to Page 2, skipping the reflected shader and 3-line statement.
   - Added stop at `progress = 0.18` (Hero Revealed) in the mobile section snap controller.
3. **Mobile Cylinder Carousel Curvature & Flow**:
   - Increased card count to 18 (20° per facet) with concave orientation (`face="concave"`), creating a natural theater-screen panoramic curve with direct touch drag.
4. **Mobile Footer Visual Clutter**:
   - Removed scattered 2x2 grid on mobile; structured into tightly paired nav links, a prominent 24px gap, and a tightly paired colophon.
5. **3D Cube Click Interactivity**:
   - Added click-to-redirect on the cube faces while preserving drag rotation without accidental navigation.
6. **ESLint & TypeScript Errors**:
   - Eliminated all 20 ESLint errors and strict type warnings; verified clean builds with Turbopack in 1.7s.

---

## Current State

- **Build**: `npm run build` succeeds with 0 errors (Next.js 16.3.5 Turbopack).
- **Lint**: `npx eslint` passes with 0 errors.
- **Types**: `npx tsc --noEmit` passes with 0 errors.
- **Git**: Working tree clean, all changes committed and pushed to `main` (`c12bd05`).
- **Live URL**: https://adrz-26.vercel.app
