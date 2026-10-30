"use client";

import { motion } from "framer-motion";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

const EDUCATION = [
  {
    institution: "MDI Gurgaon",
    degree: "PGDM — Strategic Management",
    desc: "Structured strategic thinking, organizational behavior, and decision frameworks. As Founding Member of the Industry Interaction Committee, helped organize a CHRO Summit with senior leaders from major public- and private-sector enterprises."
  },
  {
    institution: "The NorthCap University",
    degree: "BBA",
    desc: "Introduced the vocabulary of business: finance, marketing, operations. Exposure to Dubai during this period shaped an early understanding of global retail environments and consumer behavior."
  },
  {
    institution: "St. Mary's School, Dwarka",
    degree: "Founders & Foundations",
    desc: "Where curiosity about markets and systems began."
  }
];

export default function Education() {
  return (
    <section className="relative py-28 bg-slate-950 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-start">

        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <h3 className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4">
            Background
          </h3>
          <SplitReveal
            parts={["Education &\n", { text: "Foundations.", className: "font-display italic text-white/70" }]}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="lg:col-span-8 liquid-glass rounded-3xl p-6 md:p-10"
        >
          <p className="flex items-center justify-center gap-3 text-[11px] font-mono text-white/60 uppercase tracking-[0.25em] mb-8">
            <span className="text-amber-400/70">✦</span> Timeline <span className="text-amber-400/70">✦</span>
          </p>
          <ol className="divide-y divide-white/[0.06]">
            {EDUCATION.map((edu, i) => (
              <motion.li
                key={edu.institution}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: EASE }}
                className="group py-7 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <span className="font-display italic text-3xl text-white group-hover:text-amber-100 transition-colors">{edu.institution}</span>
                  <span className="text-amber-400/50 text-xs">✦</span>
                  <span className="text-xs font-mono text-white/45 uppercase tracking-widest">{edu.degree}</span>
                </div>
                <p className="text-white/55 font-light leading-relaxed max-w-2xl group-hover:text-white/75 transition-colors">
                  {edu.desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </motion.div>

      </div>
    </section>
  );
}
