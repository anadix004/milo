"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BrandLogo from "./BrandLogo";

interface PreloaderProps {
  progress: number;
  isReady: boolean;
}

export default function Preloader({ progress, isReady }: PreloaderProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setShow(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Cinematic Background: Desaturated Crowd Atmos */}
          <div className="absolute inset-0 z-0">
             <img 
               src="/assets/preloader_bg.png" 
               alt="Crowd Atmosphere" 
               className="w-full h-full object-cover grayscale opacity-30 scale-110"
             />
             {/* Deepening Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          </div>

          <div className="relative z-10 flex items-end">
            {/* Massive Bold Identity Portal */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               transition={{ duration: 1.5, type: "spring", stiffness: 70, damping: 15 }}
            >
              <BrandLogo size="xl" />
            </motion.div>
          </div>

          {/* Cinematic Tagline Synchronization */}
          <div className="absolute bottom-12 left-12 md:bottom-20 md:left-20 z-20">
             <motion.p 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 0.4, x: 0 }}
               transition={{ delay: 0.8, duration: 1 }}
               className="font-mono text-[10px] md:text-sm text-white uppercase tracking-[0.5em] font-black"
             >
               YOUR LOCAL CITY EVENT RADAR
             </motion.p>
          </div>

          {/* Minimalist Progress Synchroniser */}
          <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full z-30">
             <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white shadow-[0_0_20px_white]"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
