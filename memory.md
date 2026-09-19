# Memory — Page 2 Liquid Glass Carousel with Video Autoplay & Scroll Entrance

Last updated: 2026-09-19 16:35:00

## What was built

- **WebGL Video Texture Engine (`src/components/originkit/ui/liquid-glass-carousel-custom-style.tsx`):**
  - Upgraded `LiquidGlassCarousel` texture loader to detect video source paths (`/\.(webm|mp4|mov|ogg)($|\?)/i`).
  - Automatically instantiates and manages background HTML5 `<video>` elements configured for seamless autoplay (`autoplay`, `loop`, `muted`, `defaultMuted`, `playsInline`).
  - Added user interaction autoplay unlock listener (`pointerdown`, `touchstart`) as a fallback if browser autoplay policy delays playback.
  - Binds each video to a `THREE.VideoTexture` rendered at 60fps with `SRGBColorSpace`.
  - Dynamically captures `videoWidth` and `videoHeight` from `loadedmetadata` to adjust aspect ratios and UV cover window coordinates.
  - Added thorough video lifecycle management (`ownedVideos`) to properly pause, detach, and unload all video elements upon disposal/destruction to avoid memory leaks.
  - Added `entryTrigger` prop support to allow parent components to re-trigger card rise animations dynamically.
  - Updated default preset background to `#ECECEC` with refined liquid glass lens parameters (`dispersion: 6`, `ringColor: "rgba(0, 0, 0, 0.08)"`).

- **Page 2 Carousel Integration & Scroll Entrance (`src/app/components/Page2.tsx`):**
  - Integrated 6 portfolio video clips from `public/videos/`:
    - `Advance Animations.webm`
    - `Coffee Cup.webm`
    - `Human Brain.webm`
    - `Object Centric Animation - 2.webm`
    - `Text Centric Animation - 1.webm`
    - `What You See -.webm`
  - Integrated GSAP `ScrollTrigger` synced to `#main-scroll-container`:
    - Carousel container starts hidden below the viewport (`y: 180px`, `opacity: 0`, `pointerEvents: "none"`).
    - As soon as the Hero section curtain slides up to uncover Page 2 (`progress >= 0.82`), the carousel smoothly glides up to `y: 0`, `opacity: 1` over `0.9s` with `power3.out` easing, enabling pointer interactions and triggering the 3D card rise effect.
    - When scrolling back up towards the Hero (`progress < 0.60`), the carousel smoothly glides back down (`y: 180px`, `opacity: 0`) and disables pointer events so it will cleanly replay next time Page 2 is reached.

- **Page Layer Pointer Events (`src/app/page.tsx`):**
  - Updated Page 2 wrapper with `pointer-events-auto`, enabling smooth horizontal drag, click-to-focus, and wheel navigation on the carousel once Page 2 is visible.

## Decisions made

- **Native THREE.VideoTexture over DOM Video Layering**:
  - Embedding the videos directly as Three.js textures preserves the 3D depth, perspective, card tilting, and the liquid glass lens refraction/distortion shader effects across all cards.
- **ScrollTrigger Progress Threshold for Entrance**:
  - Triggering the reveal tween at `progress >= 0.82` ensures the carousel glides up precisely as the physical curtain opens, rather than prematurely animating while covered by the hero.
- **Bidirectional Smooth Reset**:
  - Hiding the carousel back down when scrolling back up (`progress < 0.60`) ensures a deterministic experience in both directions.

## Problems solved

- **Three.js TextureLoader Video Incompatibility**:
  - Standard `THREE.TextureLoader.load()` only handles static images, which previously caused video paths to error out and fall back to numbered canvas placeholders. Replaced with `THREE.VideoTexture` and video lifecycle management.
- **Autoplay Policy Constraints**:
  - Added both `defaultMuted`, `muted`, `playsinline`, and a one-time window pointerdown listener fallback so video playback starts unconditionally.

## Current state

