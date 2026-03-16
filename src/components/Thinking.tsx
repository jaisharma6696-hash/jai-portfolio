"use client";

import { motion } from "framer-motion";

const PRINCIPLES = [
  {
    title: "Markets Are Systems",
    desc: "Markets are systems of incentives and behavior. Understand the system and you can design the outcome."
  },
  {
    title: "Brands Are Behavioral Architecture",
    desc: "Brands shape the environment in which decisions are made."
  },
  {
    title: "Institutions Are the Endgame",
    desc: "Companies scale revenue. Institutions scale impact."
  }
];

export default function Thinking() {
  return (
    <section className="relative py-32 bg-slate-950 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center md:text-left"
        >
          <h3 className="text-sm font-mono text-amber-500/70 uppercase tracking-[0.3em] mb-4">
            Philosophy
          </h3>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
             <span className="italic text-amber-500/90">Thinking.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-12">
          {PRINCIPLES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group pl-6 md:pl-10 border-l border-amber-500/20 hover:border-amber-500/60 transition-colors"
            >
              <h4 className="text-2xl md:text-3xl font-light tracking-wide text-white mb-4 group-hover:text-amber-50 transition-colors">
                {item.title}
              </h4>
              <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed max-w-2xl group-hover:text-amber-100/70 transition-colors">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
