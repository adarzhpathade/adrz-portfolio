"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
    });

    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    lenis.on("scroll", ScrollTrigger.update);

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      if (typeof window !== "undefined") {
        delete window.__lenis;
      }
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
