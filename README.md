# ADARSH'26 — Design Folio

A cinematic, scroll-driven portfolio built with **Next.js 16**, **Three.js**, **GSAP**, and **Framer Motion**. Mixing code, AI, motion, and visuals into one immersive digital experience.

**[→ View Live](https://adrz-2026.vercel.app)**

---

## About

**Adarsh Pathade** is a designer and developer focused on digital experiences, motion, and creative development. With a strong eye for visual design and interaction, he builds modern websites that blend design with code — clean interfaces, smooth animations, and immersive digital experiences.

Currently pursuing **B.Tech in Computer Science & IT** at Acropolis Institute of Technology & Research (2024 – Present). Based in India.

---

## What's Inside

The site is a **4-page vertical scroll experience** with a cinematic preloader, synchronized scroll-driven animations, and 3D interactive elements.

### Pages

| Section | Description |
|---------|-------------|
| **Preloader** | Cinematic loading screen with asset readiness tracking and a choreographed GSAP exit morph that seamlessly transitions into the Hero |
| **Hero** | Full-viewport title reveal with GLSL reflection shader, word-by-word blur reveal, and editorial typography |
| **Work — Motion** | WebGL liquid glass carousel showcasing motion design & animation work (video textures rendered in Three.js) |
| **Work — Projects** | 3D CSS cube carousel with featured projects, followed by a skills typography lockup |
| **Contact** | Large-scale CTA with GLSL shader background, direct email link, and social links |

### Interactions

- **3D About Card** — Spring-physics floating drawer with tilt tracking, hover depth elevation, and adaptive light/dark theming based on scroll position
- **Scroll-Driven Animations** — Every element on the page is choreographed to a master GSAP ScrollTrigger timeline
- **Smooth Scroll** — Lenis smooth scroll with scroll locking during preloader
- **Zoom Resilience** — Dual-axis `clamp(min, vw, vh)` typography ensures the layout holds from 50% to 125% browser zoom

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| 3D / WebGL | [Three.js](https://threejs.org) via React Three Fiber, custom GLSL shaders |
| Animation | [GSAP](https://gsap.com) + ScrollTrigger (scroll-linked), [Framer Motion](https://motion.dev) (spring physics) |
| Smooth Scroll | [Lenis](https://lenis.darkroom.engineering) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Typography | PP Neue Montreal, PP Eiko, Fragment Mono (self-hosted woff2) |
| Deploy | [Vercel](https://vercel.com) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/adarzhpathade/adrz-portfolio.git
cd adrz-portfolio

# Install
npm install

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── components/          # Page-level components
│   │   ├── Preloader.tsx    # Cinematic loader + GSAP exit morph
│   │   ├── HeroSection.tsx  # Hero with shader, title, bio
│   │   ├── Page2.tsx        # WebGL video carousel (motion work)
│   │   ├── Page3.tsx        # 3D box carousel + skills
│   │   ├── Page4.tsx        # Contact / footer
│   │   ├── GlobalNav.tsx    # Fixed nav with scroll animations
│   │   └── AboutCard.tsx    # 3D floating drawer
│   ├── globals.css
│   ├── layout.tsx           # Font loading, metadata
│   └── page.tsx             # Scroll orchestrator
├── components/              # Shared / reusable libraries
│   ├── SmoothScroll.tsx
│   ├── fancy/               # Text animations, box carousel
│   ├── originkit/           # WebGL carousel, GLSL shader
│   └── react-bits/          # BlurText, GradualBlur
├── fonts/                   # Self-hosted woff2 fonts
├── hooks/                   # useScreenSize
└── lib/                     # Utilities
```

---

## Skills

- Web Design
- Motion Design
- Video Editing
- UI/UX Design
- Web Development

**Tools**: React, Next.js, GSAP, Framer Motion, Three.js, After Effects, Premiere Pro

---

## Contact

- **Email** — [adarshpathade79@gmail.com](mailto:adarshpathade79@gmail.com)
- **LinkedIn** — [linkedin.com/in/adarzhpathade](https://www.linkedin.com/in/adarzhpathade)
- **GitHub** — [github.com/adarzhpathade](https://github.com/adarzhpathade)

---

<p align="center">
  Design & Dev by Adarsh · Based in India
</p>
