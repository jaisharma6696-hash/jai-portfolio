"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/fx/CountUp";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

const PROOF_OF_WORK = [
  { to: 10, prefix: "₹", suffix: " Cr", label: "ARR revenue built from zero" },
  { to: 450, suffix: "+", label: "Retail outlets" },
  { to: 200, suffix: "+", label: "Stakeholders influenced" },
  { to: 40, suffix: "%", label: "Faster decision cycles" },
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
    <section className="relative py-28 bg-slate-950 border-t border-white/5 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Identity */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4"
            >
              Identity & Focus
            </motion.h3>
            <SplitReveal
              parts={["Strategist.\nOperator.\n", { text: "Founder.", className: "font-display italic text-amber-300/90" }]}
              className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-8 text-white"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
              className="text-white/60 font-light leading-relaxed text-lg max-w-md"
            >
              Operating across ventures and enterprise systems with a focus on business transformation and scalable operating models.
            </motion.p>
          </div>

          {/* Proof of Work */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: EASE }}
            className="liquid-glass rounded-3xl p-8 md:p-12 lg:mt-16"
          >
            <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-white/5">
              Proof of Work
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {PROOF_OF_WORK.map(m => (
                <div key={m.label} className="group">
                  <div className="font-display text-5xl md:text-6xl text-white leading-none mb-3 group-hover:text-amber-200 transition-colors">
                    <CountUp to={m.to} prefix={m.prefix} suffix={m.suffix} />
                  </div>
                  <p className="text-sm text-white/50 font-light tracking-wide">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 pt-6 border-t border-white/5 text-white/70 font-light text-lg">
              Multiple ventures <span className="font-display italic text-amber-200/80">across sectors.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Domains of work — marquee */}
      <div className="mt-24">
        <p className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-8">
          Domains of Work
        </p>
        <div className="marquee-mask overflow-hidden border-y border-white/5 py-8">
          <div className="marquee-track flex w-max">
            {[0, 1].map(k => (
              <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
                {DOMAINS.map(d => (
                  <span key={d} className="flex items-center gap-10 pr-10 text-4xl md:text-6xl font-light text-white/80 whitespace-nowrap">
                    {d}
                    <span className="text-amber-500/60 text-2xl md:text-3xl">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
