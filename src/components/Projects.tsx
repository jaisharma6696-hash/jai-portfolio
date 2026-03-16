"use client";

import { motion } from "framer-motion";

const PROJECTS = [
  { 
    id: 1, 
    title: "Strategic Systems", 
    category: "Architecture", 
    desc: "Designing operating models translating executive vision into measurable outcomes."
  },
  { 
    id: 2, 
    title: "Enterprise Transformation", 
    category: "Execution", 
    desc: "Rewiring governance, cross-functional execution, and leadership operating cadence."
  },
  { 
    id: 3, 
    title: "Market Creation", 
    category: "Ventures", 
    desc: "Building brands and commercial engines from zero."
  },
  { 
    id: 4, 
    title: "Digital & AI Infrastructure", 
    category: "Systems", 
    desc: "Designing decision-support systems and embedding AI into operational workflows."
  },
];

export default function Projects() {
  return (
    <section id="work" className="relative min-h-screen bg-slate-950 py-32 px-6 md:px-24">
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <h3 className="text-sm font-mono text-amber-500/70 uppercase tracking-[0.3em] mb-4">
            Operating Architecture
          </h3>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            How I <span className="italic text-amber-500/90">Operate.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {PROJECTS.map((project, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              key={project.id}
              className="group relative h-[360px] rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-2xl overflow-hidden flex flex-col justify-end p-8 md:p-12 transition-all duration-700 hover:border-white/20 hover:scale-[1.02]"
            >
              {/* Subtle Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 w-full">
                <h4 className="text-2xl md:text-3xl font-light text-white/90 mb-3 group-hover:text-amber-50 transition-colors">
                  {project.title}
                </h4>
                <p className="text-sm font-mono text-amber-500/50 uppercase tracking-widest mb-6 group-hover:text-amber-400 transition-colors">
                  {project.category}
                </p>
                <p className="text-white/50 text-base md:text-lg font-light leading-relaxed max-w-sm">
                  {project.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
