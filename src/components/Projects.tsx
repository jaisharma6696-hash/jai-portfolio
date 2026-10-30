"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DetailSheet from "@/components/fx/DetailSheet";
import SnapCarousel from "@/components/fx/SnapCarousel";
import TiltCard from "@/components/fx/TiltCard";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

const PROJECTS = [
  {
    id: 1,
    title: "Strategic Systems",
    category: "Architecture",
    desc: "Designing operating models that translate executive vision into measurable outcomes. Structuring organisations, decision rights, and execution frameworks that align strategy, people, and capital toward long-term value creation.",
  },
  {
    id: 2,
    title: "Enterprise Transformation",
    category: "Execution",
    desc: "Leading enterprise-wide transformation programs by rewiring governance structures, cross-functional execution models, and leadership operating cadence. Converting strategic intent into disciplined delivery across complex organisations.",
  },
  {
    id: 3,
    title: "Market Creation",
    category: "Ventures",
    desc: "Building brands, products, and commercial engines from zero. Identifying asymmetric opportunities, validating demand, and scaling ventures through structured experimentation, distribution strategy, and operational discipline.",
  },
  {
    id: 4,
    title: "Digital & AI Infrastructure",
    category: "Systems",
    desc: "Designing decision-support systems and embedding AI into operational workflows. Building data architecture, analytics layers, and intelligent systems that augment leadership decision-making and organisational speed.",
  },
  {
    id: 5,
    title: "Operating Model Design",
    category: "Design",
    desc: "Designing scalable operating models that integrate strategy, execution, and accountability. Aligning organisational structure, performance systems, and leadership incentives to drive consistent performance.",
  },
  {
    id: 6,
    title: "Strategy & Market Intelligence",
    category: "Intelligence",
    desc: "Conducting structured market assessments, competitive intelligence, and industry mapping to identify growth vectors. Translating macro signals into actionable strategic positioning.",
  },
  {
    id: 7,
    title: "Performance Systems & Governance",
    category: "Governance",
    desc: "Building KPI architectures, balanced scorecards, and governance frameworks that drive execution discipline. Creating visibility across organisations to track outcomes, performance, and accountability.",
  },
  {
    id: 8,
    title: "Product, Platform & Ecosystem Thinking",
    category: "Platforms",
    desc: "Designing platforms and ecosystems that unlock network effects across industries. Integrating technology, partnerships, and operating leverage to build durable competitive advantage.",
  },
];

type Lens = typeof PROJECTS[number];
const teaser = (d: string) => d.split(". ")[0] + ".";

function LensCard({ p, onOpen }: { p: Lens; onOpen: () => void }) {
  return (
    <TiltCard className="group rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] overflow-hidden transition-colors duration-500 hover:border-amber-500/30">
      <button onClick={onOpen} className="relative w-full h-full min-h-[250px] flex flex-col p-7 text-left">
        <div className="flex items-center justify-between mb-8">
          <span className="font-display italic text-4xl text-amber-400/40 group-hover:text-amber-400 transition-colors">{String(p.id).padStart(2, "0")}</span>
          <span className="w-9 h-9 rounded-full border border-white/15 text-white/60 flex items-center justify-center text-lg group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-slate-950 group-hover:rotate-90 transition-all duration-300">+</span>
        </div>
        <p className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.25em] mb-2">{p.category}</p>
        <h4 className="text-xl font-light text-white leading-snug mb-3">{p.title}</h4>
        <p className="text-white/45 text-sm font-light leading-relaxed line-clamp-3 mt-auto">{teaser(p.desc)}</p>
      </button>
    </TiltCard>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  const cur = open !== null ? PROJECTS[open] : null;
  return (
    <section id="work" className="relative bg-slate-950 py-24 md:py-32 px-6 md:px-24 overflow-x-clip">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 md:mb-20 md:text-center"
        >
          <h3 className="text-xs font-mono text-amber-500/70 uppercase tracking-[0.35em] mb-5">
            Operating Architecture
          </h3>
          <SplitReveal
            parts={["How I", { text: "Operate.", className: "font-display italic text-amber-400/90" }]}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight"
          />
          <p className="mt-6 text-white/45 font-light text-lg max-w-2xl md:mx-auto leading-relaxed">
            Eight lenses through which strategy becomes systems. Tap one to go deeper.
          </p>
        </motion.div>

        <div className="md:hidden">
          <SnapCarousel items={PROJECTS.map((p, i) => <LensCard key={p.id} p={p} onOpen={() => setOpen(i)} />)} />
        </div>
        <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-5">
          {PROJECTS.map((p, i) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.08 + Math.floor(i / 4) * 0.12, duration: 0.8, ease: EASE }}
              key={p.id}
            >
              <LensCard p={p} onOpen={() => setOpen(i)} />
            </motion.div>
          ))}
        </div>
      </div>

      <DetailSheet open={!!cur} onClose={() => setOpen(null)} label={cur?.title ?? ""}>
        {cur && (
          <div>
            <p className="font-display italic text-6xl text-amber-400/80 leading-none mb-4">{String(cur.id).padStart(2, "0")}</p>
            <p className="text-[11px] font-mono text-amber-400 uppercase tracking-[0.25em] mb-2">{cur.category}</p>
            <h3 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6 pr-8">{cur.title}</h3>
            <p className="text-xl text-white/75 font-light leading-relaxed">{cur.desc}</p>
          </div>
        )}
      </DetailSheet>
    </section>
  );
}
