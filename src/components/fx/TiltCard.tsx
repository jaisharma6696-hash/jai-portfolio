"use client";

import { ReactNode, PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

// Card that leans toward the cursor and carries a soft amber glow under it.
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const px = useMotionValue(0.5), py = useMotionValue(0.5), hover = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 18 }), sy = useSpring(py, { stiffness: 180, damping: 18 });
  const sh = useSpring(hover, { stiffness: 200, damping: 25 });
  const rotateY = useTransform([sx, sh], ([x, h]: number[]) => (x - 0.5) * 10 * h);
  const rotateX = useTransform([sy, sh], ([y, h]: number[]) => (0.5 - y) * 10 * h);
  const gx = useTransform(sx, v => `${v * 100}%`), gy = useTransform(sy, v => `${v * 100}%`);
  const glowOpacity = useTransform(sh, [0, 1], [0, 1]);
  const glow = useMotionTemplate`radial-gradient(380px circle at ${gx} ${gy}, rgba(245,158,11,0.13), transparent 60%)`;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height); hover.set(1);
  };
  const leave = () => { hover.set(0); px.set(0.5); py.set(0.5); };

  return (
    <motion.div style={{ perspective: 900 }} className="h-full">
      <motion.div
        onPointerMove={move}
        onPointerLeave={leave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative h-full ${className}`}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glow, opacity: glowOpacity }} />
        {children}
      </motion.div>
    </motion.div>
  );
}
