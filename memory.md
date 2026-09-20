# Memory — Adarsh'26 Portfolio (adrz)

Last updated: 2026-09-20 (Production build verified — 0 TypeScript/build errors)

---

## Project Overview

A cinematic, scroll-driven portfolio site built with **Next.js 16**, **GSAP**, **Three.js**, **Framer Motion**, and **Lenis** smooth scroll. Features a 4-page vertical scroll experience with 3D carousels, GLSL shaders, spring-physics UI, and a coordinated preloader.

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16.3.5 (App Router, Turbopack)
- **Animation**: GSAP + ScrollTrigger (scroll-linked), Framer Motion (spring physics, layout)
- **3D**: Three.js (LiquidGlassCarousel WebGL), CSS 3D transforms (BoxCarousel)
- **Scroll**: Lenis smooth scroll (exposed via `window.__lenis`)
- **Styling**: Tailwind CSS + custom CSS
- **Fonts**: PP Neue Montreal (Regular/Light), PP Eiko (Italic), Fragment Mono
- **Deploy**: Vercel

### File Structure
```
src/
├── app/
│   ├── components/           ← page-level components
│   │   ├── Preloader.tsx     ← cinematic loader with GSAP exit morph
│   │   ├── HeroSection.tsx   ← hero with ADARSH'26, shader, bio
│   │   ├── Page2.tsx         ← LiquidGlassCarousel (WebGL video carousel)
│   │   ├── Page3.tsx         ← 3D BoxCarousel + skills typography
│   │   ├── Page4.tsx         ← footer / contact
│   │   ├── GlobalNav.tsx     ← fixed nav with scroll-driven animations
│   │   └── AboutCard.tsx     ← 3D floating drawer (light/dark adaptive)
│   ├── globals.css
│   ├── layout.tsx            ← font loading (4 fonts)
│   └── page.tsx              ← main orchestrator (scroll, theme, state)
├── components/               ← shared/reusable UI libraries
│   ├── SmoothScroll.tsx      ← Lenis provider
│   ├── fancy/
│   │   ├── carousel/box-carousel.tsx   ← 3D CSS cube carousel
│   │   └── text/letter-swap-pingpong-anim.tsx
│   ├── originkit/ui/
│   │   ├── liquid-glass-carousel-custom-style.tsx  ← WebGL video carousel
│   │   └── reflect-shader.tsx                      ← GLSL reflection shader
│   └── react-bits/
│       ├── BlurText.tsx
│       └── GradualBlur.tsx
├── fonts/                    ← 4 woff2 font files (only used ones)
├── hooks/use-screen-size.ts
└── lib/utils.ts
```

### Public Assets
```
public/
├── images/
│   ├── adarsh-26.webp          (61 KB — converted from 2.1MB PNG)
│   └── sentinel-terminal.webp  (70 KB — converted from 2.1MB PNG)
└── videos/
    ├── advance-animations.webm     (2.2 MB)
    ├── coffee-cup.webm             (3.8 MB)
    ├── human-brain.webm            (0.6 MB)
    ├── object-centric-animation-2.webm (3.2 MB)
    ├── text-centric-animation-1.webm   (0.4 MB)
    └── what-you-see.webm          (0.5 MB)
```
Total public/ size: ~10.8 MB (down from ~24 MB after .webp conversion and cleanup).

---

## Key Systems

### 1. Scroll Orchestration (`page.tsx`)
- Single GSAP ScrollTrigger timeline scrubs all 4 pages via `#main-scroll-container`.
- `isDarkTheme` state tracks scroll position (`progress >= 0.24 && < 0.74` = light for Page 2/3, dark elsewhere).
- `isAboutOpen` / `onToggleAbout` shared across GlobalNav, HeroSection, AboutCard.
- Lenis exposed via `window.__lenis` — used by Preloader for scroll lock/unlock.

