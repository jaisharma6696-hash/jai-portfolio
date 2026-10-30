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
          <button onClick={() => scrollToTarget(0)} aria-label="Back to top" className="hidden lg:block pl-4 pr-2 font-display italic text-lg text-white whitespace-nowrap hover:text-amber-200 transition-colors">
            Jai Vardhan Sharma
          </button>
          <button onClick={() => scrollToTarget(0)} className="lg:hidden pl-4 pr-3 font-display italic text-lg text-white whitespace-nowrap">Jai Vardhan Sharma</button>

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

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[45] lg:hidden bg-[#0b1035] flex flex-col justify-between px-8 pt-28 pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          >
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(242,107,29,.25),transparent_55%)] pointer-events-none" />
            <nav className="relative flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
                  onClick={() => go(item.id)}
                  className="flex items-baseline gap-4 text-left py-1"
                >
                  <span className="font-mono text-xs text-orange-400/80">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display italic text-5xl leading-tight ${active === item.id ? "text-orange-400" : "text-white"}`}>{item.label}</span>
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="relative flex flex-col gap-3"
            >
              <a href="https://www.linkedin.com/in/jai-vardhan-sharma/" target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}
                className="w-full text-center rounded-full bg-white text-black py-4 text-xs font-mono uppercase tracking-[0.2em]">Connect on LinkedIn →</a>
              <a href="mailto:hello@jaivardhansharma.com" onClick={() => setMobileOpen(false)}
                className="w-full text-center rounded-full liquid-glass py-4 text-xs font-mono uppercase tracking-[0.2em] text-white/80">hello@jaivardhansharma.com</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
