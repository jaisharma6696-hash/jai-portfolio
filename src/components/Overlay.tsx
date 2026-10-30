"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { EASE } from "@/lib/motion";

// Masked line that rises once the intro loader has cleared.
function Line({ show, delay, children, className = "" }: { show: boolean; delay: number; children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.1em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={show ? { y: "0%" } : { y: "105%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface OverlayProps {
  scrollProgress: MotionValue<number>;
}

export default function Overlay({ scrollProgress }: OverlayProps) {
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    const on = () => setIntro(true);
    window.addEventListener("intro-done", on);
    const fallback = setTimeout(on, 6000);
    return () => { window.removeEventListener("intro-done", on); clearTimeout(fallback); };
  }, []);
  
  // Helper to map a progress window to opacity
  // Each stage occupies approx 10-12% of the scroll journey. 
  // Total height is 800vh, so each 12.5% is 100vh of scrolling.

  // Stage 1: INTRO (0 - 15%)
  const op1 = useTransform(scrollProgress, [0, 0.05, 0.12, 0.15], [1, 1, 1, 0]);
  const y1 = useTransform(scrollProgress, [0, 0.15], ["0vh", "-50vh"]);

  // Stage 2: DELHI (15 - 28%)
  const op2 = useTransform(scrollProgress, [0.12, 0.16, 0.25, 0.28], [0, 1, 1, 0]);
  const y2 = useTransform(scrollProgress, [0.15, 0.28], ["20vh", "-20vh"]);

  // Stage 3: DUBAI (28 - 41%)
  const op3 = useTransform(scrollProgress, [0.25, 0.3, 0.38, 0.41], [0, 1, 1, 0]);
  const y3 = useTransform(scrollProgress, [0.28, 0.41], ["20vh", "-20vh"]);

  // Stage 4: MDI GURGAON (41 - 54%)
  const op4 = useTransform(scrollProgress, [0.38, 0.43, 0.51, 0.54], [0, 1, 1, 0]);
  const y4 = useTransform(scrollProgress, [0.41, 0.54], ["20vh", "-20vh"]);

  // Stage 5: BRANDS & SYSTEMS (54 - 67%)
  const op5 = useTransform(scrollProgress, [0.51, 0.56, 0.64, 0.67], [0, 1, 1, 0]);
  const y5 = useTransform(scrollProgress, [0.54, 0.67], ["20vh", "-20vh"]);

  // Stage 6: RODIC TRANSFORMATION (67 - 80%)
  const op6 = useTransform(scrollProgress, [0.64, 0.69, 0.77, 0.80], [0, 1, 1, 0]);
  const y6 = useTransform(scrollProgress, [0.67, 0.80], ["20vh", "-20vh"]);

  // Stage 7: FUTURE VISION (80 - 100%)
  const op7 = useTransform(scrollProgress, [0.77, 0.82, 0.95, 1], [0, 1, 1, 0]);
  const y7 = useTransform(scrollProgress, [0.80, 1], ["20vh", "0vh"]);


  return (
    <div className="absolute inset-0 z-10 pointer-events-none text-white selection:bg-white/30">
      
      {/* 1. INTRO / HERO */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"
        style={{ y: y1, opacity: op1 }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tight text-center drop-shadow-xl mb-6 leading-none">
          <Line show={intro} delay={0.05}>Jai Vardhan</Line>
          <Line show={intro} delay={0.18}><span className="font-display italic text-white/85">Sharma</span></Line>
        </h1>
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={intro ? { opacity: 1, letterSpacing: "0.18em" } : {}}
          transition={{ duration: 1.4, ease: EASE, delay: 0.45 }}
          className="text-base md:text-xl text-white/90 font-light uppercase mb-8 text-center"
        >
          Strategy. <span className="text-white/50">Brands.</span> Systems.
        </motion.p>
        <div className="text-sm md:text-base text-white/60 text-center tracking-wide leading-relaxed max-w-lg space-y-4">
          <Line show={intro} delay={0.7}>Building ventures, systems, and ideas that scale.</Line>
          <Line show={intro} delay={0.8}><span className="font-display italic text-lg md:text-xl text-white/80">Born into questions. Built through execution.</span></Line>
        </div>

        {/* Scroll Cue */}
        <motion.div
          className="absolute bottom-14 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={intro ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.35em]">Scroll</span>
          <div className="relative w-px h-12 bg-white/15 overflow-hidden">
            <div className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-amber-400 to-transparent" />
          </div>
        </motion.div>
      </motion.div>

      {/* 2. DELHI / CHAPTER 01 */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-24"
        style={{ y: y2, opacity: op2 }}
      >
        <div className="max-w-2xl liquid-glass bg-slate-950/30 p-8 rounded-3xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 01</p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Curiosity as an <br/><span className="font-display italic text-white/70">operating model.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
            Early Delhi ventures. <span className="italic text-white">Execution beats intention.</span>
          </p>
        </div>
      </motion.div>

      {/* 3. DUBAI / CHAPTER 02 */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-end justify-center p-8 md:p-24 text-right"
        style={{ y: y3, opacity: op3 }}
      >
        <div className="max-w-2xl liquid-glass bg-slate-950/30 p-8 rounded-3xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 02</p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Observing the <br/><span className="font-display italic text-white/70">market machine.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
            Dubai. Consumer psychology, brand scale, spatial design.
          </p>
        </div>
      </motion.div>

      {/* 4. MDI / CHAPTER 03 */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-24 text-center"
        style={{ y: y4, opacity: op4 }}
      >
        <div className="max-w-3xl liquid-glass bg-slate-950/30 p-10 rounded-3xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 03</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 drop-shadow-lg">
            Formalising the <br/><span className="font-display italic text-white/85">frameworks.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed">
            MDI Gurgaon. Instinct meets structured strategy.
          </p>
        </div>
      </motion.div>

      {/* 5. BRANDS / CHAPTER 04 */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-24"
        style={{ y: y5, opacity: op5 }}
      >
        <div className="max-w-2xl liquid-glass bg-slate-950/30 p-8 rounded-3xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 04</p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Building markets.<br/><span className="font-display italic text-white/70">Not just brands.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed">
            Beantree, Bodega, and <span className="italic text-white">consumer culture.</span>
          </p>
        </div>
      </motion.div>

      {/* 6. ENTERPRISE / CHAPTER 05 */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-end justify-center p-8 md:p-24 text-right"
        style={{ y: y6, opacity: op6 }}
      >
        <div className="max-w-3xl liquid-glass bg-slate-950/30 p-8 rounded-3xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 05</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Enterprise <br/>architecture. <span className="text-white/60 text-4xl">Inside Rodic.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 font-light max-w-lg ml-auto leading-relaxed">
            Operating models, analytics infrastructure, governance systems.
          </p>
        </div>
      </motion.div>

      {/* 7. FUTURE / ENDING */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-end pb-32 p-8 md:p-24 text-center bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
        style={{ y: y7, opacity: op7 }}
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 drop-shadow-2xl">
          The next <span className="font-display italic text-amber-200/90">iteration.</span>
        </h2>
        <p className="text-xl md:text-3xl text-white/80 font-light tracking-wide leading-relaxed">
          Systems. Institutions. <span className="text-white font-medium drop-shadow-md">Outcomes that outlast the cycle.</span>
        </p>
      </motion.div>

    </div>
  );
}
