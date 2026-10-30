"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import type { BuildLabHandle } from "@/lib/buildLabScene";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

// AI products, codenamed — no real names, clients or companies.
const BUILDS = [
  {
    code: "A", name: "Halo", kind: "AI Chief-of-Staff", status: "Live · daily use",
    problem: "Work arrives across email, chat and calendar — and the important bits get lost.",
    does: [
      "Lives in WhatsApp: reads work mail, chat and calendar; replies in text or voice, and understands voice notes and files",
      "Scheduled briefs — 9 AM summary, urgent-item alerts, evening wrap-up, weekly review",
      "Proposes actions, but only executes after an explicit OK",
    ],
    ai: "Three-tier model fallback — a frontier model first, a second provider next, a self-hosted model last — so it never goes silent.",
    facts: ["199 scheduled runs in 2 weeks", "Self-healing on a cloud server", "Packaged as an installable kit"],
  },
  {
    code: "B", name: "Beacon", kind: "Event Command Centre", status: "Live · in production",
    problem: "A national tech conclave with 12 workstreams and hundreds of moving parts, run from spreadsheets.",
    does: [
      "A 298-task plan across 12 workstreams with critical path and Gantt",
      "Startup jury with weighted, blind scoring computed on the server",
      "Event Mode: a 25-cue run of show and an incident log with severity alerts",
    ],
    ai: "Designed and built end to end with an AI coding agent, then hardened with 918 automated checks.",
    facts: ["63 routes · 23 tables", "316 invitees managed", "918 checks passing"],
  },
  {
    code: "C", name: "Vows", kind: "Celebration Microsites", status: "Live · 2 sites",
    problem: "Invites are PDFs nobody can find on the day.",
    does: [
      "Envelope-opening intro, music, schedule, venues and directions — mobile-first",
      "Opt-in reminders, an admin panel and WhatsApp share previews",
      "The second site was generated from the first — a reusable product, not a one-off",
    ],
    ai: "AI-assisted design, copywriting and deployment — from first draft to live domain in one loop.",
    facts: ["2 live domains", "4–5 design options each", "Days, not weeks"],
  },
  {
    code: "D", name: "Railgrid", kind: "Asset Intelligence", status: "Proof of concept",
    problem: "Thousands of metro pillars, inspections on paper, no single history per asset.",
    does: [
      "I wrote the business and product requirements first — then had the platform built from them",
      "12 role-based personas, from field inspector to leadership",
      "QR identity per pillar: scan to see its history and raise an inspection",
    ],
    ai: "Built by an AI agent against my PRD — and accepted only when every scenario passed.",
    facts: ["17 / 17 acceptance checks", "12 personas", "144-use-case strategy paper"],
  },
  {
    code: "E", name: "Blueprint", kind: "Project Management OS", status: "Interactive wireframe",
    problem: "Infrastructure projects run across a dozen disconnected tools and trackers.",
    does: [
      "18 modules from project setup to closure — land, design, planning, materials, contracts, funds, quality, safety, risk, billing",
      "Schedule sync with planning tools, plus BIM and GIS progress views",
      "A predictive module for delays and risk",
    ],
    ai: "AI assistants built into the stakeholder, land and contract modules.",
    facts: ["18 modules", "AI in 3 modules", "End-to-end lifecycle"],
  },
  {
    code: "F", name: "Compass", kind: "Career OS", status: "In use",
    problem: "Job hunting is noisy — most listings are irrelevant, stale or vague.",
    does: [
      "Pulls live roles from five job sources and direct employer boards",
      "Scores each role on function, seniority, location, evidence and freshness — with the working shown",
      "Tailors the CV and cover letter for every shortlisted role",
    ],
    ai: "Explainable scoring with explicit uncertainty and risk flags — never a black box.",
    facts: ["5 live sources", "Explainable scoring", "Tailored applications"],
  },
  {
    code: "G", name: "Brew", kind: "Founder Toolkit", status: "Shipped",
    problem: "First-time café founders guess their way to opening day.",
    does: [
      "Ten stages: concept, location, layout, financial model, menu, procurement, staff, compliance, pre-opening, operations",
      "A printable founder report at the end",
      "No login and no backend — the founder's data stays in their browser",
    ],
    ai: "Specified as 40 acceptance criteria and built against them with an AI agent — all 40 passing.",
    facts: ["10 stages", "40 / 40 criteria", "Zero backend"],
  },
  {
    code: "H", name: "Forge", kind: "Industrial Platform", status: "Built",
    problem: "Quote requests arrive as email attachments and quietly go missing.",
    does: [
      "An accessible public site for an industrial manufacturer",
      "A request-for-quote flow with drawing uploads, validated and fingerprinted",
      "Every enquiry and status change tracked in an admin console",
    ],
    ai: "Built with an AI coding agent, with security and accessibility checks in the loop.",
    facts: ["RFQ workflow", "Verified uploads", "Admin console"],
  },
];

const N = BUILDS.length;

const MORE = [
  { t: "1 TB drive recovery", d: "94.3% of 114,552 files recovered and verified. My own extractor read 64,240 files at 97.6% in 2.5 hours — every move undoable." },
  { t: "Chief-of-Staff cockpit", d: "Revenue-leakage and pipeline dashboards, an actions-and-risks desk and a daily intel brief." },
  { t: "B2B sales CRM", d: "Purchases, sales and profit, with invoices read and extracted automatically." },
  { t: "Exit-interview agent", d: "An AI agent that runs exit interviews by voice and structures the insights." },
  { t: "Strategy game", d: "A native iPhone game that teaches how an infrastructure business works." },
  { t: "District intelligence", d: "A pan-India data platform for district-level signals." },
  { t: "Spend visibility", d: "Finance and vendor-spend views, scoped by role." },
  { t: "Whiteboard video engine", d: "Turns a script into an animated whiteboard explainer." },
];

