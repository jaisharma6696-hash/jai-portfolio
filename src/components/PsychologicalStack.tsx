"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplitReveal } from "@/components/fx/Reveal";
import SnapCarousel from "@/components/fx/SnapCarousel";
import type { StackHandle } from "@/lib/stackScene";
import { EASE } from "@/lib/motion";

const STACK_LAYERS = [
  {
    layer: "01",
    name: "Myers-Briggs (ENTP)",
    desc: "The Visionary / Debater. Thrives on analyzing complex systems, challenging the status quo, and generating innovative solutions. Excellent for entrepreneurial work because it combines relentless curiosity with strategic flexibility—turning chaotic ambiguity into structural architecture."
  },
  {
    layer: "02",
    name: "Big Five Profile",
    desc: "Highly exploratory (Openness) aggressively coupled with execution and structural discipline (Conscientiousness)."
  },
  {
    layer: "03",
    name: "The Vanguard Profile (Hogan)",
    desc: "Energized by ambiguity, scale, and cross-functional leadership under pressure."
  },
  {
    layer: "04",
    name: "Systems Orientation",
    desc: "Extracting underlying rules, mapping incentives, and designing the corresponding operating system."
  },
  {
    layer: "05",
    name: "Commercial Aggression",
    desc: "Bias for velocity. Strategy means nothing without execution."
  },
  {
    layer: "06",
    name: "AI-Native Operator",
    desc: "Directs AI agents like a team — writes the spec, demands the test results, and approves before anything ships."
  },
];

const CYCLE_MS = 5500;
const ACCENTS = Array(6).fill("#f26b1d");

export default function PsychologicalStack() {
  const secRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<StackHandle | null>(null);
  const holdT = useRef<ReturnType<typeof setTimeout>>();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  const pick = useCallback((i: number) => {
    setActive(i); setPaused(true);
    clearTimeout(holdT.current);
    holdT.current = setTimeout(() => setPaused(false), 12000);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current, sec = secRef.current; if (!cv || !sec) return;
    let disposed = false;
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); sceneRef.current?.setActive(e.isIntersecting); }, { rootMargin: "100px" });
    import("@/lib/stackScene").then(({ mountStack }) => {
      if (disposed) return;
      const s = mountStack(cv); if (!s) return;
      sceneRef.current = s; io.observe(sec);
    });
    const onResize = () => sceneRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { disposed = true; io.disconnect(); window.removeEventListener("resize", onResize); sceneRef.current?.dispose(); sceneRef.current = null; clearTimeout(holdT.current); };
  }, []);

  useEffect(() => { sceneRef.current?.select(active); }, [active]);

  // autoplay through the layers while the section is on screen
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive(a => (a + 1) % STACK_LAYERS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, inView, paused]);

  return (
    <section id="stack" ref={secRef} className="relative py-24 md:py-32 bg-[#07090f] border-t border-white/5 z-10 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_55%,rgba(242,107,29,.10),transparent_55%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">

        <div className="mb-12 md:mb-16 md:text-center">
          <h3 className="text-xs font-mono text-orange-400 uppercase tracking-[0.3em] mb-4">The Operator&apos;s Architecture</h3>
          <SplitReveal
            parts={["Psychological", { text: "Stack.", className: "font-display italic text-orange-400" }]}
            className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-tight mb-8"
          />
          <p className="max-w-3xl md:mx-auto text-2xl md:text-4xl font-display italic leading-snug text-white/85">
            &ldquo;A systems builder who treats ambiguity as raw material — and turns it into architecture.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-12 gap-x-6 items-center">
          {/* Six layers, six little cities */}
          <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1 h-[105vw] max-h-[66svh] lg:max-h-none lg:h-[86vh] -mx-6 md:mx-0">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-label="Six floating city tiles, one for each layer of the stack" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
              {STACK_LAYERS.map((l, i) => (
                <button key={l.layer} onClick={() => pick(i)} aria-label={l.name}
                  className="w-2.5 rounded-full transition-all duration-500" style={{ height: active === i ? 28 : 10, background: active === i ? ACCENTS[i] : "rgba(255,255,255,.25)" }} />
              ))}
            </div>
          </div>

          {/* Desktop: autoplaying list */}
          <ol className="hidden lg:block lg:col-span-5 lg:col-start-1 lg:row-start-1 border-t border-white/10">
            {STACK_LAYERS.map((l, i) => {
              const on = active === i;
              return (
                <li key={l.layer} className="border-b border-white/10">
                  <button onClick={() => pick(i)} onMouseMove={() => { if (!on) pick(i); }} className="w-full flex items-baseline gap-5 py-4 text-left group">
                    <span className="font-mono text-sm transition-colors" style={{ color: on ? ACCENTS[i] : "rgba(255,255,255,.4)" }}>{l.layer}</span>
                    <span className={`text-xl xl:text-2xl font-medium tracking-tight transition-colors ${on ? "text-white" : "text-white/65 group-hover:text-white"}`}>{l.name}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
                        <p className="pl-10 pb-5 text-white/65 font-light leading-relaxed max-w-md">{l.desc}</p>
                        <div className="h-[2px] bg-white/5">
                          <motion.div key={`${i}-${paused}`} className="h-full origin-left" style={{ background: ACCENTS[i] }}
                            initial={{ scaleX: paused ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: paused ? 0 : CYCLE_MS / 1000, ease: "linear" }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>

          {/* Phone: swipe the layers, the stack follows */}
          <div className="lg:hidden -mt-4 relative z-10">
            <SnapCarousel
              active={active}
              onActive={pick}
              items={STACK_LAYERS.map((l, i) => (
                <div key={l.layer} className="h-full rounded-3xl p-6 border bg-white/[0.05] transition-colors duration-500" style={{ borderColor: active === i ? ACCENTS[i] : "rgba(255,255,255,.1)" }}>
                  <span className="font-display italic text-5xl leading-none" style={{ color: ACCENTS[i] }}>{l.layer}</span>
                  <h4 className="text-xl font-semibold text-white mt-4 mb-2">{l.name}</h4>
                  <p className="text-white/65 font-light leading-relaxed text-[15px]">{l.desc}</p>
                </div>
              ))}
            />
            <div className="flex justify-center gap-1.5 mt-4">
              {STACK_LAYERS.map((l, i) => <span key={l.layer} className="h-1.5 rounded-full transition-all duration-500" style={{ width: active === i ? 24 : 6, background: active === i ? ACCENTS[i] : "rgba(255,255,255,.25)" }} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
