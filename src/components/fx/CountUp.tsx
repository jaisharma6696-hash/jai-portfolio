"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE, prefersReducedMotion } from "@/lib/motion";

// Counts from 0 to `to` the first time it scrolls into view.
export default function CountUp({ to, prefix = "", suffix = "", duration = 1.8 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) { setV(to); return; }
    const c = animate(0, to, { duration, ease: EASE, onUpdate: x => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref} className="tabular-nums">{prefix}{v.toLocaleString("en-IN")}{suffix}</span>;
}
