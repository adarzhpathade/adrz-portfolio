# Memory — Adarsh'26 Portfolio (adrz)

Last updated: 2026-09-22 (Production build & ESLint clean — 0 errors, ready for deployment)

---

## Project Overview

A cinematic, scroll-driven portfolio site built with **Next.js 16**, **GSAP**, **Three.js**, **Framer Motion**, and **Lenis** smooth scroll. Features a 4-page vertical scroll experience with 3D carousels, GLSL shaders, spring-physics UI, and a coordinated preloader.

**Live URL**: https://adrz-26.vercel.app  
**Repo**: https://github.com/adarzhpathade/adrz-portfolio  

---

## Architecture

### Tech Stack
- **Framework**: Next.js 16.3.5 (App Router, Turbopack)
- **Animation**: GSAP + ScrollTrigger (scroll-linked), Framer Motion (spring physics, layout)
- **3D**: Three.js (LiquidGlassCarousel WebGL), CSS 3D transforms (BoxCarousel)
- **Scroll**: Lenis smooth scroll (exposed via `window.__lenis`)
- **Styling**: Tailwind CSS v4 + custom CSS
- **Fonts**: PP Neue Montreal (Regular/Light), PP Eiko (Italic), Fragment Mono — self-hosted woff2 in `src/fonts/`
- **Analytics**: Vercel Analytics (`@vercel/analytics/next`)
- **Deploy**: Vercel (auto-deploy from `main` branch)

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
│   ├── globals.css           ← global styles, scrollbar hiding
│   ├── layout.tsx            ← font loading, metadata, viewport, Analytics
│   └── page.tsx              ← main orchestrator (scroll, theme, state)
├── components/               ← shared/reusable UI libraries
│   ├── SmoothScroll.tsx      ← Lenis provider with mobile-optimized config
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
│   ├── PPNeueMontreal-Regular.woff2
│   ├── PPNeueMontreal-Light.woff2
│   ├── PPEiko-RegularItalic.woff2
│   └── FragmentMono-Regular.woff2
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
Total public/ size: ~10.8 MB. All filenames are kebab-case (no spaces, no special chars) for Vercel URL compatibility.

---

## Key Systems

### 1. Scroll Orchestration (`page.tsx`)
- Single GSAP ScrollTrigger timeline scrubs all 4 pages via `#main-scroll-container`.
- `isDarkTheme` state tracks scroll position (`progress >= 0.24 && < 0.74` = light for Page 2/3, dark elsewhere).
- `isAboutOpen` / `onToggleAbout` shared across GlobalNav, HeroSection, AboutCard.
- Lenis exposed via `window.__lenis` — used by Preloader for scroll lock/unlock.

### 2. Lenis Smooth Scroll (`SmoothScroll.tsx`)
- **Desktop**: `wheelMultiplier: 1`, `duration: 1.2` — smooth and controlled.
- **Mobile**: `touchMultiplier: 1.2` (reduced from 2 — was too aggressive/jumpy), `syncTouch: true`, `syncTouchLerp: 0.075` — native-feeling momentum on touch devices.
- Synced to GSAP ticker via `gsap.ticker.add()` with `lagSmoothing(0)`.

### 3. Preloader System (`Preloader.tsx`)
- **Readiness**: Waits for `document.readyState`, `document.fonts.ready`, and all images.
- **Progress**: Direct DOM ref (`counterNumberRef`) — no React re-renders during count-up. Prevents mobile text shifting.
- **Counter Position**: Counter is a **sibling** of the backdrop (not a child) — positioned to the fixed `inset-0` container (actual viewport). This prevents iOS `100vh` clipping where `h-screen` extends beyond the visible area. Uses `bottom-[max(3vh,env(safe-area-inset-bottom,12px))]` for phones with notches/home indicators, `sm:bottom-[7vh]` for larger screens.
- **Exit Morph**: GSAP timeline — counter blurs out, backdrop shrinks `100vh → 80vh`, `ADARSH'26` scales `0.38 → 1.0` and glides to hero position.
- **Scroll Lock**: `body.style.overflow = "hidden"` + `lenis.stop()` during load, released on complete with `lenis.start()` + `ScrollTrigger.refresh()`.
- **Coordination**: `setIsPreloaderExiting(true)` → HeroSection fades in side elements. `setIsPreloaderComplete(true)` → scroll unlocked.

