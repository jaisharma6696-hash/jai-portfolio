"use client";

import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import DetailSheet from "@/components/fx/DetailSheet";
import SnapCarousel from "@/components/fx/SnapCarousel";
import Tour, { TourScene } from "@/components/fx/Tour";
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

type Build = typeof BUILDS[number];

const TOUR_STEPS = BUILDS.map(b => ({ kicker: `Project ${b.code} · ${b.kind} · ${b.status}`, title: `${b.name}.`, body: b.problem }));
async function mountLabTour(cv: HTMLCanvasElement, lb: HTMLElement): Promise<TourScene | null> {
  const { mountBuildLab } = await import("@/lib/buildLabScene");
  const s = mountBuildLab(cv, lb, BUILDS.map(b => `${b.code} · ${b.name}`));
  return s && { go: i => s.setProgress(i + 1), setActive: s.setActive, resize: s.resize, dispose: s.dispose };
}

function Teaser({ b, on, onOpen }: { b: Build; on: boolean; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className={`group w-full text-left rounded-3xl p-6 md:p-7 transition-all duration-500 border ${on ? "border-orange-400/40 bg-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,.35)]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"}`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-[11px] font-mono text-orange-400 uppercase tracking-[0.22em]">Project {b.code} · {b.kind}</p>
        <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/10 text-[9px] font-mono uppercase tracking-wider text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{b.status}
        </span>
      </div>
      <h3 className="text-4xl md:text-5xl font-display italic text-white leading-none mb-3">{b.name}.</h3>
      <p className="text-white/65 font-light leading-relaxed mb-5 line-clamp-2">{b.problem}</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {b.facts.slice(0, 2).map(f => <span key={f} className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[11px] text-white/70">{f}</span>)}
        </div>
        <span className="shrink-0 w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg transition-transform duration-300 group-hover:rotate-45">↗</span>
      </div>
    </button>
  );
}

function Detail({ b }: { b: Build }) {
  return (
    <div>
      <p className="text-[11px] font-mono text-orange-400 uppercase tracking-[0.25em] mb-3 pr-10">Project {b.code} — {b.kind} · {b.status}</p>
      <h3 className="text-5xl md:text-6xl font-display italic text-white leading-none mb-5">{b.name}.</h3>
      <p className="text-xl text-white/85 font-light leading-relaxed mb-8">{b.problem}</p>
      <p className="text-[11px] font-mono text-white/40 uppercase tracking-[0.25em] mb-3">What it does</p>
      <ul className="space-y-3 mb-8">
        {b.does.map(d => <li key={d} className="flex gap-3 text-white/70 font-light leading-relaxed"><span className="text-orange-400 mt-[3px] text-xs">✦</span>{d}</li>)}
      </ul>
      <div className="rounded-2xl border border-orange-400/20 bg-orange-500/[0.06] p-5 mb-8">
        <p className="text-[11px] font-mono text-orange-300 uppercase tracking-[0.25em] mb-2">The AI inside</p>
        <p className="text-white/80 font-light leading-relaxed">{b.ai}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {b.facts.map(f => <div key={f} className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white/80">{f}</div>)}
      </div>
    </div>
  );
}

export default function BuildLab() {
  const secRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const sceneRef = useRef<BuildLabHandle | null>(null);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [tour, setTour] = useState(false);

  const focus = useCallback((k: number) => { sceneRef.current?.setProgress(k); setStep(prev => (prev === k ? prev : k)); }, []);

  useEffect(() => {
    const cv = canvasRef.current, lb = labelsRef.current, sec = secRef.current;
    if (!cv || !lb || !sec) return;
    let disposed = false, io: IntersectionObserver | null = null;

    // desktop: the card nearest the reading line drives the map (0 = overview)
    const onScroll = () => {
      if (window.innerWidth < 1024) return;
      const vh = window.innerHeight, line = vh * 0.5;
      let k = 0, best = Infinity;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - line);
        if (r.top < line + vh * 0.25 && d < best) { best = d; k = i + 1; }
      });
      const last = cardRefs.current[N - 1]?.getBoundingClientRect();
      if (last && last.bottom < vh * 0.3) k = N + 1;
      focus(k);
    };

    import("@/lib/buildLabScene").then(({ mountBuildLab }) => {
      if (disposed) return;
      const s = mountBuildLab(cv, lb, BUILDS.map(b => `${b.code} · ${b.name}`), i => setOpen(i));
      if (!s) return;
      sceneRef.current = s;
      io = new IntersectionObserver(([e]) => {
        s.setActive(e.isIntersecting);
        if (e.isIntersecting && window.innerWidth < 1024) setStep(p => { const k = p || 1; s.setProgress(k); return k; });
      }, { rootMargin: "120px" });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onSwipe = useCallback((i: number) => focus(i + 1), [focus]);

  return (
    <section id="builds" ref={secRef} className="relative bg-[#0b1035] pt-24 lg:pt-28 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(59,76,190,.35),transparent_55%)] pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-6 lg:mb-0">
          <p className="text-xs font-mono text-orange-400 uppercase tracking-[0.35em] mb-5">Build Lab · AI Products</p>
          <SplitReveal
            parts={["Things I've built\n", { text: "with AI.", className: "font-display italic text-orange-400" }]}
            className="text-5xl md:text-7xl font-semibold text-white tracking-tight leading-[0.98] mb-5"
          />
          <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-xl">
            Eight products, designed, specified and shipped with AI as my build team. Tap any building to explore. Codenamed — clients withheld.
          </p>
          <button onClick={() => setTour(true)} className="mt-7 group inline-flex items-center gap-3 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors pl-6 pr-2 py-2 text-sm font-medium text-white">
            Take the 3D tour <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110">▶</span>
          </button>
        </div>

        <div className="relative lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Map */}
          <div
            className="relative lg:sticky lg:top-0 lg:order-2 lg:col-span-7 h-[92vw] max-h-[62svh] lg:max-h-none lg:h-screen -mx-6 md:-mx-12 lg:mx-0 overflow-hidden lg:[mask-image:linear-gradient(to_right,transparent,black_12%)]"
            onMouseMove={onMove} onMouseLeave={() => sceneRef.current?.setPointer(0, 0)}
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-label="Isometric island of the eight AI products" />
            <div ref={labelsRef} className="absolute inset-0 pointer-events-none" />
          </div>

          {/* Desktop teaser cards */}
          <div className="hidden lg:block relative z-10 lg:order-1 lg:col-span-5 pt-[30vh] pb-[40vh]">
            {BUILDS.map((b, i) => (
              <div key={b.code} ref={el => { cardRefs.current[i] = el; }} className="mb-[26vh]">
                <Teaser b={b} on={step === i + 1} onOpen={() => setOpen(i)} />
              </div>
            ))}
          </div>
        </div>

        {/* Phone: swipe through products, the map follows */}
        <div className="lg:hidden -mt-4 relative z-10">
          <SnapCarousel
            active={Math.max(0, step - 1)}
            onActive={onSwipe}
            items={BUILDS.map((b, i) => <Teaser key={b.code} b={b} on={step === i + 1} onOpen={() => setOpen(i)} />)}
          />
          <div className="flex justify-center gap-1.5 mt-4">
            {BUILDS.map((b, i) => <span key={b.code} className={`h-1.5 rounded-full transition-all duration-500 ${step === i + 1 ? "w-6 bg-orange-500" : "w-1.5 bg-white/25"}`} />)}
          </div>
        </div>

        {/* More from the lab */}
        <div className="pt-20 lg:pt-0 pb-24">
          <p className="text-[11px] font-mono text-white/40 uppercase tracking-[0.3em] mb-6">More from the lab</p>
          <div className="lg:hidden">
            <SnapCarousel items={MORE.map(m => <MoreCard key={m.t} m={m} />)} />
          </div>
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {MORE.map((m, i) => (
              <motion.div key={m.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 4) * 0.07, duration: 0.7, ease: EASE }}>
                <MoreCard m={m} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Tour open={tour} onClose={() => setTour(false)} heading="Inside the Build Lab" steps={TOUR_STEPS} mount={mountLabTour} />
      <DetailSheet open={open !== null} onClose={() => setOpen(null)} label={open !== null ? BUILDS[open].name : ""}>
        {open !== null && <Detail b={BUILDS[open]} />}
      </DetailSheet>
    </section>
  );
}

function MoreCard({ m }: { m: { t: string; d: string } }) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-orange-400/30 hover:bg-white/[0.05] transition-colors">
      <p className="text-white font-medium mb-1.5">{m.t}</p>
      <p className="text-sm text-white/55 font-light leading-relaxed">{m.d}</p>
    </div>
  );
}
