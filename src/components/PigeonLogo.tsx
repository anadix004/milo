"use client";

import { motion } from "framer-motion";

interface PigeonLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export default function PigeonLogo({ className, size = 24, animate = true }: PigeonLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animate ? {
        y: [0, -4, 0],
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        <linearGradient id="pigeon-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" /> {/* Bright Orange */}
          <stop offset="40%" stopColor="#ec4899" /> {/* Pink/Magenta */}
          <stop offset="100%" stopColor="#8b5cf6" /> {/* Deep Purple */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Trailing 4-pointed Stars (Exact shapes from image) */}
      <g opacity="0.6">
        <motion.path
          d="M12 28C14 30 16 32 12 34C10 32 8 30 12 28Z"
          fill="url(#pigeon-gradient)"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M20 38C23 41 26 44 20 47C17 44 14 41 20 38Z"
          fill="url(#pigeon-gradient)"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.3, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.path
          d="M15 52C16.5 53.5 18 55 15 56.5C13.5 55 12 53.5 15 52Z"
          fill="url(#pigeon-gradient)"
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </g>

      {/* High-Fidelity Silhouette Reconstruction */}
      <motion.path
        d="M92 48.5C88 47 82 46 78 47.5C74 49 71 52 70 56C68.5 61 69 67 71 72C68 70 65.5 66 64 62C61 54 61.5 45 65 38C68.5 31 75 25 82 22C72 26 62 34 58 45C54 56 56 68 63 78C56 71 52 62 52 52C52 42 56 31 63 22C43 32 30 52 32 75C34 68 38 62 45 58C52 54 60 55 68 58C58 55 48 55 38 58C36 72 38 85 45 92C38 84 34 74 32 64C28 62 22 62 16 64"
        fill="url(#pigeon-gradient)"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Precision Beak & Head Hook */}
      <path
        d="M94 48L88 44C91 46 93 47 94 48Z"
        fill="url(#pigeon-gradient)"
      />
    </motion.svg>
  );
}