### 4. AboutCard Drawer (`AboutCard.tsx`)
- **Adaptive Theming**: Light card (`bg-[#F7F7F7]`) on light scroll sections, dark card (`bg-[#090909]`) on dark sections. Controlled by `isDark` prop from page.tsx scroll progress.
- **Mobile**: Slides from right (`x: "100vw" → 0`), full viewport height, centered.
- **Desktop**: Docked right edge, `max-w-[400px]`.
- **3D Interaction**: Framer Motion spring tilt (`±10deg`), hover `zElevate: 0 → 38px`.
- **Overlay**: Transparent dismiss (`bg-black/20` dark, `bg-black/10` light, `backdrop-blur-[1px]`).

### 5. Carousel Systems
- **LiquidGlassCarousel** (Page 2): WebGL/Three.js with video textures. Dynamic card dimensions (`targetHeight ≈ 44% vh`).
- **BoxCarousel** (Page 3): CSS 3D cube with drag rotation and click-to-redirect. Dynamic dimensions (`targetHeight ≈ 31% vh`, aspect 1.71). Safety timeout guards on rotation lock to prevent drag deadlocks. Features click vs. drag disambiguation (>6px drag suppression + 150ms post-drag lock) allowing clicking any face to open its live project website.

### 6. Zoom Resilience
- All display headings use dual-axis clamping: `clamp(min, vw, vh)` to prevent blowup on zoom-out.
- Carousel dimensions are `vh`-proportional, not pixel-hardcoded.
- Tested across 50%–125% browser zoom.

### 7. iOS / Mobile Viewport Handling
- `viewport-fit: cover` exported from `layout.tsx` — enables `env(safe-area-inset-*)` CSS variables on iOS.
### 8. Mobile Optimization & Performance Architecture
- **Native Touch Scroll**: Lenis `syncTouch: false`, `touchMultiplier: 1` on touch devices gives 1:1 finger tracking and native 60Hz/120Hz momentum without laggy 7.5% software lerp delays. Desktop `smoothWheel: true`, `wheelMultiplier: 1`, `duration: 1.2` preserved.
- **Dynamic Scrub**: Responsive scrub in GSAP timelines (`scrub: isMobile ? 0.35 : 1`) eliminates the desktop 1-second lag when touching/swiping.
- **Dual-Axis Headings & Breakpoints**:
  - `ADARSH'26`: `text-[clamp(2.4rem,11.5vw,17vh)] sm:text-[clamp(3.5rem,12vw,17vh)]` (prevents title overflow on 360–390px phones).
  - `PROJECTS`: `text-[clamp(2.3rem,12vw,16.5vh)] sm:text-[clamp(3.5rem,13vw,16.5vh)]` (prevents horizontal clipping).
  - `LET'S CREATE.`: `text-[clamp(2.2rem,11.5vw,17vh)] sm:text-[clamp(3.5rem,13vw,17vh)]`.
  - Technologies: `break-words max-w-[92vw] sm:whitespace-nowrap`.
  - GlobalNav pinned logo: mobile `targetScale: 0.32` (avoids colliding with `(Contact)` / `(About)` buttons).
- **GPU & Battery Throttling**:
  - WebGL DPR capped at `1.25` on mobile (vs `2.0` on desktop) to prevent fill-rate overload on 3.0x retina screens.
  - `IntersectionObserver` on `LiquidGlassCarousel` & `ReflectShader`: halts WebGL frame loops (`raf`) and pauses all 6 HTML5 `<video>` decoders when off-screen, resuming instantly when scrolled into view.

---

## Decisions & Patterns

