"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { SplitReveal } from "@/components/fx/Reveal";

// Working rules drawn from how the builds were actually run; each carries a receipt.
const RULES = [
  {
    rule: "I write the brief like a PRD — then make the AI prove it.",
    how: "Requirements, acceptance scenarios and a work breakdown come first. The build is only accepted when the tests say so.",
    receipt: "918 automated checks · 0 failures on the event command centre",
  },
  {
    rule: "Nothing irreversible ships without my yes.",
    how: "Preview locally, deploy only on green, keep every move reversible. Agents propose; I approve.",
    receipt: "209,526 file moves during a drive recovery — every one undoable",
  },
  {
    rule: "I ask the AI to score its own work — and send it back until it's a nine.",
    how: "Self-review against the brief, a stress test, then a check on the live product as a real user would see it.",
    receipt: "17 / 17 acceptance scenarios passed on the metro asset platform",
  },
  {
    rule: "Tokens are budget. I run AI like a P&L.",
    how: "One job at a time, the cheapest model that does it well, and a fallback so the system never goes silent.",
    receipt: "3-tier model fallback · 199 scheduled agent runs in two weeks",
  },
  {
    rule: "I build for the person who reads it.",
    how: "A senior official, a site lead, a guest on a phone — the format, tone and access follow the reader, not the builder.",
    receipt: "Role-scoped access: admins see everything, leads see their own work",
  },
];

function Card({ i, n, progress, r }: { i: number; n: number; progress: MotionValue<number>; r: typeof RULES[number] }) {
  // earlier cards shrink back slightly as later ones stack over them
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - i) * 0.035]);
  return (
    <div className="sticky h-[78vh] md:h-[70vh] flex items-start" style={{ top: `calc(84px + ${i * 22}px)` }}>
      <motion.article
        style={{ scale }}
        className="origin-top w-full rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-7 md:p-12 shadow-[0_-20px_60px_rgba(0,0,0,.5)] overflow-hidden relative"
      >
        <span aria-hidden className="absolute -right-4 -top-10 md:-top-16 font-display italic text-[10rem] md:text-[16rem] leading-none text-amber-500/[0.07] select-none">
          {String(i + 1).padStart(2, "0")}
        </span>
        <p className="relative text-xs font-mono text-amber-400/80 uppercase tracking-[0.3em] mb-6">Rule {String(i + 1).padStart(2, "0")}</p>
        <h3 className="relative text-3xl md:text-5xl font-light text-white leading-[1.1] tracking-tight max-w-3xl mb-6">{r.rule}</h3>
        <p className="relative text-lg text-white/55 font-light leading-relaxed max-w-2xl mb-8">{r.how}</p>
        <div className="relative inline-flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.25em] mt-[3px] shrink-0">Receipt</span>
          <span className="text-sm text-white/80">{r.receipt}</span>
        </div>
      </motion.article>
    </div>
  );
}

export default function HowIWork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="method" className="relative bg-slate-950 border-t border-white/5 px-6 md:px-12 lg:px-24 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono text-amber-500/80 uppercase tracking-[0.35em] mb-5">How I work</p>
        <SplitReveal
          parts={["My operating manual\nfor ", { text: "AI.", className: "font-display italic text-amber-400/90" }]}
          className="text-5xl md:text-7xl font-light text-white tracking-tight leading-[1.02] mb-6"
        />
        <p className="text-lg text-white/55 font-light leading-relaxed max-w-xl mb-16">
          Five rules I hold every build to — distilled from a year of directing AI agents on real products, with the receipts.
        </p>
        <div ref={ref} className="relative">
          {RULES.map((r, i) => <Card key={i} i={i} n={RULES.length} progress={scrollYProgress} r={r} />)}
        </div>
      </div>
    </section>
  );
}
