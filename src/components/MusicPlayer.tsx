"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Reliable cinematic ambient drone using Web Audio API.
// Architecture: Sub + warm triangle oscillators → lowpass filter → reverb → master gain
// LFO gently modulates gain for a "breathing" effect.

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const startedRef = useRef(false);

  const buildReverb = (ctx: AudioContext) => {
    const conv = ctx.createConvolver();
    const sr = ctx.sampleRate;
    const len = sr * 3;
    const buf = ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      }
    }
    conv.buffer = buf;
    return conv;
  };

  const startEngine = (ctx: AudioContext, master: GainNode) => {
    if (startedRef.current) return;
    startedRef.current = true;

    const reverb = buildReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.55;
    reverb.connect(reverbGain);
    reverbGain.connect(master);

    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.45;
    dryGain.connect(master);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.4;
    filter.connect(dryGain);
    filter.connect(reverb);

    // C2 sub bass
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 65.41;
    const subG = ctx.createGain();
    subG.gain.value = 0.45;
    sub.connect(subG);
    subG.connect(filter);
    sub.start();

    // G2 fifth - warmth
    const fifth = ctx.createOscillator();
    fifth.type = "triangle";
    fifth.frequency.value = 98.0;
    fifth.detune.value = -6;
    const fifthG = ctx.createGain();
    fifthG.gain.value = 0.22;
    fifth.connect(fifthG);
    fifthG.connect(filter);
    fifth.start();

    // E2 - colour
    const third = ctx.createOscillator();
    third.type = "sine";
    third.frequency.value = 82.41;
    third.detune.value = 4;
    const thirdG = ctx.createGain();
    thirdG.gain.value = 0.15;
    third.connect(thirdG);
    thirdG.connect(filter);
    third.start();

    // LFO breathing
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.015;
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
  };

  const togglePlay = async () => {
    // Create AudioContext on first user interaction (required by browser)
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      masterRef.current = master;

      // Start oscillators immediately after context creation
      startEngine(ctx, master);
    }

    const ctx = ctxRef.current;
    const master = masterRef.current!;

    // Resume if browser suspended it
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    if (isPlaying) {
      // Fade out over 2s
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    } else {
      // Fade in over 3s
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3);
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
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
                animation: isPlaying ? `pulse ${0.6 + i * 0.15}s ease-in-out infinite alternate` : "none",
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
