# Memory — ADARSH'25 Portfolio Architecture & State

Last updated: 2026-09-19 (Session complete, pushed to `origin/main`)

---

## 1. Project Overview & Repository State

- **Repository**: `https://github.com/adarzhpathade/adrz-portfolio.git`
- **Branch**: `main` (Latest commit `50ede16`, working tree clean).
- **Core Tech Stack**:
  - **Framework**: Next.js 16.3.5 (App Router, Turbopack)
  - **Runtime & UI**: React 19.2.8, TypeScript 5, Tailwind CSS v4
  - **3D Graphics & Shaders**: Three.js 0.186.0, WebGL 2, Custom GLSL shaders
  - **Animation**: GSAP 3.15.0 (`ScrollTrigger`, `@gsap/react`), Framer Motion 13.4.0
  - **Smooth Scrolling**: Lenis 1.3.26 synchronized with GSAP ticker
  - **Typography**: PP Neue Montreal (Sans), PP Eiko (Display Italic), Fragment Mono (Monospace)
- **Production Build Status**: `npm run build` and `npx tsc --noEmit` pass with **0 errors**.

---

## 2. Page Architecture & Master Scroll System

The entire application runs on a pinned sticky scroll container in `src/app/page.tsx`:
- **Scroll Track**: `h-[220vh]` invisible div providing the scroll distance for GSAP ScrollTrigger.
- **Sticky Viewport**: `sticky top-0 left-0 w-full h-screen overflow-hidden`.
- **Layer Stacking Order**:
  - `z-30`: **Global Navigation Header (`GlobalNav.tsx`)** — Persistent across pages.
  - `z-20`: **Hero Section (`HeroSection.tsx`)** — Slides up and out of the viewport on scroll (`yPercent: -100` between scroll progress 0.55 and 1.00).
  - `z-10`: **Page 2 (`Page2.tsx`)** — Sits directly beneath Hero; fades in and triggers the 3D card carousel entrance when scroll progress reaches `>= 0.80`.

---

## 3. Component Deep Dive

### A. Global Navigation (`src/app/components/GlobalNav.tsx`)
- **Title Tracking Animation**:
  - Starts as the main hero headline (`ADARSH'25`, large display font).
  - On scroll (progress 0.55 -> 0.92), scales down (`0.22` desktop, `0.36` mobile) and translates to the top-left header position (`x: 18px / 10px`, `y: 12px / 8px`).
  - Color transitions smoothly from white (Hero) to dark `#080808` (Page 2).
- **Responsive Nav Links**: Right-aligned navigation links (`(Contact)`) stay inline with the title's vertical centerline on Page 2.

### B. Hero Section (`src/app/components/HeroSection.tsx`)
- **WebGL ReflectShader**: Chromatic reflection background responding to scroll progression.
- **Micro-Interactions**:
  - `LetterSwapPingPong`: Interactive letter swap on hover.
  - `BlurText`: Smooth word-by-word blur reveals on scroll.
- **Bottom Bio**:
  - Anchored at `absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full text-center`.
  - Typography: `text-[8px] sm:text-[10px] font-mono tracking-normal text-text-light/70 leading-tight uppercase`.

### C. Page 2 — 3D Liquid Glass Carousel (`src/app/components/Page2.tsx`)
- **6 Portfolio WebM Clips** (`public/videos/`):
  1. `Advance Animations.webm`
  2. `Coffee Cup.webm`
  3. `Human Brain.webm`
  4. `Object Centric Animation - 2.webm`
  5. `Text Centric Animation - 1.webm`
  6. `What You See -.webm`
- **Proportions**:
  - `cardWidth: 240px` (scaled down ~20% from original 300px for refined hierarchy)
  - `cardHeight: 390px` (scaled down ~20% from 490px)
  - `gap: 30px`
  - `cornerRadius: 18px`
- **Curvature & Layout**:
  - Shifted upward via `-translate-y-4 sm:-translate-y-6` with top padding `pt-10 sm:pt-14` and bottom padding `pb-8 sm:pb-12`.
  - Concave 3D arc: center cards curve inward into the screen (negative Z), outer cards curve forward toward the viewer with inward rotation (`rotY = -theta`).
- **Edge Gradual Blurs (`src/components/react-bits/GradualBlur.tsx`)**:
  - Attached to left and right edges (`width="6rem"`, `strength={0.9}`, `curve="ease-in"`, `zIndex={30}`).
