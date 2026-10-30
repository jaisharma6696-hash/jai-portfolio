"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

// Before → after, drawn as roads and rails. Figures from my CV; "before" is the baseline.
type Row = { tag: string; sub: string; value: number; label: string; now?: boolean };
const GROUPS: { title: string; style: "road" | "rail"; max: number; rows: Row[] }[] = [
  {
    title: "Product range at my FMCG venture", style: "road", max: 32,
    rows: [
      { tag: "Launch", sub: "Year one", value: 20, label: "20 SKUs" },
      { tag: "Scaled", sub: "Through continuous innovation", value: 30, label: "30 SKUs", now: true },
    ],
  },
  {
    title: "Executive decision turnaround · 200+ leaders", style: "rail", max: 100,
    rows: [
      { tag: "Before", sub: "Manual MIS, baseline = 100", value: 100, label: "100" },
      { tag: "After", sub: "Dashboards & governance cadence", value: 60, label: "~40% faster", now: true },
    ],
  },
  {
    title: "Cross-functional response time", style: "road", max: 100,
    rows: [
      { tag: "Before", sub: "Baseline = 100", value: 100, label: "100" },
      { tag: "After", sub: "Redesigned review cadences", value: 70, label: "~30% faster", now: true },
    ],
  },
  {
    title: "Procurement cost at my FMCG venture", style: "rail", max: 100,
    rows: [
      { tag: "Before", sub: "Baseline = 100", value: 100, label: "100" },
      { tag: "After", sub: "Vendor negotiation & standard process", value: 80, label: "−20%", now: true },
    ],
  },
];

function Bar({ row, style, max, delay }: { row: Row; style: "road" | "rail"; max: number; delay: number }) {
  const pct = (row.value / max) * 78; // leave room after the tip for the label
  const tone = row.now ? "#f26b1d" : "#e2e8f0";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[180px_minmax(0,1fr)] gap-2 md:gap-6 items-center">
      <div>
        <p className={`font-semibold tracking-tight leading-none ${row.now ? "text-orange-500 text-4xl md:text-5xl" : "text-white text-3xl md:text-4xl"}`}>{row.tag}</p>
        <p className="text-xs text-white/45 mt-1">{row.sub}</p>
      </div>
      <div className="relative h-12 md:h-14">
        {/* track */}
        <div className={`absolute inset-0 rounded-sm border border-dashed border-white/10 ${style === "rail" ? "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0_2px,transparent_2px_9px)]" : "bg-white/[0.02]"}`} />
        {/* the built length */}
        <motion.div
          className="absolute inset-y-0 left-0 overflow-hidden rounded-sm"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.8, ease: EASE, delay }}
          style={{ boxShadow: row.now ? "0 0 40px rgba(242,107,29,.25)" : undefined }}
        >
          {style === "road" ? (
            <div className="absolute inset-0 bg-gradient-to-r from-[#3a3a40] via-[#3a3a40] to-[#4a3426] border-y-2 border-white/30">
              <div className="road-dash absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px]" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${row.now ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.6)"} 0 18px, transparent 18px 34px)` }} />
            </div>
          ) : (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.75)_0_3px,transparent_3px_10px)] opacity-80" />
              <div className="absolute left-0 right-0 top-[30%] h-[2px] bg-white/80" />
              <div className="absolute left-0 right-0 bottom-[30%] h-[2px] bg-white/80" />
            </div>
          )}
          <div className="absolute inset-y-0 right-0 w-1.5" style={{ background: tone }} />
          <div className="absolute inset-y-0 right-0 w-24" style={{ background: `linear-gradient(90deg, transparent, ${row.now ? "rgba(242,107,29,.5)" : "rgba(255,255,255,.15)"})` }} />
        </motion.div>
        {/* value label rides the tip */}
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 pl-3 text-lg md:text-2xl font-semibold whitespace-nowrap"
          style={{ color: tone }}
          initial={{ left: "0%", opacity: 0 }}
          whileInView={{ left: `${pct}%`, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.8, ease: EASE, delay }}
        >
          {row.label}
        </motion.span>
      </div>
    </div>
  );
}

export default function Impact() {
  const [info, setInfo] = useState(false);
  return (
    <section id="impact" className="relative bg-[#0b0a09] py-24 md:py-32 px-6 md:px-12 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 opacity-40 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(242,107,29,.12),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <button onClick={() => setInfo(v => !v)} aria-label="About these figures" aria-expanded={info}
          className="absolute right-0 top-0 w-11 h-11 rounded-full border border-white/30 text-white font-display italic text-xl hover:bg-white/10 transition-colors">i</button>
        <AnimatePresence>
          {info && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 top-14 z-10 max-w-xs rounded-2xl liquid-glass bg-slate-950/90 p-4 text-sm text-white/75 leading-relaxed">
              Figures from my CV. Where an improvement is a percentage, the &ldquo;before&rdquo; bar is set to a baseline of 100.
            </motion.p>
          )}
        </AnimatePresence>

        <SplitReveal
          parts={["I've become better at\nmaking things move ", { text: "over the years.", className: "text-orange-500" }]}
          className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05] md:text-center mb-16 md:mb-24 pr-12 md:px-12"
        />

        <div className="space-y-16 md:space-y-20">
          {GROUPS.map(g => (
            <div key={g.title}>
              <p className="flex items-center gap-3 text-base md:text-lg text-white font-medium mb-6"><span className="w-3 h-3 bg-orange-500" />{g.title}</p>
              <div className="space-y-6">
                {g.rows.map((r, i) => <Bar key={r.tag} row={r} style={g.style} max={g.max} delay={i * 0.25} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
