"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { EASE } from "@/lib/motion";

// "Learn more" panel: a bottom sheet on phones (drag down to close), a centred card on desktop.
export default function DetailSheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => { window.__lenis?.start(); document.documentElement.style.overflow = prev; window.removeEventListener("keydown", key); };
  }, [open, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => { if (info.offset.y > 120 || info.velocity.y > 600) onClose(); };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end lg:items-center justify-center" role="dialog" aria-modal="true" aria-label={label}>
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md cursor-default"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            className="relative w-full lg:max-w-2xl max-h-[88svh] lg:max-h-[84vh] flex flex-col rounded-t-[32px] lg:rounded-[32px] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_-30px_80px_rgba(0,0,0,.6)] overflow-hidden"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            <div className="flex justify-center pt-3 pb-1 lg:hidden cursor-grab active:cursor-grabbing">
              <span className="w-10 h-1.5 rounded-full bg-white/20" />
            </div>
            <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
              ✕
            </button>
            <div className="overflow-y-auto overscroll-contain px-6 md:px-10 pt-4 lg:pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]" onPointerDownCapture={e => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
