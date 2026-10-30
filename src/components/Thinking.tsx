"use client";

import { SplitReveal, ScrollLit, Rise } from "@/components/fx/Reveal";

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
    <section className="relative py-32 md:py-40 bg-slate-950 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <Rise>
            <h3 className="text-sm font-mono text-amber-500/70 uppercase tracking-[0.3em] mb-4">
              Philosophy
            </h3>
          </Rise>
          <SplitReveal
            parts={[{ text: "Thinking.", className: "font-display italic text-amber-400/90" }]}
            className="text-5xl md:text-7xl font-light text-white tracking-tight"
          />
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {PRINCIPLES.map((item, i) => (
            <div key={item.title} className="grid md:grid-cols-12 gap-6 md:gap-10">
              <Rise className="md:col-span-4" delay={0.05}>
                <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-3">0{i + 1}</p>
                <h4 className="text-2xl md:text-3xl font-display italic text-amber-100/90 leading-tight">
                  {item.title}
                </h4>
              </Rise>
              <ScrollLit
                text={item.desc}
                className="md:col-span-8 text-3xl md:text-5xl font-light leading-[1.15] tracking-tight text-white"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
