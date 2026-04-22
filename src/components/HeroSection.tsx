"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { HERO_FRAMES } from "@/constants/frames";
import { useIsMobile } from "@/hooks/useMediaQuery";

const FRAME_COUNT = HERO_FRAMES.length;

export default function HeroSection() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
    if (isMobile) {
      setImagesLoaded(true); // Treat as loaded since we use video
      return;
    }

    // Preload images - Desktop Only
    const loadImages = async () => {
      const loadPromises = [];
      imagesRef.current = [];

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const fileName = HERO_FRAMES[i];
        
        loadPromises.push(new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false); 
          img.src = `/sequence/frames:2/${fileName}`;
        }));
        imagesRef.current.push(img);
      }
      
      await Promise.all(loadPromises);
      setImagesLoaded(true);
      drawFrame(0);
    };
    
    loadImages();

    const handleResize = () => {
      if (!isMobile && canvasRef.current && imagesRef.current.length > 0) {
        drawFrame(frameIndex.get());
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const drawFrame = (index: number) => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const frameNumber = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(index)));
    const img = imagesRef.current[frameNumber];
    if (!img || img.naturalWidth === 0) return;

    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ZOOM_FACTOR = 1.05;
    const ratio = Math.max(hRatio, vRatio) * ZOOM_FACTOR;
    
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) * 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0, 0, img.naturalWidth, img.naturalHeight,
      centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
    );
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isMobile && imagesLoaded) {
      requestAnimationFrame(() => drawFrame(latest));
    }
  });

  return (
    <section ref={containerRef} className={clsx("relative w-full", isMobile ? "h-[200vh]" : "h-[400vh]")}>
      {/* Sticky tracking viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Visual Layer */}
        <div className="absolute inset-0 w-full h-full bg-black">
          {isMobile ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
            />
          )}
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/40 w-full h-full pointer-events-none" />
        </div>

        {/* Bottom Annotations UI */}
        <div className={clsx(
          "absolute z-30 mix-blend-difference pointer-events-none",
          isMobile 
            ? "bottom-24 left-1/2 -translate-x-1/2" 
            : "bottom-6 right-6 md:bottom-8 md:right-8"
        )}>
          <p className={clsx(
            "font-[family-name:var(--font-roboto-mono)] text-[8px] md:text-xs text-white/70 tracking-widest uppercase flex flex-col items-center",
            !isMobile && "writing-vertical-rl"
          )}>
            {isMobile ? "Scroll for events" : "Scroll to explore"}
            <span className={clsx("block w-[1px] bg-white/50 animate-pulse", isMobile ? "h-6 mt-3" : "h-12 mt-4")}></span>
          </p>
        </div>

        {/* Loading Indicator */}
        {!imagesLoaded && !isMobile && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30 bg-black">
            <p className="text-white/50 animate-pulse font-[family-name:var(--font-roboto-mono)] uppercase tracking-widest text-sm">
              Loading Experience...
            </p>
          </div>
        )}


        {/* Bottom Fade-out transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
