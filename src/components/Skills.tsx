"use client";

import { motion } from "framer-motion";

const SKILL_CATEGORIES = [
  {
    title: "Strategy & Transformation",
    skills: [
      "Business Transformation", "Operating Model Design", "Corporate Strategy", 
      "Strategic Planning", "Execution Governance", "Change Management"
    ]
  },
  {
    title: "Consulting & Leadership",
    skills: [
      "Chief of Staff Operations", "Cross-Functional Program Leadership", 
      "Stakeholder Management", "Executive Communication", "Decision-Support Systems"
    ]
  },
  {
    title: "Data & Analytics",
    skills: [
      "Advanced Excel (Macros, Power Query)", "SQL (MySQL, PostgreSQL)", 
      "Power BI", "Google Data Studio", "Analytics Dashboards", "Performance Metrics Architecture"
    ]
  },
  {
    title: "Entrepreneurship & Business Building",
    skills: [
      "P&L Ownership", "Market Entry Strategy", "FMCG Brand Building", 
      "Distributor Network Strategy", "Supply Chain Optimization", "Team Building"
    ]
  },
  {
    title: "Digital & AI",
    skills: [
      "Generative AI Applications", "Prompt Engineering", "AI Productivity Systems", 
      "Digital Transformation"
    ]
  }
];

const CERTIFICATIONS = [
  "BCG – Strategy Consulting",
  "BCG – X Ventures (Operating Models & New Business Design)",
  "PMI – Prompt Engineering",
  "PMI – Practical Application of Generative AI"
];

export default function Skills() {
  return (
    <section className="relative py-32 bg-slate-950 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <h3 className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4">
            Capabilities Arsenal
          </h3>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
            Skills & <span className="italic text-white/60">Expertise.</span>
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {SKILL_CATEGORIES.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-8 hover:bg-white/[0.04] transition-colors"
            >
              <h4 className="text-xl font-light text-white mb-6 tracking-wide border-b border-white/10 pb-4">
                {category.title}
              </h4>
              <ul className="space-y-3">
                {category.skills.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-white/30 mt-1.5 text-xs">◆</span>
                    <span className="text-white/70 font-light text-sm md:text-base leading-relaxed">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Certifications Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center"
        >
          <h4 className="text-lg font-mono text-white/50 uppercase tracking-[0.2em] mb-8">
            Certifications
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {CERTIFICATIONS.map((cert, i) => (
              <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white/80 font-light text-sm tracking-wide">
                {cert}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
