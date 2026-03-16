"use client";

import { motion } from "framer-motion";

const EDUCATION = [
  {
    institution: "MDI Gurgaon",
    degree: "PGDM — Strategic Management",
    desc: "Structured strategic thinking, organizational behavior, and decision frameworks. As Founding Member of the Industry Interaction Committee, helped organize the CHRO Summit with leaders from PowerGrid, Coal India, IOCL, Adani Power, and DMRC."
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
    <section className="relative py-24 bg-slate-950 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <h3 className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4">
            Background
          </h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
            Education & <span className="italic text-white/60">Foundations.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="border-t border-white/10 pt-6"
            >
              <h4 className="text-2xl font-light text-white mb-2">{edu.institution}</h4>
              <p className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">
                {edu.degree}
              </p>
              <p className="text-white/60 font-light leading-relaxed">
                {edu.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
