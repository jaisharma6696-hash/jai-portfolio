"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/ambient.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const fadeVolume = (target: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const steps = 30;
    const interval = durationMs / steps;
    const start = audio.volume;
    const delta = (target - start) / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      audio.volume = Math.min(1, Math.max(0, start + delta * step));
      if (step >= steps) clearInterval(timer);
    }, interval);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fadeVolume(0, 1500);
      setTimeout(() => audio.pause(), 1600);
    } else {
      audio.volume = 0;
      await audio.play().catch(() => {});
      fadeVolume(0.55, 2000);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
    >
      <button
        onClick={togglePlay}
        className="flex items-center gap-3 px-4 py-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/5 transition-colors group shadow-2xl"
        aria-label={isPlaying ? "Turn sound off" : "Turn sound on"}
      >
        {/* Equalizer bars */}
        <div className="flex items-end gap-[3px] h-4">
          {[14, 10, 18, 12, 16].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-amber-500/80 transition-all duration-500"
              style={{
                height: isPlaying ? `${h}px` : "3px",
                animation: isPlaying
                  ? `pulse ${0.6 + i * 0.15}s ease-in-out infinite alternate`
                  : "none",
              }}
            />
          ))}
        </div>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500/70 group-hover:text-amber-400 transition-colors">
          {isPlaying ? "Sound [ON]" : "Sound [OFF]"}
        </span>
      </button>
    </motion.div>
  );
}
