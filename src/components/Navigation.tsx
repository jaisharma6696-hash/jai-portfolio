"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { EASE, scrollToTarget } from "@/lib/motion";

const NAV_ITEMS = [
  { label: "Ventures", id: "ventures" },
  { label: "AI Builds", id: "builds" },
  { label: "Method", id: "method" },
  { label: "Work", id: "work" },
  { label: "Architecture", id: "stack" },
  { label: "Contact", id: "contact" },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [raised, setRaised] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setRaised(latest > 100);
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileOpen(false);
    } else {
      setHidden(false);
    }
  });

  // highlight the section currently crossing the middle of the viewport
  useEffect(() => {
    const els = NAV_ITEMS.map(i => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach(el => io.observe(el));
    const top = () => { if (window.scrollY < window.innerHeight) setActive(null); };
    window.addEventListener("scroll", top, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", top); };
  }, []);

  const go = (id: string) => { setMobileOpen(false); scrollToTarget(id); };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: hidden ? -110 : 0 }}
        transition={{ opacity: { delay: 0.5, duration: 1 }, y: { duration: 0.45, ease: EASE } }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
      >
        <div
          className={`pointer-events-auto liquid-glass rounded-full flex items-center gap-1 p-1.5 transition-shadow duration-500 ${raised ? "shadow-lg shadow-black/40" : ""}`}
        >
          {/* JVS badge */}
          <button
            onClick={() => scrollToTarget(0)}
            aria-label="Back to top"
            className="group relative w-9 h-9 rounded-full p-[1.5px] ring-gradient shrink-0"
          >
            <span className="flex w-full h-full items-center justify-center rounded-full bg-slate-950 font-display italic text-[13px] text-white group-hover:scale-110 transition-transform duration-300">
              jvs
            </span>
          </button>
          <span className="lg:hidden pl-2 pr-3 text-sm font-light text-white/80 tracking-tight">Jai Vardhan Sharma</span>

          <div className="hidden lg:block w-px h-5 bg-white/10 mx-1" />

          <nav className="hidden lg:flex items-center">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`relative px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-300 ${active === item.id ? "text-white" : "text-white/55 hover:text-white"}`}
              >
                {active === item.id && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:block w-px h-5 bg-white/10 mx-1" />

          <a
            href="mailto:hello@jaivardhansharma.com"
            className="hidden lg:inline-flex group relative rounded-full p-[1px] overflow-hidden"
          >
            <span className="absolute inset-0 ring-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative rounded-full bg-white text-black px-4 py-2 text-[11px] font-mono uppercase tracking-[0.18em]">
              Say hi <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </span>
          </a>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 items-center rounded-full bg-white/[0.06]"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block w-4 h-[1.5px] bg-white/80 origin-center" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block w-4 h-[1.5px] bg-white/80 origin-center" />
          </button>
        </div>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed top-[76px] left-4 right-4 z-40 lg:hidden liquid-glass bg-slate-950/80 rounded-3xl"
          >
            <nav className="flex flex-col px-7 py-6 gap-5">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                  onClick={() => go(item.id)}
                  className={`text-left text-3xl font-display italic transition-colors ${active === item.id ? "text-amber-400" : "text-white/80 hover:text-white"}`}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="border-t border-white/10 pt-4 mt-1 flex flex-col gap-3">
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