### 2. Preloader System (`Preloader.tsx`)
- **Readiness**: Waits for `document.readyState`, `document.fonts.ready`, and all images.
- **Progress**: Direct DOM ref (`counterNumberRef`) — no React re-renders during count-up. Prevents mobile text shifting.
- **Exit Morph**: GSAP timeline — counter blurs out, backdrop shrinks `100vh → 80vh`, `ADARSH'26` scales `0.38 → 1.0` and glides to hero position.
- **Scroll Lock**: `body.style.overflow = "hidden"` + `lenis.stop()` during load, released on complete with `lenis.start()` + `ScrollTrigger.refresh()`.
- **Coordination**: `setIsPreloaderExiting(true)` → HeroSection fades in side elements. `setIsPreloaderComplete(true)` → scroll unlocked.

### 3. AboutCard Drawer (`AboutCard.tsx`)
- **Adaptive Theming**: Light card (`bg-[#F7F7F7]`) on light scroll sections, dark card (`bg-[#090909]`) on dark sections. Controlled by `isDark` prop from page.tsx scroll progress.
- **Mobile**: Slides from right (`x: "100vw" → 0`), full viewport height, centered.
- **Desktop**: Docked right edge, `max-w-[400px]`.
- **3D Interaction**: Framer Motion spring tilt (`±10deg`), hover `zElevate: 0 → 38px`.
- **Overlay**: Transparent dismiss (`bg-black/20` dark, `bg-black/10` light, `backdrop-blur-[1px]`).

### 4. Carousel Systems
- **LiquidGlassCarousel** (Page 2): WebGL/Three.js with video textures. Dynamic card dimensions (`targetHeight ≈ 44% vh`).
- **BoxCarousel** (Page 3): CSS 3D cube with drag rotation. Dynamic dimensions (`targetHeight ≈ 31% vh`, aspect 1.71). Safety timeout guards on rotation lock to prevent drag deadlocks.

### 5. Zoom Resilience
- All display headings use dual-axis clamping: `clamp(min, vw, vh)` to prevent blowup on zoom-out.
- Carousel dimensions are `vh`-proportional, not pixel-hardcoded.
- Tested across 50%–125% browser zoom.

---

## Decisions & Patterns

- **No `useState` for frame-rate updates** — Use direct DOM refs to avoid React reconciler fighting GSAP transforms (learned from Preloader mobile fix).
- **Preserve-3D context** — No `overflow: hidden` on 3D wrapper ancestors on desktop; breaks `translateZ` child parallax.
- **`zElevate` via spring, not static CSS** — Static `translateZ` on inline words tears sentence baselines apart in perspective projection. Spring from `0 → 38px` on hover keeps text flat at rest.
- **Kebab-case filenames** — All assets use lowercase hyphenated names (no spaces, no special chars) for Vercel URL compatibility.
- **WebP for images** — 97% size reduction vs PNG with near-identical visual quality.
- **Videos in public/** — At ~10.7 MB total, well within Vercel's 250 MB deployment limit. No external hosting needed.

---

## Problems Solved

1. **Carousel Drag Deadlock**: `isRotating.current` stuck true after interrupted animations. Fixed with immediate `baseRotate.stop()` on touch/mouse start + safety timeout guards.
2. **Carousel Pointer Lockout on Scrollback**: `pointerEvents = "none"` set on scroll-down never restored on scroll-up. Fixed by explicitly restoring in reverse scroll path.
3. **Mobile Preloader Text Shifting**: `useState(displayProgress)` caused ~60 re-renders/sec on mobile. Replaced with direct DOM ref.
4. **Layout Errors on Resize**: `key={width-height}` on BoxCarousel destroyed component on every pixel change. Removed. Added `backface-visibility: hidden` for WebKit z-buffer flicker.
5. **Universal Scrollbar Removal**: Hidden across Chrome/Safari/Edge/Firefox via `::-webkit-scrollbar`, `scrollbar-width: none`, `-ms-overflow-style: none` in globals.css.

---

## Current State

- **Build**: `next build` passes with 0 errors (TypeScript + compilation).
- **All pages**: Hero, Page 2, Page 3, Page 4, GlobalNav, AboutCard — fully responsive and tested.
- **Preloader**: Cinematic loader synced with Hero and Lenis.
- **Assets**: All images (.webp) and videos (.webm) production-ready with clean filenames.
- **Deploy**: Ready for Vercel deployment.
