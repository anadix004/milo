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
    const ZOOM_FACTOR = 1.12;
    const ratio = Math.max(hRatio, vRatio) * ZOOM_FACTOR;
    
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;

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

        {/* The MILO Wall Typography */}
        <div className={clsx(
          "absolute inset-0 w-full h-full flex flex-col items-start pointer-events-none z-40 overflow-hidden px-1 md:px-2",
          isMobile ? "justify-center px-6" : "justify-end mb-12 md:mb-20"
        )}>
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
                "text-[32vw] md:text-[24vw]",
                "font-extrabold text-white lowercase text-left",
                "leading-[0.7] tracking-[-0.05em] m-0 p-0",
                "drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] [text-shadow:_0_0_60px_rgba(255,255,255,0.3)]" 
              )}
              style={{ WebkitFontSmoothing: "antialiased" }}
            >
              milo
            </h1>
            <p className="font-[family-name:var(--font-lexend)] text-white/90 text-[10px] md:text-sm uppercase tracking-[0.4em] ml-1 mt-2 md:mt-4 opacity-80 drop-shadow-lg">
              your local city event radar
            </p>
          </motion.div>
        </div>

        {/* Bottom Fade-out transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
