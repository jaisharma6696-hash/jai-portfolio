"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

// Lenis drives window scroll, so native scroll events (framer useScroll, Build Lab) keep working.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete window.__lenis; };
  }, []);
  return null;
}
