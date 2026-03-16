"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";

interface ScrollyCanvasProps {
  frameCount: number;
}

// How many frames to preload before showing the sequence
const INITIAL_BATCH = 15;

export default function ScrollyCanvas({ frameCount }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // True once the first INITIAL_BATCH frames are ready
  const [initialReady, setInitialReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Draw a single frame onto the canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIdx];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth = canvas.width, drawHeight = canvas.height, offsetX = 0, offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Update frame based on scroll — requestAnimationFrame throttled
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!initialReady) return;
    const targetFrame = Math.min(frameCount - 1, Math.max(0, Math.floor(latest * frameCount)));
    if (targetFrame === currentFrameRef.current) return;
    currentFrameRef.current = targetFrame;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
  });

  // Load images — initial batch first, then the rest
  useEffect(() => {
    const images = imagesRef.current;
    let initialLoadedCount = 0;

    const loadImage = (i: number) => {
      const img = new Image();
      const padIndex = (i + 1).toString().padStart(4, "0");
      img.src = `/sequence/frame_${padIndex}.webp`;

      img.onload = () => {
        images[i] = img;

        // Draw frame 0 as soon as it arrives
        if (i === 0) {
          requestAnimationFrame(() => drawFrame(0));
        }

        if (i < INITIAL_BATCH) {
          initialLoadedCount++;
          if (initialLoadedCount >= INITIAL_BATCH) {
            setInitialReady(true);
          }
        }
      };

      img.onerror = () => {
        // Graceful: treat as loaded so we don't block forever
        if (i < INITIAL_BATCH) {
          initialLoadedCount++;
          if (initialLoadedCount >= INITIAL_BATCH) {
            setInitialReady(true);
          }
        }
      };
    };

    // Load initial batch first (frames 0–INITIAL_BATCH)
    for (let i = 0; i < Math.min(INITIAL_BATCH, frameCount); i++) {
      loadImage(i);
    }

    // Load remaining frames after a short delay so initial batch gets priority bandwidth
    const remainingTimer = setTimeout(() => {
      for (let i = INITIAL_BATCH; i < frameCount; i++) {
        loadImage(i);
      }
    }, 800);

    return () => clearTimeout(remainingTimer);
  }, [frameCount, drawFrame]);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawFrame(currentFrameRef.current);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  return (
    <div ref={containerRef} className="relative h-[800vh] w-full bg-slate-950">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {!initialReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4">
            {/* Cinematic loading indicator */}
            <div className="flex items-end gap-1 h-5">
              {[1,1.4,0.8,1.2,0.9,1.1,0.7].map((s, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-white/30 rounded-full animate-pulse"
                  style={{
                    height: `${Math.round(s * 14)}px`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: "1s"
                  }}
                />
              ))}
            </div>
            <span className="text-white/25 text-xs font-mono tracking-[0.4em] uppercase">
              Initialising
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover z-0 transition-opacity duration-700 ${initialReady ? "opacity-100" : "opacity-0"}`}
        />
        <Overlay scrollProgress={scrollYProgress} />
      </div>
    </div>
  );
}
