import type Lenis from "lenis";

// One easing curve for the whole site — fast out, long settle.
export const EASE = [0.2, 0.7, 0.1, 1] as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

declare global {
  interface Window { __lenis?: Lenis }
}

// Scroll to a y offset or element id, through Lenis when it is running.
export function scrollToTarget(target: number | string) {
  const el = typeof target === "string" ? document.getElementById(target) : null;
  if (typeof target === "string" && !el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el ?? (target as number), { duration: 1.4 });
    return;
  }
  const top = el ? el.getBoundingClientRect().top + window.scrollY : (target as number);
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
