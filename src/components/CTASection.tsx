"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative py-32 min-h-[70vh] bg-slate-950 px-6 md:px-24 flex flex-col items-center justify-center border-t border-white/5 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-mono text-white/30 uppercase tracking-[0.4em] mb-10">
            The Next Chapter
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            Build systems that outlast <br />
            <span className="text-white/50">founders, markets, and cycles.</span>
          </h2>

          <p className="text-white/30 font-light text-lg mb-16 max-w-xl mx-auto leading-relaxed">
            Open to strategic conversations — ventures, transformation mandates, partnerships, and ideas worth pursuing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="https://www.linkedin.com/in/jai-vardhan-sharma/"
              target="_blank"
              rel="noreferrer"
              className="px-10 py-4 rounded-full bg-white text-black text-xs font-mono tracking-widest hover:bg-white/90 transition-all hover:scale-[1.02] uppercase"
            >
              Connect on LinkedIn →
            </a>
            <a
              href="mailto:hello@jaivardhansharma.com"
              className="px-10 py-4 rounded-full bg-transparent border border-white/15 text-white/70 text-xs font-mono tracking-widest hover:bg-white/[0.05] hover:text-white hover:border-white/30 transition-all uppercase"
            >
              hello@jaivardhansharma.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center px-6"
      >
        <p className="text-white/20 text-xs font-light tracking-wide leading-relaxed">
          © 2026 Jai Vardhan Sharma — Built with curiosity, strategy, and a love for building things.
        </p>
        <p className="text-white/15 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">
          Designed & built by Jai with AI
        </p>
      </motion.footer>
    </section>
  );
}
