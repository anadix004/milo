"use client";

import clsx from "clsx";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full h-screen overflow-hidden">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 w-full h-full bg-black">
          {isMobile ? (
            <div 
              className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1540039155732-684735035727?w=800')] bg-cover bg-center opacity-70"
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="https://images.unsplash.com/photo-1540039155732-684735035727?w=1200"
              className="w-full h-full object-cover opacity-70"
            >
              <source src="/city event/long event.mp4" type="video/mp4" />
            </video>
          )}
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/50 w-full h-full pointer-events-none" />
        </div>

        {/* Main Title Section */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 px-6 text-center pointer-events-none">
          <div className="space-y-6">
            <h1 className="font-[family-name:var(--font-lexend)] text-white text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic">
              Discover Everything <br />
              <span className="text-white/40 not-italic tracking-normal">Happening In</span> <br />
              Your City
            </h1>
            <p className="font-[family-name:var(--font-roboto-mono)] text-[8px] md:text-xs text-white/50 uppercase tracking-[0.5em] font-black">
              Your city's live social radar.
            </p>
          </div>
        </div>

        {/* Bottom Annotations UI */}
        <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 mix-blend-difference pointer-events-none">
          <p className="font-[family-name:var(--font-roboto-mono)] text-[8px] md:text-xs text-white/70 tracking-widest uppercase flex flex-col items-center">
            Scroll to explore
            <span className="block w-[1px] bg-white/50 animate-pulse h-8 md:h-12 mt-3"></span>
          </p>
        </div>

        {/* Bottom Fade-out transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
