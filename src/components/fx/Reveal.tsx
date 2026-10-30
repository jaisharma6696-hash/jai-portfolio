"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { EASE } from "@/lib/motion";

type Part = string | { text: string; className?: string };

// Masked word-by-word rise. Parts let a heading mix plain words with serif/italic spans.
export function SplitReveal({
  parts, className = "", delay = 0, as = "h2", once = true,
}: { parts: Part[]; className?: string; delay?: number; as?: "h1" | "h2" | "h3" | "p"; once?: boolean }) {
  const words: { w: string; cls?: string; br?: boolean }[] = [];
  parts.forEach(p => {
    const text = typeof p === "string" ? p : p.text, cls = typeof p === "string" ? undefined : p.className;
    text.split(/(\n)/).forEach(chunk => {
      if (chunk === "\n") { words.push({ w: "", br: true }); return; }
      chunk.split(" ").filter(Boolean).forEach(w => words.push({ w, cls }));
    });
  });
  const Tag = motion[as];
  let k = 0;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
      aria-label={words.map(x => x.w).join(" ").replace(/\s+/g, " ").trim()}
    >
      {words.map((x, i) =>
        x.br ? <br key={i} /> : (
          <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={`inline-block ${x.cls ?? ""}`}
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE } } }}
              custom={k++}
            >
              {x.w}&nbsp;
            </motion.span>
          </span>
        )
      )}
    </Tag>
  );
}

// Fade-up for blocks, sharing the site easing.
export function Rise({ children, className = "", delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function LitWord({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const a = i / n, b = Math.min(1, a + 1.5 / n);
  const opacity = useTransform(progress, [a, b], [0.14, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

// Words light up one by one as the paragraph scrolls through the viewport.
export function ScrollLit({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <LitWord key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />)}
    </p>
  );
}
