"use client";

import clsx from "clsx";

interface FinalCTAProps {
  selectedCity: string | null;
}

const CITY_DATA: Record<string, { name: string; qr: string; color: string; brightness: string }> = {
  del: { name: "DELHI - NCR", qr: "/QR/Delhi_QR.png", color: "#a855f7", brightness: "shadow-purple-500/50" },
  blr: { name: "BENGALURU", qr: "/QR/Bengaluru_QR.png", color: "#22c55e", brightness: "shadow-green-500/50" },
  mum: { name: "MUMBAI", qr: "/QR/Mumbai_QR.png", color: "#06b6d4", brightness: "shadow-cyan-500/50" },
};

import { useIsMobile } from "@/hooks/useMediaQuery";

export default function FinalCTA({ selectedCity }: FinalCTAProps) {
  const isMobile = useIsMobile();
  const city = (selectedCity && CITY_DATA[selectedCity]) ? CITY_DATA[selectedCity] : CITY_DATA.del;

  return (
    <section className="relative w-full min-h-[80vh] bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* SVG Liquid Ribbon Container */}
      <div className="absolute inset-x-0 top-0 w-full h-full pointer-events-none z-10">
        <svg 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="none" 
          className="w-full h-full"
          style={{ filter: isMobile ? "none" : "url(#gooey)" }}
        >
          {!isMobile && (
            <defs>
              <filter id="gooey">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
              </filter>
            </defs>
          )}
          <path
            d="M0,0 Q960,1200 1920,0 L1920,1080 Q960,1150 0,1080 Z"
            fill={city.color}
            fillOpacity={0.8}
            className="backdrop-blur-2xl"
            style={{ 
              filter: isMobile ? "none" : `drop-shadow(0 0 20px ${city.color}44)` 
            }}
          />
        </svg>
      </div>

      {/* Hub Content */}
      <div className="relative z-20 flex flex-col items-center gap-12 px-6">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-lexend)] text-white/40 text-[10px] md:text-xs uppercase tracking-[0.6em] mb-4 font-bold">
            Simulate Your Connection
          </h2>
          <h3 className="font-[family-name:var(--font-lexend)] text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-tight shadow-xl">
            {city.name} <span className="opacity-20 italic">HUB</span>
          </h3>
        </div>

        {/* Access Button */}
        <button 
          onClick={() => {
            const el = document.getElementById("event-listing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative px-12 py-6 rounded-full bg-white text-black font-black tracking-[0.4em] uppercase text-xs md:text-sm overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ 
              background: `linear-gradient(45deg, transparent, ${city.color}22, transparent)` 
            }}
          />
          <span className="relative z-10 flex items-center gap-4 text-center">
            NOTIFY ME WHEN MILO APP LAUNCHES
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </span>
        </button>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 w-full flex justify-center opacity-20 hover:opacity-50 transition-opacity z-20">
        <p className="font-[family-name:var(--font-lexend)] text-white text-[10px] tracking-[1em] uppercase font-bold">
          MILO RADAR / 2026
        </p>
      </div>
    </section>
  );
}
