"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PreloaderProps {
  progress: number;
  isReady: boolean;
}

export default function Preloader({ progress, isReady }: PreloaderProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  // SVG Circle Constants for the "O" loader
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background subtle scanning lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          
          <div className="relative flex flex-col items-center">
            {/* The "milo" title with the O-Loading Engine */}
            <div className="flex items-center font-[family-name:var(--font-jakarta)] text-6xl md:text-8xl font-extrabold uppercase tracking-[0.2em]">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">mil</span>
              
              {/* The Dynamic "O" Loading Engine */}
              <div className="relative w-[1.1em] h-[1.1em] flex items-center justify-center ml-[-0.05em]">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Progress Fill */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="white"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  />
                </svg>
                {/* Percentage readout (Minimalist) */}
                <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-sm font-black tracking-normal text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  {Math.round(progress)}
                </div>
              </div>
            </div>

            {/* Technical Detail Footer */}
            <motion.p 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-[family-name:var(--font-roboto-mono)] text-[8px] tracking-[0.8em] uppercase text-white/20 mt-12 text-center drop-shadow-md"
            >
              Jurisdictional synchronization in progress...
            </motion.p>
          </div>

          {/* Corner HUD Data */}
          <div className="absolute bottom-12 left-12 font-[family-name:var(--font-roboto-mono)] text-[8px] text-white/10 uppercase tracking-widest hidden md:block leading-loose">
            <p className="flex items-center gap-2"><span className="w-1 h-1 bg-white/20 rounded-full" /> Lat: 28.6139° N</p>
            <p className="flex items-center gap-2"><span className="w-1 h-1 bg-white/20 rounded-full" /> Long: 77.2090° E</p>
          </div>
          <div className="absolute top-12 right-12 font-[family-name:var(--font-roboto-mono)] text-[8px] text-white/10 uppercase tracking-widest hidden md:block text-right leading-loose">
            <p>System: Anti-Gravity V2.4</p>
            <p className="text-white/20">Jurisdiction: Delhi NCR</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
