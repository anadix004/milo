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
            {/* Pulsing Brand Logo */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-12"
            >
              <h1 className="font-[family-name:var(--font-lexend)] text-white text-6xl md:text-8xl font-black uppercase tracking-[0.2em] italic opacity-40">
                milo
              </h1>
            </motion.div>

            {/* Technical HUD Elements */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between w-64 font-[family-name:var(--font-roboto-mono)] text-[10px] tracking-[0.3em] uppercase text-white/40">
                <span>Nebula Sync</span>
                <motion.span>
                  {Math.round(progress)}%
                </motion.span>
              </div>

              <motion.p 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-[family-name:var(--font-roboto-mono)] text-[8px] tracking-[0.5em] uppercase text-white/20 mt-8"
              >
                Initializing simulation matrix...
              </motion.p>
            </div>
          </div>

          {/* Corner HUD Data */}
          <div className="absolute bottom-12 left-12 font-[family-name:var(--font-roboto-mono)] text-[8px] text-white/10 uppercase tracking-widest hidden md:block">
            <p>Lat: 28.6139° N</p>
            <p>Long: 77.2090° E</p>
          </div>
          <div className="absolute top-12 right-12 font-[family-name:var(--font-roboto-mono)] text-[8px] text-white/10 uppercase tracking-widest hidden md:block">
            <p>Status: Pre-Loading</p>
            <p>System: Anti-Gravity V2</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
