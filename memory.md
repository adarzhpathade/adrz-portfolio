# Memory — Desktop View Polish, 3D Box Cube Drag Interaction & Typography Harmonization

Last updated: 2026-09-20 (Verified with 0 TypeScript/build errors)

---

## What was built

1. **Interactive 3D Box Carousel with Natural Grab & Drag Controls** ([src/components/fancy/carousel/box-carousel.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/components/fancy/carousel/box-carousel.tsx)):
   - Replaced `cursor-move` with standard `cursor-grab` on hover and `cursor-grabbing` while actively dragging.
   - Added `select-none pointer-events-none` to all media elements (images and videos) in `MediaRenderer` to eliminate native browser drag ghosting.
   - Fixed pointer event blocking from the invisible dark canvas skills overlay (`skillsContainerRef`), allowing mouse hover and click events to directly reach the 3D cube.
   - Upgraded drag responsiveness (`delta * dragSensitivity`) and motion value transform sync (`[baseRotateX, baseRotateY]`), enabling fluid 1:1 rotation and spring snapping to adjacent project faces.
   - Drag affordance is communicated cleanly and unobtrusively via `cursor-grab` on hover and `cursor-grabbing` during drag (no extra floating text pills).

2. **Skills Section Refinement on Dark Canvas** ([src/app/components/Page3.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/Page3.tsx)):
   - Centered 5 discipline items revealed with `LetterSwapPingPong` slot-machine hover animations.
   - Standardized typography to clean, un-italicized modern sans (`font-sans font-[450] uppercase tracking-tight`).
   - Removed section numbering prefixes (`01.`–`05.`) and discipline headers for a clean, editorial presentation.
   - Positioned supporting descriptive copy at the viewport bottom, matching the exact styling and responsive layout of the hero and Page 2 descriptions.

3. **Active Project Title Refinement** ([src/app/components/Page3.tsx](file:///e:/Projects/Landing%20Pages/adrz%20-%20Portfolio/src/app/components/Page3.tsx)):
   - Updated the primary project title to **SENTINEL** only (removed `TERMINAL`).
   - Replaced underline effect with `LetterSwapPingPong` slot-machine hover animation.
   - Dynamic label segmenting supporting both single-font sans and multi-segment font styles.

4. **Harmonized Monospace Editorial Typography Across All Viewports**:
   - Standardized secondary captions across Hero, Page 2, and Page 3 to use `text-[8px] sm:text-[10px] font-mono tracking-normal leading-tight uppercase`.
   - Balanced responsive line wraps across mobile, tablet, and desktop viewports.

5. **Scroll-Driven Dark Canvas Transition**:
   - Scrubbed GSAP timeline smoothly transitioning background from `#ECECEC` to `#080808` (`0.83 -> 0.98`).
   - Letter-by-letter dissolution of `PROJECTS` heading using React Bits `BlurText` styling.
   - Persistent GlobalNav smoothly transitioning typography color from `#080808` to `#FFFFFF` without positional shift.

---

## Decisions Made

- **Pointer Events Delegation**:
  - `skillsContainerRef` overlay explicitly set to `pointer-events-none` until `skillsInView` is true (`progress >= 0.92`), ensuring the 3D cube and interactive project titles remain 100% clickable and draggable while Page 3 is active.
- **Direct MotionValue Transform over Spring Transform**:
  - Passing `[baseRotateX, baseRotateY]` directly into `useTransform` ensures zero-latency tracking of mouse and touch drag gestures, while spring physics handle the release snap seamlessly.
- **AutoPlay Hover State**:
  - Automatically pausing autoPlay when `isHovered` or `isDragging` prevents jarring transitions when users inspect or interact with project cards.
- **Typography Consistency**:
  - Unified all small metadata and secondary captions into `text-[8px] sm:text-[10px] font-mono tracking-normal leading-tight uppercase` across every page for strict editorial coherence.

---

## Problems Solved

1. **Cube Drag & Hover Failure**:
   - Invisible skills overlay at `z-30` had inner elements with hardcoded `pointer-events-auto`, swallowing all mouse events over the center of Page 3. Solved by scoping pointer events to `skillsInView`.
2. **Autoplay Conflict During Drag**:
   - Autoplay ticks previously fired while dragging or set `isRotating.current`, preventing drag start. Solved by pausing autoplay on hover and drag.
3. **Heavy Drag Feeling**:
   - Drag formula previously halved the delta (`(delta * dragSensitivity) / 2`), requiring 360px movement to turn 90°. Tuned to `delta * dragSensitivity` for effortless flicking.
4. **Native Browser Ghost Dragging**:
   - `<img>` tags inside cube faces initiated default browser image drags instead of cube rotations. Fixed with `select-none pointer-events-none draggable={false}`.

---

## Current State

- **Desktop View**: Fully polished, verified, and approved by the user.
- **TypeScript Compilation**: `npx tsc --noEmit` passes with **0 errors**.
- **Next.js Production Build**: Passes cleanly.
- **Dev Server**: Active on `http://localhost:3000`.

---

## Next Session Starts With

1. Mobile responsiveness audit and touch optimization for Page 3, skills overlay, and 3D cube layout.
2. Any additional sections or footer content requested on the dark canvas.

---

## Open Questions

- What content or features are planned for subsequent sections on the dark canvas (e.g. About bio, Experience timeline, or Contact form)?
