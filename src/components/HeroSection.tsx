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

  const getCitySlug = (cityCode: string | null): string | null => {
    if (!cityCode) return null;
    if (cityCode === "del") return "delhi";
    if (cityCode === "mum") return "mumbai";
    if (cityCode === "blr") return "bengaluru";
    return null;
  };

  const ensureCitySlug = () => {
    const city = selectedCity ?? "del";
    const slug = getCitySlug(city);
    if (!slug) {
      addNotification("system", "Could not determine city route.");
      return null;
    }
    return slug;
  };

  const handleExplore = () => {
    const slug = ensureCitySlug();
    if (!slug) return;
    router.push(`/explore/${slug}`);
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

        {/* Explore Button & Quick Filters */}
        <div className="absolute z-50 bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
          <button 
            onClick={handleExplore}
            className="px-12 py-4 bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Explore
          </button>

          <div className="flex flex-wrap justify-center gap-2 max-w-sm md:max-w-none">
            {[
              { label: "Tonight", qs: "time=Today" },
              { label: "Tomorrow", qs: "time=Tomorrow" },
              { label: "This week", qs: "time=Week" },
              { label: "Free", qs: "price=Free" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  const slug = ensureCitySlug();
                  if (!slug) return;
                  router.push(`/explore/${slug}?${a.qs}`);
                }}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 text-[11px] uppercase tracking-[0.22em] font-black transition-colors cursor-pointer"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Fade-out transition */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
