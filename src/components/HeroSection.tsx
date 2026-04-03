"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { HERO_FRAMES } from "@/constants/frames";

const FRAME_COUNT = HERO_FRAMES.length;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track images
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Scroll tracking across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform 0-1 into an integer index between 0 and FRAME_COUNT - 1
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    // Preload images
    const loadImages = async () => {
      const loadPromises = [];
      imagesRef.current = []; // Reset just in case

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const fileName = HERO_FRAMES[i];
        
        loadPromises.push(new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false); 
          img.src = `/sequence/frames/${fileName}`;
        }));
        imagesRef.current.push(img);
      }
      
      await Promise.all(loadPromises);
      setImagesLoaded(true);
      
      // Draw initial frame if available
      drawFrame(0);
    };
    
    loadImages();

    // Auto-resize handler
    const handleResize = () => {
      if (canvasRef.current && imagesRef.current.length > 0) {
        drawFrame(frameIndex.get());
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    
    // Ensure canvas internal resolution matches exactly its CSS layout dimensions
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Safety checks
    const frameNumber = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(index)));
    const img = imagesRef.current[frameNumber];
    
    // Check if image object exists AND is fully loaded (naturalWidth > 0)
    if (!img || img.naturalWidth === 0) return;

    // Draw image maintaining object-cover equivalent proportions
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    
    // Apply a 12% zoom scale to naturally crop out the "vevo" watermark burned into the source frames
    const ZOOM_FACTOR = 1.12;
    const ratio = Math.max(hRatio, vRatio) * ZOOM_FACTOR;
    
    // Center it relative to the new zoom scale
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0, 0, img.naturalWidth, img.naturalHeight,
      centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
    );
  };

  // Intercept the motion value and dispatch rendering loop
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (imagesLoaded) {
      // Use requestAnimationFrame mapping for optimized draw
      requestAnimationFrame(() => drawFrame(latest));
    }
  });

  return (
    <section ref={containerRef} className="relative w-full h-[400vh]">
      {/* Sticky tracking viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Canvas Sequence */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />
          {/* Subtle dark overlay to match Lusion contrast for white text */}
          <div className="absolute inset-0 bg-black/40 w-full h-full pointer-events-none" />
        </div>

        {/* Navigation & Status UI moved to global Header */}

        {/* Bottom Annotations UI */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 mix-blend-difference pointer-events-none">
          <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] md:text-xs text-white/70 tracking-widest uppercase writing-vertical-rl flex flex-col items-center">
            Scroll to explore
            <span className="block w-[1px] h-12 bg-white/50 mt-4 animate-pulse"></span>
          </p>
        </div>

        {/* Loading Indicator */}
        {!imagesLoaded && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30 bg-black">
            <p className="text-white/50 animate-pulse font-[family-name:var(--font-roboto-mono)] uppercase tracking-widest text-sm">
              Loading High-Res Simulation...
            </p>
          </div>
        )}

        {/* The MILO Wall Typography */}
        <div className="absolute inset-0 w-full h-full flex flex-col justify-end items-start pointer-events-none z-30 overflow-hidden px-1 md:px-2 mb-12 md:mb-20">
          <motion.div
            initial={{ y: "20%", filter: "blur(20px)", opacity: 0 }}
            animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.19, 1, 0.22, 1],
              delay: 0.5 
            }}
            className="flex flex-col items-start mix-blend-normal"
          >
            <h1
              className={clsx(
                "font-[family-name:var(--font-lexend)]",
                "text-[28vw] md:text-[24vw]",
                "font-extrabold text-white lowercase text-left",
                "leading-[0.7] tracking-[-0.05em] m-0 p-0"
              )}
              style={{ WebkitFontSmoothing: "antialiased" }}
            >
              milo
            </h1>
            <p className="font-[family-name:var(--font-lexend)] text-white/90 text-[10px] md:text-sm uppercase tracking-[0.4em] ml-1 mt-2 md:mt-4 opacity-80">
              your local city event radar
            </p>
          </motion.div>
        </div>

        {/* Bottom Fade-out transition for blending into next section during scroll */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
