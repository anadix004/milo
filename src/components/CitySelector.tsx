"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const CITIES = [
  {
    id: "del",
    name: "Delhi NCR",
    monument: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
        <path d="M25 90H35V30H40V25H60V30H65V90H75V100H25V90ZM42 32V85H58V32H42Z" />
        <path d="M38 22H62V25H38V22ZM41 18H59V21H41V18ZM44 14H56V17H44V14Z" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "mum",
    name: "Mumbai",
    monument: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
        <path d="M15 90H25V35H30V30H70V35H75V90H85V100H15V90ZM32 38V85H68V38H32Z" />
        <path d="M10 90H20V100H10V90ZM80 90H90V100H90V90H80Z" opacity="0.4" />
        <circle cx="25" cy="28" r="4" /><circle cx="75" cy="28" r="4" />
        <path d="M35 25H65V30H35V25ZM40 20H60V24H40V20Z" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "blr",
    name: "Bangalore",
    monument: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
        <path d="M10 95H90V100H10V95ZM20 95V40H30V35H70V40H80V95H20Z" />
        <path d="M40 35V25C40 22 42 20 45 20H55C58 20 60 22 60 25V35H40Z" />
        <path d="M48 20V15H52V20H48Z" opacity="0.8" />
        <rect x="25" y="45" width="50" height="5" opacity="0.3" />
        <rect x="25" y="55" width="50" height="5" opacity="0.3" />
        <rect x="25" y="65" width="50" height="5" opacity="0.3" />
      </svg>
    ),
  }
];

interface CitySelectorProps {
  selectedCity: string | null;
  onSelect: (id: string | null) => void;
}

export default function CitySelector({ selectedCity, onSelect }: CitySelectorProps) {
  return (
    <section className="relative py-12 md:py-20 bg-black flex flex-col items-center justify-center overflow-hidden z-20">
      {/* Background Nebula depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] -z-10" />

      {/* The Monument Selection Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative flex flex-col md:flex-row items-center gap-6 md:gap-1 px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] md:rounded-full backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {CITIES.map((city, idx) => (
          <div key={city.id} className="flex items-center group/container">
            {/* Divider Logic */}
            {idx !== 0 && <div className="hidden md:block w-[1px] h-8 bg-white/10 mx-6" />}
            
            <div
              onClick={() => onSelect(city.id)}
              className={clsx(
                "flex items-center gap-4 px-6 py-3 cursor-pointer transition-all duration-700 rounded-full",
                selectedCity === city.id ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
              )}
            >
              {/* Monument Icon */}
              <div className={clsx(
                "w-10 h-10 md:w-12 md:h-12 transition-all duration-700",
                selectedCity === city.id ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-white/20 group-hover/container:text-white/40"
              )}>
                {city.monument}
              </div>

              <div className="flex items-center gap-3">
                {/* Selector Trigger (In Front of Name) */}
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className={clsx(
                    "absolute inset-0 rounded-full border border-white/20 transition-all",
                    selectedCity === city.id ? "border-white/60 scale-125" : "group-hover/container:border-white/40"
                  )} />
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: selectedCity === city.id ? 1 : 0,
                      opacity: selectedCity === city.id ? 1 : 0 
                    }}
                    className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"
                  />
                </div>

                <h2 className={clsx(
                  "font-[family-name:var(--font-lexend)] text-sm md:text-base font-black uppercase tracking-[0.3em] transition-all duration-500",
                  selectedCity === city.id ? "text-white" : "text-white/30 group-hover/container:text-white/50"
                )}>
                  {city.name}
                </h2>
              </div>
            </div>
          </div>
        ))}
        
        {/* Animated Scanning Line (Aesthetic) */}
        <motion.div 
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none -z-10"
        />
      </motion.div>

      {/* Technical HUD Details */}
      <div className="mt-8 flex gap-12 font-[family-name:var(--font-roboto-mono)] text-[8px] tracking-[0.6em] uppercase text-white/10 hidden md:flex">
        <span>Identity Scan Active</span>
        <span>Secure Stream [04:NCR:MUM:BLR]</span>
        <motion.span 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-white/20"
        >
          // Live Selection Hook
        </motion.span>
      </div>
    </section>
  );
}
