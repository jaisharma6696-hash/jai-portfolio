"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { VenturesHandle } from "@/lib/venturesScene";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE, scrollToTarget } from "@/lib/motion";

const VENTURES = [
  {
    id: "beantree", name: "Beantree Foods", label: "Beantree Foods", role: "Co-Founder & Strategy Lead", when: "2017 – 2023",
    line: "An FMCG brand built from zero — product, brand, manufacturing, distribution, pricing, hiring and finance, with full P&L.",
    stats: ["₹1.5 Cr+ revenue in 18 months", "150+ A-category outlets, 5 states", "35+ person sales organisation"],
  },
  {
    id: "kk-store", name: "KK Store", label: "KK Store", role: "Operator", when: "Retail",
    line: "A retail laboratory where customers vote with their feet — pricing psychology, inventory and working-capital discipline.",
    stats: ["Daily margin decisions", "Supplier trust", "Footprint yield"],
  },
  {
    id: "bite-me", name: "Bite Me", label: "Bite Me", role: "CEO's Office · Brand launch", when: "2023 – 2025",
    line: "An F&B brand launched end to end from a CEO's office — concept, positioning, menu, pricing and launch.",
    stats: ["Concept → launch", "Menu & pricing design", "Unit-economics reviews"],
  },
  {
    id: "supper-club", name: "The Supper Club", label: "The Supper Club", role: "CEO's Office · Brand launch", when: "2023 – 2025",
    line: "Curated dining where the guest list is designed as carefully as the menu — premium positioning, intimate scale.",
    stats: ["Premium positioning", "Community design", "Repeatable formats"],
  },
  {
    id: "bodega", name: "The Back Alley Bodega", label: "Back Alley Bodega", role: "CEO's Office · Apparel line", when: "2023 – 2025",
    line: "An apparel and lifestyle line built around neighbourhood culture — brand, product and go-to-market.",
    stats: ["Brand & product", "Go-to-market", "Cultural positioning"],
  },
  {
    id: "rodic", name: "Rodic Consultants", label: "Rodic Consultants", role: "Senior Program Manager · Chief of Staff Cell", when: "2025 – now",
    line: "Strategy and transformation inside an infrastructure consultancy — growth, digital platforms and the firm's AI roadmap.",
    stats: ["₹1,200 Cr pipeline · ₹400 Cr won", "Platform for 2,500+ employees", "~40% faster decisions"],
  },
];

const CYCLE_MS = 6500;

export default function Ventures() {
  const secRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<VenturesHandle | null>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const holdT = useRef<ReturnType<typeof setTimeout>>();

  const pick = (i: number) => {
    setActive(i); setPaused(true);
    clearTimeout(holdT.current);
    holdT.current = setTimeout(() => setPaused(false), 15000);
  };

  useEffect(() => {
    const cv = canvasRef.current, lb = labelsRef.current, sec = secRef.current;
    if (!cv || !lb || !sec) return;
    let disposed = false;
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); sceneRef.current?.setActive(e.isIntersecting); }, { rootMargin: "100px" });
    import("@/lib/venturesScene").then(({ mountVentures }) => {
      if (disposed) return;
      const s = mountVentures(cv, lb, VENTURES.map(v => v.label), i => pick(i));
      if (!s) return;
      sceneRef.current = s;
      io.observe(sec);
    });
    const onResize = () => sceneRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { disposed = true; io.disconnect(); window.removeEventListener("resize", onResize); sceneRef.current?.dispose(); sceneRef.current = null; clearTimeout(holdT.current); };
  }, []);

  useEffect(() => { sceneRef.current?.select(inView ? active : -1); }, [active, inView]);

  // auto-advance while visible and not being driven by the visitor
  useEffect(() => {
    if (!inView || paused) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setTimeout(() => setActive(a => (a + 1) % VENTURES.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, inView, paused]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section id="ventures" ref={secRef} className="relative overflow-hidden bg-[#0b1035] py-24 lg:py-28">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(59,76,190,.35),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-x-6 gap-y-8 items-center">
        {/* Heading */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 self-end">
          <p className="text-xs font-mono text-orange-400/90 uppercase tracking-[0.35em] mb-5">Ventures & Operations</p>
          <SplitReveal
            parts={["What I've built\n", { text: "on the ground.", className: "font-display italic text-orange-400" }]}
            className="text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight leading-[0.98] text-white"
          />
        </div>


        {/* Diorama */}
        <div
          className="relative overflow-hidden lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[82vh] -mx-6 md:mx-0"
          onMouseMove={onMove}
          onMouseLeave={() => sceneRef.current?.setPointer(0, 0)}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-label="Isometric island with one site per venture" />
          <div ref={labelsRef} className="absolute inset-0 [&>button]:pointer-events-auto pointer-events-none" />
        </div>

        {/* List */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 self-start">

          <ol className="border-t border-white/10">
            {VENTURES.map((v, i) => {
              const on = active === i;
              return (
                <li key={v.id} className="border-b border-white/10">
                  <button
                    onClick={() => pick(i)}
                    onMouseMove={() => { if (active !== i) pick(i); }}
                    aria-expanded={on}
                    className="w-full flex items-baseline gap-5 py-4 md:py-5 text-left group"
                  >
                    <span className={`font-mono text-sm transition-colors ${on ? "text-orange-400" : "text-white/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-xl md:text-2xl font-medium tracking-tight transition-colors ${on ? "text-white" : "text-white/70 group-hover:text-white"}`}>{v.name}</span>
                    <span className="ml-auto hidden sm:inline text-[11px] font-mono text-white/35 uppercase tracking-widest">{v.when}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pl-10 pb-5">
                          <p className="text-[11px] font-mono text-orange-300/80 uppercase tracking-[0.2em] mb-2">{v.role}</p>
                          <p className="text-white/70 font-light leading-relaxed mb-4 max-w-md">{v.line}</p>
                          <ul className="flex flex-wrap gap-2 mb-4">
                            {v.stats.map(s => (
                              <li key={s} className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/80">{s}</li>
                            ))}
                          </ul>
                          <button onClick={() => scrollToTarget(`story-${v.id}`)} className="text-xs font-mono uppercase tracking-[0.2em] text-orange-400 hover:text-orange-300 transition-colors">
                            Read the story ↓
                          </button>
                        </div>
                        {/* progress underline */}
                        <div className="h-[2px] bg-white/5">
                          <motion.div
                            key={`${i}-${paused}`}
                            className="h-full bg-orange-500 origin-left"
                            initial={{ scaleX: paused ? 1 : 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: paused ? 0 : CYCLE_MS / 1000, ease: "linear" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