- Hero section and curtain reveal function smoothly.
- Page 2 displays the Liquid Glass Carousel with all 6 videos autoplaying in 3D.
- Bottom-to-top reveal animation triggers as Page 2 comes fully into screen.
- Carousel automatically scrolls on repeat (`speed: 65px/s`, seamlessly wraps modulo `totalWidth`) and resumes after user drags.
- 3D cylindrical side curvature configured as a concave wrap-around arc: center part curves inward into the screen (negative Z), while the sides curve forward toward the viewer with inward rotation (`rotY = -theta`).
- Center liquid glass lens effect is temporarily disabled (`lens={{ enabled: false }}`).
- Integrated `<GradualBlur />` on both left and right edges with refined, subtle parameters (`width="6rem"`, `strength={0.9}`, `curve="ease-in"`, `exponential={false}`) so cards softly dissolve at the screen edges without overwhelming the viewport.
- Card Edge Curving: Injected a signed-distance-field (SDF) box corner shader (`sdCardBox`) into `MeshBasicMaterial.onBeforeCompile` with `uCornerRadius` (22px) and dynamic `uCardSize` updates, replacing `#include <common>` to preserve `#version 300 es` on line 1, and guarded with `USE_UV` to ensure 100% stable WebGL 2 shader compilation.
- Jitter Elimination & Restored Signature Incoming Animation:
  - Restored the full signature 3D incoming card animation: cards fly in from below the screen (`enterFrom: "bottom"`) in an orchestrated wave from center outward, fanning out into the 3D curved space, and expanding from initial height to full size with `EXPO_INOUT` easing.
  - Eliminated the incoming snap/jitter: paused `autoScroll` while `inEntry` (`entryActive || entrySettled`) is running so `scroll` stays locked to the center card until cards are fully in place. When entry completes, `off` and `centerX` match with 0px difference, transitioning seamlessly into smooth continuous auto-scroll.
  - Sharp Edges During Reveal: Kept `uCornerRadius = 0` during the entire reveal and fanning out phase, completely eliminating the pill shape distortion. The subtle corner curvature (22px) only blends in once the cards reach their full dimensions.
  - Immediate Scroll Upon Scaling: Removed the 1.0s idle delay after card scale completion (`lastInput = 0` at `growEnd`), and tightened scale timing so auto-scroll begins immediately as soon as cards reach their full size.
  - Decoupled Mouse Scroll from Cards: Set `wheel: false` and `touchAction: "pan-y"` so mouse wheel scrolling passes cleanly through to the main webpage, allowing vertical navigation to subsequent pages. Dragging with mouse/touch (`drag: true`) remains fully functional on the cards.
  - Fixed carousel wrapping math with canonical screen-centered continuous formula (`REPEATS = 5`), ensuring cards never swap mesh instances in the viewport.
  - Eliminated auto-scroll lag oscillation by advancing `scroll` and `target` in lockstep during steady auto-scroll, with `scrollEnergy` zeroed out so card scale remains rock-solid without vibrating.
- Scaled Down Cards & Elevated Upward Layout:
  - Scaled cards down by ~20%: `cardWidth={240}` (down from 300), `cardHeight={390}` (down from 490), `gap={30}` (down from 38), and `cornerRadius={18}` (down from 22).
  - Shifted carousel upward (`-translate-y-4 sm:-translate-y-6` inside a `flex-1 min-h-0` wrapper) to provide generous visual breathing room in the lower viewport.
  - Bottom Statement Matching Hero Section:
    - Text: `A collection of original motion graphics and visual experiments,` / `crafted through design, animation and After Effects.`
    - Styling: `text-[8px] sm:text-[10px] font-mono tracking-normal text-[#080808]/70 leading-tight uppercase text-center`.
    - Positioned at `absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-full text-center px-4 z-40 pointer-events-auto`, guaranteeing 100% visibility on all phone screens without being clipped off by flex overflow.
- Mobile Touch Scroll & Gesture Disambiguation:
  - Set WebGL canvas `el.style.touchAction = "pan-y"`, allowing the mobile browser to process native vertical touch scroll events.
  - Added smart touch gesture disambiguation in `onPointerDown`/`onPointerMove`:
    - Vertical finger swipes (`dy > dx && dy > 8`) immediately yield control to native browser page scrolling.
    - Horizontal swipes (`dx >= dy && dx > 8`) lock into carousel card drag with `setPointerCapture`.
    - Desktop mouse dragging remains immediate and unaffected.
- Production build passes with zero errors (`npm run build`).

## Next session starts with

- Building next pages or fine-tuning any specific typography, animations, or video details requested by user.
