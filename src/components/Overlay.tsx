"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
  scrollProgress: MotionValue<number>;
}

export default function Overlay({ scrollProgress }: OverlayProps) {
  
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
          Jai Vardhan <span className="font-light text-white/80">Sharma</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-light tracking-widest uppercase mb-8">
          Strategy. <span className="text-white/50">Brands.</span> Systems.
        </p>
        <div className="text-sm md:text-base text-white/60 text-center tracking-wide leading-relaxed max-w-lg space-y-4">
          <p>Building ventures, systems, and ideas that scale.</p>
          <p className="italic">Born into questions. Built through execution.</p>
        </div>
        
        {/* Scroll Cue */}
        <motion.div 
          className="absolute bottom-16 flex flex-col items-center gap-3 opacity-50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-mono uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </motion.div>

      {/* 2. DELHI / CHAPTER 01 */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-24"
        style={{ y: y2, opacity: op2 }}
      >
        <div className="max-w-2xl bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 01</p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Curiosity as an <br/><span className="text-white/60">operating model.</span>
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
        <div className="max-w-2xl bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 02</p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Observing the <br/><span className="italic text-white/60">market machine.</span>
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
        <div className="max-w-3xl bg-black/20 backdrop-blur-md p-10 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 03</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 drop-shadow-lg">
            Formalising the <br/><span className="font-medium text-white/80">frameworks.</span>
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
        <div className="max-w-2xl bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mb-4">Chapter 04</p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6 drop-shadow-lg">
            Building markets.<br/><span className="text-white/60">Not just brands.</span>
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
        <div className="max-w-3xl bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
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
          The next <span className="italic font-normal">iteration.</span>
        </h2>
        <p className="text-xl md:text-3xl text-white/80 font-light tracking-wide leading-relaxed">
          Systems. Institutions. <span className="text-white font-medium drop-shadow-md">Outcomes that outlast the cycle.</span>
        </p>
      </motion.div>

    </div>
  );
}
