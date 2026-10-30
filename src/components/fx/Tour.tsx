"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, prefersReducedMotion } from "@/lib/motion";

export type TourScene = { go: (i: number) => void; setActive: (on: boolean) => void; resize: () => void; dispose: () => void };
export type TourStep = { kicker: string; title: string; body: string };

const STEP_MS = 6500;

// Full-screen guided walkthrough of a 3D scene: counter, prev / play-pause / next, captions.
export default function Tour({
  open, onClose, heading, steps, mount, start = 0,
}: {
  open: boolean; onClose: () => void; heading: string; steps: TourStep[];
  mount: (canvas: HTMLCanvasElement, labels: HTMLElement) => Promise<TourScene | null>; start?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [i, setI] = useState(start);
  const [playing, setPlaying] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<TourScene | null>(null);
  const n = steps.length;

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (open) { setI(start); setPlaying(!prefersReducedMotion()); } }, [open, start]);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    let disposed = false;
    const t = setTimeout(() => {
      const cv = canvasRef.current, lb = labelsRef.current; if (!cv || !lb) return;
      mount(cv, lb).then(s => {
        if (disposed || !s) { s?.dispose(); return; }
        sceneRef.current = s; s.setActive(true); s.go(start);
      });
    }, 50);
    const onResize = () => sceneRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true; clearTimeout(t);
      window.removeEventListener("resize", onResize);
      sceneRef.current?.dispose(); sceneRef.current = null;
      window.__lenis?.start(); document.documentElement.style.overflow = prev;
    };
  }, [open, mount, start]);

  useEffect(() => { sceneRef.current?.go(i); }, [i]);

  const next = useCallback(() => setI(v => (v + 1) % n), [n]);
  const prevStep = useCallback(() => setI(v => (v - 1 + n) % n), [n]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setTimeout(next, STEP_MS);
    return () => clearTimeout(t);
  }, [open, playing, i, next]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") { setPlaying(false); next(); }
      if (e.key === "ArrowLeft") { setPlaying(false); prevStep(); }
      if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose, next, prevStep]);

  if (!mounted) return null;
  const s = steps[i], up = steps[(i + 1) % n];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] bg-[#0b1035] text-white"
          initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: EASE }}
          role="dialog" aria-modal="true" aria-label={heading}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div ref={labelsRef} className="absolute inset-0 pointer-events-none" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b1035] to-transparent pointer-events-none" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0b1035] via-[#0b1035]/80 to-transparent pointer-events-none" />

          {/* top bar */}
          <div className="absolute top-0 inset-x-0 p-5 md:p-10 flex items-start justify-between gap-4">
            <div>
              <button onClick={onClose} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 md:px-5 py-2.5 text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
                ← Back to site
              </button>
              <p className="mt-4 text-xl md:text-3xl font-semibold tracking-tight">{heading}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden sm:inline font-mono text-sm text-white/70 mr-2 tabular-nums">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
              <button onClick={() => { setPlaying(false); prevStep(); }} aria-label="Previous" className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-lg">←</button>
              <button onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause" : "Play"} className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors text-lg font-bold">{playing ? "❚❚" : "▶"}</button>
              <button onClick={() => { setPlaying(false); next(); }} aria-label="Next" className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-lg">→</button>
            </div>
          </div>

          {/* caption */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col md:flex-row md:items-end justify-between gap-6">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: EASE }} className="max-w-2xl">
                <p className="font-mono text-xs md:text-sm text-orange-400 uppercase tracking-[0.2em] mb-2 md:mb-3">
                  <span className="sm:hidden text-white/60 mr-2">{String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}</span>{s.kicker}
                </p>
                <h3 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-3 md:mb-4">{s.title}</h3>
                <p className="text-base md:text-xl text-white/80 font-light leading-relaxed">{s.body}</p>
              </motion.div>
            </AnimatePresence>
            <button onClick={() => { setPlaying(false); next(); }} className="self-start md:self-end shrink-0 flex items-center gap-4 rounded-full liquid-glass bg-slate-950/50 pl-5 pr-2 py-2 text-left hover:bg-white/10 transition-colors">
              <span>
                <span className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Up next</span>
                <span className="block text-sm md:text-base font-medium">{up.title}</span>
              </span>
              <span className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">→</span>
            </button>
          </div>

          {/* step progress */}
          <div className="absolute bottom-0 inset-x-0 flex gap-1 px-5 md:px-10 pb-2">
            {steps.map((_, k) => (
              <div key={k} className="h-[3px] flex-1 bg-white/15 overflow-hidden rounded-full">
                {k < i && <div className="h-full w-full bg-orange-500" />}
                {k === i && (
                  <motion.div key={`${i}-${playing}`} className="h-full bg-orange-500 origin-left"
                    initial={{ scaleX: playing ? 0 : 1 }} animate={{ scaleX: 1 }} transition={{ duration: playing ? STEP_MS / 1000 : 0, ease: "linear" }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
