"use client";

import { motion } from "framer-motion";

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
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6">
            Psychological <span className="italic text-amber-500/90">Stack.</span>
          </h2>
        </motion.div>

        {/* 1-Line Identity Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 md:p-12 rounded-3xl mb-24 text-center backdrop-blur-xl shadow-2xl"
        >
          <p className="text-2xl md:text-4xl font-light leading-snug text-white/90 italic">
            &ldquo;A systems builder who treats ambiguity as raw material — and turns it into architecture.&rdquo;
          </p>
        </motion.div>

        {/* The Layers */}
        <div className="max-w-4xl mx-auto space-y-4">
          {STACK_LAYERS.map((layer, i) => (
            <motion.div 
              key={layer.layer}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-4 md:gap-12 md:items-start p-6 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-6 md:w-1/3 shrink-0">
                <span className="text-sm font-mono text-amber-500/40 group-hover:text-amber-500/80 transition-colors">
                  {layer.layer}
                </span>
                <h4 className="text-lg md:text-xl font-medium tracking-wide text-white/90 group-hover:text-amber-50 transition-colors">
                  {layer.name}
                </h4>
              </div>
              
              <div className="md:w-2/3">
                <p className="text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                  {layer.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
