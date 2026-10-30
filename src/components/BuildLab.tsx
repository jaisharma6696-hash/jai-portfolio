"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BuildLabHandle } from "@/lib/buildLabScene";

// Codenamed builds — no real names, clients or companies.
const BUILDS = [
  {
    code: "A", name: "Halo", kind: "AI Assistant",
    line: "A personal AI chief-of-staff that lives in WhatsApp — reads the day, drafts the replies, and only acts after a confirm.",
    tags: ["Multi-model fallback", "Confirm-to-act", "Always-on cloud VM"],
  },
  {
    code: "B", name: "Beacon", kind: "Event Command Centre",
    line: "One live command centre for a national tech conclave — registrations, partners, speakers and run-of-show on a single screen.",
    tags: ["Live ops dashboard", "Partner pipeline", "Run-of-show"],
  },
  {
    code: "C", name: "Vows", kind: "Celebration Microsites",
    line: "Cinematic wedding-invite microsites, designed, written and shipped on custom domains in days, not weeks.",
    tags: ["Motion design", "Custom domains", "Mobile-first"],
  },
  {
    code: "D", name: "Railgrid", kind: "Asset Intelligence",
    line: "Asset intelligence for an urban metro — every pillar QR-tagged, every inspection traceable, from BRD to working prototype.",
    tags: ["QR asset tagging", "BRD → PRD → POC", "Maintenance analytics"],
  },
  {
    code: "E", name: "Blueprint", kind: "Project Management OS",
    line: "An AI-native project management system for infrastructure delivery — land, design, funding and reporting as one connected flow.",
    tags: ["Modular wireframes", "Predictive reporting", "Stakeholder hub"],
  },
  {
    code: "F", name: "Compass", kind: "Career OS",
    line: "A truth-first career OS that scans live roles, scores fit with its working shown, and tailors every application.",
    tags: ["Live job feeds", "Explainable scoring", "Tailored CVs"],
  },
  {
    code: "G", name: "Brew", kind: "Founder Toolkit",
    line: "A café-planning toolkit that takes a founder from concept and location to menu, model and opening day.",
    tags: ["Financial model", "Launch checklist", "No-backend SaaS"],
  },
  {
    code: "H", name: "Forge", kind: "Industrial Platform",
    line: "A public site and quote-request platform for an industrial manufacturer — drawings in, enquiries tracked end to end.",
    tags: ["RFQ workflow", "Secure uploads", "Admin console"],
  },
];

const N = BUILDS.length;

export default function BuildLab() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BuildLabHandle | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const cv = canvasRef.current, lb = labelsRef.current, wr = wrapRef.current;
    if (!cv || !lb || !wr) return;
    let disposed = false, io: IntersectionObserver | null = null;

    import("@/lib/buildLabScene").then(({ mountBuildLab }) => {
      if (disposed) return;
      const s = mountBuildLab(cv, lb, BUILDS.map(b => `${b.code} · ${b.name}`));
      if (!s) return;
      sceneRef.current = s;
      s.setShift(window.innerWidth >= 1024 ? 0.4 : 0);
      io = new IntersectionObserver(([e]) => s.setActive(e.isIntersecting), { rootMargin: "120px" });
      io.observe(wr);
      onScroll();
    });

    // scroll position inside the pinned section picks a step: 0 intro, 1..N builds, N+1 outro
    const onScroll = () => {
      const r = wr.getBoundingClientRect(), vh = window.innerHeight;
      const s = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      const k = Math.round(s * (N + 1));
      sceneRef.current?.setProgress(k);
      setStep(prev => (prev === k ? prev : k));
    };
    const onResize = () => {
      sceneRef.current?.setShift(window.innerWidth >= 1024 ? 0.4 : 0);
      sceneRef.current?.resize();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const jump = (k: number) => {
    const wr = wrapRef.current; if (!wr) return;
    const top = wr.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((wr.offsetHeight - window.innerHeight) * k) / (N + 1), behavior: "smooth" });
  };

  const b = step >= 1 && step <= N ? BUILDS[step - 1] : null;

  return (
    <section id="builds" ref={wrapRef} className="relative bg-slate-950" style={{ height: `${(N + 2) * 75}vh` }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        onMouseMove={onMove}
        onMouseLeave={() => sceneRef.current?.setPointer(0, 0)}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div ref={labelsRef} className="absolute inset-0 pointer-events-none" />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[54%] bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent lg:hidden pointer-events-none" />

        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 md:px-12 lg:px-0 flex flex-col justify-end lg:justify-center pb-16 lg:pb-0 pointer-events-none">
          <div className="max-w-md pointer-events-auto">
            <p className="text-xs font-mono text-white/40 uppercase tracking-[0.4em] mb-6">Build Lab</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
              >
                {b ? (
                  <>
                    <p className="text-sm font-mono text-amber-500/80 uppercase tracking-[0.3em] mb-3">
                      Project {b.code} — {b.kind}
                    </p>
                    <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
                      {b.name}.
                    </h2>
                    <p className="text-lg text-white/70 font-light leading-relaxed mb-8">{b.line}</p>
                    <div className="flex flex-wrap gap-2">
                      {b.tags.map(t => (
                        <span key={t} className="px-3 py-1.5 border border-white/10 bg-slate-950/60 text-white/60 text-xs tracking-wider rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : step === 0 ? (
                  <>
                    <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
                      Things I&apos;ve built.<br />
                      <span className="text-white/50">Codenamed.</span>
                    </h2>
                    <p className="text-lg text-white/60 font-light leading-relaxed">
                      Eight builds across AI, events, infrastructure and commerce. Scroll to walk the map.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
                      Eight builds.<br />
                      <span className="text-white/50">And counting.</span>
                    </h2>
                    <p className="text-lg text-white/60 font-light leading-relaxed">
                      Each one started as a problem worth a system. Names withheld; the thinking is on the map.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-10">
              {BUILDS.map((x, i) => (
                <button
                  key={x.code}
                  onClick={() => jump(i + 1)}
                  aria-label={`Project ${x.code} — ${x.name}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${step === i + 1 ? "w-8 bg-amber-500" : step > i ? "w-3 bg-white/40" : "w-3 bg-white/15"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
