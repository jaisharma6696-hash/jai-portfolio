"use client";

import { motion } from "framer-motion";

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

export default function Projects() {
  return (
    <section id="work" className="relative min-h-screen bg-slate-950 py-32 px-6 md:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24 text-center"
        >
          <h3 className="text-xs font-mono text-amber-500/70 uppercase tracking-[0.35em] mb-5">
            Operating Architecture
          </h3>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            How I <span className="italic text-amber-500/90">Operate.</span>
          </h2>
          <p className="mt-6 text-white/40 font-light text-lg max-w-2xl mx-auto leading-relaxed">
            Eight lenses through which strategy becomes systems, and systems become outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PROJECTS.map((project, i) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              key={project.id}
              className="group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl overflow-hidden flex flex-col p-8 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]"
            >
              {/* Top accent line */}
              <div className="w-6 h-[1px] bg-amber-500/40 mb-8 group-hover:w-10 group-hover:bg-amber-500/70 transition-all duration-500" />

              <div className="flex-1">
                <h4 className="text-lg font-light text-white/90 mb-1 leading-snug group-hover:text-white transition-colors">
                  {project.title}
                </h4>
                <p className="text-[10px] font-mono text-amber-500/40 uppercase tracking-[0.25em] mb-5 group-hover:text-amber-500/70 transition-colors">
                  {project.category}
                </p>
                <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/55 transition-colors">
                  {project.desc}
                </p>
              </div>

              {/* Bottom index number */}
              <div className="mt-8 text-[10px] font-mono text-white/15 group-hover:text-amber-500/30 transition-colors">
                {String(project.id).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
