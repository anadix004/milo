"use client";

import clsx from "clsx";

interface FinalCTAProps {
  selectedCity: string | null;
}

const CITY_DATA: Record<string, { name: string; qr: string; color: string; brightness: string; whatsapp: string }> = {
  del: { name: "DELHI - NCR", qr: "/QR/Delhi_QR.png", color: "#a855f7", brightness: "shadow-purple-500/50", whatsapp: "https://chat.whatsapp.com/placeholder-delhi" },
  blr: { name: "BENGALURU", qr: "/QR/Bengaluru_QR.png", color: "#22c55e", brightness: "shadow-green-500/50", whatsapp: "https://chat.whatsapp.com/placeholder-blr" },
  mum: { name: "MUMBAI", qr: "/QR/Mumbai_QR.png", color: "#06b6d4", brightness: "shadow-cyan-500/50", whatsapp: "https://chat.whatsapp.com/placeholder-mum" },
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

        {/* Access Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
          <button 
            onClick={() => {
              const el = document.getElementById("event-listing");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group relative px-8 py-5 rounded-full bg-white text-black font-black tracking-[0.3em] uppercase text-[10px] md:text-xs overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ 
                background: `linear-gradient(45deg, transparent, ${city.color}22, transparent)` 
              }}
            />
            <span className="relative z-10 flex items-center gap-3 text-center">
              NOTIFY ME WHEN APP LAUNCHES
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </span>
          </button>
          
          <a 
            href={city.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-white font-black tracking-[0.3em] uppercase text-[10px] md:text-xs overflow-hidden transition-all hover:scale-105 active:scale-95 hover:bg-[#25D366]/20 flex items-center gap-3 backdrop-blur-md"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#25D366]" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            JOIN {city.name} WHATSAPP
          </a>
        </div>
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
