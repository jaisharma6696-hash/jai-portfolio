"use client";

import { motion } from "framer-motion";

const PROOF_OF_WORK = [
  "₹10 Cr ARR revenue built from zero",
  "450+ retail outlets",
  "200+ stakeholders influenced",
  "40% faster decision cycles",
  "Multiple ventures across sectors"
];

const DOMAINS = [
  "Consumer Brands", 
  "Retail & Experience Design", 
  "Enterprise Transformation", 
  "Infrastructure & Energy", 
  "AI & Digital Platforms"
];

export default function ExperienceSnapshot() {
  return (
    <section className="relative py-24 bg-slate-950 px-6 md:px-12 lg:px-24 border-t border-white/5 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Identity & Domains */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4">
              Identity & Focus
            </h3>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              Strategist.<br/>Operator.<br/>Founder.
            </h2>
            <p className="text-white/60 font-light leading-relaxed text-lg max-w-md mb-12">
              Operating across ventures and enterprise systems with a focus on business transformation and scalable operating models.
            </p>
            
            <div className="space-y-6">
              <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">
                Domains of Work
              </p>
              <div className="flex flex-col gap-3">
                {DOMAINS.map(domain => (
                  <div key={domain} className="flex items-center gap-4">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/70 font-light tracking-wide text-lg">
                      {domain}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Proof of Work Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:mt-24 shadow-2xl"
          >
            <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-white/5">
              Proof of Work
            </p>
            <div className="flex flex-col gap-8">
              {PROOF_OF_WORK.map((metric, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <div className="text-amber-500/60 font-mono text-sm group-hover:text-amber-400 transition-colors">0{i + 1}</div>
                  <div className="text-xl md:text-2xl font-light text-white/90 group-hover:text-amber-50 transition-colors">
                    {metric}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
