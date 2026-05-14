"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { useLocation } from "./LocationContext";
import { useRouter } from "next/navigation";
import { useNotifications } from "./NotificationContext";
import Image from "next/image";
import { TypingEffect } from "./ui/typing-effect";
export default function HeroSection() {
  const isMobile = useIsMobile();
  const { selectedCity } = useLocation();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const handleExplore = () => {
    if (!selectedCity) {
      addNotification("system", "Please select your city from the location menu first.");
      return;
    }
    
    let cityUrl = selectedCity;
    if (selectedCity === "del") cityUrl = "delhi";
    if (selectedCity === "mum") cityUrl = "mumbai";
    if (selectedCity === "blr") cityUrl = "bengaluru";
    
    router.push(`/explore/${cityUrl}`);
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1540039155732-684735035727?w=1200"
            className="w-full h-full object-cover opacity-70"
          >
            <source src="/city event/long event.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/50 w-full h-full pointer-events-none" />
        </div>

        {/* Main Title Section */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 px-6 text-center pointer-events-none">
          <div className="space-y-6">
            <TypingEffect
              texts={["DISCOVER YOUR SCENE."]}
              className="font-[family-name:var(--font-lexend)] text-white text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] italic drop-shadow-2xl"
            />
            <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] md:text-sm text-white/80 uppercase tracking-[0.3em] font-bold mt-4">
              Stop searching. Start experiencing what&apos;s happening right now.
            </p>
          </div>
        </div>

        {/* Explore Button */}
        <div className="absolute z-50 bottom-28 md:bottom-16 left-1/2 -translate-x-1/2">
          <button 
            onClick={handleExplore}
            className="px-12 py-4 bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            Explore
          </button>
        </div>

        {/* Bottom Fade-out transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
