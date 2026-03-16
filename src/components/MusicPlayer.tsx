"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// A rich cinematic ambient engine built entirely with the Web Audio API.
// Architecture: 
//   - 4 detuned oscillator layers per chord note (sub, warm, air, shimmer)
//   - Convolver-based reverb (impulse response synthesized inline)
//   - Slow LFO on gain for gentle breathing / pulsing
//   - Chord progression that slowly cycles every 8 seconds
//   - Stereo panning spread for width and depth

const CHORDS = [
  [65.41, 82.41, 98.00],   // C2, E2, G2 — C Major (open, majestic)
  [73.42, 87.31, 110.00],  // D2, F2, A2 — D Minor (introspective)
  [55.00, 73.42, 87.31],   // A1, D2, F2 — A Minor (depth, gravity)
  [61.74, 77.78, 98.00],   // B1, Eb2, G2 — B dim-flavored (tension, forward)
];

function buildReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * 4; // 4-second reverb tail
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let c = 0; c < 2; c++) {
    const channel = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

function buildOscLayer(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  detune: number,
  gainVal: number,
  pan: number,
  destination: AudioNode
) {
  const panner = ctx.createStereoPanner();
  panner.pan.value = pan;
  panner.connect(destination);

  const gainNode = ctx.createGain();
  gainNode.gain.value = gainVal;
  gainNode.connect(panner);

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(gainNode);
  osc.start();
  return { osc, gainNode };
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef<{
    ctx: AudioContext;
    masterGain: GainNode;
    layers: { osc: OscillatorNode; gainNode: GainNode }[];
    lfo: OscillatorNode;
    chordIndex: number;
    chordTimer: ReturnType<typeof setInterval> | null;
  } | null>(null);

  const initEngine = () => {
    const CtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new CtxClass();

    // Master gain (start silent)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    // Reverb send
    const reverb = buildReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.6;
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);

    // Dry bus
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.4;
    dryGain.connect(masterGain);

    // Low-pass filter on dry for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    filter.connect(dryGain);

    // Also send filtered to reverb
    filter.connect(reverb);

    const layers: { osc: OscillatorNode; gainNode: GainNode }[] = [];

    const startChord = (freqs: number[]) => {
      freqs.forEach((freq, i) => {
        const pan = (i - 1) * 0.5; // -0.5, 0, 0.5
        // Sub bass sine
        layers.push(buildOscLayer(ctx, freq * 0.5, "sine", 0, 0.25, pan * 0.2, filter));
        // Warm triangle
        layers.push(buildOscLayer(ctx, freq, "triangle", -8, 0.12, pan, filter));
        // Slightly detuned sine for warmth
        layers.push(buildOscLayer(ctx, freq, "sine", 8, 0.10, -pan, filter));
        // High shimmer sine (2 octaves up, very quiet)
        layers.push(buildOscLayer(ctx, freq * 4, "sine", 0, 0.02, pan * 0.8, filter));
      });
    };

    startChord(CHORDS[0]);

    // Breathing LFO on master gain
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.018; // subtle ±1.8% volume swell
    lfo.type = "sine";
    lfo.frequency.value = 0.07; // one breath every ~14s
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();

    engineRef.current = {
      ctx,
      masterGain,
      layers,
      lfo,
      chordIndex: 0,
      chordTimer: null,
    };
  };

  const startChordCycle = () => {
    if (!engineRef.current) return;
    const eng = engineRef.current;

    const cycle = () => {
      eng.chordIndex = (eng.chordIndex + 1) % CHORDS.length;
      const freqs = CHORDS[eng.chordIndex];
      const ctx = eng.ctx;

      // Transition: slowly ramp gain down/up on each layer
      eng.layers.forEach(({ gainNode }) => {
        gainNode.gain.setTargetAtTime(0, ctx.currentTime, 3);
      });

      // Fade in new chord after 3s
      setTimeout(() => {
        if (!engineRef.current) return;
        const newLayers: { osc: OscillatorNode; gainNode: GainNode }[] = [];

        // Build the new chord's output bus inline
        const reverbNode = buildReverb(ctx);
        const reverbGain = ctx.createGain();
        reverbGain.gain.value = 0.6;
        reverbNode.connect(reverbGain);
        reverbGain.connect(engineRef.current.masterGain);

        const dryG = ctx.createGain();
        dryG.gain.value = 0.4;
        dryG.connect(engineRef.current.masterGain);

        const filt = ctx.createBiquadFilter();
        filt.type = "lowpass";
        filt.frequency.value = 800;
        filt.Q.value = 0.5;
        filt.connect(dryG);
        filt.connect(reverbNode);

        freqs.forEach((freq, i) => {
          const pan = (i - 1) * 0.5;
          newLayers.push(buildOscLayer(ctx, freq * 0.5, "sine", 0, 0, pan * 0.2, filt));
          newLayers.push(buildOscLayer(ctx, freq, "triangle", -8, 0, pan, filt));
          newLayers.push(buildOscLayer(ctx, freq, "sine", 8, 0, -pan, filt));
          newLayers.push(buildOscLayer(ctx, freq * 4, "sine", 0, 0, pan * 0.8, filt));
        });

        // Ramp new layers in
        newLayers.forEach(({ gainNode }, idx) => {
          const targetGain = idx % 4 === 0 ? 0.25 : idx % 4 === 1 ? 0.12 : idx % 4 === 2 ? 0.10 : 0.02;
          gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 4);
        });

        // Stop old layers
        eng.layers.forEach(({ osc }) => {
          try { osc.stop(ctx.currentTime + 12); } catch { /* ignore */ }
        });

        eng.layers.length = 0;
        eng.layers.push(...newLayers);
      }, 3000);
    };

    eng.chordTimer = setInterval(cycle, 12000); // change chord every 12s
  };

  const togglePlay = () => {
    if (!engineRef.current) {
      initEngine();
    }

    const eng = engineRef.current!;
    const ctx = eng.ctx;

    if (ctx.state === "suspended") ctx.resume();

    if (isPlaying) {
      eng.masterGain.gain.setTargetAtTime(0, ctx.currentTime, 2);
      if (eng.chordTimer) clearInterval(eng.chordTimer);
      eng.chordTimer = null;
    } else {
      eng.masterGain.gain.setTargetAtTime(0.22, ctx.currentTime, 2.5);
      startChordCycle();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        if (engineRef.current.chordTimer) clearInterval(engineRef.current.chordTimer);
        engineRef.current.ctx.close().catch(() => {});
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
        aria-label={isPlaying ? "Turn sound off" : "Turn sound on"}
      >
        {/* Animated equalizer bars */}
        <div className="flex items-end gap-[3px] h-4">
          {[1, 1.4, 0.8, 1.2, 0.9].map((scale, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-full bg-amber-500/80 transition-all duration-300 ${
                isPlaying
                  ? `animate-[pulse_${(0.7 + i * 0.2).toFixed(1)}s_ease-in-out_infinite]`
                  : "h-[3px]"
              }`}
              style={isPlaying ? { height: `${Math.round(scale * 10)}px` } : {}}
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