- **Bottom Statement**:
  - Copy:
    ```
    A COLLECTION OF ORIGINAL MOTION GRAPHICS AND VISUAL EXPERIMENTS,
    CRAFTED THROUGH DESIGN, ANIMATION AND AFTER EFFECTS.
    ```
  - Styling: `text-[8px] sm:text-[10px] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase text-center`.
  - Positioned at `absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full text-center px-4 z-40 pointer-events-auto`.
  - Exactly matches the Hero section's bottom bio baseline and footprint.

### D. WebGL Engine (`src/components/originkit/ui/liquid-glass-carousel-custom-style.tsx`)
- **Video Texture Engine**:
  - Automatically detects video paths (`/\.(webm|mp4|mov|ogg)($|\?)/i`).
  - Instantiates background HTML5 `<video>` elements (`autoplay`, `loop`, `muted`, `defaultMuted`, `playsInline`).
  - Uses `THREE.VideoTexture` with `SRGBColorSpace`.
  - Captures `videoWidth` / `videoHeight` from `loadedmetadata` for UV cover window scaling.
  - Video elements tracked in `ownedVideos` and cleanly disposed in `destroy()`.
- **SDF Shader Corner Clipping (`sdCardBox`)**:
  - Injected into `MeshBasicMaterial.onBeforeCompile` via `shader.fragmentShader.replace('#include <common>', ...)`.
  - Replaces `#include <common>` to ensure `#version 300 es` remains on line 1 for WebGL 2 compliance.
  - Guarded with `#if defined(USE_UV)` and `mat.defines = { USE_UV: "" }`.
  - Smoothly clips corners using `smoothstep(0.5, -0.5, d)` without texture distortion.
- **Orchestrated 3D Entrance Reveal**:
  - Cards fly in from below the screen (`enterFrom: "bottom"`) in a wave from center outward.
  - Corner radius stays `0` during rise to eliminate pill-shape warping, blending into 18px rounded corners only once cards reach full dimensions.
  - Auto-scroll is paused during entry (`!inEntry`), preventing the 200px reveal snap/jitter.
  - `lastInput = 0` at `growEnd` so auto-scroll starts immediately with zero idle delay.
- **Mobile Touch Scroll & Gesture Disambiguation**:
  - Canvas DOM element set to `el.style.touchAction = "pan-y"`.
  - `onPointerDown` does **not** capture pointer on touch immediately.
  - In `onPointerMove`:
    - Vertical finger swipe (`dy > dx && dy > 8`): Marks gesture as vertical, releases pointer, allowing the mobile browser to natively scroll the webpage vertically.
    - Horizontal swipe (`dx >= dy && dx > 8`): Locks in horizontal drag via `el.setPointerCapture` and drags cards.
    - Desktop mouse dragging captures immediately on `pointerdown` for instant responsiveness.
  - Mouse wheel is decoupled (`wheel: false`), allowing vertical wheel scrolling to pass through to the page.

---

## 4. Key Problems Solved

1. **WebGL 2 Shader Compilation Crash**:
   - Fixed by injecting `sdCardBox` via `#include <common>` replacement instead of prepending, preserving `#version 300 es` as the first line of the shader.
2. **Video Autoplay in Three.js**:
   - Replaced static `TextureLoader` with HTML5 `<video>` element management and `THREE.VideoTexture`.
3. **Card Reveal Jitter & Pill-Shape Distortions**:
   - Paused `autoScroll` during entrance to eliminate the coordinate mismatch snap.
   - Set corner radius to 0 during entrance and blended in only when scale reaches $\ge 95\%$.
4. **Mobile Scroll Inability**:
   - Fixed canvas `touchAction = "none"` by changing to `"pan-y"`.
   - Added directional gesture disambiguation in pointer event listeners so vertical swipes scroll the page naturally on mobile devices.
5. **Missing Bottom Text on Mobile Viewports**:
   - Eliminated flex-column overflow clipping by anchoring the text to `absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full`.
   - Removed conflicting `min-h-screen` and flex centering from `<section>`.

---

## 5. Next Session Roadmap

1. **Subsequent Pages / Sections**:
   - Design and build Page 3 (e.g., Selected Case Studies, Detailed Project Breakdown, Interactive Labs, or About / Contact Section).
   - Extend the master scroll track distance in `src/app/page.tsx` (`h-[220vh]` -> `h-[340vh]+`) and configure smooth transition timelines.
2. **Video Modal / Expanded View (Optional)**:
   - Clicking a card can open a high-resolution full-screen modal or detailed case-study drawer with video audio unmuted and project write-ups.
3. **Performance & Asset Preloading**:
   - Add progressive loading or low-res poster frames for video clips if deployed on slower mobile networks.
