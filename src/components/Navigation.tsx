"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Journey", id: "journey" },
  { label: "Work", id: "work" },
  { label: "Architecture", id: "stack" },
  { label: "Contact", id: "contact" },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileOpen(false);
    } else {
      setHidden(false);
    }
  });

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: hidden ? -100 : 0 }}
        transition={{
          opacity: { delay: 0.5, duration: 1 },
          y: { duration: 0.35, ease: "easeInOut" },
        }}
        className="fixed top-0 left-0 right-0 z-50 py-6 px-8 md:px-12 flex items-center justify-between pointer-events-none"
      >
        {/* Wordmark — matching Strategist/Operator/Founder visual weight */}
        <div
          className="text-white font-light tracking-tight text-xl md:text-2xl cursor-pointer pointer-events-auto hover:text-white/70 transition-colors drop-shadow-md"
          style={{ fontFamily: "var(--font-geist-sans)", letterSpacing: "0.01em" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Jai Vardhan Sharma
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10 pointer-events-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-white/60 hover:text-white text-xs font-mono uppercase tracking-[0.2em] transition-colors drop-shadow-md"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden pointer-events-auto flex flex-col gap-[5px] p-2 group"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-6 h-[1.5px] bg-white/80 origin-center"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="block w-6 h-[1.5px] bg-white/80"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-6 h-[1.5px] bg-white/80 origin-center"
          />
        </button>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed top-[72px] left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5"
          >
            <nav className="flex flex-col px-8 py-6 gap-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  onClick={() => scrollTo(item.id)}
                  className="text-white/70 hover:text-white text-sm font-mono uppercase tracking-[0.25em] text-left transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/jai-vardhan-sharma/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/40 hover:text-white/70 text-xs font-mono uppercase tracking-[0.2em] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  LinkedIn →
                </a>
                <a
                  href="mailto:hello@jaivardhansharma.com"
                  className="text-white/40 hover:text-white/70 text-xs font-mono uppercase tracking-[0.2em] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  hello@jaivardhansharma.com
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
