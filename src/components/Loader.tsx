"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, prefersReducedMotion } from "@/lib/motion";

const WORDS = ["Strategy", "Operate", "Build"];
const MIN_MS = 2200, MAX_MS = 5000;

declare global {
  interface Window { __heroReady?: boolean }
}

// Intro counter 000→100. Holds at 90 until the hero frame sequence reports ready.
export default function Loader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("jvs-intro") === "1"; } catch {}
    const reduce = prefersReducedMotion();
    if (seen || reduce) { const t = setTimeout(() => setShow(false), reduce ? 300 : 0); return () => clearTimeout(t); }

    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
    const t0 = performance.now();
    let raf = 0, done = false;
    const wordT = setInterval(() => setWord(w => (w + 1) % WORDS.length), 800);
    const tick = (now: number) => {
      const el = now - t0, ready = !!window.__heroReady || el > MAX_MS;
      const base = Math.min(1, el / MIN_MS);
      const v = ready ? base : Math.min(0.9, base);
      setCount(Math.round(v * 100));
      if (v >= 1 && !done) {
        done = true;
        try { sessionStorage.setItem("jvs-intro", "1"); } catch {}
        setTimeout(() => setShow(false), 350);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearInterval(wordT); };
  }, []);

  useEffect(() => {
    if (show) return;
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
    window.dispatchEvent(new Event("intro-done"));
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col justify-between p-6 md:p-12"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.p
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
            className="text-xs font-mono text-white/40 uppercase tracking-[0.35em]"
          >
            Jai Vardhan Sharma — Portfolio
          </motion.p>

          <div className="h-[1.2em] text-5xl md:text-7xl lg:text-8xl font-display italic text-white/85 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={word}
                className="block"
                initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {WORDS[word]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div>
            <div className="flex justify-end mb-4">
              <span className="font-display text-7xl md:text-9xl lg:text-[11rem] leading-none tabular-nums">
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="h-[2px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 origin-left shadow-[0_0_10px_rgba(245,158,11,.5)]"
                style={{ transform: `scaleX(${count / 100})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
