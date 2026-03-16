"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section id="contact" className="relative py-32 min-h-[70vh] bg-slate-950 px-6 md:px-24 flex flex-col items-center justify-center border-t border-white/5 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-mono text-white/40 uppercase tracking-[0.4em] mb-8">
            The Output
          </p>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight mb-16 drop-shadow-lg">
            Build systems that outlast <br/>
            <span className="text-white/60">founders, markets, and cycles.</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://www.linkedin.com/in/jai-vardhan-sharma/" 
              target="_blank"
              rel="noreferrer"
              className="px-10 py-5 rounded-full bg-white text-black font-medium tracking-widest hover:bg-white/90 transition-all hover:scale-[1.02] uppercase text-xs"
            >
              Connect on LinkedIn →
            </a>
            <a 
              href="mailto:hello@jaivardhansharma.com" 
              className="px-10 py-5 rounded-full bg-transparent border border-white/20 text-white font-medium tracking-widest hover:bg-white/10 transition-colors uppercase text-xs"
            >
              Email
            </a>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
