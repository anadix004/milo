"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, ChevronRight, Loader2 } from "lucide-react";
import clsx from "clsx";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

interface IdentityScanProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

export default function IdentityScan({ isOpen, onClose, onVerified }: IdentityScanProps) {
  const [status, setStatus] = useState<"scanning" | "analyzing" | "verified">("scanning");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStatus("scanning");
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (progress === 100) {
      setStatus("verified");
      // Execute verified trigger pulse
      onVerified?.();
      // Auto-close portal after cinematic pause
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress, onVerified, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
          />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 40 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.8, opacity: 0, y: 40 }} 
            transition={SPRING_CONFIG} 
            className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-2xl"
          >
            {/* Cinematic Background Pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            <div className="relative z-10 space-y-12 text-center">
               <div className="space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                     <motion.div 
                        animate={{ 
                          rotate: 360,
                          borderColor: ["rgba(255,255,255,0.1)", "rgba(168,85,247,0.4)", "rgba(255,255,255,0.1)"]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed rounded-full" 
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        {status === "verified" ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING_CONFIG}>
                             <Shield className="text-emerald-400" size={40} />
                          </motion.div>
                        ) : (
                          <Loader2 className="text-purple-400 animate-spin" size={40} />
                        )}
                     </div>
                  </div>
                  <h2 className="font-lexend text-3xl font-black uppercase tracking-tight text-white">Identity Scan</h2>
                  <p className="font-mono text-[10px] text-purple-500 uppercase tracking-[0.4em] font-black">
                    {status === "scanning" ? "Scanning Bio-Pulse" : status === "analyzing" ? "Analyzing Mission Data" : "Identity Synchronized"}
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                     />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-white/20 uppercase tracking-widest font-black">
                     <span>Pulse Stability</span>
                     <span>{progress}%</span>
                  </div>
               </div>

               <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-center gap-3 text-white/40">
                     <Shield className="w-4 h-4" />
                     <span className="font-mono text-[8px] uppercase tracking-widest">Nexus Security Guardrail Active</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
