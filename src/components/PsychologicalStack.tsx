"use client";

import { motion } from "framer-motion";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

// Chamfered corners: big cut top-left, small cut bottom-right.
const CUT = "polygon(44px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 44px)";

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
];

export default function PsychologicalStack() {
  return (
    <section id="stack" className="relative py-32 bg-slate-950 border-t border-white/5 z-10 overflow-hidden">
      
      {/* Background Graphic Element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-10 pointer-events-none">
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="399" stroke="white" strokeWidth="2" strokeDasharray="10 10"/>
          <circle cx="400" cy="400" r="299" stroke="white" strokeWidth="1" strokeDasharray="5 5"/>
          <circle cx="400" cy="400" r="199" stroke="white" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h3 className="text-xs font-mono text-amber-500/70 uppercase tracking-[0.3em] mb-4">
            The Operator&apos;s Architecture
          </h3>
          <SplitReveal
            parts={["Psychological", { text: "Stack.", className: "font-display italic text-amber-400/90" }]}
            className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6"
          />
        </motion.div>

        {/* 1-Line Identity Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 md:p-12 rounded-3xl mb-24 text-center backdrop-blur-xl shadow-2xl"
        >
          <p className="text-3xl md:text-5xl font-display italic leading-snug text-white/90">
            &ldquo;A systems builder who treats ambiguity as raw material — and turns it into architecture.&rdquo;
          </p>
        </motion.div>

        {/* The Layers — staggered chamfered cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STACK_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.9, ease: EASE }}
              className={`group ${i % 3 === 1 ? "lg:mt-20" : ""} ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="p-px bg-gradient-to-br from-amber-500/40 via-white/10 to-white/5 group-hover:from-amber-400/80 transition-colors duration-500 h-full" style={{ clipPath: CUT }}>
                <div className="relative h-full min-h-[230px] bg-slate-950 bg-gradient-to-br from-white/[0.04] to-transparent p-8 pl-10 flex flex-col" style={{ clipPath: CUT }}>
                  <span className="font-display italic text-6xl text-amber-500/25 group-hover:text-amber-400/60 transition-colors duration-500 leading-none mb-6">
                    {layer.layer}
                  </span>
                  <h4 className="text-lg md:text-xl font-medium tracking-wide text-white/90 group-hover:text-amber-50 transition-colors mb-3">
                    {layer.name}
                  </h4>
                  <p className="text-white/50 font-light leading-relaxed text-[15px] group-hover:text-white/70 transition-colors">
                    {layer.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
