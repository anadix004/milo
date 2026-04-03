"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const CITIES = [
  {
    id: "del",
    name: "Delhi NCR",
    image: "/city selection/delhi.png",
    color: "#a855f7", // Electric Purple
    accentClass: "text-purple-500",
  },
  {
    id: "blr",
    name: "Bangalore",
    image: "/city selection/banglore.png",
    color: "#22c55e", // Matrix Green
    accentClass: "text-green-500",
  },
  {
    id: "mum",
    name: "Mumbai",
    image: "/city selection/mumbai.png",
    color: "#06b6d4", // Cyber Cyan
    accentClass: "text-cyan-500",
  },
];

interface CitySelectorProps {
  selectedCity: string | null;
  onSelect: (id: string | null) => void;
}

export default function CitySelector({ selectedCity, onSelect }: CitySelectorProps) {


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1] as any,
      }
    },
  };

  return (
    <section className="relative h-[45vh] bg-black flex flex-col items-center justify-start pt-24 md:pt-32 overflow-hidden z-20">
      {/* Top subtle glow for blending */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-[1440px] mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4"
      >
        {CITIES.map((city) => (
          <motion.div
            key={city.id}
            variants={itemVariants}
            onClick={() => onSelect(city.id)}
            className={clsx(
              "group relative flex flex-col items-center cursor-pointer transition-all duration-700 ease-in-out",
              selectedCity && selectedCity !== city.id ? "opacity-30 grayscale blur-[2px] scale-95" : "opacity-100 grayscale-0 blur-0 scale-100"
            )}
          >
            {/* Visual Container - Surgically cropped to remove watermarks */}
            <div className="relative w-full h-[18vh] md:h-[22vh] mb-4 overflow-hidden flex items-center justify-center rounded-2xl group/crop">
              {/* Neon Glow Background (Pulse) */}
              <div 
                className={clsx(
                  "absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000 blur-3xl",
                  city.accentClass
                )}
                style={{ backgroundColor: city.color }}
              />

              {/* City Asset - Scaled to surgically hide bottom-right watermarks */}
              <motion.img
                src={city.image}
                alt={city.name}
                className={clsx(
                  "relative w-full h-full object-cover transition-all duration-700",
                  "scale-[1.15] group-hover:scale-[1.2] group-hover:brightness-125",
                  "group-hover:animate-neon-pulse"
                )}
                style={{ color: city.color }}
              />
              
              {/* Pedestal / Accent Line */}
              <div 
                className={clsx(
                  "absolute bottom-0 w-2/3 h-[1px] transition-all duration-700 opacity-30 group-hover:opacity-100",
                  city.accentClass
                )} 
                style={{ backgroundColor: city.color, boxShadow: `0 0 15px ${city.color}` }}
              />
            </div>

            {/* Typography */}
            <div className="flex flex-col items-center mt-4">
              <h2 className="font-[family-name:var(--font-lexend)] text-[24px] md:text-[2vw] font-black uppercase tracking-[0.4em] text-white transition-colors duration-500 group-hover:text-white/100 text-center">
                {city.name}
              </h2>
              
              {/* Selection Indicator */}
              <motion.div 
                initial={false}
                animate={{ 
                  width: selectedCity === city.id ? "100%" : "0%",
                  opacity: selectedCity === city.id ? 1 : 0 
                }}
                className={clsx("h-[2px] mt-2", city.accentClass)}
                style={{ backgroundColor: city.color }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Decorative background depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] z-10" />
    </section>
  );
}
