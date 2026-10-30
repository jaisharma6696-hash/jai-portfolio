"use client";

import { ReactNode, useEffect, useRef } from "react";

// Horizontal swipe row (phones): cards snap to centre, the next one peeks in.
// Reports the centred card; scrolls to `active` when it changes from outside.
export default function SnapCarousel({
  items, active, onActive, className = "",
}: { items: ReactNode[]; active?: number; onActive?: (i: number) => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fromSwipe = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0, bd = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const h = c as HTMLElement, d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - mid);
          if (d < bd) { bd = d; best = i; }
        });
        fromSwipe.current = true;
        onActive?.(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [onActive]);

  useEffect(() => {
    if (active === undefined) return;
    if (fromSwipe.current) { fromSwipe.current = false; return; }
    const el = ref.current, c = el?.children[active] as HTMLElement | undefined;
    if (!el || !c) return;
    el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div
      ref={ref}
      className={`flex gap-3 overflow-x-auto snap-x snap-mandatory overscroll-x-contain scroll-px-6 px-6 -mx-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {items.map((it, i) => (
        <div key={i} className="snap-center shrink-0 w-[82vw] max-w-[360px]">{it}</div>
      ))}
    </div>
  );
}
