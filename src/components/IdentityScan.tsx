"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface IdentityScanProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function IdentityScan({ isOpen, onClose, onVerified }: IdentityScanProps) {
  const [status, setStatus] = useState<"scanning" | "analyzing" | "verified">("scanning");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Start the fake scan sequence
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      const statusTimer = setTimeout(() => setStatus("analyzing"), 2000);
      const verifiedTimer = setTimeout(() => {
        setStatus("verified");
        setTimeout(() => {
          onVerified();
        }, 1500);
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(statusTimer);
        clearTimeout(verifiedTimer);
      };
    }
  }, [isOpen, onVerified]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md flex items-center justify-center overflow-hidden"
        >
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Simulated Camera Feed / Abstract Blur */}
          <div className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-emerald-500/10 to-transparent opacity-20 blur-3xl pointer-events-none" />

          {/* Laser Sweep Line */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_20px_#10b981] z-50 opacity-40"
          />

          <div className="relative flex flex-col items-center gap-8 px-6 text-center">
            {/* Status Indicator */}
            <div className="flex flex-col items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={clsx(
                  "w-3 h-3 rounded-full mb-4 shadow-[0_0_15px_currentcolor]",
                  status === "verified" ? "text-emerald-500" : "text-amber-500"
                )}
              />
              <h2 className={clsx(
                "font-[family-name:var(--font-lexend)] text-4xl md:text-6xl font-black uppercase tracking-tighter transition-colors duration-500",
                status === "verified" ? "text-emerald-400" : "text-white"
              )}>
                {status === "verified" ? "Identity Verified" : "Identity Scan"}
              </h2>
              <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] md:text-xs tracking-[0.5em] text-white/40 uppercase mt-2">
                {status === "scanning" && "Capturing facial anchors..."}
                {status === "analyzing" && "Validating neural signature..."}
                {status === "verified" && "Nebula encryption key acquired."}
              </p>
            </div>

            {/* Scanning HUD Ring */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-emerald-500/20 rounded-full border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-emerald-500/40 rounded-full border-dotted"
              />
              
              {/* Central Progress Circle */}
              <svg className="w-48 h-48 md:w-64 md:h-64 rotate-[-90deg]">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  className="fill-none stroke-white/5 stroke-2"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  className="fill-none stroke-emerald-500 stroke-2"
                  strokeDasharray="100"
                  animate={{ strokeDashoffset: 100 - progress }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-[family-name:var(--font-roboto-mono)] text-4xl font-light text-white opacity-40">
                  {progress}%
                </span>
              </div>
            </div>

            {/* HUD Floating Data */}
            <div className="flex flex-col gap-2 font-[family-name:var(--font-roboto-mono)] text-[8px] text-emerald-500/30 uppercase tracking-[0.3em]">
              <p>DNA Link: Active</p>
              <p>Satellite Sync: 4/4</p>
              <p>Milo Encryption: V4.2</p>
            </div>
          </div>

          {/* Close Trigger (Bottom) */}
          <button 
            onClick={onClose}
            className="absolute bottom-12 px-8 py-3 border border-white/10 rounded-full text-white/40 text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-white hover:text-black hover:border-white"
          >
            Abort Scan
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
