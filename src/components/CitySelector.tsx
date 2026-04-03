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
    color: "#ffffff"
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
    color: "#ffffff"
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
    color: "#ffffff"
  }
];

interface CitySelectorProps {
  selectedCity: string | null;
  onSelect: (id: string | null) => void;
}

export default function CitySelector({ selectedCity, onSelect }: CitySelectorProps) {
  return (
    <section className="relative h-screen bg-black flex flex-col items-center justify-center overflow-hidden z-20">
      {/* Background Nebula depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-12"
      >
        {CITIES.map((city) => (
          <div
            key={city.id}
            onClick={() => onSelect(city.id)}
            className={clsx(
              "group relative flex flex-col items-center cursor-pointer transition-all duration-1000",
              selectedCity && selectedCity !== city.id ? "opacity-20 grayscale scale-95" : "opacity-100"
            )}
          >
            {/* Monument Silhouette Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="relative w-48 h-48 md:w-64 md:h-64 mb-12 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/[0.02] rounded-[3rem] border border-white/[0.05] group-hover:border-white/20 transition-all duration-700" />
              <div className="relative w-2/3 h-2/3 text-white/40 group-hover:text-white transition-all duration-700 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                {city.monument}
              </div>
            </motion.div>

            {/* Selection Row: Circle + Name */}
            <div className="flex items-center gap-6 group/name px-8 py-3 rounded-full border border-transparent group-hover:border-white/10 group-hover:bg-white/[0.03] transition-all duration-700">
              {/* Selector Circle */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/50 transition-colors" />
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: selectedCity === city.id ? 1 : 0,
                    opacity: selectedCity === city.id ? 1 : 0 
                  }}
                  className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"
                />
              </div>

              <h2 className="font-[family-name:var(--font-lexend)] text-xl md:text-2xl font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-all duration-500">
                {city.name}
              </h2>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Identity Scan Footer Text */}
      <motion.p 
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-12 font-[family-name:var(--font-roboto-mono)] text-[10px] tracking-[0.8em] uppercase text-white/20"
      >
        Select jurisdictional center for event synchronization
      </motion.p>
    </section>
  );
}
