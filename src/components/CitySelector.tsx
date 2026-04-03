"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedCityData = CITIES.find(c => c.id === selectedCity);

  return (
    <section className="relative py-12 md:py-20 bg-black flex flex-col items-center justify-center z-20">
      {/* Background Nebula depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] -z-10" />

      {/* The "Select Your City" Trigger Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col items-center">
        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-full max-w-md bg-white/[0.02] border border-white/[0.05] rounded-full px-8 py-4 flex items-center justify-between cursor-pointer backdrop-blur-3xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 text-white/50 group-hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-lexend)] text-xs md:text-sm font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-white truncate">
              {selectedCityData ? `JURISDICTION: ${selectedCityData.name}` : "SELECT YOUR CITY"}
            </span>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-white/30 group-hover:text-white flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </motion.div>

          {/* Pulsing indicator if not selected */}
          {!selectedCity && !isOpen && (
            <div className="absolute -right-2 -top-2 w-4 h-4 bg-white rounded-full animate-ping opacity-20" />
          )}
        </motion.div>

        {/* Expandable Monument Selection Hub */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full mt-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 py-8 flex-wrap">
                {CITIES.map((city, idx) => (
                  <div key={city.id} className="flex items-center group/container">
                    {/* Compact Separator */}
                    {idx !== 0 && <div className="hidden lg:block w-px h-8 bg-white/10 mx-4" />}
                    
                    <div
                      onClick={() => {
                        onSelect(city.id);
                        setTimeout(() => setIsOpen(false), 500);
                      }}
                      className={clsx(
                        "flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3 md:py-4 cursor-pointer transition-all duration-700 rounded-full border border-transparent hover:border-white/10 hover:bg-white/[0.03]",
                        selectedCity === city.id ? "bg-white/[0.05] border-white/20 scale-105" : "opacity-40 hover:opacity-100"
                      )}
                    >
                      {/* Monument Icon */}
                      <div className="w-8 h-8 md:w-10 md:h-10 text-white transition-all duration-700 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {city.monument}
                      </div>

                      <div className="flex items-center gap-3 md:gap-4">
                        {/* Selector Trigger (In Front of Name) */}
                        <div className="relative w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
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
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"
                          />
                        </div>

                        <h2 className="font-[family-name:var(--font-lexend)] text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-white whitespace-nowrap">
                          {city.name}
                        </h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Technical HUD Details */}
      <div className="mt-12 flex gap-8 md:gap-12 font-[family-name:var(--font-roboto-mono)] text-[8px] tracking-[0.6em] uppercase text-white/5 items-center px-4 text-center">
        <span>Identity Scan: ACTIVE</span>
        <div className="hidden md:block w-24 h-px bg-white/10" />
        <span className="hidden sm:inline">Jurisdiction selection required for event sync</span>
      </div>
    </section>
  );
}
