"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DroneHandle } from "@/lib/droneScene";

const BUBBLES = ["Let’s build something.", "Say hello."];

export default function CTASection() {
  const secRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const btnRefs = [useRef<HTMLAnchorElement>(null), useRef<HTMLAnchorElement>(null)];
  const droneRef = useRef<DroneHandle | null>(null);
  const hovRef = useRef(-1);
  const [hov, setHov] = useState(-1);

  const droneSize = () => {
    const w = secRef.current?.clientWidth ?? 1200;
    return w < 640 ? 64 : w < 1024 ? 84 : 104;
  };

  // home pad sits beside the heading (desktop) or above it (mobile); hovering a button sends the drone over it
  const aim = () => {
    const sec = secRef.current, d = droneRef.current; if (!sec || !d) return;
    const sr = sec.getBoundingClientRect(), z = droneSize(), wide = sr.width >= 1024;
    const hx = wide ? sr.width * 0.86 : sr.width * 0.5, hy = wide ? sr.height * 0.3 : z * 1.2;
    d.setHome(hx, hy);
    const b = hovRef.current >= 0 ? btnRefs[hovRef.current].current : null;
    if (!b) { d.setTarget(hx, hy); return; }
    const r = b.getBoundingClientRect();
    d.setTarget(r.left - sr.left + r.width / 2, r.top - sr.top - z * 0.75);
  };

  const enter = (i: number) => () => { hovRef.current = i; setHov(i); aim(); };
  const leave = () => { hovRef.current = -1; setHov(-1); aim(); };

  useEffect(() => {
    const sec = secRef.current, cv = canvasRef.current; if (!sec || !cv) return;
    let disposed = false, io: IntersectionObserver | null = null;
    const onMove = (e: PointerEvent) => { const r = sec.getBoundingClientRect(); droneRef.current?.setLook(e.clientX - r.left, e.clientY - r.top); };
    const onResize = () => { droneRef.current?.resize(); aim(); };

    import("@/lib/droneScene").then(({ mountDrone }) => {
      if (disposed) return;
      const d = mountDrone(cv, {
        size: droneSize,
        engaged: () => hovRef.current >= 0,
        onFrame: (x, y, settled) => {
          const bb = bubbleRef.current; if (!bb) return;
          const on = hovRef.current >= 0 && settled;
          bb.style.transform = `translate3d(${(x + droneSize() * 0.55).toFixed(1)}px,${(y - droneSize() * 0.9).toFixed(1)}px,0)`;
          bb.style.opacity = on ? "1" : "0";
        },
      });
      if (!d) return;
      droneRef.current = d;
      aim();
      io = new IntersectionObserver(([e]) => { d.setActive(e.isIntersecting); if (e.isIntersecting) aim(); }, { rootMargin: "120px" });
      io.observe(sec);
    });
    sec.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      io?.disconnect();
      sec.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      droneRef.current?.dispose();
      droneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={secRef}
      id="contact"
      className="relative py-32 min-h-[70vh] bg-slate-950 px-6 md:px-24 flex flex-col items-center justify-center border-t border-white/5 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Contact scout drone */}
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none z-20" />
      <div
        ref={bubbleRef}
        aria-hidden
        className="absolute left-0 top-0 z-30 pointer-events-none opacity-0 transition-opacity duration-300 px-4 py-2 rounded-2xl rounded-bl-sm bg-white text-black text-xs font-mono tracking-wider whitespace-nowrap"
      >
        {BUBBLES[hov >= 0 ? hov : 0]}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full pt-24 lg:pt-0">
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
            <span className="font-display italic text-white/60">founders, markets, and cycles.</span>
          </h2>

          <p className="text-white/30 font-light text-lg mb-16 max-w-xl mx-auto leading-relaxed">
            Open to strategic conversations — ventures, transformation mandates, partnerships, and ideas worth pursuing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              ref={btnRefs[0]}
              onMouseEnter={enter(0)}
              onMouseLeave={leave}
              onFocus={enter(0)}
              onBlur={leave}
              href="https://www.linkedin.com/in/jai-vardhan-sharma/"
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-full p-[1.5px] overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="absolute inset-0 ring-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative block px-10 py-4 rounded-full bg-white text-black text-xs font-mono tracking-widest uppercase">
                Connect on LinkedIn <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
            <a
              ref={btnRefs[1]}
              onMouseEnter={enter(1)}
              onMouseLeave={leave}
              onFocus={enter(1)}
              onBlur={leave}
              href="mailto:hello@jaivardhansharma.com"
              className="liquid-glass px-10 py-4 rounded-full text-white/75 text-xs font-mono tracking-widest hover:bg-white/[0.07] hover:text-white transition-all duration-300 hover:scale-[1.03] uppercase"
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
