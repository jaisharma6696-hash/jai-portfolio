"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: hidden ? -100 : 0 }}
      transition={{ 
        opacity: { delay: 0.5, duration: 1 },
        y: { duration: 0.35, ease: "easeInOut" }
      }}
      className="fixed top-0 left-0 right-0 z-50 py-6 px-8 md:px-12 flex items-center justify-between pointer-events-none"
    >
      <div 
        className="text-white font-light tracking-[0.15em] text-sm cursor-pointer pointer-events-auto hover:text-white/70 transition-colors drop-shadow-md" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
      >
        Jai Vardhan Sharma
      </div>

      <nav className="hidden md:flex items-center gap-10 pointer-events-auto">
        {[
          { label: 'Journey', id: 'journey' },
          { label: 'Work', id: 'work' },
          { label: 'Architecture', id: 'stack' },
          { label: 'Contact', id: 'contact' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="text-white/60 hover:text-white text-xs font-mono uppercase tracking-[0.2em] transition-colors drop-shadow-md"
          >
            {item.label}
          </button>
        ))}
      </nav>

    </motion.header>
  );
}
