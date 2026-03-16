"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain for smooth fade in/out
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0; // start muted
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Dark, low drone setup
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      filter.connect(masterGain);

      // Sub oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 65.41; // C2
      osc1.connect(filter);
      
      // Warmth oscillator
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 65.41 * 1.5; // G2 (Fifth)
      osc2.connect(filter);

      // Low modulation effect (LFO on filter)
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.1; // Very slow sweep
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Start everything
      osc1.start();
      osc2.start();
      lfo.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    }
  };

  const togglePlay = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current!;
    const gain = gainNodeRef.current!;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (isPlaying) {
      // Fade out
      gain.gain.setTargetAtTime(0, ctx.currentTime, 1.5);
    } else {
      // Fade in
      gain.gain.setTargetAtTime(0.15, ctx.currentTime, 2.0); // 15% volume
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

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
      >
        <div className="flex items-end gap-1 h-3">
          <div className={`w-0.5 bg-amber-500/70 transition-all duration-300 ${isPlaying ? 'h-3 animate-[pulse_1s_ease-in-out_infinite]' : 'h-1'}`} />
          <div className={`w-0.5 bg-amber-500/70 transition-all duration-300 ${isPlaying ? 'h-2 animate-[pulse_1.2s_ease-in-out_infinite]' : 'h-1'}`} />
          <div className={`w-0.5 bg-amber-500/70 transition-all duration-300 ${isPlaying ? 'h-3 animate-[pulse_0.8s_ease-in-out_infinite]' : 'h-1'}`} />
        </div>
        
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500/70 group-hover:text-amber-400 transition-colors">
          {isPlaying ? 'Sound [ON]' : 'Sound [OFF]'}
        </span>
      </button>
    </motion.div>
  );
}
