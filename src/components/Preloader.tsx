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
               className="font-lexend text-[clamp(100px,25vw,400px)] font-black text-white lowercase tracking-tighter leading-none select-none flex items-baseline"
            >
              milo
              {/* Iridescent Pearl Dot */}
              <div className="relative ml-2 mb-[0.1em] w-[0.15em] h-[0.15em] rounded-full overflow-hidden shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.2)]">
                {/* Iridescent Gradient Base */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.2)_20%,rgba(138,255,128,0.3)_40%,rgba(128,166,255,0.3)_60%,rgba(255,128,217,0.3)_80%,rgba(0,0,0,0.1)_100%)]" />
                
                {/* Highlight Shine */}
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-white rounded-full blur-[2px] opacity-60" />
                
                {/* Spectral Shimmer Animation */}
                <motion.div 
                   animate={{ 
                     rotate: 360,
                     scale: [1, 1.05, 1],
                   }}
                   transition={{ 
                     duration: 8, 
                     repeat: Infinity, 
                     ease: "linear" 
                   }}
                   className="absolute inset-0 bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.1)_50%,transparent_80%)]"
                />
              </div>
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