export default function BuildLab() {
  const secRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const sceneRef = useRef<BuildLabHandle | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const cv = canvasRef.current, lb = labelsRef.current, sec = secRef.current;
    if (!cv || !lb || !sec) return;
    let disposed = false, io: IntersectionObserver | null = null;

    // the card whose centre is nearest the reading line drives the map (0 = overview)
    const onScroll = () => {
      const vh = window.innerHeight, line = vh * (window.innerWidth >= 1024 ? 0.5 : 0.68);
      let k = 0, best = Infinity;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - line);
        if (r.top < line + vh * 0.25 && d < best) { best = d; k = i + 1; }
      });
      const last = cardRefs.current[N - 1]?.getBoundingClientRect();
      if (last && last.bottom < vh * 0.3) k = N + 1;
      sceneRef.current?.setProgress(k);
      setStep(prev => (prev === k ? prev : k));
    };

    import("@/lib/buildLabScene").then(({ mountBuildLab }) => {
      if (disposed) return;
      const s = mountBuildLab(cv, lb, BUILDS.map(b => `${b.code} · ${b.name}`));
      if (!s) return;
      sceneRef.current = s;
      io = new IntersectionObserver(([e]) => s.setActive(e.isIntersecting), { rootMargin: "120px" });
      io.observe(sec);
      onScroll();
    });

    const onResize = () => sceneRef.current?.resize();
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

  return (
    <section id="builds" ref={secRef} className="relative bg-slate-950 pt-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-10 lg:mb-0">
          <p className="text-xs font-mono text-amber-500/80 uppercase tracking-[0.35em] mb-5">Build Lab · AI Products</p>
          <SplitReveal
            parts={["Things I've built\n", { text: "with AI.", className: "font-display italic text-amber-400/90" }]}
            className="text-5xl md:text-7xl font-light text-white tracking-tight leading-[1.02] mb-6"
          />
          <p className="text-lg text-white/55 font-light leading-relaxed max-w-xl">
            Eight products across operations, events, infrastructure and commerce — designed, specified and shipped with AI as my build team.
            Codenamed: clients and names withheld.
          </p>
        </div>

        <div className="relative lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Map — sticky beside the cards on desktop, pinned above them on mobile */}
          <div className="sticky top-0 z-20 lg:z-auto lg:order-2 lg:col-span-7 h-[40vh] lg:h-screen overflow-hidden lg:[mask-image:linear-gradient(to_right,transparent,black_14%)] -mx-6 md:-mx-12 lg:mx-0 bg-slate-950 lg:bg-transparent border-b border-white/5 lg:border-0" onMouseMove={onMove} onMouseLeave={() => sceneRef.current?.setPointer(0, 0)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-label="Isometric map of the eight AI products" />
            <div ref={labelsRef} className="absolute inset-0 pointer-events-none" />
            <div className="absolute left-4 right-4 bottom-3 flex gap-1.5 lg:hidden">
              {BUILDS.map((b, i) => <span key={b.code} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step === i + 1 ? "bg-amber-500" : step > i + 1 ? "bg-white/40" : "bg-white/10"}`} />)}
            </div>
          </div>

          {/* Product cards */}
          <div className="relative z-10 lg:order-1 lg:col-span-5 pb-[30vh] lg:pb-[40vh] lg:pt-[30vh]">
            {BUILDS.map((b, i) => {
              const on = step === i + 1;
              return (
                <motion.article
                  key={b.code}
                  ref={el => { cardRefs.current[i] = el; }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className={`mt-10 lg:mt-0 lg:mb-[28vh] rounded-3xl p-6 md:p-8 transition-all duration-500 ${on ? "liquid-glass bg-white/[0.04] border-amber-500/30" : "border border-white/[0.06] bg-white/[0.015] opacity-70"}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <p className="text-[11px] font-mono text-amber-500/80 uppercase tracking-[0.25em]">Project {b.code} — {b.kind}</p>
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] text-[10px] font-mono uppercase tracking-wider text-emerald-300/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{b.status}
                    </span>
                  </div>
                  <h3 className="text-5xl md:text-6xl font-display italic text-white leading-none mb-5">{b.name}.</h3>
                  <p className="text-lg text-white/80 font-light leading-relaxed mb-6">{b.problem}</p>

                  <p className="text-[11px] font-mono text-white/35 uppercase tracking-[0.25em] mb-3">What it does</p>
                  <ul className="space-y-2.5 mb-6">
                    {b.does.map(d => (
                      <li key={d} className="flex gap-3 text-white/65 font-light leading-relaxed">
                        <span className="text-amber-500/70 mt-[3px] text-xs">✦</span>{d}
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-4 mb-6">
                    <p className="text-[11px] font-mono text-amber-400/80 uppercase tracking-[0.25em] mb-1.5">The AI inside</p>
                    <p className="text-white/75 font-light leading-relaxed">{b.ai}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {b.facts.map(f => (
                      <span key={f} className="px-3 py-1.5 border border-white/10 bg-slate-950/60 text-white/70 text-xs tracking-wide rounded-full">{f}</span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* More from the lab */}
        <div className="pb-28">
          <p className="text-[11px] font-mono text-white/35 uppercase tracking-[0.3em] mb-6">More from the lab</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MORE.map((m, i) => (
              <motion.div
                key={m.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.07, duration: 0.7, ease: EASE }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-amber-500/25 hover:bg-white/[0.04] transition-colors"
              >
                <p className="text-white/90 font-medium mb-1.5">{m.t}</p>
                <p className="text-sm text-white/50 font-light leading-relaxed">{m.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
