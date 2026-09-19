# ADARSH'25 — Creative Technologist & Motion Portfolio

> Designing, building & experimenting with code, AI & motion. Turning ideas into immersive digital experiences & visual stories.

A high-performance creative development portfolio engineered with **Next.js 16**, **React 19**, **Three.js / WebGL**, **GSAP ScrollTrigger**, and **Tailwind CSS v4**.

---

## ✨ Features & Highlights

### 1. Hero Section & Curtain Reveal
- **WebGL Reflect Shader**: Hardware-accelerated dynamic chromatic reflection background that reacts dynamically to scroll progress.
- **Micro-Interactive Typography**: Custom letter-swapping hover animations (`LetterSwapPingPong`) and blurred scroll-driven text reveals (`BlurText`).
- **Synchronized Scroll Choreography**: Pinned master viewport driven by **GSAP ScrollTrigger** and **Lenis** smooth scrolling.
- **Physical Curtain Transition**: Hero section slides up cleanly to reveal Page 2 beneath it once scroll progress passes the threshold.

### 2. Persistent Global Navigation
- **Dynamic Scale & Translate**: The `ADARSH'25` title begins prominently centered in the Hero section and smoothly scales and tracks to its persistent top-left header position on Page 2.
- **Responsive Navigation Actions**: Centerline-aligned interactive navigation links (`(Contact)`) with smooth page-scroll triggers.

### 3. Page 2 — 3D Liquid Glass Carousel & Motion Reel
- **Native WebGL Video Engine**: 6 portfolio showcase video clips rendered directly onto 3D planes using `THREE.VideoTexture` with seamless autoplay, looping, and lifecycle cleanup.
- **Concave 3D Cylindrical Arc**: Cards are positioned along a curved 3D cylinder where the center curves inward into the scene and outer cards curve toward the viewer (`rotY = -theta`).
- **Custom WebGL 2 SDF Corner Clipping**: Injected signed-distance-field box shader (`sdCardBox`) directly into `MeshBasicMaterial` for clean, anti-aliased rounded corners without texture stretching.
- **Smooth 3D Reveal & Auto-Scroll**:
  - Cards fly in from below the screen in a staggered wave from center outward, expanding to full size with `EXPO_INOUT` easing.
  - Sharp rectangular geometry during reveal blends into smooth rounded corners upon scale completion.
  - Zero-delay transition into continuous auto-scrolling with lockstep delta synchronization.
- **Decoupled Mouse Wheel & Mobile Touch Gestures**:
  - Desktop: Horizontal mouse dragging on cards, while mouse wheel scrolls the page vertically.
  - Mobile: Canvas configured with `touch-action: pan-y` and smart gesture disambiguation: vertical swipes scroll the page naturally, while horizontal swipes slide the carousel.
- **Subtle Edge Gradual Blurs**: Soft, non-intrusive edge fading using `GradualBlur` overlays.
- **Editorial Project Statement**: Minimalist monospace typography anchored to the bottom baseline (`Fragment Mono`), styled identically to the Hero section's bio.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & State**: [React 19](https://react.dev/), TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics & Shaders**: [Three.js](https://threejs.org/), Custom GLSL Shaders, WebGL 2
- **Animation & Timelines**: [GSAP](https://gsap.com/) (`ScrollTrigger`, `@gsap/react`), [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Typography**: PP Neue Montreal (Sans), PP Eiko (Display Italic), Fragment Mono (Monospace)

---

## 📂 Project Structure

```
├── public/
│   ├── fonts/           # Local typography (PP Neue Montreal, PP Eiko, Fragment Mono)
│   └── videos/          # WebM portfolio showcase animations
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── GlobalNav.tsx      # Persistent animated title & navigation
│   │   │   ├── HeroSection.tsx    # Hero section with ReflectShader & typography
│   │   │   └── Page2.tsx          # Page 2 layout & 3D carousel integration
│   │   ├── globals.css            # Tailwind CSS v4 design tokens & theme setup
│   │   ├── layout.tsx             # Root layout with local fonts & Lenis scroll
│   │   └── page.tsx               # Pinned sticky viewport & master scroll container
│   └── components/
│       ├── SmoothScroll.tsx       # Lenis smooth scroll provider synced to GSAP
│       ├── fancy/                 # Custom text animations (letter swapping)
│       ├── originkit/ui/          # WebGL 3D Carousel & Reflect Shader engines
│       └── react-bits/            # GradualBlur & BlurText UI components
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adarzhpathade/adrz-portfolio.git
   cd adrz-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 📄 License

Created by **Adarsh Pathade**. All rights reserved.