- **No `useState` for frame-rate updates** — Use direct DOM refs to avoid React reconciler fighting GSAP transforms (learned from Preloader mobile fix).
- **Preserve-3D context** — No `overflow: hidden` on 3D wrapper ancestors on desktop; breaks `translateZ` child parallax.
- **`zElevate` via spring, not static CSS** — Static `translateZ` on inline words tears sentence baselines apart in perspective projection. Spring from `0 → 38px` on hover keeps text flat at rest.
- **Counter outside backdrop** — Preloader counter is a sibling of the backdrop div, not a child. On iOS, `h-screen` (100vh) extends past the visible viewport (includes URL bar), so children positioned at `bottom` get clipped below visibility.
- **Kebab-case filenames** — All assets use lowercase hyphenated names (no spaces, no special chars) for Vercel URL compatibility.
- **WebP for images** — 97% size reduction vs PNG with near-identical visual quality.
- **Videos in public/** — At ~10.7 MB total, well within Vercel's 250 MB deployment limit. No external hosting needed.
- **Native touch scroll for mobile** — Lenis `syncTouch: false` allows native mobile momentum, while desktop retains 1.2s smooth wheel.

---

## Problems Solved

1. **Carousel Drag Deadlock**: `isRotating.current` stuck true after interrupted animations. Fixed with immediate `baseRotate.stop()` on touch/mouse start + safety timeout guards.
2. **Carousel Pointer Lockout on Scrollback**: `pointerEvents = "none"` set on scroll-down never restored on scroll-up. Fixed by explicitly restoring in reverse scroll path.
3. **Mobile Preloader Text Shifting**: `useState(displayProgress)` caused ~60 re-renders/sec on mobile. Replaced with direct DOM ref.
4. **Mobile Loader Counter Not Visible**: Counter was inside the `h-screen` backdrop div. On iOS, `100vh` extends beyond visible viewport (includes URL bar height), pushing the counter below visibility. Moved counter outside backdrop as a sibling, positioned to the fixed `inset-0` container.
5. **Mobile Text Cut-off on Small Viewports**: Fixed hardcoded `3.5rem` minimum clamps across Hero, Projects, and Let's Create display titles by providing smaller responsive minimums for mobile (`sm:` prefix keeps desktop identical).
6. **Mobile Touch Scroll Lag**: Replaced `syncTouch: true` with native momentum scroll (`syncTouch: false`) and responsive GSAP scrub (`isMobile ? 0.35 : 1`), removing the 1-second touch lag.
7. **Mobile GPU & Battery Drain**: Reduced DPR to 1.25 on mobile and added IntersectionObserver to pause offscreen WebGL shaders and carousel video decoding.
8. **Layout Errors on Resize**: Removed `key={width-height}` from BoxCarousel. Added `backface-visibility: hidden` for WebKit z-buffer flicker.
9. **Universal Scrollbar Removal**: Hidden across Chrome/Safari/Edge/Firefox via globals.css.
10. **Mobile 3D Carousel Performance & Curvature**: Replaced heavy WebGL `LiquidGlassCarousel` on mobile `< 768px` with CSS 3D `CylinderCarousel` using 6 WebP posters (-96% payload). Fixed extreme inward fish-eye curvature by increasing perspective from 512px (32em) to 1600px, doubling small item sets to 12 facets (lowering card angle step from 60° to 30°), using a relaxed radius, and adopting a subtle convex stage orientation so the active card stays hero in front while side cards curve gracefully backward into depth.
11. **Mobile Nav Refinement**: Enlarged `ADARSH'26` in `GlobalNav` to `targetScale: 0.50` (~23px) so it stands out distinctly larger than the `(About)` button (`text-xs` / 12px). Removed `(Contact)` from `GlobalNav` on mobile view only, while fully keeping `(Contact)` on the `HeroSection` on mobile and desktop.

---

## Current State

- **Build**: `next build` passes with 0 errors (TypeScript + compilation).
- **Deploy**: Live on Vercel at https://adrz-26.vercel.app
- **Analytics**: Vercel Analytics active (`@vercel/analytics/next` in layout.tsx).
- **All pages**: Hero, Page 2, Page 3, Page 4, GlobalNav, AboutCard — fully responsive.
- **Mobile**: `CylinderCarousel` on Page 2 with 6 WebP posters, native touch momentum, zero video decoder overhead.
- **Desktop**: 100% untouched — full cinematic WebGL `LiquidGlassCarousel` with 6 interactive video cards and edge blurs.
- **Assets**: All images (.webp) and videos (.webm) production-ready with clean filenames.

