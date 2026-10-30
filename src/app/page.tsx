"use client";

import ScrollyCanvas from "@/components/ScrollyCanvas";
import BuildLab from "@/components/BuildLab";
import Ventures from "@/components/Ventures";
import HowIWork from "@/components/HowIWork";
import Projects from "@/components/Projects";
import PsychologicalStack from "@/components/PsychologicalStack";
import ExperienceSnapshot from "@/components/ExperienceSnapshot";
import CTASection from "@/components/CTASection";
import ParticleBackground from "@/components/ParticleBackground";
import MusicPlayer from "@/components/MusicPlayer";
import Navigation from "@/components/Navigation";
import Thinking from "@/components/Thinking";
import Education from "@/components/Education";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import { MouseEvent } from "react";

export default function Home() {
  const handleMouseMove = (e: MouseEvent) => {
    // Only apply on desktop (rough heuristic)
    if (window.innerWidth > 768) {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty('--x', `${x}px`);
      document.documentElement.style.setProperty('--y', `${y}px`);
    }
  };

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative bg-slate-950 min-h-screen text-slate-50 selection:bg-white/20 overflow-x-clip"
    >
      <SmoothScroll />
      <Loader />
      <div aria-hidden className="grain" />

      {/* Global Cinematic Cursor Spotlight */}
      <div className="cursor-spotlight hidden md:block" />

      {/* Ambient Experience */}
      <Navigation />
      <ParticleBackground />
      <MusicPlayer />

      {/* 1. Scrollytelling Hero Area */}
      <div className="relative z-10">
        <ScrollyCanvas frameCount={89} />
      </div>

      <div className="relative z-10">
        {/* 2. Ventures island */}
        <Ventures />


        {/* 3. Build Lab / Codenamed builds map */}
        <BuildLab />

        {/* How I work with AI */}
        <HowIWork />

        {/* 3. Capabilities / What Jai Builds */}
        <Projects />

        {/* 4. Philosophy / Thinking */}
        <Thinking />

        {/* 5. Psychological Architecture */}
        <PsychologicalStack />

        {/* 6. Identity Stats & Domains */}
        <ExperienceSnapshot />

        {/* 7. Education & Foundations */}
        <Education />

        {/* 8. Closing */}
        <CTASection />
      </div>

    </main>
  );
}
