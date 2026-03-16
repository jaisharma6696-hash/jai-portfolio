"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";

interface ScrollyCanvasProps {
  frameCount: number;
}

export default function ScrollyCanvas({ frameCount }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Framer Motion scroll hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to frame index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded || images.length === 0 || !canvasRef.current) return;
    
    // Calculate the current frame based on progress (0 to frameCount - 1)
    const currentFrame = Math.min(
      frameCount - 1,
      Math.max(0, Math.floor(latest * frameCount))
    );

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[currentFrame];
    if (!img) return;

    // Render image using object-fit: cover logic
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  });

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Assuming format like `frame_0001.webp`
        const padIndex = i.toString().padStart(4, "0");
        img.src = `/sequence/frame_${padIndex}.webp`;

        img.onload = () => {
          loadedCount++;
          if (loadedCount === frameCount) {
            setImagesLoaded(true);
            
            // Draw first frame once loaded
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                const canvasRatio = canvasRef.current.width / canvasRef.current.height;
                const imgRatio = loadedImages[0].width / loadedImages[0].height;

                let drawWidth = canvasRef.current.width;
                let drawHeight = canvasRef.current.height;
                let offsetX = 0;
                let offsetY = 0;

                if (imgRatio > canvasRatio) {
                  drawWidth = canvasRef.current.height * imgRatio;
                  offsetX = (canvasRef.current.width - drawWidth) / 2;
                } else {
                  drawHeight = canvasRef.current.width / imgRatio;
                  offsetY = (canvasRef.current.height - drawHeight) / 2;
                }
                
                ctx?.drawImage(loadedImages[0], offsetX, offsetY, drawWidth, drawHeight);
            }
          }
        };
        img.onerror = () => {
          // Handle missing images gently for robust degraded performance
          loadedCount++;
          if (loadedCount === frameCount) {
            setImagesLoaded(true);
          }
        }
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    loadImages();
  }, [frameCount]);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-render the current frame (will happen naturally on next scroll or can be triggered here if strictly needed)
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[800vh] w-full bg-slate-950">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20 text-white/50 text-sm tracking-widest uppercase">
            Loading Sequence...
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover z-0"
        />
        <Overlay scrollProgress={scrollYProgress} />
      </div>
    </div>
  );
}
