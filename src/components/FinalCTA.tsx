"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface FinalCTAProps {
  selectedCity: string | null;
}

const CITY_DATA: Record<string, { name: string; shortName: string; tagline: string; color: string; gradient: string; whatsapp: string }> = {
  del: {
    name: "DELHI - NCR",
    shortName: "Delhi",
    tagline: "Heritage meets hustle. Never miss a vibe.",
    color: "#a855f7",
    gradient: "from-purple-600 via-purple-500 to-fuchsia-500",
    whatsapp: "https://chat.whatsapp.com/GzTG445P70x8MfifnKg1uy?mode=gi_t",
  },
  blr: {
    name: "BENGALURU",
    shortName: "Bengaluru",
    tagline: "Garden city energy. Plug into the scene.",
    color: "#22c55e",
    gradient: "from-emerald-600 via-green-500 to-teal-400",
    whatsapp: "https://chat.whatsapp.com/BwOUV0sjQ0lDTFpiGSOP2j?mode=gi_t",
  },
  mum: {
    name: "MUMBAI",
    shortName: "Mumbai",
    tagline: "Maximum city. Maximum plans.",
    color: "#06b6d4",
    gradient: "from-cyan-600 via-sky-500 to-blue-400",
    whatsapp: "https://chat.whatsapp.com/JuyswAkQ1733fZZAA3H3G3?mode=gi_t",
  },
};

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

function CityWhatsAppCard({ cityKey, city, isHighlighted }: { cityKey: string; city: typeof CITY_DATA[string]; isHighlighted: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={city.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "group relative flex flex-col items-center justify-center rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500",
        "border backdrop-blur-xl",
        isHighlighted
          ? "w-full md:w-[380px] min-h-[280px] border-[#25D366]/30 bg-[#25D366]/[0.04]"
          : "w-full md:w-[320px] min-h-[240px] border-white/[0.06] bg-white/[0.02]",
        "hover:border-[#25D366]/40 hover:bg-[#25D366]/[0.06] hover:shadow-[0_0_60px_rgba(37,211,102,0.08)]",
        "active:scale-[0.98]"
      )}
    >
      {/* Animated gradient orb background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${city.color}15 0%, transparent 60%)`,
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute top-6 right-6">
        <div
          className={clsx(
            "w-2 h-2 rounded-full transition-all duration-500",
            isHovered ? "bg-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.6)]" : "bg-white/10"
          )}
        />
      </div>
      <div className="absolute bottom-10 left-8">
        <div
          className={clsx(
            "w-1.5 h-1.5 rounded-full transition-all duration-700 delay-100",
            isHovered ? "bg-[#25D366]/60" : "bg-white/5"
          )}
        />
      </div>

      {/* City name */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-8">
        <span className="font-[family-name:var(--font-roboto-mono)] text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold">
          Join Community
        </span>

        <h3 className="font-[family-name:var(--font-lexend)] text-2xl md:text-3xl font-black text-white uppercase tracking-tight text-center leading-none">
          {city.shortName}
        </h3>

        <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] text-white/40 text-center max-w-[200px] leading-relaxed">
          {city.tagline}
        </p>

        {/* WhatsApp Button */}
        <div
          className={clsx(
            "flex items-center gap-3 px-7 py-3.5 rounded-full transition-all duration-500",
            "bg-[#25D366]/10 border border-[#25D366]/20",
            "group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:shadow-[0_0_30px_rgba(37,211,102,0.3)]",
          )}
        >
          <span className="text-[#25D366] group-hover:text-black transition-colors duration-300">
            {WHATSAPP_ICON}
          </span>
          <span className="font-black text-[10px] tracking-[0.2em] uppercase text-[#25D366] group-hover:text-black transition-colors duration-300">
            Join Now
          </span>
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-current text-[#25D366]/50 group-hover:text-black/60 group-hover:translate-x-1 transition-all duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

export default function FinalCTA({ selectedCity }: FinalCTAProps) {
  const isMobile = useIsMobile();
  const cityKeys = Object.keys(CITY_DATA);

  return (
    <section className="relative w-full bg-black overflow-hidden py-24 md:py-32">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top gradient fade from previous section */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #25D366 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#25D366]/40" />
            <div className="w-2 h-2 rounded-full bg-[#25D366]/40 animate-pulse" />
            <span className="font-[family-name:var(--font-roboto-mono)] text-[9px] uppercase tracking-[0.6em] text-[#25D366]/60 font-bold">
              WhatsApp Communities
            </span>
            <div className="w-2 h-2 rounded-full bg-[#25D366]/40 animate-pulse" />
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#25D366]/40" />
          </div>

          <h2 className="font-[family-name:var(--font-lexend)] text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-5">
            Never Miss <br />
            <span className="text-white/20 italic">A Plan Again</span>
          </h2>

          <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] md:text-xs text-white/30 uppercase tracking-[0.4em] max-w-md mx-auto">
            Real events. Real people. Your city&apos;s pulse — delivered straight to WhatsApp.
          </p>
        </motion.div>

        {/* City Cards */}
        <div className={clsx(
          "flex gap-6 justify-center",
          isMobile ? "flex-col items-center" : "flex-row items-stretch flex-wrap"
        )}>
          {cityKeys.map((key) => (
            <CityWhatsAppCard
              key={key}
              cityKey={key}
              city={CITY_DATA[key]}
              isHighlighted={selectedCity === key}
            />
          ))}
        </div>

        {/* Bottom trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center gap-4 mt-16 md:mt-20"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.04] bg-white/[0.01]">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10" />
              ))}
            </div>
            <span className="font-[family-name:var(--font-roboto-mono)] text-[9px] text-white/25 uppercase tracking-[0.2em] font-bold">
              2,400+ people joined this week
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-20 mt-20 flex flex-col items-center gap-3">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="font-[family-name:var(--font-lexend)] text-white/10 text-[9px] tracking-[1em] uppercase font-bold">
          MILO — 2026
        </p>
      </div>
    </section>
  );
}
