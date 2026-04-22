"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.05], [0, -50]);

  return (
    <section ref={containerRef} className={clsx("relative w-full", isMobile ? "h-[200vh]" : "h-[400vh]")}>
      {/* Sticky tracking viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Visual Layer */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/city event/long event.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/60 w-full h-full pointer-events-none" />
        </div>

        {/* Main Title Section */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 px-6 text-center pointer-events-none">
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="space-y-6"
          >
            <h1 className="font-[family-name:var(--font-lexend)] text-white text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic">
              Discover Everything <br />
              <span className="text-white/40 not-italic tracking-normal">Happening In</span> <br />
              Your City
            </h1>
            <p className="font-[family-name:var(--font-roboto-mono)] text-[8px] md:text-xs text-white/50 uppercase tracking-[0.5em] font-black">
              Your city's live social radar.
            </p>
          </motion.div>
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

        {/* Bottom Fade-out transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
