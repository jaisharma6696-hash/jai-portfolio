# Cinematic Scrollytelling Portfolio — Project Architecture & Tech Stack

This document serves as a comprehensive context file for any AI assistant to understand the current state, architecture, and technical implementation of the "Cinematic Scrollytelling Portfolio" built for Jai Vardhan Sharma.

## 1. Project Overview & Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (`.tsx`)
- **Styling**: Tailwind CSS + custom CSS (`globals.css`)
- **Animations & Layout**: Framer Motion (`framer-motion`)
- **3D / WebGL**: React Three Fiber (`@react-three/fiber`, `@react-three/drei`, `three`) with `maath` for random mathematical generation.
- **Audio**: Native HTML5 `<audio>` API (with fallback capabilities) + Web Audio API.

## 2. Core Features & UX Paradigm
The website is designed not as a standard resume, but as an immersive, cinematic, Apple-style "scrollytelling" experience. It uses deep blacks (`bg-slate-950`), stark whites, large typography, and heavy reliance on scroll-triggered animations.

Key UX features:
- **Interactive Scrollytelling Hero**: An 89-frame image sequence (`/public/sequence/frame_0001.webp` to `0089.webp`) that scrubs forward and backward based on the user's scroll position, creating a video-like scroll effect.
- **Ambient Canvas Background**: A 3D starfield/particle background rendered behind the content using WebGL (React Three Fiber).
- **Cinematic Audio**: A floating UI toggle button that manages an ambient music loop (`/public/ambient.mp3`), functioning with a visual equalizer bar animation.
- **Scroll-Linked Reveals**: All text and cards fade in and slide up as they enter the viewport using Framer Motion's `whileInView` and `viewport={{ once: true }}` properties.
- **Sticky Layouts**: Sidebars (like the titles in the Journey section) stay fixed while the right-side content scrolls past.

## 3. Directory Structure
```text
/src
  /app
    layout.tsx         # Root layout (Metadata, Google Fonts, global constraints)
    page.tsx           # Main landing page (stitches all components together)
    globals.css        # Tailwind directives + custom utility classes
  /components
    Navigation.tsx     # Fixed top header (Logo: "JVS.", Nav links)
    ParticleBackground.tsx # 3D rotating starfield (R3F)
    MusicPlayer.tsx    # Floating audio toggle in bottom right
    ScrollyCanvas.tsx  # Handles the 89-frame image sequence rendering on a <canvas>
    Overlay.tsx        # Text overlays that fade in over specific scroll milestones in the Hero
    Journey.tsx        # Scroll-based timeline of ventures (Beantree, Bodega, etc.)
    Projects.tsx       # "How I Operate" / Capabilities grid (4 cards)
    PsychologicalStack.tsx # Personality/psychological profiling section (MBTI, Hogan)
    ExperienceSnapshot.tsx # Identity stats and industry tags
    CTASection.tsx     # Final footer with call-to-action and logo grids showing companies/education
```

## 4. Component Breakdown & Data Structures

**A. `ScrollyCanvas.tsx` & `Overlay.tsx`**
- Uses Framer Motion's `useScroll` and `useMotionValueEvent`.
- Calculates `currentFrame` based on scroll percentage and draws the corresponding pre-loaded `.webp` image to a `<canvas>` using `ctx.drawImage` (with object-fit cover logic).
- `Overlay.tsx` reads the same scroll progress and uses Framer Motion `opacity` mappings to fade different h1/h2 text blocks in and out over the image sequence.

**B. `Journey.tsx`**
- Contains a hardcoded `STORIES` array of objects (each has `id`, `title`, `subtitle` or `role`, `industry`, `content` array, and `skills` array).
- Maps over `STORIES` to render `<StoryCard>` components.
- Uses a sticky left column for the title/metadata, and a scrolling right column for the narrative content.
- Features an "expandable" UI (`isOpen` state) where clicking "Discover the Full Story +" uses `motion.div` to smoothly animate `height: "auto"` and reveal the rest of the text and skills tags.
- Attempts to load images from `/public/logos/[id].png` and fails gracefully (`display='none'`) if the logo isn't present.

**C. `Projects.tsx` (Capabilities)**
- A 2x2 grid displaying 4 core capabilities ("Operating Models", "Transformation", etc.).
- Cards feature subtle hover states (`hover:bg-white/[0.05]`) and glassmorphism styling (`backdrop-blur-2xl`, `bg-white/[0.03]`).

**D. `PsychologicalStack.tsx`**
- Renders an SVG background graphic (concentric dashed circles).
- Maps over a `STACK_LAYERS` array to display the 5 layers of the operator's psychological profile (MBTI, Big Five, Hogan, etc.) in a list format.

**E. `ExperienceSnapshot.tsx` & `CTASection.tsx`**
- Snapshot displays high-level stats ("Asset Classes", "Ventures Built") and maps over an `INDUSTRIES` array for pill tags.
- CTA Section contains the final "Initiate Contact" / "LinkedIn Profile" buttons.
- Contains the footer grid displaying "Ventures" (left column) and "Education" (right column), featuring grayscale logos (`mix-blend-screen`, `opacity-50` fading to `100` on hover).

## 5. Recent History Note
The portfolio recently underwent an experimental UI phase (changing titles, adding a "Thinking" section, removing the footer, adding magnetic hover effects), but **it was rolled back** to this current "Cinematic Portfolio" state per the user's preference. The current codebase reflects the distinct structured components: Journey, Capabilities, Psychological Stack, Identity Stats, and CTA/Footer Grid.
