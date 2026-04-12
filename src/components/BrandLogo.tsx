"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-5xl md:text-6xl",
    xl: "text-[clamp(100px,25vw,400px)]",
  };

  return (
    <div className={clsx("flex items-baseline select-none font-lexend font-black lowercase tracking-tighter leading-none text-white", sizeClasses[size], className)}>
      milo
      {/* Iridescent Pearl Dot */}
      <div className="relative ml-1 mb-[0.1em] w-[0.15em] h-[0.15em] rounded-full overflow-hidden shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.2)]">
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
    </div>
  );
}
